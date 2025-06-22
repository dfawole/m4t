import Stripe from 'stripe';
import { storage } from './storage';
import { Request, Response } from 'express';

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe with the API key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-04-30.basil', // Use current stable API version
});

// Create a payment intent for one-time payments
export async function createPaymentIntent(req: Request, res: Response) {
	try {
		const { amount, currency = 'usd' } = req.body;

		if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
			return res.status(400).json({
				error: 'Invalid amount. Amount must be a positive number.',
			});
		}

		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(parseFloat(amount) * 100), // Convert to cents
			currency,
			automatic_payment_methods: {
				enabled: true,
			},
		});

		res.json({ clientSecret: paymentIntent.client_secret });
	} catch (error: any) {
		console.error('Error creating payment intent:', error);
		res.status(500).json({
			error: 'Error creating payment intent',
			message: error.message,
		});
	}
}

// Create or get existing subscription for a user
export async function getOrCreateUserSubscription(req: Request, res: Response) {
	try {
		if (!req.user || !req.user.claims || !req.user.claims.sub) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const userId = req.user.claims.sub;
		const user = await storage.getUser(userId);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// If user already has a subscription, retrieve it
		if (user.stripeSubscriptionId) {
			const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

			return res.json({
				subscriptionId: subscription.id,
				clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
			});
		}

		// Check if required data exists
		const { planId } = req.body;
		if (!planId) {
			return res.status(400).json({ error: 'Plan ID is required' });
		}

		const plan = await storage.getSubscriptionPlan(planId);
		if (!plan) {
			return res.status(404).json({ error: 'Subscription plan not found' });
		}

		if (!user.email) {
			return res.status(400).json({ error: 'User email is required for subscription' });
		}

		// Create a Stripe customer if it doesn't exist
		let customerId = user.stripeCustomerId;
		if (!customerId) {
			const customer = await stripe.customers.create({
				email: user.email,
				name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
			});
			customerId = customer.id;
		}

		// Ensure plan has a Stripe price ID, or create one if missing
		let priceId = plan.stripePriceId;
		if (!priceId) {
			// Create product in Stripe if it doesn't exist
			let productId = plan.stripeProductId;
			if (!productId) {
				const product = await stripe.products.create({
					name: plan.name,
					description: plan.description,
				});
				productId = product.id;

				// Update the plan with product ID
				await storage.updateSubscriptionPlanStripeInfo(plan.id, {
					productId: product.id,
					priceId: '', // Will be updated below
				});
			}

			// Create price for the product
			const price = await stripe.prices.create({
				product: productId,
				unit_amount: Math.round(parseFloat(plan.price.toString()) * 100),
				currency: 'usd',
				recurring: {
					interval: plan.period === 'MONTHLY' ? 'month' : 'year',
					interval_count: plan.period === 'MONTHLY' ? 1 : 1, // For yearly plans, use 1 as the interval_count
				},
			});

			priceId = price.id;

			// Update the plan with price ID
			await storage.updateSubscriptionPlanStripeInfo(plan.id, {
				productId,
				priceId: price.id,
			});
		}

		// Create the subscription
		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [
				{
					price: priceId,
				},
			],
			payment_behavior: 'default_incomplete',
			payment_settings: { save_default_payment_method: 'on_subscription' },
			expand: ['latest_invoice.payment_intent'],
		});

		// Update user with Stripe customer and subscription IDs
		await storage.updateUserStripeInfo(userId, {
			customerId,
			subscriptionId: subscription.id,
		});

		// Return client secret for the payment intent
		return res.json({
			subscriptionId: subscription.id,
			clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
		});
	} catch (error: any) {
		console.error('Error creating subscription:', error);
		res.status(500).json({
			error: 'Error creating subscription',
			message: error.message,
		});
	}
}

