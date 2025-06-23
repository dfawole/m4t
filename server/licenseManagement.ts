import { Request, Response } from 'express';
import { storage } from './storage';
import { LicenseStatus } from '@shared/schema';
import { customAlphabet } from 'nanoid';
import { UserRole } from '@shared/schema';
import {
	sendLicenseAssignmentEmail,
	sendLicenseRevokedEmail,
	sendLicenseSuspendedEmail,
} from './emailService';

// Create a license key generator
const generateLicenseKey = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16);

export type InsertLicenseActivity = {
	licenseId: string;
	userId: string;
	activity: string;
	ipAddress?: string;
	userAgent?: string;
	timestamp: Date;
};

// Middleware to check if user is a company admin
export function isCompanyAdmin(req: Request, res: Response, next: Function) {
	if (
		req.user &&
		(req.user.role === UserRole.COMPANY_ADMIN || req.user.role === UserRole.INTERNAL_ADMIN)
	) {
		return next();
	}
	return res.status(403).json({ message: 'Forbidden. Company admin access required.' });
}

// Log license activity
async function logLicenseActivity(
	licenseId: string,
	userId: string,
	activity: string,
	req: Request
) {
	try {
		await storage.createLicenseActivity({
			licenseId,
			userId,
			activity,
			ipAddress: req.ip || req.socket.remoteAddress || '',
			userAgent: req.get('User-Agent') || '',
			timestamp: new Date(),
		});
	} catch (error) {
		console.error('Failed to log license activity:', error);
	}
}

// Create licenses for a company subscription
export async function createLicensesForSubscription(req: Request, res: Response) {
	try {
		const { companyId, subscriptionId, quantity } = req.body;

		if (!companyId || !subscriptionId || !quantity || isNaN(quantity) || quantity <= 0) {
			return res.status(400).json({
				message: 'Invalid parameters. Required: companyId, subscriptionId, and quantity.',
			});
		}

		// Get company and subscription
		const company = await storage.getCompany(companyId);
		const subscription = await storage.getCompanySubscription(subscriptionId);

		if (!company) {
			return res.status(404).json({ message: 'Company not found.' });
		}

		if (!subscription) {
			return res.status(404).json({ message: 'Subscription not found.' });
		}

		// Create licenses
		const licenses = [];
		for (let i = 0; i < quantity; i++) {
			const licenseKey = generateLicenseKey();
			const license = await storage.createLicense({
				companyId,
				subscriptionId,
				licenseKey,
			});
			licenses.push(license);
		}

		return res.status(201).json({ licenses });
	} catch (error) {
		console.error('Error creating licenses:', error);
		return res.status(500).json({ message: 'Failed to create licenses' });
	}
}

// Get all licenses for a company
export async function getCompanyLicenses(req: Request, res: Response) {
	try {
		const companyId = parseInt(req.params.companyId);

		if (isNaN(companyId)) {
			return res.status(400).json({ message: 'Invalid company ID' });
		}

		const company = await storage.getCompany(companyId);
		if (!company) {
			return res.status(404).json({ message: 'Company not found' });
		}

		const licenses = await storage.getCompanyLicenses(companyId);
		return res.json({ licenses });
	} catch (error) {
		console.error('Error getting company licenses:', error);
		return res.status(500).json({ message: 'Failed to get company licenses' });
	}
}

// Get available (unassigned) licenses for a company
export async function getAvailableCompanyLicenses(req: Request, res: Response) {
	try {
		const companyId = parseInt(req.params.companyId);

		if (isNaN(companyId)) {
			return res.status(400).json({ message: 'Invalid company ID' });
		}

		const company = await storage.getCompany(companyId);
		if (!company) {
			return res.status(404).json({ message: 'Company not found' });
		}

		const licenses = await storage.getAvailableCompanyLicenses(companyId);
		return res.json({ licenses });
	} catch (error) {
		console.error('Error getting available company licenses:', error);
		return res.status(500).json({ message: 'Failed to get available company licenses' });
	}
}

// Get assigned licenses for a company
export async function getAssignedCompanyLicenses(req: Request, res: Response) {
	try {
		const companyId = parseInt(req.params.companyId);

		if (isNaN(companyId)) {
			return res.status(400).json({ message: 'Invalid company ID' });
		}

		const company = await storage.getCompany(companyId);
		if (!company) {
			return res.status(404).json({ message: 'Company not found' });
		}

		const licenses = await storage.getAssignedCompanyLicenses(companyId);
		return res.json({ licenses });
	} catch (error) {
		console.error('Error getting assigned company licenses:', error);
		return res.status(500).json({ message: 'Failed to get assigned company licenses' });
	}
}

// Assign a license to a user
export async function assignLicenseToUser(req: Request, res: Response) {
	try {
		const { licenseId, userId } = req.body;

		if (!licenseId || !userId) {
			return res.status(400).json({ message: 'License ID and user ID are required' });
		}

		// Get the license and user
		const license = await storage.getLicense(licenseId);
		const user = await storage.getUser(userId);

		if (!license) {
			return res.status(404).json({ message: 'License not found' });
		}

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if license is available to assign
		if (license.status !== LicenseStatus.ACTIVE || license.userId) {
			return res.status(400).json({ message: 'License is not available for assignment' });
		}

		// Assign the license
		const updatedLicense = await storage.assignLicenseToUser(licenseId, userId);

		// Update user's company and role
		await storage.updateUserCompany(userId, license.companyId);

		// If user doesn't have a role or is a student, upgrade to company user
		if (!user.role || user.role === UserRole.STUDENT) {
			await storage.updateUserRole(userId, UserRole.STUDENT);
		}

		return res.json({ license: updatedLicense });
	} catch (error) {
		console.error('Error assigning license to user:', error);
		return res.status(500).json({ message: 'Failed to assign license to user' });
	}
}

// Revoke a license from a user
export async function revokeLicenseFromUser(req: Request, res: Response) {
	try {
		const licenseId = parseInt(req.params.licenseId);

		if (isNaN(licenseId)) {
			return res.status(400).json({ message: 'Invalid license ID' });
		}

		// Get the license
		const license = await storage.getLicense(licenseId);

		if (!license) {
			return res.status(404).json({ message: 'License not found' });
		}

		// Check if license is assigned
		if (license.status !== LicenseStatus.ASSIGNED || !license.userId) {
			return res.status(400).json({ message: 'License is not assigned to any user' });
		}

		// Get the user before revoking
		const userId = license.userId;

		// Revoke the license
		const updatedLicense = await storage.revokeLicenseFromUser(licenseId);

		return res.json({ license: updatedLicense });
	} catch (error) {
		console.error('Error revoking license from user:', error);
		return res.status(500).json({ message: 'Failed to revoke license from user' });
	}
}

// Register license management routes
export function registerLicenseManagementRoutes(app: any) {
	// Create licenses
	app.post('/api/licenses', isCompanyAdmin, createLicensesForSubscription);

	// Get company licenses
	app.get('/api/companies/:companyId/licenses', isCompanyAdmin, getCompanyLicenses);
	app.get(
		'/api/companies/:companyId/licenses/available',
		isCompanyAdmin,
		getAvailableCompanyLicenses
	);
	app.get(
		'/api/companies/:companyId/licenses/assigned',
		isCompanyAdmin,
		getAssignedCompanyLicenses
	);

	// License assignment
	app.post('/api/licenses/assign', isCompanyAdmin, assignLicenseToUser);
	app.post('/api/licenses/:licenseId/revoke', isCompanyAdmin, revokeLicenseFromUser);
}
