// import express, { type Request, Response, NextFunction } from 'express';
// import { registerRoutes } from './routes';
// import { setupVite, serveStatic, log } from './vite';
// import { initializeGamification } from './initGamification';
// import cookieParser from 'cookie-parser';
// import { jwtAuth } from './jwtMiddleware';
// import { db } from './db';
// import { users, UserRole } from '@shared/schema';
// import { eq } from 'drizzle-orm';
// import { scrypt, randomBytes } from 'crypto';
// import { promisify } from 'util';

// const scryptAsync = promisify(scrypt);

// // Function to hash password for test accounts
// async function hashPassword(password: string) {
// 	const salt = randomBytes(16).toString('hex');
// 	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
// 	return `${buf.toString('hex')}.${salt}`;
// }

// // Function to setup default subscription plans if they don't exist
// async function setupDefaultSubscriptionPlans() {
// 	// Check if plans already exist
// 	const { subscriptionPlans } = await import('@shared/schema');
// 	const plans = await db.select().from(subscriptionPlans);

// 	if (plans.length > 0) {
// 		console.log(`Found ${plans.length} existing subscription plans, skipping plan creation.`);
// 		return;
// 	}

// 	console.log('Creating default subscription plans...');

// 	// Default plans
// 	const defaultPlans = [
// 		{
// 			name: 'Basic',
// 			description: 'Access to all basic courses and materials.',
// 			price: 9.99,
// 			period: 'MONTHLY',
// 			features: JSON.stringify(['10 courses per month', 'Basic analytics', 'Email support']),
// 			isActive: true,
// 		},
// 		{
// 			name: 'Pro',
// 			description: 'Full access to all courses with additional benefits.',
// 			price: 19.99,
// 			period: 'MONTHLY',
// 			features: JSON.stringify([
// 				'Unlimited courses',
// 				'Advanced analytics',
// 				'Priority support',
// 				'Course certificates',
// 			]),
// 			isActive: true,
// 		},
// 		{
// 			name: 'Enterprise',
// 			description: 'Complete learning solution for teams and organizations.',
// 			price: 49.99,
// 			period: 'MONTHLY',
// 			features: JSON.stringify([
// 				'Team management',
// 				'Custom learning paths',
// 				'Advanced reporting',
// 				'API access',
// 				'Dedicated support',
// 			]),
// 			isActive: true,
// 		},
// 		{
// 			name: 'Annual Pro',
// 			description: 'Save 20% with our annual plan. Full access to all courses.',
// 			price: 191.88,
// 			period: 'YEARLY',
// 			features: JSON.stringify([
// 				'Unlimited courses',
// 				'Advanced analytics',
// 				'Priority support',
// 				'Course certificates',
// 				'20% savings compared to monthly',
// 			]),
// 			isActive: true,
// 		},
// 	];

// 	for (const plan of defaultPlans) {
// 		await db.insert(subscriptionPlans).values({
// 			...plan,
// 			price: plan.price.toString(),
// 		});
// 		console.log(`Created subscription plan: ${plan.name}`);
// 	}

// 	console.log('Default subscription plans created');
// }

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// // Add JWT authentication middleware - this will run on all requests
// // but won't block any requests that don't have a valid token
// app.use(jwtAuth);

// app.use((req, res, next) => {
// 	const start = Date.now();
// 	const path = req.path;
// 	let capturedJsonResponse: Record<string, any> | undefined = undefined;

// 	const originalResJson = res.json;
// 	res.json = function (bodyJson, ...args) {
// 		capturedJsonResponse = bodyJson;
// 		return originalResJson.apply(res, [bodyJson, ...args]);
// 	};

// 	res.on('finish', () => {
// 		const duration = Date.now() - start;
// 		if (path.startsWith('/api')) {
// 			let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
// 			if (capturedJsonResponse) {
// 				logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
// 			}

// 			if (logLine.length > 80) {
// 				logLine = logLine.slice(0, 79) + '…';
// 			}

// 			log(logLine);
// 		}
// 	});

// 	next();
// });

// (async () => {
// 	const server = await registerRoutes(app);

// 	// Initialize gamification system with badges and challenges
// 	try {
// 		await initializeGamification();

// 		// Ensure test accounts exist
// 		// await setupTestAccounts();

// 		// Setup default subscription plans
// 		await setupDefaultSubscriptionPlans();
// 	} catch (error) {
// 		console.error('Error during system initialization:', error);
// 	}

// 	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
// 		const status = err.status || err.statusCode || 500;
// 		const message = err.message || 'Internal Server Error';

// 		res.status(status).json({ message });
// 		throw err;
// 	});

