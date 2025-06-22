import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionForm from '@/components/subscription/subscription-form';
import { UserRole } from '@shared/schema';

export default function SubscriptionExample() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [showSubscribe, setShowSubscribe] = useState(false);

  // Fetch user's active subscription
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['/api/user/subscription'],
    enabled: isAuthenticated,
  });

  // Format date to display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Example Payment Integration</h1>
          <p className="text-neutral-medium">
            This example shows how to use both Stripe and PayPal for subscription payments.
          </p>
        </div>

        {/* Subscription Status Card */}
        {isLoadingSubscription ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ) : subscription ? (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Subscription</CardTitle>
                <Badge className="bg-success bg-opacity-10 text-success">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-xl font-bold">{subscription.plan?.name}</h3>
                <p className="text-neutral-medium">
                  ${subscription.plan?.price} / {subscription.plan?.period.replace('_', ' ')}
                </p>
              </div>
              <div className="mb-4">
                <div className="text-sm text-neutral-medium mb-1">Subscription Details</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-neutral-medium">Start Date:</span>
                    <div>{formatDate(subscription.startDate)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-medium">End Date:</span>
                    <div>{formatDate(subscription.endDate)}</div>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowSubscribe(true)}
              >
                Change Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                You don't have an active subscription. Subscribe to get full access to all courses.
              </p>
              <Button onClick={() => setShowSubscribe(true)}>Subscribe Now</Button>
            </CardContent>
          </Card>
        )}

        {/* Subscription Form */}
        {showSubscribe && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Choose a Plan</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowSubscribe(false)}
              >
                Cancel
              </Button>
            </div>
            <SubscriptionForm 
              type="user" 
              onSuccess={() => setShowSubscribe(false)} 
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}