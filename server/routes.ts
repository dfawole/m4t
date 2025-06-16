import type { Express, Request, Response, NextFunction } from 'express';
import { createServer, type Server } from 'http';
import { db } from './db';
import { storage } from './storage';
import { requireJwtAuth } from './jwtMiddleware';
import { registerGamificationRoutes } from './gamification';
import { registerCompanyOnboardingRoutes } from './companyOnboarding';
import { registerLicenseManagementRoutes } from './licenseManagement';
import { registerEmailVerificationRoutes } from './emailVerification';
import { loginWithJwt, refreshAccessToken, logoutJwt, getCurrentUser } from './jwtRoutes';
import { setupOAuth } from './oauth';
import passport from 'passport';
import { createSubscription, sendWelcomeEmail, sendCourseCompletionEmail, sendPasswordResetEmail, generatePersonalizedLearningPath, generateQuizQuestions, provideLearningRecommendations, checkServicesHealth } from './services-integration';
import Stripe from 'stripe';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from './jwt';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import {
        insertCategorySchema,
        insertCourseSchema,
        insertModuleSchema,
        insertLessonSchema,
        insertEnrollmentSchema,
        insertSubscriptionPlanSchema,
        UserRole,
        TipContext,
        learningTips,
        users,
} from '@shared/schema';
import { count, eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

// Function to compare passwords
async function comparePasswords(supplied: string, stored: string) {
        const [hashed, salt] = stored.split('.');
        const hashedBuf = Buffer.from(hashed, 'hex');
        const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
        return hashedBuf.equals(suppliedBuf);
}

// Helper function to initialize learning tips
async function initializeLearningTips() {
        try {
                const existingTips = await db.select({ count: count() }).from(learningTips);

                if (existingTips[0].count > 0) {
                        console.log(`Found ${existingTips[0].count} existing learning tips, skipping tip creation.`);
                        return;
                }

                const initialTips = [
                        {
                                tipKey: 'course_overview_browsing',
                                title: 'Browse with Ease',
                                content: 'Use the search bar and category filters to quickly find courses that match your interests and skill level.',
                                context: TipContext.COURSE_OVERVIEW,
                                priority: 100,
                        },
                        {
                                tipKey: 'lesson_viewer_navigation',
                                title: 'Easy Navigation',
                                content: 'Use the next and previous buttons to move between lessons, or click directly on a lesson in the sidebar.',
                                context: TipContext.LESSON_VIEWER,
                                priority: 100,
                        },
                        {
                                tipKey: 'dashboard_overview',
                                title: 'Your Learning Hub',
                                content: 'This dashboard gives you an overview of your enrolled courses, progress, and achievements all in one place.',
                                context: TipContext.DASHBOARD,
                                priority: 100,
                        },
                ];

                await db.insert(learningTips).values(initialTips);
                console.log(`Created ${initialTips.length} initial learning tips.`);
        } catch (error) {
                console.error('Error initializing learning tips:', error);
        }
}

// Helper middleware to check if user has the correct role
const hasRole = (allowedRoles: string[]) => (req: any, res: Response, next: NextFunction) => {
        if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
                const userRole = req.user.role;
                if (!allowedRoles.includes(userRole)) {
                        return res.status(403).json({ message: 'Forbidden' });
                }
                next();
        } catch (error) {
                console.error('Error checking user role:', error);
                return res.status(500).json({ message: 'Internal server error' });
        }
};

const isAdminOrInstructor = hasRole([UserRole.INTERNAL_ADMIN, UserRole.INSTRUCTOR]);
const isAdmin = hasRole([UserRole.INTERNAL_ADMIN]);

