import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

// Ensure we have a JWT_SECRET environment variable
if (!process.env.SESSION_SECRET) {
	throw new Error('SESSION_SECRET environment variable is required for JWT authentication');
}

// Using SESSION_SECRET for JWT signing to maintain compatibility with existing setup
const JWT_SECRET = process.env.SESSION_SECRET;

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days (matching current session expiry)

// Define what we store in the JWT payload
interface JwtPayload {
	userId: string;
	email: string | null;
	role: string;
	tokenVersion?: number; // For token invalidation
}

// Extended interface for user objects
interface JwtUser {
	id: string;
	email: string | null;
	role?: string;
	[key: string]: any;
}

/**
 * Generate an access token for the user
 */
export function generateAccessToken(user: any): string {
	const payload: JwtPayload = {
		userId: user.id,
		email: user.email,
		role: user.role,
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

/**
 * Generate a refresh token for the user
 */
export function generateRefreshToken(user: any, tokenVersion: number = 0): string {
	const payload: JwtPayload = {
		userId: user.id,
		email: user.email,
		role: user.role,
		tokenVersion,
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

/**
 * Verify an access token and return the decoded payload
 */
export function verifyAccessToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch (error) {
		return null;
	}
}

/**
 * Verify a refresh token and return the decoded payload
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch (error) {
		return null;
	}
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}

	return authHeader.split(' ')[1];
}

/**
 * Generate a simple token for OAuth flows (compatibility function)
 */
export function generateToken(userId: string, email: string | null, role: string): string {
	return generateAccessToken({ id: userId, email, role });
}
