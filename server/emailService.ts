import { randomBytes } from 'crypto';
import { db } from './db';
import { users } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';
import sgMail from '@sendgrid/mail';

// Check if SendGrid API key is set
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const PLATFORM_EMAIL = 'noreply@m4t.com';
const APP_URL =
	process.env.NODE_ENV === 'production'
		? 'https://learningplatform.replit.app'
		: 'http://localhost:5000';

if (SENDGRID_API_KEY) {
	sgMail.setApiKey(SENDGRID_API_KEY);
}

// Generate a random token for verification
export function generateVerificationToken(): string {
	return randomBytes(32).toString('hex');
}

// Set verification token for a user
export async function setVerificationToken(userId: string, token: string): Promise<void> {
	// Set token expiry to 24 hours from now
	const expiryDate = new Date();
	expiryDate.setHours(expiryDate.getHours() + 24);

	await db
		.update(users)
		.set({
			verificationToken: token,
			verificationTokenExpiry: expiryDate,
		})
		.where(eq(users.id, userId));
}

// Set password reset token for a user
export async function setPasswordResetToken(userId: string, token: string): Promise<void> {
	// Set token expiry to 1 hour from now
	const expiryDate = new Date();
	expiryDate.setHours(expiryDate.getHours() + 1);

	await db
		.update(users)
		.set({
			resetPasswordToken: token,
			resetPasswordTokenExpiry: expiryDate,
		})
		.where(eq(users.id, userId));
}

// Verify user's email with token
export async function verifyUserEmail(token: string): Promise<boolean> {
	// Find user with matching token that hasn't expired
	const now = new Date();

	const [user] = await db
		.select()
		.from(users)
		.where(and(eq(users.verificationToken, token), gt(users.verificationTokenExpiry as any, now)));

	if (!user) {
		return false;
	}

	// Mark user as verified and clear token
	await db
		.update(users)
		.set({
			isEmailVerified: true,
			verificationToken: null,
			verificationTokenExpiry: null,
		})
		.where(eq(users.id, user.id));

	return true;
}

// Check if user needs email verification
export async function needsEmailVerification(userId: string): Promise<boolean> {
	const [user] = await db
		.select({ isEmailVerified: users.isEmailVerified })
		.from(users)
		.where(eq(users.id, userId));

	return user ? !user.isEmailVerified : true;
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
	if (!SENDGRID_API_KEY) {
		console.warn('SendGrid API key not set, skipping email send');
		return false;
	}

	const verificationLink = `${APP_URL}/api/auth/verify?token=${token}`;

	try {
		const msg = {
			to: email,
			from: PLATFORM_EMAIL,
			subject: 'Verify Your Email Address',
			html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin-bottom: 5px; font-size: 24px;">Welcome to LearnFlow!</h1>
            <p style="color: #6b7280; font-size: 16px; margin-top: 0;">Your journey to knowledge begins here</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 16px; margin-top: 0;">Please verify your email address to access all features of our learning platform.</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${verificationLink}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">Verify My Email</a>
            </div>
            
            <p style="color: #4b5563; font-size: 14px;">This link will expire in 24 hours. If you don't verify your email within this timeframe, you can request a new verification link from your account dashboard.</p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
            <p style="color: #6b7280; font-size: 14px;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;"><a href="${verificationLink}" style="color: #4f46e5; text-decoration: none;">${verificationLink}</a></p>
          </div>
          
          <div style="margin-top: 25px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>If you did not create an account with LearnFlow, please ignore this email.</p>
            <p>© ${new Date().getFullYear()} LearnFlow Learning Platform. All rights reserved.</p>
          </div>
        </div>
      `,
		};

		await sgMail.send(msg);
		return true;
	} catch (error) {
		console.error('Error sending verification email:', error);
		return false;
	}
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
	if (!SENDGRID_API_KEY) {
		console.warn('SendGrid API key not set, skipping email send');
		return false;
	}

	const resetLink = `${APP_URL}/reset-password?token=${token}`;

	try {
		const msg = {
			to: email,
			from: PLATFORM_EMAIL,
			subject: 'Reset Your Password',
			html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin-bottom: 5px; font-size: 24px;">Password Reset</h1>
            <p style="color: #6b7280; font-size: 16px; margin-top: 0;">Secure your LearnFlow account</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 16px; margin-top: 0;">You requested to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">Reset My Password</a>
            </div>
            
            <p style="color: #4b5563; font-size: 14px;">This link will expire in 1 hour for security reasons. If you need another reset link, you can request it from the login page.</p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
            <p style="color: #6b7280; font-size: 14px;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;"><a href="${resetLink}" style="color: #4f46e5; text-decoration: none;">${resetLink}</a></p>
          </div>
          
          <div style="margin-top: 25px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>If you did not request a password reset, please ignore this email or contact support if you're concerned about your account security.</p>
            <p>© ${new Date().getFullYear()} LearnFlow Learning Platform. All rights reserved.</p>
          </div>
        </div>
      `,
		};

		await sgMail.send(msg);
		return true;
	} catch (error) {
		console.error('Error sending password reset email:', error);
		return false;
	}
}