// Create or get existing subscription for a company
export async function getOrCreateCompanySubscription(req: Request, res: Response) {
	try {
		if (!req.user || !req.user.claims || !req.user.claims.sub) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const userId = req.user.claims.sub;
		const user = await storage.getUser(userId);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		if (!user.companyId) {
			return res.status(403).json({ error: 'User is not associated with a company' });
		}

		const company = await storage.getCompany(user.companyId);
		if (!company) {
			return res.status(404).json({ error: 'Company not found' });
		}

		// If company already has a subscription, retrieve it
		if (company.stripeSubscriptionId) {
			const subscription = await stripe.subscriptions.retrieve(company.stripeSubscriptionId);

			return res.json({
				subscriptionId: subscription.id,
				clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
			});
		}

		// Check if required data exists
		const { planId, userLimit } = req.body;
		if (!planId || !userLimit) {
			return res.status(400).json({ error: 'Plan ID and user limit are required' });
		}

		const plan = await storage.getSubscriptionPlan(planId);
		if (!plan) {
			return res.status(404).json({ error: 'Subscription plan not found' });
		}

		// Create a Stripe customer if it doesn't exist
		let customerId = company.stripeCustomerId;
		if (!customerId) {
			const customer = await stripe.customers.create({
				email: company.email,
				name: company.name,
			});
			customerId = customer.id;
		}

		// Ensure plan has a Stripe price ID, or create one if missing
		let priceId = plan.stripePriceId;
		if (!priceId) {
			// Create product in Stripe if it doesn't exist
			let productId = plan.stripeProductId;
			if (!productId) {
				const product = await stripe.products.create({
					name: `${plan.name} (Company)`,
					description: plan.description,
				});
				productId = product.id;

				// We don't update the original plan here since this is a company-specific variant
			}

			// Create a custom price for the company with per-user pricing
			const price = await stripe.prices.create({
				product: productId,
				unit_amount: Math.round(parseFloat(plan.price.toString()) * 100),
				currency: 'usd',
				recurring: {
					interval: plan.period === 'MONTHLY' ? 'month' : 'year',
					interval_count: plan.period === 'MONTHLY' ? 1 : 1, // For yearly plans, use 1 as the interval_count
				},
			});

			priceId = price.id;
		}

		// Create the subscription
		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [
				{
					price: priceId,
					quantity: userLimit,
				},
			],
			payment_behavior: 'default_incomplete',
			payment_settings: { save_default_payment_method: 'on_subscription' },
			expand: ['latest_invoice.payment_intent'],
		});

		// Update company with Stripe customer and subscription IDs
		await storage.updateCompanyStripeInfo(company.id, {
			customerId,
			subscriptionId: subscription.id,
		});

		// Create company subscription record in our database
		const startDate = new Date();
		const endDate = new Date();
		// Set end date based on subscription period
		if (plan.period === 'MONTHLY') {
			endDate.setMonth(endDate.getMonth() + 1);
		} else if (plan.period === 'YEARLY') {
			endDate.setFullYear(endDate.getFullYear() + 1);
		}

		await storage.createCompanySubscription({
			companyId: company.id,
			planId: plan.id,
			startDate,
			endDate,
			userLimit,
			isActive: true,
			stripeSubscriptionId: subscription.id,
		});

		// Return client secret for the payment intent
		return res.json({
			subscriptionId: subscription.id,
			clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
		});
	} catch (error: any) {
		console.error('Error creating company subscription:', error);
		res.status(500).json({
			error: 'Error creating company subscription',
			message: error.message,
		});
	}
}

// Handle Stripe webhook events
export async function handleStripeWebhook(req: Request, res: Response) {
	const sig = req.headers['stripe-signature'];

	if (!process.env.STRIPE_WEBHOOK_SECRET || !sig) {
		return res.status(400).json({ error: 'Webhook signature missing' });
	}

	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
	} catch (err: any) {
		console.error(`Webhook Error: ${err.message}`);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object;
			console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
			// Update your database with payment success info
			break;

		case 'payment_intent.payment_failed':
			const failedPayment = event.data.object;
			console.log(`Payment failed: ${failedPayment.last_payment_error?.message}`);
			break;

		case 'invoice.payment_succeeded':
			const invoice = event.data.object;
			const subscriptionId = invoice.subscription;

			// Update subscription status in your database
			if (subscriptionId) {
				// Check if this is a user or company subscription
				const userSub = await storage.getUserSubscriptionByStripeId(subscriptionId);
				if (userSub) {
					// Update user subscription status
					await storage.updateUserSubscriptionStatus(userSub.id, true);
				} else {
					// Check if it's a company subscription
					const companySub = await storage.getCompanySubscriptionByStripeId(subscriptionId);
					if (companySub) {
						// Update company subscription status
						await storage.updateCompanySubscriptionStatus(companySub.id, true);
					}
				}
			}
			break;

		case 'invoice.payment_failed':
			const failedInvoice = event.data.object;
			const failedSubId = failedInvoice.subscription;

			// Update subscription status in your database
			if (failedSubId) {
				// Similar logic to check user vs company subscription
				// And update status accordingly
			}
			break;

		case 'customer.subscription.updated':
		case 'customer.subscription.deleted':
			const subscription = event.data.object;
			// Update subscription status in your database
			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	// Return a 200 response to acknowledge receipt of the event
	res.json({ received: true });
}