export async function registerRoutes(app: Express): Promise<Server> {
        await initializeLearningTips();

        // Test account login endpoint
        app.get('/api/login/test-account', async (req: Request, res: Response) => {
                try {
                        const { email } = req.query;

                        if (!email || typeof email !== 'string') {
                                return res.status(400).json({ message: 'Email is required' });
                        }

                        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

                        if (!user || user.length === 0) {
                                return res.status(404).json({ message: 'User not found' });
                        }

                        const token = generateAccessToken(user[0]);

                        res.cookie('token', token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                        });

                        return res.status(200).json({
                                message: 'Login successful',
                                user: {
                                        id: user[0].id,
                                        email: user[0].email,
                                        firstName: user[0].firstName,
                                        lastName: user[0].lastName,
                                        role: user[0].role,
                                },
                        });
                } catch (error) {
                        console.error('Test login error:', error);
                        res.status(500).json({ message: 'Login failed', error: (error as Error).message });
                }
        });

        // Register route modules
        registerGamificationRoutes(app);
        registerCompanyOnboardingRoutes(app);
        registerLicenseManagementRoutes(app);
        registerEmailVerificationRoutes(app);

        // JWT Authentication endpoints
        app.post('/api/jwt/login', loginWithJwt);
        app.post('/api/jwt/refresh', refreshAccessToken);
        app.post('/api/jwt/logout', logoutJwt);
        app.get('/api/jwt/user', getCurrentUser);

        // Login endpoint for username/password authentication
        app.post('/api/auth/login', async (req: Request, res: Response) => {
                try {
                        const { username, password } = req.body;

                        if (!username || !password) {
                                return res.status(400).json({ message: 'Username and password are required' });
                        }

                        const user = await storage.getUserByUsernameOrEmail(username);

                        if (!user) {
                                return res.status(401).json({ message: 'Invalid credentials' });
                        }

                        // Check if user has a password and it's valid
                        if (!user.password) {
                                return res.status(401).json({ message: 'Invalid credentials' });
                        }

                        const isValidPassword = await comparePasswords(password, user.password);
                        if (!isValidPassword) {
                                return res.status(401).json({ message: 'Invalid credentials' });
                        }

                        const token = generateAccessToken(user);

                        res.cookie('token', token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                                path: '/',
                        });

                        res.json({
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                        });
                } catch (error) {
                        console.error('Login error:', error);
                        res.status(500).json({ message: 'Login failed' });
                }
        });

        // Get current user
        app.get('/api/auth/user', async (req: Request, res: Response) => {
                try {
                        console.log('Auth check - Cookies:', req.cookies);
                        console.log('Auth check - Headers:', req.headers.cookie);
                        
                        const token = req.cookies?.token || req.cookies?.accessToken;

                        if (!token) {
                                console.log('No token found in cookies');
                                return res.status(200).json(null);
                        }

                        console.log('Token found:', token ? 'YES' : 'NO');
                        
                        const decoded = verifyAccessToken(token);
                        if (!decoded || !decoded.userId) {
                                console.log('Invalid token or no userId');
                                return res.status(200).json(null);
                        }

                        console.log('Decoded userId:', decoded.userId);

                        const user = await storage.getUser(decoded.userId);

                        if (!user) {
                                console.log('User not found in database');
                                return res.status(200).json(null);
                        }

                        console.log('User found:', user.username);

                        // Remove sensitive data before sending
                        const { password, ...userWithoutPassword } = user;
                        res.json(userWithoutPassword);
                } catch (error) {
                        console.error('Error fetching user:', error);
                        res.status(200).json(null);
                }
        });

        // Logout endpoint
        app.post('/api/logout', async (req: Request, res: Response) => {
                try {
                        res.clearCookie('token', {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                path: '/',
                        });

                        res.json({ message: 'Logged out successfully' });
                } catch (error) {
                        console.error('Logout error:', error);
                        res.status(500).json({ message: 'Logout failed' });
                }
        });

        // Course routes
        app.get('/api/courses', async (req: Request, res: Response) => {
                try {
                        const courses = await storage.getCourses();
                        res.json(courses);
                } catch (error) {
                        console.error('Error fetching courses:', error);
                        res.status(500).json({ message: 'Failed to fetch courses' });
                }
        });

        app.get('/api/courses/:id', async (req: Request, res: Response) => {
                try {
                        const courseId = parseInt(req.params.id);
                        const course = await storage.getCourseById(courseId);

                        if (!course) {
                                return res.status(404).json({ message: 'Course not found' });
                        }

                        const modules = await storage.getModulesByCourse(courseId);

                        const modulesWithLessons = await Promise.all(
                                modules.map(async (module) => {
                                        const lessons = await storage.getLessonsByModule(module.id);
                                        // Make first two lessons in each course free for all users
                                        const lessonsWithFreeAccess = lessons.map((lesson, index) => ({
                                                ...lesson,
                                                isPreview: index < 2 || lesson.isPreview, // First 2 lessons are always free
                                                isFree: index < 2 || lesson.isPreview
                                        }));
                                        return {
                                                ...module,
                                                lessons: lessonsWithFreeAccess
                                        };
                                })
                        );

                        res.json({
                                ...course,
                                modules: modulesWithLessons
                        });
                } catch (error) {
                        console.error('Error fetching course:', error);
                        res.status(500).json({ message: 'Failed to fetch course' });
                }
        });

        app.post('/api/courses', requireJwtAuth, isAdminOrInstructor, async (req: Request, res: Response) => {
                try {
                        const courseData = insertCourseSchema.parse(req.body);
                        const course = await storage.createCourse(courseData);
                        res.status(201).json(course);
                } catch (error) {
                        console.error('Error creating course:', error);
                        res.status(400).json({ message: 'Invalid course data' });
                }
        });

        // Category routes
        app.get('/api/categories', async (req: Request, res: Response) => {
                try {
                        const categories = await storage.getCategories();
                        res.json(categories);
                } catch (error) {
                        console.error('Error fetching categories:', error);
                        res.status(500).json({ message: 'Failed to fetch categories' });
                }
        });

        app.post('/api/categories', requireJwtAuth, isAdmin, async (req: Request, res: Response) => {
                try {
                        const categoryData = insertCategorySchema.parse(req.body);
                        const category = await storage.createCategory(categoryData);
                        res.status(201).json(category);
                } catch (error) {
                        console.error('Error creating category:', error);
                        res.status(400).json({ message: 'Invalid category data' });
                }
        });

        // Module routes
        app.post('/api/modules', requireJwtAuth, isAdminOrInstructor, async (req: Request, res: Response) => {
                try {
                        const moduleData = insertModuleSchema.parse(req.body);
                        const module = await storage.createModule(moduleData);
                        res.status(201).json(module);
                } catch (error) {
                        console.error('Error creating module:', error);
                        res.status(400).json({ message: 'Invalid module data' });
                }
        });

        // Lesson routes
        app.post('/api/lessons', requireJwtAuth, isAdminOrInstructor, async (req: Request, res: Response) => {
                try {
                        const lessonData = insertLessonSchema.parse(req.body);
                        const lesson = await storage.createLesson(lessonData);
                        res.status(201).json(lesson);
                } catch (error) {
                        console.error('Error creating lesson:', error);
                        res.status(400).json({ message: 'Invalid lesson data' });
                }
        });

        // Enrollment routes
        app.post('/api/enrollments', requireJwtAuth, async (req: any, res: Response) => {
                try {
                        const enrollmentData = insertEnrollmentSchema.parse(req.body);
                        const userId = req.user.sub || req.user.id;

                        const existingEnrollment = await storage.getEnrollment(userId, enrollmentData.courseId);
                        if (existingEnrollment) {
                                return res.status(400).json({ message: 'Already enrolled in this course' });
                        }

                        const enrollment = await storage.createEnrollment(enrollmentData);
                        res.status(201).json(enrollment);
                } catch (error) {
                        console.error('Error creating enrollment:', error);
                        res.status(400).json({ message: 'Invalid enrollment data' });
                }
        });

        app.get('/api/enrollments/user', requireJwtAuth, async (req: any, res: Response) => {
                try {
                        const userId = req.user.sub || req.user.id;
                        const enrollments = await storage.getUserEnrollments(userId);
                        res.json(enrollments);
                } catch (error) {
                        console.error('Error fetching enrollments:', error);
                        res.status(500).json({ message: 'Failed to fetch enrollments' });
                }
        });

        // Subscription routes
        app.get('/api/subscription-plans', async (req: Request, res: Response) => {
                try {
                        const plans = await storage.getSubscriptionPlans();
                        res.json(plans);
                } catch (error) {
                        console.error('Error fetching subscription plans:', error);
                        res.status(500).json({ message: 'Failed to fetch subscription plans' });
                }
        });

        // Test login endpoint for quick testing
        app.post('/api/test-login', async (req: Request, res: Response) => {
                try {
                        const { email } = req.body;
                        
                        if (!email) {
                                return res.status(400).json({ message: 'Email is required' });
                        }

                        // Find user by email
                        const user = await storage.getUserByEmail(email);
                        
                        if (!user) {
                                return res.status(404).json({ message: 'User not found' });
                        }

                        console.log('Test login for user:', user.username);

                        // Generate JWT tokens
                        const accessToken = generateAccessToken(user);
                        const refreshToken = generateRefreshToken(user);

                        // Set both tokens as HttpOnly cookies
                        res.cookie('refreshToken', refreshToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        });
                        
                        res.cookie('token', accessToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 15 * 60 * 1000, // 15 minutes
                        });

                        console.log('Test login successful, cookies set');

                        // Return success
                        res.json({
                                message: 'Login successful',
                                user: { id: user.id, username: user.username, email: user.email, role: user.role }
                        });
                } catch (error) {
                        console.error('Test login error:', error);
                        res.status(500).json({ message: 'Login failed' });
                }
        });

        // Stripe payment processing routes
        if (!process.env.STRIPE_SECRET_KEY) {
                console.warn('STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
        } else {
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

                // Create payment intent for one-time payments
                app.post('/api/create-payment-intent', async (req: Request, res: Response) => {
                        try {
                                const { amount } = req.body;
                                
                                if (!amount || amount <= 0) {
                                        return res.status(400).json({ message: 'Valid amount is required' });
                                }

                                const paymentIntent = await stripe.paymentIntents.create({
                                        amount: Math.round(amount * 100), // Convert to cents
                                        currency: 'usd',
                                        automatic_payment_methods: {
                                                enabled: true,
                                        },
                                });

                                res.json({ 
                                        clientSecret: paymentIntent.client_secret,
                                        paymentIntentId: paymentIntent.id 
                                });
                        } catch (error: any) {
                                console.error('Stripe payment intent error:', error);
                                res.status(500).json({ message: 'Failed to create payment intent: ' + error.message });
                        }
                });

                // Create subscription
                app.post('/api/create-subscription', async (req: Request, res: Response) => {
                        try {
                                const { email, planId, amount } = req.body;
                                
                                if (!email || !planId || !amount) {
                                        return res.status(400).json({ message: 'Email, planId, and amount are required' });
                                }

                                // Create or retrieve customer
                                const customer = await stripe.customers.create({
                                        email: email,
                                });

                                // Create subscription
                                const subscription = await stripe.subscriptions.create({
                                        customer: customer.id,
                                        items: [{
                                                price_data: {
                                                        currency: 'usd',
                                                        product_data: {
                                                                name: `M4T Learning Platform - ${planId}`,
                                                        },
                                                        unit_amount: Math.round(amount * 100),
                                                        recurring: {
                                                                interval: 'month',
                                                        },
                                                },
                                        }],
                                        payment_behavior: 'default_incomplete',
                                        expand: ['latest_invoice.payment_intent'],
                                });

                                res.json({
                                        subscriptionId: subscription.id,
                                        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
                                        customerId: customer.id,
                                });
                        } catch (error: any) {
                                console.error('Stripe subscription error:', error);
                                res.status(500).json({ message: 'Failed to create subscription: ' + error.message });
                        }
                });

                // Check payment status
                app.get('/api/payment-status/:paymentIntentId', async (req: Request, res: Response) => {
                        try {
                                const { paymentIntentId } = req.params;
                                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                                
                                res.json({
                                        status: paymentIntent.status,
                                        amount: paymentIntent.amount,
                                        currency: paymentIntent.currency
                                });
                        } catch (error: any) {
                                console.error('Payment status check error:', error);
                                res.status(500).json({ message: 'Failed to check payment status: ' + error.message });
                        }
                });

                console.log('Stripe payment processing enabled');
        }

        // SendGrid email service routes
        if (!process.env.SENDGRID_API_KEY) {
                console.warn('SENDGRID_API_KEY not found. Email functionality will be disabled.');
        } else {
                // Send welcome email
                app.post('/api/send-welcome-email', async (req: Request, res: Response) => {
                        try {
                                const { email, firstName } = req.body;
                                
                                if (!email || !firstName) {
                                        return res.status(400).json({ message: 'Email and firstName are required' });
                                }

                                const sgMail = await import('@sendgrid/mail');
                                sgMail.default.setApiKey(process.env.SENDGRID_API_KEY!);

                                await sgMail.default.send({
                                        to: email,
                                        from: 'noreply@m4t.com',
                                        subject: 'Welcome to M4T Learning Platform!',
                                        html: `
                                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                                        <h2 style="color: #2563eb;">Welcome to M4T Learning Platform!</h2>
                                                        <p>Hi ${firstName},</p>
                                                        <p>Welcome to the M4T Learning Platform! We're excited to have you join our community of learners.</p>
                                                        <p>Get started by exploring our courses and begin your learning journey today.</p>
                                                        <p>Best regards,<br>M4T Learning Platform Team</p>
                                                </div>
                                        `
                                });

                                res.json({ message: 'Welcome email sent successfully' });
                        } catch (error: any) {
                                console.error('SendGrid email error:', error);
                                res.status(500).json({ message: 'Failed to send email: ' + error.message });
                        }
                });

                console.log('SendGrid email service enabled');
        }

        // Service health check
        app.get('/api/services-health', async (req: Request, res: Response) => {
                const health = {
                        stripe: !!process.env.STRIPE_SECRET_KEY,
                        sendgrid: !!process.env.SENDGRID_API_KEY,
                        paypal: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
                        openai: !!process.env.OPENAI_API_KEY,
                        timestamp: new Date().toISOString()
                };

                res.json(health);
        });

        // Initialize OAuth social login
        setupOAuth(app);

        const httpServer = createServer(app);
        return httpServer;
}