// Generic send email function
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
	if (!SENDGRID_API_KEY) {
		console.warn('SendGrid API key not set, skipping email send');
		return false;
	}

	try {
		const msg = {
			to,
			from: PLATFORM_EMAIL,
			subject,
			html,
		};

		await sgMail.send(msg);
		return true;
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
}

// Send license assignment email
export async function sendLicenseAssignmentEmail(
	email: string,
	companyName: string
): Promise<boolean> {
	if (!SENDGRID_API_KEY) {
		console.warn('SendGrid API key not set, skipping email send');
		return false;
	}

	const loginLink = `${APP_URL}/login`;

	try {
		const msg = {
			to: email,
			from: PLATFORM_EMAIL,
			subject: `You've Been Given Access to LearnFlow by ${companyName}`,
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Welcome to LearnFlow!</h2>
          <p>Congratulations! ${companyName} has given you access to the LearnFlow learning platform.</p>
          <p>You can now access all the premium courses and content available in your company's learning plan.</p>
          <a href="${loginLink}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 15px 0;">Start Learning</a>
          <p>If you don't already have an account, you'll need to create one using this email address.</p>
          <p>Happy learning!</p>
        </div>
      `,
		};

		await sgMail.send(msg);
		return true;
	} catch (error) {
		console.error('Error sending license assignment email:', error);
		return false;
	}
}

/**
 * Notify the user that their license has been revoked.
 */
export async function sendLicenseRevokedEmail(
	to: string,
	licenseKey: string,
	reason?: string
): Promise<boolean> {
	const subject = `Your license "${licenseKey}" has been revoked`;
	const html = `
    <div style="font-family: sans-serif; line-height:1.4">
      <h2 style="color:#c53030">License Revoked</h2>
      <p>Your license with key <strong>${licenseKey}</strong> has been <strong>revoked</strong>.</p>
      ${reason ? `<p><em>Reason:</em> ${reason}</p>` : ''}
      <p>If you believe this was a mistake, please contact support.</p>
      <hr/>
      <p style="font-size:0.85em;color:#666">
        LearnEdge Team
      </p>
    </div>
  `;

	return sendEmail(to, subject, html);
}

/**
 * Notify the user that their license has been suspended.
 */
export async function sendLicenseSuspendedEmail(
	to: string,
	licenseKey: string,
	until: Date,
	reason?: string
): Promise<boolean> {
	const subject = `Your license "${licenseKey}" has been suspended`;
	const html = `
    <div style="font-family: sans-serif; line-height:1.4">
      <h2 style="color:#dd6b20">License Suspended</h2>
      <p>Your license <strong>${licenseKey}</strong> is currently <strong>suspended</strong> until <strong>${until.toDateString()}</strong>.</p>
      ${reason ? `<p><em>Reason:</em> ${reason}</p>` : ''}
      <p>If you have any questions, please contact support.</p>
      <hr/>
      <p style="font-size:0.85em;color:#666">
        LearnEdge Team
      </p>
    </div>
  `;

	return sendEmail(to, subject, html);
}

// Send enrollment confirmation email
export async function sendEnrollmentConfirmationEmail(
	email: string,
	courseName: string
): Promise<boolean> {
	if (!SENDGRID_API_KEY) {
		console.warn('SendGrid API key not set, skipping email send');
		return false;
	}

	const dashboardLink = `${APP_URL}/dashboard`;

	try {
		const msg = {
			to: email,
			from: PLATFORM_EMAIL,
			subject: `You've Enrolled in ${courseName}`,
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Course Enrollment Confirmation</h2>
          <p>Congratulations! You have successfully enrolled in <strong>${courseName}</strong>.</p>
          <p>You can start learning right away by visiting your dashboard:</p>
          <a href="${dashboardLink}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 15px 0;">Go to Dashboard</a>
          <p>We're excited to have you on this learning journey!</p>
          <p>Happy learning!</p>
        </div>
      `,
		};

		await sgMail.send(msg);
		return true;
	} catch (error) {
		console.error('Error sending enrollment confirmation email:', error);
		return false;
	}
}
