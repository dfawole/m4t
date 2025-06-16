import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';
import { initializeGamification } from './initGamification';
import cookieParser from 'cookie-parser';
import { jwtAuth } from './jwtMiddleware';
import { db } from './db';
import { users, UserRole } from '@shared/schema';
import { eq, or } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Function to hash password for test accounts
async function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${buf.toString('hex')}.${salt}`;
}

// Function to setup test accounts if they don't exist
async function setupTestAccounts() {
	console.log('Setting up test accounts...');

	const testAccounts = [
		{
			id: 'admin',
			username: 'admin',
			email: 'admin@m4t.com',
			firstName: 'Internal',
			lastName: 'Admin',
			password: 'admin123',
			role: UserRole.INTERNAL_ADMIN,
		},
		{
			id: 'company_admin',
			username: 'company_admin',
			email: 'company@m4t.com',
			firstName: 'Company',
			lastName: 'Admin',
			password: 'company123',
			role: UserRole.COMPANY_ADMIN,
		},
		{
			id: 'instructor',
			username: 'instructor',
			email: 'instructor@m4t.com',
			firstName: 'Course',
			lastName: 'Instructor',
			password: 'instructor123',
			role: UserRole.INSTRUCTOR,
		},
		{
			id: 'student',
			username: 'student',
			email: 'student@m4t.com',
			firstName: 'Test',
			lastName: 'Student',
			password: 'student123',
			role: UserRole.STUDENT,
		},
	];

	for (const account of testAccounts) {
		// Check if user already exists by email OR id
		const existingUser = await db
			.select()
			.from(users)
			.where(or(eq(users.email, account.email), eq(users.id, account.id)))
			.limit(1);

		if (existingUser.length === 0) {
			// Create the user if it doesn't exist
			const hashedPassword = await hashPassword(account.password);

			await db.insert(users).values({
				id: account.id,
				username: account.username,
				email: account.email,
				firstName: account.firstName,
				lastName: account.lastName,
				password: hashedPassword,
				role: account.role,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			console.log(`Created test account: ${account.email} with role ${account.role}`);
		} else {
			console.log(`Test account already exists: ${account.email}`);
		}
	}

	console.log('Test accounts setup complete');
}

// Function to setup default subscription plans if they don't exist
async function setupDefaultSubscriptionPlans() {
	// Check if plans already exist
	const { subscriptionPlans } = await import('@shared/schema');
	const plans = await db.select().from(subscriptionPlans);

	if (plans.length > 0) {
		console.log(`Found ${plans.length} existing subscription plans, skipping plan creation.`);
		return;
	}

	console.log('Creating default subscription plans...');

	// Default plans
	const defaultPlans = [
		{
			name: 'Basic',
			description: 'Access to all basic courses and materials.',
			price: 9.99,
			period: 'MONTHLY',
			features: JSON.stringify(['10 courses per month', 'Basic analytics', 'Email support']),
			isActive: true,
		},
		{
			name: 'Pro',
			description: 'Full access to all courses with additional benefits.',
			price: 19.99,
			period: 'MONTHLY',
			features: JSON.stringify([
				'Unlimited courses',
				'Advanced analytics',
				'Priority support',
				'Course certificates',
			]),
			isActive: true,
		},
		{
			name: 'Enterprise',
			description: 'Complete learning solution for teams and organizations.',
			price: 49.99,
			period: 'MONTHLY',
			features: JSON.stringify([
				'Team management',
				'Custom learning paths',
				'Advanced reporting',
				'API access',
				'Dedicated support',
			]),
			isActive: true,
		},
		{
			name: 'Annual Pro',
			description: 'Save 20% with our annual plan. Full access to all courses.',
			price: 191.88,
			period: 'YEARLY',
			features: JSON.stringify([
				'Unlimited courses',
				'Advanced analytics',
				'Priority support',
				'Course certificates',
				'20% savings compared to monthly',
			]),
			isActive: true,
		},
	];

	for (const plan of defaultPlans) {
		await db.insert(subscriptionPlans).values({
			...plan,
			price: plan.price.toString(), // Convert number to string
			// Remove createdAt and updatedAt as they have defaultNow()
		});
		console.log(`Created subscription plan: ${plan.name}`);
	}

	console.log('Default subscription plans created');
}

const app = express();

// Configure Express middleware from environment variables
const jsonLimit = process.env.JSON_LIMIT || '10mb';
const urlEncodedExtended = process.env.URL_ENCODED_EXTENDED === 'true';
const requestLimit = process.env.REQUEST_LIMIT || '10mb';

app.use(express.json({ limit: jsonLimit }));
app.use(
	express.urlencoded({
		extended: urlEncodedExtended,
		limit: requestLimit,
	})
);
app.use(cookieParser());

// Add JWT authentication middleware - this will run on all requests
// but won't block any requests that don't have a valid token
app.use(jwtAuth);

// Request logging middleware - configurable via environment variables
const enableLogging = process.env.ENABLE_REQUEST_LOGGING !== 'false';
const logApiOnly = process.env.LOG_API_ONLY !== 'false';
const logResponseData = process.env.LOG_RESPONSE_DATA === 'true';
const maxLogLength = parseInt(process.env.MAX_LOG_LENGTH || '80');

if (enableLogging) {
	app.use((req, res, next) => {
		const start = Date.now();
		const path = req.path;
		let capturedJsonResponse: Record<string, any> | undefined = undefined;

		if (logResponseData) {
			const originalResJson = res.json;
			res.json = function (bodyJson, ...args) {
				capturedJsonResponse = bodyJson;
				return originalResJson.apply(res, [bodyJson, ...args]);
			};
		}

		res.on('finish', () => {
			const duration = Date.now() - start;
			const shouldLog = !logApiOnly || path.startsWith('/api');

			if (shouldLog) {
				let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
				if (logResponseData && capturedJsonResponse) {
					logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
				}

				if (logLine.length > maxLogLength) {
					logLine = logLine.slice(0, maxLogLength - 1) + '…';
				}

				log(logLine);
			}
		});

		next();
	});
}

(async () => {
	const server = await registerRoutes(app);

	// Initialize gamification system with badges and challenges
	try {
		await initializeGamification();

		// Ensure test accounts exist
		await setupTestAccounts();

		// Setup default subscription plans
		await setupDefaultSubscriptionPlans();
	} catch (error) {
		console.error('Error during system initialization:', error);
	}

	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const status = err.status || err.statusCode || 500;
		const message = err.message || 'Internal Server Error';

		res.status(status).json({ message });
		throw err;
	});

	// importantly only setup vite in development and after
	// setting up all the other routes so the catch-all route
	// doesn't interfere with the other routes
	if (app.get('env') === 'development') {
		await setupVite(app, server);
	} else {
		serveStatic(app);
	}

	// // Server configuration - Use environment PORT or default based on environment
	// const port = parseInt(
	// 	process.env.PORT || (process.env.NODE_ENV === 'production' ? '3006' : '5000')
	// );
	// const host = '0.0.0.0'; // Required for Replit deployment

	// server.listen(port, host, () => {
	// 	log(
	// 		`M4T Learning Platform serving on ${host}:${port} (${process.env.NODE_ENV || 'development'})`
	// 	);
	// });
})();

// ————— Vercel compatibility —————
// Only call app.listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
	const port = parseInt(
		process.env.PORT || (process.env.NODE_ENV === 'production' ? '3006' : '5000'),
		10
	);
	const host = '0.0.0.0';

	app.listen(port, host, () => {
		log(
			`M4T Learning Platform serving on ${host}:${port} (${process.env.NODE_ENV || 'development'})`
		);
	});
}

// Export the Express app for Vercel’s serverless handler
export default app;
