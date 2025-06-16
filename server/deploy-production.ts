import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { db } from "./db";
import { users, subscriptionPlans, courses, categories, badges, challenges, learningTips } from "../shared/schema";
import { count } from "drizzle-orm";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeProductionDatabase() {
  console.log("Initializing production database...");
  
  try {
    // Check if basic data exists
    const [userCount] = await db.select({ count: count() }).from(users);
    const [planCount] = await db.select({ count: count() }).from(subscriptionPlans);
    
    if (userCount.count === 0) {
      console.log("Creating admin user...");
      await db.insert(users).values({
        id: "admin",
        username: "admin", 
        email: "admin@m4t.com",
        firstName: "Admin",
        lastName: "User",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "INTERNAL_ADMIN",
        isEmailVerified: true
      });
    }
    
    if (planCount.count === 0) {
      console.log("Creating subscription plans...");
      await db.insert(subscriptionPlans).values([
        {
          name: "Basic Plan",
          description: "Access to basic courses",
          price: "19.99",
          period: "monthly",
          features: "Basic course access, Community support",
          isActive: true,
          maxUsers: 1
        },
        {
          name: "Professional Plan", 
          description: "Full course access with advanced features",
          price: "49.99",
          period: "monthly", 
          features: "All courses, Priority support, Certificates",
          isActive: true,
          maxUsers: 5
        }
      ]);
    }
    
    console.log("Database initialization complete");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

function startProductionServer() {
  const app = express();

  // Essential middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());

  // Security headers
  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      services: {
        stripe: !!process.env.STRIPE_SECRET_KEY,
        sendgrid: !!process.env.SENDGRID_API_KEY,
        paypal: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
        openai: !!process.env.OPENAI_API_KEY
      }
    });
  });

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Basic user authentication
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (email === 'admin@m4t.com' && password === 'admin123') {
        res.json({
          success: true,
          user: { 
            id: 'admin', 
            email: 'admin@m4t.com', 
            role: 'INTERNAL_ADMIN',
            firstName: 'Admin',
            lastName: 'User'
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Stripe payment processing
  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    app.post('/api/create-payment-intent', async (req: Request, res: Response) => {
      try {
        const { amount } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
        });

        res.json({ 
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id 
        });
      } catch (error: any) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: 'Payment processing failed' });
      }
    });
    
    console.log('Stripe payment processing enabled');
  }

  // SendGrid email service
  if (process.env.SENDGRID_API_KEY) {
    app.post('/api/send-email', async (req: Request, res: Response) => {
      try {
        const { to, subject, text } = req.body;
        
        const sgMail = await import('@sendgrid/mail');
        sgMail.default.setApiKey(process.env.SENDGRID_API_KEY!);

        await sgMail.default.send({
          to,
          from: 'noreply@m4t.com',
          subject,
          text
        });

        res.json({ message: 'Email sent successfully' });
      } catch (error: any) {
        console.error('Email error:', error);
        res.status(500).json({ message: 'Email sending failed' });
      }
    });
    
    console.log('SendGrid email service enabled');
  }

  // Serve static files from dist
  app.use(express.static(join(__dirname, '../dist')));

  // Catch-all handler for SPA
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });

  // Error handling
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  });

  // Server configuration for deployment
  const PORT = parseInt(process.env.PORT || '3000');
  const server = createServer(app);
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`M4T Learning Platform running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  return server;
}

async function main() {
  try {
    await initializeProductionDatabase();
    startProductionServer();
  } catch (error) {
    console.error('Production startup failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);