// 	// importantly only setup vite in development and after
// 	// setting up all the other routes so the catch-all route
// 	// doesn't interfere with the other routes
// 	if (app.get('env') === 'development') {
// 		await setupVite(app, server);
// 	} else {
// 		serveStatic(app);
// 	}

// 	// ALWAYS serve the app on port 5000
// 	// this serves both the API and the client.
// 	// It is the only port that is not firewalled.
// 	const port = 3001;
// 	server.listen(
// 		{
// 			port,
// 			host: '0.0.0.0',
// 			reusePort: true,
// 		},
// 		() => {
// 			log(`serving on port ${port}`);
// 		}
// 	);
// })();

/////

// server/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import path from 'path';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

import { registerRoutes } from './routes.js';
import { setupVite, serveStatic, log } from './vite.js';
import { initializeGamification } from './initGamification.js';
import { jwtAuth } from './jwtMiddleware.js';

import { db } from './db.js';
// ← relative import of your shared schema
import { users, UserRole, subscriptionPlans } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

// Function to hash password for test accounts
async function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${buf.toString('hex')}.${salt}`;
}

// Ensure our default subscription plans exist
async function setupDefaultSubscriptionPlans() {
	// Pull the table definition straight from shared/schema:
	//   import { subscriptionPlans } from '../shared/schema'
	const existing = await db.select().from(subscriptionPlans);
	if (existing.length > 0) {
		console.log(`Found ${existing.length} existing plans, skipping creation.`);
		return;
	}

	console.log('Creating default subscription plans…');

	const defaultPlans = [
		{
			name: 'Basic',
			description: 'Access to all basic courses and materials.',
			price: 9.99,
			period: 'MONTHLY',
			features: ['10 courses per month', 'Basic analytics', 'Email support'],
			isActive: true,
		},
		{
			name: 'Pro',
			description: 'Full access to all courses with additional benefits.',
			price: 19.99,
			period: 'MONTHLY',
			features: [
				'Unlimited courses',
				'Advanced analytics',
				'Priority support',
				'Course certificates',
			],
			isActive: true,
		},
		{
			name: 'Enterprise',
			description: 'Complete learning solution for teams and organizations.',
			price: 49.99,
			period: 'MONTHLY',
			features: [
				'Team management',
				'Custom learning paths',
				'Advanced reporting',
				'API access',
				'Dedicated support',
			],
			isActive: true,
		},
		{
			name: 'Annual Pro',
			description: 'Save 20% with our annual plan. Full access to all courses.',
			price: 191.88,
			period: 'YEARLY',
			features: [
				'Unlimited courses',
				'Advanced analytics',
				'Priority support',
				'Course certificates',
				'20% savings compared to monthly',
			],
			isActive: true,
		},
	];

	for (const p of defaultPlans) {
		await db.insert(subscriptionPlans).values({
			name: p.name,
			description: p.description,
			price: p.price.toString(), // numeric columns accept string
			period: p.period,
			features: JSON.stringify(p.features),
			isActive: p.isActive,
		});
		console.log(`  ✔ Created plan "${p.name}"`);
	}
	console.log('Default subscription plans created.');
}

async function main() {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());

	// Attach JWT middleware (non-blocking)
	app.use(jwtAuth);

	// Simple logger for all /api calls
	app.use((req, res, next) => {
		const start = Date.now();
		let jsonBody: any;
		const _json = res.json;
		res.json = (body: any) => {
			jsonBody = body;
			return _json.call(res, body);
		};

		res.on('finish', () => {
			if (req.path.startsWith('/api')) {
				let msg = `${req.method} ${req.path} → ${res.statusCode} in ${Date.now() - start}ms`;
				if (jsonBody !== undefined) {
					msg += ` :: ${JSON.stringify(jsonBody)}`.slice(0, 80) + '…';
				}
				log(msg);
			}
		});

		next();
	});

	// Bind all your feature routes under /api/…
	const httpServer = await registerRoutes(app);

	// One-time bootstrapping
	try {
		await initializeGamification();
		await setupDefaultSubscriptionPlans();
	} catch (err) {
		console.error('Bootstrap error:', err);
	}

	// Error handler
	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const status = err.statusCode || err.status || 500;
		res.status(status).json({ message: err.message || 'Internal error' });
		throw err;
	});

	// In dev, spin up Vite’s middleware; in prod serve the built client
	if (app.get('env') === 'development') {
		await setupVite(app, httpServer);
	} else {
		serveStatic(app);
	}

	const PORT = parseInt(process.env.PORT || '3001', 10);
	httpServer.listen(PORT, '0.0.0.0', () => {
		log(`listening on http://localhost:${PORT}`);
	});
}

main().catch((err) => {
	console.error('Fatal error starting server:', err);
	process.exit(1);
});
