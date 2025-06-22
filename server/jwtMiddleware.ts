import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './jwt';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Function to get token from either authorization header or cookie
function getToken(req: any): string | null {
  // First try authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // Then try cookie
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
}

// Simple JWT middleware that doesn't depend on Express session
export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  
  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      // Add user info to request
      (req as any).user = { id: payload.userId, email: payload.email, role: payload.role };
    }
  }
  
  next();
}

// Middleware to require JWT authentication
export function requireJwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  
  if (!token) {
    return res.status(401).json({ message: 'JWT authentication required' });
  }
  
  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  // Create user object directly from payload for test accounts
  (req as any).user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
    claims: { sub: payload.userId }
  };
  
  // Add isAuthenticated method
  (req as any).isAuthenticated = function() { 
    return true; 
  };
  
  next();
}