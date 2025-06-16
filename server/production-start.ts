import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db } from './db';
import { users, subscriptionPlans, courses } from '../shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function initializeProductionDatabase() {
  console.log('Initializing production database...');
  
  try {
    // Check if basic data exists
    const existingUsers = await db.select().from(users).limit(1);
    const existingPlans = await db.select().from(subscriptionPlans).limit(1);
    
    if (existingUsers.length === 0) {
      // Create essential admin account
      await db.insert(users).values({
        id: 'admin',
        email: 'admin@m4t.com',
        password: await hashPassword('admin123'),
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isEmailVerified: true
      }).onConflictDoNothing();
      
      console.log('Created admin account: admin@m4t.com');
    }
    
    if (existingPlans.length === 0) {
      // Create subscription plans
      const plans = [
        {
          name: 'Basic',
          description: 'Essential learning features',
          price: '19.99',
          period: 'monthly' as const,
          features: JSON.stringify(['Access to basic courses', 'Progress tracking', 'Mobile access']),
          isActive: true,
          maxUsers: 1
        },
        {
          name: 'Professional',
          description: 'Advanced learning with certificates', 
          price: '49.99',
          period: 'monthly' as const,
          features: JSON.stringify(['All courses', 'Certificates', 'Priority support']),
          isActive: true,
          maxUsers: 1
        },
        {
          name: 'Enterprise',
          description: 'Full platform for teams',
          price: '99.99',
          period: 'monthly' as const,
          features: JSON.stringify(['Team management', 'Custom branding', 'API access']),
          isActive: true,
          maxUsers: 100
        }
      ];
      
      for (const plan of plans) {
        await db.insert(subscriptionPlans).values(plan).onConflictDoNothing();
      }
      
      console.log('Created subscription plans');
    }
    
    console.log('Database initialization complete');
    
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

async function startProductionServer() {
  const app = express();
  
  // Initialize database on startup
  await initializeProductionDatabase();
  
  // Serve static files from dist
  app.use(express.static(join(__dirname, '../dist')));
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });
  
  // API routes for basic functionality
  app.get('/api/status', async (req, res) => {
    try {
      const userCount = await db.select().from(users);
      const courseCount = await db.select().from(courses);
      const planCount = await db.select().from(subscriptionPlans);
      
      res.json({
        users: userCount.length,
        courses: courseCount.length,
        plans: planCount.length,
        status: 'operational'
      });
    } catch (error) {
      res.status(500).json({ error: 'Database connection failed' });
    }
  });
  
  // SPA routing - serve index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
  
  const PORT = parseInt(process.env.PORT || '3000');
  const server = createServer(app);
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`M4T Learning Platform running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Admin access: admin@m4t.com / admin123`);
  });
  
  return server;
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start server
startProductionServer().catch((error) => {
  console.error('Failed to start production server:', error);
  process.exit(1);
});