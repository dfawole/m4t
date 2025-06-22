import { Request, Response } from 'express';
import { storage } from './storage';
import { insertCompanyOnboardingApplicationSchema } from '@shared/schema';
import { sendEmail } from './emailService';
import { z } from 'zod';

// Enhanced schema for API validation with nested objects
const companyOnboardingApiSchema = z.object({
	companyName: z.string().min(2, 'Company name must be at least 2 characters'),
	industry: z.string().min(1, 'Please select an industry'),
	companySize: z.string().min(1, 'Please select company size'),
	website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
	description: z.string().min(10, 'Company description must be at least 10 characters'),
	contactPerson: z.object({
		firstName: z.string().min(2, 'First name is required'),
		lastName: z.string().min(2, 'Last name is required'),
		email: z.string().email('Please enter a valid email address'),
		phone: z.string().min(10, 'Please enter a valid phone number'),
		jobTitle: z.string().min(2, 'Job title is required'),
	}),
	address: z.object({
		street: z.string().min(5, 'Street address is required'),
		city: z.string().min(2, 'City is required'),
		state: z.string().min(2, 'State/Province is required'),
		zipCode: z.string().min(3, 'ZIP/Postal code is required'),
		country: z.string().min(2, 'Country is required'),
	}),
	licensesNeeded: z.number().min(5, 'Minimum 5 licenses required for enterprise plans'),
	preferredPlan: z.string().min(1, 'Please select a plan'),
	specialRequirements: z.string().optional(),
	termsAccepted: z
		.boolean()
		.refine((val) => val === true, 'You must accept the terms and conditions'),
});

export async function submitCompanyOnboardingApplication(req: Request, res: Response) {
	try {
		// Validate the request body
		const validationResult = companyOnboardingApiSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: 'Validation failed',
				details: validationResult.error.issues,
			});
		}

		const data = validationResult.data;

		// Transform nested object data to flat structure for database
		const applicationData = {
			companyName: data.companyName,
			industry: data.industry,
			companySize: data.companySize,
			website: data.website || null,
			description: data.description,

			// Contact person fields
			contactFirstName: data.contactPerson.firstName,
			contactLastName: data.contactPerson.lastName,
			contactEmail: data.contactPerson.email,
			contactPhone: data.contactPerson.phone,
			contactJobTitle: data.contactPerson.jobTitle,

			// Address fields
			addressStreet: data.address.street,
			addressCity: data.address.city,
			addressState: data.address.state,
			addressZipCode: data.address.zipCode,
			addressCountry: data.address.country,

			// Requirements
			licensesNeeded: data.licensesNeeded,
			preferredPlan: data.preferredPlan,
			specialRequirements: data.specialRequirements || null,

			// Terms acceptance
			termsAccepted: data.termsAccepted,
		};

		// Create the application in the database
		const application = await storage.createCompanyOnboardingApplication(applicationData);

		// Send confirmation email to the applicant
		await sendApplicationConfirmationEmail(
			data.contactPerson.email,
			`${data.contactPerson.firstName} ${data.contactPerson.lastName}`,
			data.companyName,
			application.id
		);

		// Send notification email to internal team
		await sendInternalNotificationEmail(application);

		res.status(201).json({
			success: true,
			message: 'Application submitted successfully',
			applicationId: application.id,
			estimatedReviewTime: '2 business days',
		});
	} catch (error) {
		console.error('Error submitting company onboarding application:', error);
		res.status(500).json({
			error: 'Failed to submit application',
			message: 'Please try again later or contact support',
		});
	}
}

export async function getCompanyOnboardingApplications(req: Request, res: Response) {
	try {
		// Only internal admins can view all applications
		const user = (req as any).user;
		if (!user || user.role !== 'internal_admin') {
			return res.status(403).json({ error: 'Access denied' });
		}

		const applications = await storage.getAllCompanyOnboardingApplications();

		res.json({
			applications,
			total: applications.length,
		});
	} catch (error) {
		console.error('Error fetching company onboarding applications:', error);
		res.status(500).json({
			error: 'Failed to fetch applications',
		});
	}
}

export async function updateCompanyOnboardingApplicationStatus(req: Request, res: Response) {
	try {
		// Only internal admins can update application status
		const user = (req as any).user;
		if (!user || user.role !== 'internal_admin') {
			return res.status(403).json({ error: 'Access denied' });
		}

		const { applicationId } = req.params;
		const { status, reviewNotes } = req.body;

		const validStatuses = ['pending', 'approved', 'rejected', 'in_review'];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({ error: 'Invalid status' });
		}

		const updatedApplication = await storage.updateCompanyOnboardingApplicationStatus(
			parseInt(applicationId),
			status,
			user.id,
			reviewNotes
		);

		// Send status update email to applicant
		await sendStatusUpdateEmail(updatedApplication, status);

		res.json({
			success: true,
			application: updatedApplication,
		});
	} catch (error) {
		console.error('Error updating application status:', error);
		res.status(500).json({
			error: 'Failed to update application status',
		});
	}
}

