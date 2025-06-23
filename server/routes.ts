//server/routes.ts
import type { Express, Request, Response, NextFunction } from 'express';
import { createServer, type Server } from 'http';
import { db } from './db.js';
import { storage } from './storage.js';
import { jwtAuth, requireJwtAuth } from './jwtMiddleware.js';
import { registerGamificationRoutes } from './gamification.js';
import { registerCompanyOnboardingRoutes } from './companyOnboarding.js';
import { registerLicenseManagementRoutes } from './licenseManagement.js';
import { registerEmailVerificationRoutes } from './emailVerification.js';
import { setupOAuth } from './oauth.js';
import passport from 'passport';
import { loginWithJwt, refreshAccessToken, logoutJwt, getCurrentUser } from './jwtRoutes.js';
import { generateAccessToken, verifyAccessToken } from './jwt.js';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import {
	insertCategorySchema,
	insertCourseSchema,
	insertModuleSchema,
	insertLessonSchema,
	insertEnrollmentSchema,
	UserRole,
	TipContext,
	learningTips,
	users,
} from '../shared/schema.js';

import { count, eq } from 'drizzle-orm';
import userProfileRoute from './userProfile.js';

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
		// Check if we already have learning tips
		const existingTips = await db.select({ count: count() }).from(learningTips);

		if (existingTips[0].count > 0) {
			console.log(`Found ${existingTips[0].count} existing learning tips, skipping tip creation.`);
			return;
		}

		// Create initial learning tips for different contexts
		const initialTips = [
			// Course overview tips
			{
				tipKey: 'course_overview_browsing',
				title: 'Browse with Ease',
				content:
					'Use the search bar and category filters to quickly find courses that match your interests and skill level.',
				context: TipContext.COURSE_OVERVIEW,
				priority: 100,
			},
			{
				tipKey: 'course_overview_teaser',
				title: 'Teaser Videos',
				content:
					"Look for the 'Teaser' badge to find courses with preview videos that give you a glimpse of the content before enrolling.",
				context: TipContext.COURSE_OVERVIEW,
				priority: 90,
			},
			{
				tipKey: 'course_overview_enrollment',
				title: 'Easy Enrollment',
				content:
					"Click 'View Course' to see detailed information and enroll. Your progress will be automatically tracked once you start learning.",
				context: TipContext.COURSE_OVERVIEW,
				priority: 80,
			},

			// Course detail tips
			{
				tipKey: 'course_detail_modules',
				title: 'Course Structure',
				content:
					'Each course is divided into modules and lessons. Complete them in order to build your knowledge systematically.',
				context: TipContext.COURSE_OVERVIEW,
				priority: 100,
			},
			{
				tipKey: 'course_detail_progress',
				title: 'Track Your Progress',
				content:
					"Your progress is automatically saved. The progress bar shows how far you've come in completing the course.",
				context: TipContext.COURSE_OVERVIEW,
				priority: 90,
			},

			// Lesson viewer tips
			{
				tipKey: 'lesson_viewer_navigation',
				title: 'Easy Navigation',
				content:
					'Use the next and previous buttons to move between lessons, or click directly on a lesson in the sidebar.',
				context: TipContext.LESSON_VIEWER,
				priority: 100,
			},
			{
				tipKey: 'lesson_viewer_reactions',
				title: 'React to Content',
				content:
					'Use emoji reactions to express how you feel about a lesson. This helps instructors improve their content.',
				context: TipContext.LESSON_VIEWER,
				priority: 90,
			},
			{
				tipKey: 'lesson_viewer_materials',
				title: 'Additional Materials',
				content:
					"Check the 'Materials' section for downloadable resources that complement the lesson content.",
				context: TipContext.LESSON_VIEWER,
				priority: 80,
			},

			// Dashboard tips
			{
				tipKey: 'dashboard_overview',
				title: 'Your Learning Hub',
				content:
					'This dashboard gives you an overview of your enrolled courses, progress, and achievements all in one place.',
				context: TipContext.DASHBOARD,
				priority: 100,
			},
			{
				tipKey: 'dashboard_achievements',
				title: 'Track Achievements',
				content:
					"Earn badges and points as you complete courses and lessons. Check your achievements to see how far you've come!",
				context: TipContext.DASHBOARD,
				priority: 90,
			},
		];

		// Insert tips into the database
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

// Only admins and instructors can access these routes
const isAdminOrInstructor = hasRole([UserRole.INTERNAL_ADMIN, UserRole.INSTRUCTOR]);

// Only admins can access these routes
const isAdmin = hasRole([UserRole.INTERNAL_ADMIN]);

// Company admins can access these routes
const isCompanyAdmin = hasRole([UserRole.COMPANY_ADMIN, UserRole.INTERNAL_ADMIN]);

