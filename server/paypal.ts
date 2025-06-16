import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { Request, Response } from "express";
import { storage } from "./storage";

/* PayPal Controllers Setup */

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID) {
  throw new Error("Missing PAYPAL_CLIENT_ID");
}
if (!PAYPAL_CLIENT_SECRET) {
  throw new Error("Missing PAYPAL_CLIENT_SECRET");
}

// Initialize PayPal client
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

const ordersController = new OrdersController(client);
const oAuthAuthorizationController = new OAuthAuthorizationController(client);

/* Token generation helpers */

export async function getClientToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

/* Process transactions */

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    const { amount, currency = "USD", intent = "CAPTURE" } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({
          error: "Invalid amount. Amount must be a positive number.",
        });
    }

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create PayPal order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    // Process the order data after successful capture
    if (httpStatusCode === 201) {
      try {
        // If user is authenticated, associate the payment with their account
        if (req.user && req.user.claims && req.user.claims.sub) {
          const userId = req.user.claims.sub;
          const user = await storage.getUser(userId);
          
          // Extract payment data from PayPal response
          const paymentData = {
            userId,
            paymentId: jsonResponse.id,
            amount: jsonResponse.purchase_units[0].payments.captures[0].amount.value,
            currency: jsonResponse.purchase_units[0].payments.captures[0].amount.currency_code,
            status: jsonResponse.status,
            paymentMethod: 'paypal',
            metadata: JSON.stringify(jsonResponse)
          };
          
          // Store payment in database if needed
          // await storage.createPayment(paymentData);
          
          // If this is a subscription payment, handle accordingly
          const subscriptionId = req.query.subscriptionId;
          if (subscriptionId && typeof subscriptionId === 'string') {
            // Update subscription status in database
            // await storage.updateSubscriptionPaymentStatus(subscriptionId, 'paid');
          }
        }
      } catch (err) {
        console.error("Error processing payment data:", err);
        // Continue anyway - we want to return success to PayPal
      }
    }

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture PayPal order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  try {
    const clientToken = await getClientToken();
    res.json({
      clientToken,
    });
  } catch (error) {
    console.error("Failed to get PayPal client token:", error);
    res.status(500).json({ error: "Failed to initialize PayPal." });
  }
}

// Create a subscription with PayPal
export async function createPaypalSubscription(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.claims || !req.user.claims.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const { planId, returnUrl, cancelUrl } = req.body;
    
    if (!planId || !returnUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: "Missing required parameters: planId, returnUrl, or cancelUrl" 
      });
    }
    
    const plan = await storage.getSubscriptionPlan(planId);
    if (!plan) {
      return res.status(404).json({ error: "Subscription plan not found" });
    }
    
    // Create a PayPal subscription - this is a simplified example
    // In production, you would need to create a proper PayPal billing plan first
    // This is more complex than this example shows
    
    const amount = parseFloat(plan.price.toString());
    const currency = "USD";
    
    // Instead of a real subscription, we'll create a one-time payment order for demo
    const collect = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount.toString(),
            },
            description: `Subscription to ${plan.name} plan`,
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    
    // Store the order reference for later processing
    // In a real app, you would create a pending subscription entry
    
    res.status(httpResponse.statusCode).json({
      ...jsonResponse,
      subscriptionPlaceholder: true, // Indicator that this is not a real subscription
    });
  } catch (error) {
    console.error("Failed to create PayPal subscription:", error);
    res.status(500).json({ error: "Failed to create subscription." });
  }
}