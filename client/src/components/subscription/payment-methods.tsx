import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard } from "lucide-react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe outside of component to avoid recreating it on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentMethodsProps {
  planId: number;
  planName: string;
  planPrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Stripe Payment Form
const StripePaymentForm = ({ planId, onSuccess, onCancel }: {
  planId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/subscription-success',
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment failed",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment successful",
          description: "You have successfully subscribed to the plan",
        });
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      toast({
        title: "Error processing payment",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};

// PayPal Component
const PayPalPayment = ({ planId, planPrice, onSuccess, onCancel }: {
  planId: number;
  planPrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayPalClick = async () => {
    setIsLoading(true);

    try {
      // Use a button click approach for PayPal instead of direct API calls
      toast({
        title: "PayPal Checkout",
        description: "Redirecting to PayPal checkout...",
      });
      
      // Create a subscription with the plan
      const response = await apiRequest('POST', '/api/paypal/subscription', {
        planId,
        amount: planPrice.toString(),
        currency: 'USD'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Payment successful",
          description: "You have successfully subscribed to the plan",
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Payment not completed",
          description: "Your payment was not completed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error processing PayPal payment",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 border rounded-md text-center">
        <p className="mb-4">Click the button below to pay with PayPal</p>
        <div className="flex justify-center">
          <Button
            onClick={handlePayPalClick}
            disabled={isLoading}
            className="bg-[#0070ba] hover:bg-[#003087] text-white font-bold"
            size="lg"
          >
            <CreditCard className="mr-2 h-5 w-5" /> {isLoading ? "Processing..." : "Pay with PayPal"}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Main Payment Methods Component
export const PaymentMethods = ({ planId, planName, planPrice, onSuccess, onCancel }: PaymentMethodsProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchClientSecret = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/create-subscription', { planId });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not initialize payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (paymentMethod === 'stripe') {
      fetchClientSecret();
    }
  }, [paymentMethod]);

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Select a payment method to subscribe to the {planName} plan for ${planPrice}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'paypal')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">
              <CreditCard className="mr-2 h-4 w-4" /> Stripe
            </TabsTrigger>
            <TabsTrigger value="paypal">
              <CreditCard className="mr-2 h-4 w-4" /> PayPal
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stripe" className="mt-6">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm planId={planId} onSuccess={onSuccess} onCancel={onCancel} />
              </Elements>
            ) : (
              <div className="text-center py-4">
                <p>Unable to initialize Stripe. Please try another payment method.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="paypal" className="mt-6">
            <PayPalPayment 
              planId={planId} 
              planPrice={planPrice}
              onSuccess={onSuccess} 
              onCancel={onCancel} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;