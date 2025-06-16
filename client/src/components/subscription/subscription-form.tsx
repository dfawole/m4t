import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { PaymentMethods } from './payment-methods';
import PlanCard from './plan-card';

interface SubscriptionFormProps {
  planId?: number;
  type?: 'user' | 'company';
  companyId?: number;
  onSuccess?: () => void;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  isActive: boolean;
  stripePriceId?: string;
  stripeProductId?: string;
}

export default function SubscriptionForm({ planId, type = 'user', companyId, onSuccess }: SubscriptionFormProps) {
  const [step, setStep] = useState(planId ? 'payment' : 'select-plan');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(planId || null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch available subscription plans
  const { data: plans, isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/subscription-plans'],
  });
  
  // Get the selected plan
  const selectedPlan = plans?.find(plan => plan.id === selectedPlanId);
  
  // Handle plan selection
  const handleSelectPlan = (planId: number) => {
    setSelectedPlanId(planId);
    setStep('payment');
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    // Invalidate queries to refresh subscription data
    if (type === 'user') {
      queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
    } else {
      queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/subscription`] });
    }
    
    toast({
      title: 'Subscription Successful',
      description: 'Your subscription has been activated.',
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  // Handle cancel/back button
  const handleCancel = () => {
    setStep('select-plan');
  };
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="flex flex-col h-full">
            <CardHeader>
              <div className="h-7 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="h-9 w-24 bg-neutral-200 rounded animate-pulse mb-6"></div>
              <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse mb-3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (step === 'select-plan') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <PlanCard
            key={plan.id}
            title={plan.name}
            description={plan.description}
            price={parseFloat(plan.price)}
            period={plan.period}
            features={plan.features}
            isPopular={plan.name.toLowerCase().includes('pro')}
            onClick={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>
    );
  }
  
  if (step === 'payment' && selectedPlan) {
    return (
      <PaymentMethods
        planId={selectedPlan.id}
        planName={selectedPlan.name}
        planPrice={parseFloat(selectedPlan.price)}
        onSuccess={handlePaymentSuccess}
        onCancel={handleCancel}
      />
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-neutral-medium mb-6">
          No subscription plans are available at this time. Please check back later.
        </p>
        {step === 'payment' && (
          <Button variant="outline" onClick={() => setStep('select-plan')}>
            Back
          </Button>
        )}
      </CardContent>
    </Card>
  );
}