export async function registerRoutes(app: Express): Promise<Server> {
	// Initialize learning tips for the system
	await initializeLearningTips();

	// Custom endpoint for test account login with JWT authentication
	app.get('/api/login/test-account', async (req: Request, res: Response) => {
		try {
			const { email } = req.query;

			if (!email || typeof email !== 'string') {
				return res.status(400).json({ message: 'Email is required' });
			}

			// Find user by email from the database
			const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

			if (!user || user.length === 0) {
				return res.status(404).json({ message: 'User not found' });
			}

			// Generate JWT token for the user
			const token = generateAccessToken(user[0]);

			// Set token in cookie
			res.cookie('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				path: '/',
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

	// Apply JWT middleware to all gamification routes
	app.use('/api/gamification/user', jwtAuth);

	// Register gamification routes
	registerGamificationRoutes(app);

	// Register company onboarding routes
	registerCompanyOnboardingRoutes(app);

	// Register license management routes
	registerLicenseManagementRoutes(app);

	// Register email verification routes
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

			// Find user by username or email
			const user = await storage.getUserByUsernameOrEmail(username);

			if (!user) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			// Check if user has a password and it;s valid
			if (!user.password) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			// Check password
			const isValidPassword = await comparePasswords(password, user.password);
			if (!isValidPassword) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			// Generate JWT token
			const token = generateAccessToken(user);

			// Set token in cookie
			res.cookie('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				path: '/',
			});

			// Return user data
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

	app.use(userProfileRoute);

	// Logout endpoint
	app.post('/api/logout', async (req: Request, res: Response) => {
		try {
			// Clear the authentication cookie
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

	// Test login endpoint for development/testing purposes
	app.post('/api/test-login', async (req: Request, res: Response) => {
		try {
			const { email } = req.body;

			if (!email) {
				return res.status(400).json({ message: 'Email is required' });
			}

			// Find user by email
			const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

			if (!user || user.length === 0) {
				return res.status(404).json({ message: 'User not found' });
			}

			// Generate JWT token for the user (for testing purposes only)
			const token = generateAccessToken(user[0]);

			// Set token in cookie
			res.cookie('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				path: '/',
			});

			return res.status(200).json(user[0]);
		} catch (error) {
			console.error('Error during test login:', error);
			res.status(500).json({ message: 'Login failed' });
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

	// Individual course route
	app.get('/api/courses/:id', async (req: Request, res: Response) => {
		try {
			const courseId = parseInt(req.params.id);
			const course = await storage.getCourseById(courseId);

			if (!course) {
				return res.status(404).json({ message: 'Course not found' });
			}

			// Get the course modules
			const modules = await storage.getModulesByCourse(courseId);

			// For each module, get its lessons
			const modulesWithLessons = await Promise.all(
				modules.map(async (module) => {
					const lessons = await storage.getLessonsByModule(module.id);
					// Make first two lessons in each course free for all users
					const lessonsWithFreeAccess = lessons.map((lesson, index) => ({
						...lesson,
						isPreview: index < 2 || lesson.isPreview,
						isFree: index < 2 || lesson.isPreview,
					}));
					return {
						...module,
						lessons: lessonsWithFreeAccess,
					};
				})
			);

			res.json({
				...course,
				modules: modulesWithLessons,
			});
		} catch (error) {
			console.error('Error fetching course:', error);
			res.status(500).json({ message: 'Failed to fetch course' });
		}
	});

	app.post(
		'/api/courses',
		requireJwtAuth,
		isAdminOrInstructor,
		async (req: Request, res: Response) => {
			try {
				const courseData = insertCourseSchema.parse(req.body);
				const course = await storage.createCourse(courseData);
				res.status(201).json(course);
			} catch (error) {
				console.error('Error creating course:', error);
				res.status(400).json({ message: 'Invalid course data' });
			}
		}
	);

	// Categories routes
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
	app.post(
		'/api/modules',
		requireJwtAuth,
		isAdminOrInstructor,
		async (req: Request, res: Response) => {
			try {
				const moduleData = insertModuleSchema.parse(req.body);
				const module = await storage.createModule(moduleData);
				res.status(201).json(module);
			} catch (error) {
				console.error('Error creating module:', error);
				res.status(400).json({ message: 'Invalid module data' });
			}
		}
	);

	// Lesson routes
	app.post(
		'/api/lessons',
		requireJwtAuth,
		isAdminOrInstructor,
		async (req: Request, res: Response) => {
			try {
				const lessonData = insertLessonSchema.parse(req.body);
				const lesson = await storage.createLesson(lessonData);
				res.status(201).json(lesson);
			} catch (error) {
				console.error('Error creating lesson:', error);
				res.status(400).json({ message: 'Invalid lesson data' });
			}
		}
	);

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

	// Initialize OAuth social login
	setupOAuth(app);

	const httpServer = createServer(app);
	return httpServer;
}
