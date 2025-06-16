import { MailService } from '@sendgrid/mail';
import Stripe from "stripe";

// Initialize services with existing API keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY!);

// Stripe payment processing
export async function createStripePaymentIntent(amount: number, currency: string = 'usd') {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw new Error('Failed to create payment intent');
  }
}

export async function createSubscription(customerEmail: string, priceAmount: number, planName: string) {
  try {
    // Create or retrieve customer
    const customer = await stripe.customers.create({
      email: customerEmail,
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: planName,
          },
          unit_amount: Math.round(priceAmount * 100),
          recurring: {
            interval: 'month',
          },
        },
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Stripe subscription creation error:', error);
    throw new Error('Failed to create subscription');
  }
}

// Email notifications using SendGrid
export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    await mailService.send({
      to: email,
      from: 'noreply@m4t.com',
      templateId: 'd-your-template-id', // Replace with actual template ID
      dynamicTemplateData: {
        firstName: firstName,
        loginUrl: 'https://your-domain.com/login',
        supportEmail: 'support@m4t.com'
      }
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendCourseCompletionEmail(email: string, courseName: string, certificateUrl: string) {
  try {
    await mailService.send({
      to: email,
      from: 'noreply@m4t.com',
      subject: `Congratulations! You've completed ${courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Course Completion Certificate</h2>
          <p>Congratulations on completing <strong>${courseName}</strong>!</p>
          <p>Your certificate is ready for download:</p>
          <a href="${certificateUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Certificate</a>
          <p>Continue your learning journey with our other courses.</p>
          <p>Best regards,<br>M4T Learning Platform Team</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Course completion email error:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetUrl = `https://your-domain.com/reset-password?token=${resetToken}`;
    
    await mailService.send({
      to: email,
      from: 'noreply@m4t.com',
      subject: 'Reset Your M4T Learning Platform Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You requested a password reset for your M4T Learning Platform account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <p>Best regards,<br>M4T Learning Platform Team</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Password reset email error:', error);
    return false;
  }
}

// AI-powered learning features using OpenAI
export async function generatePersonalizedLearningPath(userProgress: any, preferences: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert learning advisor. Create personalized learning paths based on user progress and preferences. Respond with JSON format containing recommended courses, topics, and learning strategies."
        },
        {
          role: "user",
          content: `User Progress: ${JSON.stringify(userProgress)}\nPreferences: ${JSON.stringify(preferences)}\n\nCreate a personalized learning path with course recommendations.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    console.error('OpenAI learning path generation error:', error);
    throw new Error('Failed to generate learning path');
  }
}

export async function generateQuizQuestions(courseContent: string, difficulty: 'beginner' | 'intermediate' | 'advanced') {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an educational content expert. Generate high-quality quiz questions based on course material. Return JSON with questions, multiple choice options, and correct answers."
        },
        {
          role: "user",
          content: `Course Content: ${courseContent}\nDifficulty: ${difficulty}\n\nGenerate 5 multiple choice questions to test understanding.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    console.error('OpenAI quiz generation error:', error);
    throw new Error('Failed to generate quiz questions');
  }
}

export async function provideLearningRecommendations(userActivity: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a learning analytics expert. Analyze user activity and provide actionable learning recommendations. Respond in JSON format with specific suggestions for improvement."
        },
        {
          role: "user",
          content: `User Activity Data: ${JSON.stringify(userActivity)}\n\nProvide personalized learning recommendations to improve engagement and knowledge retention.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    console.error('OpenAI recommendations error:', error);
    throw new Error('Failed to generate recommendations');
  }
}

// Service health checks
export async function checkServicesHealth() {
  const results = {
    stripe: false,
    sendgrid: false,
    openai: false,
    timestamp: new Date().toISOString()
  };

  // Test Stripe
  try {
    await stripe.products.list({ limit: 1 });
    results.stripe = true;
  } catch (error) {
    console.error('Stripe health check failed:', error);
  }

  // Test SendGrid (basic API check)
  try {
    // SendGrid doesn't have a simple health check, so we'll assume it's working if the API key is set
    results.sendgrid = !!process.env.SENDGRID_API_KEY;
  } catch (error) {
    console.error('SendGrid health check failed:', error);
  }

  // Test OpenAI
  try {
    await openai.models.list();
    results.openai = true;
  } catch (error) {
    console.error('OpenAI health check failed:', error);
  }

  return results;
}

export {
  stripe,
  mailService,
  openai
};