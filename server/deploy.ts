import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import type { Express, Request, Response } from 'express';
import { createServer, type Server } from 'http';
import { db } from './db';
import { storage } from './storage';
import { requireJwtAuth } from './jwtMiddleware';
import { loginWithJwt, refreshAccessToken, logoutJwt, getCurrentUser } from './jwtRoutes';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from './jwt';
import { scrypt } from 'crypto';
import crypto from 'crypto';
import { promisify } from 'util';
import { users } from '../shared/schema';
import { count, eq } from 'drizzle-orm';
import './vite';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

function registerMinimalRoutes(app: Express): Server {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', message: 'M4T Learning Platform running' });
  });

  // Auth routes
  app.post('/api/auth/login', loginWithJwt);
  app.post('/api/auth/refresh', refreshAccessToken);
  app.post('/api/auth/logout', logoutJwt);
  app.get('/api/auth/me', requireJwtAuth, getCurrentUser);

  // Register endpoint  
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await hashPassword(password);
      
      const user = await storage.createUser({
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        role: 'student',
        isEmailVerified: true
      });

      const accessToken = generateAccessToken(user.id, user.email, user.role);
      const refreshToken = generateRefreshToken(user.id);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  // Stats endpoint
  app.get('/api/stats', async (req, res) => {
    try {
      const userCount = await db.select({ count: count() }).from(users);
      res.json({ 
        users: userCount[0]?.count || 0,
        status: 'M4T Learning Platform Active'
      });
    } catch (error) {
      res.json({ users: 0, status: 'Database connecting...' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function startDeployment() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '5000');

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  console.log('Deploying M4T Learning Platform...');

  const server = registerMinimalRoutes(app);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`M4T Learning Platform deployed on port ${PORT}`);
    console.log('UAT Test Accounts Available:');
    console.log('- student@test.com (password: password123)');
    console.log('- instructor@test.com (password: password123)');
    console.log('- admin@techcorp.com (password: password123)');
    console.log('Platform ready for UAT testing');
  });
}

startDeployment().catch(console.error);