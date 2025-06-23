import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Express } from 'express';
import { storage } from './storage.ts';
import { generateToken } from './jwt.ts';
import crypto from 'crypto';

export function setupOAuth(app: Express) {
	// Initialize Passport
	app.use(passport.initialize());

	// Google OAuth Strategy
	if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
		passport.use(
			new GoogleStrategy(
				{
					clientID: process.env.GOOGLE_CLIENT_ID,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET,
					callbackURL: '/api/auth/google/callback',
				},
				async (accessToken, refreshToken, profile, done) => {
					try {
						const email = profile.emails?.[0]?.value;
						if (!email) {
							return done(new Error('No email found in Google profile'));
						}

						// Check if user exists
						let user = await storage.getUserByEmail(email);

						if (!user) {
							// Create new user
							user = await storage.createUser({
								id: crypto.randomUUID(),
								email,
								firstName: profile.name?.givenName || '',
								lastName: profile.name?.familyName || '',
								role: 'student',
								isEmailVerified: true,
								password: '', // OAuth users don't need a password
								googleId: profile.id,
								profileImageUrl: profile.photos?.[0]?.value,
								authProvider: 'google',
							});
						} else if (!user.googleId) {
							// Link Google account to existing user
							storage.updateUser(user.id, {
								googleId: profile.id,
								authProvider: 'google',
								githubId: '',
							});
						}

						return done(null, user);
					} catch (error) {
						return done(error);
					}
				}
			)
		);
	}

	// GitHub OAuth Strategy
	if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
		passport.use(
			new GitHubStrategy(
				{
					clientID: process.env.GITHUB_CLIENT_ID,
					clientSecret: process.env.GITHUB_CLIENT_SECRET,
					callbackURL: '/api/auth/github/callback',
				},
				async (accessToken: string, refreshToken: string, profile: any, done: any) => {
					try {
						const email = profile.emails?.[0]?.value;
						if (!email) {
							return done(new Error('No email found in GitHub profile'));
						}

						// Check if user exists
						let user = await storage.getUserByEmail(email);

						if (!user) {
							// Create new user
							user = await storage.createUser({
								id: crypto.randomUUID(),
								email,
								firstName: profile.displayName?.split(' ')[0] || '',
								lastName: profile.displayName?.split(' ')[1] || '',
								role: 'student',
								isEmailVerified: true,
								password: '', // OAuth users don't need a password
								githubId: profile.id,
								profileImageUrl: profile.photos?.[0]?.value,
								authProvider: 'github',
							});
						} else if (!user.githubId) {
							// Link GitHub account to existing user
							storage.updateUser(user.id, {
								githubId: profile.id,
								authProvider: 'github',
								googleId: '',
							});
						}

						return done(null, user);
					} catch (error) {
						return done(error);
					}
				}
			)
		);
	}

	// OAuth Routes

	// Google OAuth routes
	app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

	app.get(
		'/api/auth/google/callback',
		passport.authenticate('google', { session: false }),
		async (req: any, res) => {
			try {
				const user = req.user;
				const token = generateToken(user.id, user.email, user.role);

				// Set JWT token as HTTP-only cookie
				res.cookie('token', token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				});

				// Redirect to dashboard or intended page
				res.redirect('/dashboard?auth=success');
			} catch (error) {
				console.error('Google OAuth callback error:', error);
				res.redirect('/login?error=oauth_failed');
			}
		}
	);

	// GitHub OAuth routes
	app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

	app.get(
		'/api/auth/github/callback',
		passport.authenticate('github', { session: false }),
		async (req: any, res) => {
			try {
				const user = req.user;
				const token = generateToken(user.id, user.email, user.role);

				// Set JWT token as HTTP-only cookie
				res.cookie('token', token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				});

				// Redirect to dashboard or intended page
				res.redirect('/dashboard?auth=success');
			} catch (error) {
				console.error('GitHub OAuth callback error:', error);
				res.redirect('/login?error=oauth_failed');
			}
		}
	);

	passport.serializeUser((user: any, done) => done(null, user.id));
	passport.deserializeUser(async (id: string, done) => {
		const user = await storage.getUser(id);
		done(null, user || undefined);
	});

	// OAuth status endpoint
	app.get('/api/auth/oauth-status', (req, res) => {
		const status = {
			google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
			github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
			apple: false, // Simplified for now
		};
		res.json(status);
	});
}
