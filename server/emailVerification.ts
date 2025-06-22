import { Request, Response } from "express";
import { 
  generateVerificationToken, 
  sendVerificationEmail, 
  setVerificationToken,
  verifyUserEmail,
  needsEmailVerification,
  sendPasswordResetEmail,
  setPasswordResetToken
} from "./emailService";
import { storage } from "./storage";
import { randomBytes } from "crypto";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Send verification email to user
export async function sendVerification(req: Request, res: Response) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: "If your email exists in our system, a verification email has been sent" });
    }
    
    // Check if user is already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email is already verified" });
    }
    
    // Generate and store verification token
    const token = generateVerificationToken();
    await setVerificationToken(user.id, token);
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, token);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }
    
    return res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({ message: "Failed to send verification email" });
  }
}

// Verify user's email with token
export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    
    const verified = await verifyUserEmail(token);
    
    if (!verified) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }
    
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Failed to verify email" });
  }
}

// Request password reset
export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: "If your email exists in our system, a password reset email has been sent" });
    }
    
    // Generate reset token
    const token = randomBytes(32).toString('hex');
    
    // Save token to user
    await setPasswordResetToken(user.id, token);
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, token);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send password reset email" });
    }
    
    return res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return res.status(500).json({ message: "Failed to request password reset" });
  }
}

// Check if email needs verification
export async function checkEmailVerification(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const needsVerification = await needsEmailVerification(req.user.id);
    
    return res.status(200).json({ needsVerification });
  } catch (error) {
    console.error("Error checking email verification:", error);
    return res.status(500).json({ message: "Failed to check email verification status" });
  }
}

// Register email verification routes
// Resend verification email endpoint
export async function resendVerification(req: Request, res: Response) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: "If your email exists in our system, a verification email has been sent" });
    }
    
    // Check if user is already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email is already verified" });
    }
    
    // Generate and store verification token
    const token = generateVerificationToken();
    await setVerificationToken(user.id, token);
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, token);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }
    
    return res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res.status(500).json({ message: "Failed to resend verification email" });
  }
}

// Get email verification status
export async function getEmailVerificationStatus(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ 
      isVerified: user.isEmailVerified || false,
      email: user.email
    });
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return res.status(500).json({ message: "Failed to get email verification status" });
  }
}

export function registerEmailVerificationRoutes(app: any) {
  // Send verification email
  app.post('/api/auth/verify/send', sendVerification);
  
  // Resend verification email
  app.post('/api/auth/resend-verification', resendVerification);
  
  // Verify email with token
  app.get('/api/auth/verify', verifyEmail);
  
  // Request password reset
  app.post('/api/auth/password-reset/request', requestPasswordReset);
  
  // Check if email needs verification
  app.get('/api/auth/verify/check', checkEmailVerification);
  
  // Get email verification status
  app.get('/api/auth/email-verification-status', getEmailVerificationStatus);
}