// Email notification functions
export async function sendApplicationConfirmationEmail(
	email: string,
	contactName: string,
	companyName: string,
	applicationId: number
): Promise<boolean> {
	const subject = `Enterprise Application Received - ${companyName}`;
	const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Received</h2>
        <p>Dear ${contactName},</p>
        <p>Thank you for submitting your enterprise onboarding application for <strong>${companyName}</strong>.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">Application Details:</p>
          <ul style="margin: 10px 0;">
            <li><strong>Application ID:</strong> #${applicationId}</li>
            <li><strong>Company:</strong> ${companyName}</li>
            <li><strong>Status:</strong> Under Review</li>
          </ul>
        </div>
        
        <h3 style="color: #374151;">What happens next?</h3>
        <ol style="color: #6b7280;">
          <li>Our enterprise team will review your application within 2 business days</li>
          <li>We'll contact you to discuss your specific requirements and custom pricing</li>
          <li>Schedule a personalized demo and technical consultation</li>
          <li>Finalize your enterprise agreement and begin implementation</li>
        </ol>
        
        <p>If you have any immediate questions, please don't hesitate to contact our enterprise team at enterprise@m4t.com</p>
        
        <p>Best regards,<br>The M4T Enterprise Team</p>
      </div>
    `;
	return sendEmail(email, subject, html);
}

async function sendInternalNotificationEmail(application: any): Promise<boolean> {
	const to = 'enterprise@m4t.com'; // Internal enterprise team email
	const subject = `New Enterprise Application - ${application.companyName}`;
	const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Enterprise Application</h2>
        <p>A new enterprise onboarding application has been submitted.</p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <h3 style="margin-top: 0;">Company Information</h3>
          <p><strong>Company:</strong> ${application.companyName}</p>
          <p><strong>Industry:</strong> ${application.industry}</p>
          <p><strong>Size:</strong> ${application.companySize}</p>
          <p><strong>Licenses Needed:</strong> ${application.licensesNeeded}</p>
          <p><strong>Preferred Plan:</strong> ${application.preferredPlan}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
          <h3 style="margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${application.contactFirstName} ${application.contactLastName}</p>
          <p><strong>Title:</strong> ${application.contactJobTitle}</p>
          <p><strong>Email:</strong> ${application.contactEmail}</p>
          <p><strong>Phone:</strong> ${application.contactPhone}</p>
        </div>
        
        <p><strong>Application ID:</strong> #${application.id}</p>
        <p>Please review and follow up within 2 business days.</p>
      </div>
    `;
	return sendEmail(to, subject, html);
}

async function sendStatusUpdateEmail(application: any, status: string): Promise<boolean> {
	const statusMessages = {
		approved: {
			subject: 'Application Approved',
			message: 'Congratulations! Your enterprise application has been approved.',
			color: '#059669',
		},
		rejected: {
			subject: 'Application Update',
			message: "Thank you for your interest. After review, we're unable to proceed at this time.",
			color: '#dc2626',
		},
		in_review: {
			subject: 'Application Under Review',
			message: 'Your application is currently under detailed review by our enterprise team.',
			color: '#d97706',
		},
	};

	const statusInfo = statusMessages[status as keyof typeof statusMessages];
	if (!statusInfo) return false;

	const to = application.contactEmail;
	const subject = `${statusInfo.subject} - ${application.companyName}`;
	const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusInfo.color};">${statusInfo.subject}</h2>
        <p>Dear ${application.contactFirstName} ${application.contactLastName},</p>
        <p>${statusInfo.message}</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <p style="margin: 0;"><strong>Application ID:</strong> #${application.id}</p>
          <p style="margin: 5px 0 0 0;"><strong>Company:</strong> ${application.companyName}</p>
        </div>
        
        ${
					application.reviewNotes
						? `
        <div style="margin: 20px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">Review Notes:</p>
          <p style="margin: 10px 0 0 0;">${application.reviewNotes}</p>
        </div>
        `
						: ''
				}
        
        <p>If you have any questions, please contact our enterprise team at enterprise@m4t.com</p>
        
        <p>Best regards,<br>The M4T Enterprise Team</p>
      </div>
    `;

	return sendEmail(to, subject, html);
}

export function registerCompanyOnboardingRoutes(app: any) {
	app.post('/api/company-onboarding', submitCompanyOnboardingApplication);
	app.get('/api/company-onboarding/applications', getCompanyOnboardingApplications);
	app.patch(
		'/api/company-onboarding/applications/:applicationId/status',
		updateCompanyOnboardingApplicationStatus
	);
}
