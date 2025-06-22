import { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwt';
import { storage } from './storage';
import { eq } from 'drizzle-orm';
import { users } from '@shared/schema';
import { db } from './db';
import cookie from 'cookie-parser';

// Cookie options
const REFRESH_TOKEN_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: 'strict' as const,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Generate tokens for a user
export async function loginWithJwt(req: Request, res: Response) {
	try {
		// Direct login with email (for test users)
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}

		// Find user by email
		const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (!user || user.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		// // Generate tokens
		// const accessToken = generateAccessToken(user[0]);
		// const refreshToken = generateRefreshToken(user[0]);

		// // Set refresh token as HttpOnly cookie
		// res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

		// // Return access token and user data
		// res.json({
		//   accessToken,
		//   user: user[0]
		// });

		const accessToken = generateAccessToken(user[0]);
		const refreshToken = generateRefreshToken(user[0]);
		// Set both tokens as HttpOnly cookies
		res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
		res.cookie('token', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 15 * 60 * 1000, // 15 minutes
		});
		// Return access token and user data
		res.json({
			accessToken,
			user: user[0],
		});
	} catch (error) {
		console.error('JWT login error:', error);
		res.status(500).json({ message: 'Login failed' });
	}
}

// Refresh access token using refresh token cookie
export async function refreshAccessToken(req: Request, res: Response) {
	try {
		const refreshToken = req.cookies?.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: 'Refresh token required' });
		}

		const payload = verifyRefreshToken(refreshToken);

		if (!payload) {
			return res.status(401).json({ message: 'Invalid or expired refresh token' });
		}

		const user = await storage.getUser(payload.userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Generate new access token
		const accessToken = generateAccessToken(user);

		// Return new access token
		res.json({ accessToken });
	} catch (error) {
		console.error('Token refresh error:', error);
		res.status(500).json({ message: 'Token refresh failed' });
	}
}

// // Log out - clear refresh token cookie
// export async function logoutJwt(req: Request, res: Response) {
// 	try {
// 		// Clear refresh token cookie
// 		res.clearCookie('refreshToken', { ...REFRESH_TOKEN_COOKIE_OPTIONS });

// 		// If using session auth as well, logout from that too
// 		if (req.logout) {
// 			req.logout(() => {
// 				res.json({ message: 'Logged out successfully' });
// 			});
// 		} else {
// 			res.json({ message: 'Logged out successfully' });
// 		}
// 	} catch (error) {
// 		console.error('Logout error:', error);
// 		res.status(500).json({ message: 'Logout failed' });
// 	}
// }

// Log out - clear refresh token cookie
// export async function logoutJwt(req: Request, res: Response) {
// 	try {
// 		// Clear both cookies
// 		res.clearCookie('refreshToken', { ...REFRESH_TOKEN_COOKIE_OPTIONS });
// 		res.clearCookie('token', {
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === 'production',
// 			sameSite: 'lax',
// 			path: '/',
// 		});

// 		// If using session auth as well, logout from that too
// 		if (req.logout) {
// 			req.logout(() => {
// 				res.json({ message: 'Logged out successfully' });
// 			});
// 		} else {
// 			res.json({ message: 'Logged out successfully' });
// 		}
// 	} catch (error) {
// 		console.error('Logout error:', error);
// 		res.status(500).json({ message: 'Logout failed' });
// 	}
// }

// Log out - clear refresh token cookie
export async function logoutJwt(req: Request, res: Response) {
	try {
		// Clear both cookies
		res.clearCookie('refreshToken', { ...REFRESH_TOKEN_COOKIE_OPTIONS });
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
}

// Get current user with JWT
export async function getCurrentUser(req: Request, res: Response) {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			return res.status(200).json(null); // Return null instead of error for client-side checking
		}

		try {
			// Verify token - use access token verification here
			const payload = verifyRefreshToken(token);
			if (!payload) {
				return res.status(200).json(null);
			}

			// Get user from database
			const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

			if (!user || user.length === 0) {
				return res.status(200).json(null);
			}

			// Return user data
			return res.json({
				id: user[0].id,
				email: user[0].email,
				firstName: user[0].firstName,
				lastName: user[0].lastName,
				profileImageUrl: user[0].profileImageUrl,
				role: user[0].role,
			});
		} catch (err) {
			console.log('JWT verification error:', err);
			return res.status(200).json(null);
		}
	} catch (error) {
		console.error('Get user error:', error);
		return res.status(200).json(null);
	}
}
