import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CreditCard, Check } from 'lucide-react';
import { useLocation } from 'wouter';

interface SubscriptionCardProps {
  subscription?: {
    plan?: {
      name: string;
      price: string;
      period: string;
      features?: string[];
    };
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  };
  loading?: boolean;
}

export default function SubscriptionCard({ subscription, loading = false }: SubscriptionCardProps) {
  const [_, navigate] = useLocation();
  
  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Helper to calculate days remaining in subscription
  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };
  
  // Calculate percentage of subscription period completed
  const getProgressPercentage = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Calculate percentage and ensure it's between 0 and 100
    return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  };

  // Helper to map period to display text
  const getPeriodDisplay = (period?: string) => {
    if (!period) return '';
    
    switch(period) {
      case 'six_months':
        return '6 months';
      case 'twelve_months':
        return '12 months';
      case 'twenty_four_months':
        return '24 months';
      default:
        return period;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse mb-6"></div>
          <div className="h-6 w-36 bg-neutral-200 rounded animate-pulse mb-4"></div>
          <div className="h-2 w-full bg-neutral-200 rounded animate-pulse mb-6"></div>
          <div className="h-10 w-full bg-neutral-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription || !subscription.plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
          <p className="text-neutral-medium mb-6">
            You don't have an active subscription plan. Subscribe to get full access to all courses.
          </p>
          <Button onClick={() => navigate('/subscriptions')}>View Plans</Button>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = getDaysRemaining(subscription.endDate);
  const progressPercentage = getProgressPercentage(subscription.startDate, subscription.endDate);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle>Subscription</CardTitle>
          {subscription.isActive && (
            <Badge variant="outline" className="bg-success bg-opacity-10 text-success border-success">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-2xl font-bold">{subscription.plan.name}</div>
          <div className="text-neutral-medium">
            ${subscription.plan.price} • {getPeriodDisplay(subscription.plan.period)}
          </div>
        </div>
        
        {subscription.isActive && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-neutral-medium">
                <Clock className="h-4 w-4 mr-1" />
                <span>{daysRemaining} days remaining</span>
              </div>
              <span className="text-sm text-neutral-medium">
                Expires {formatDate(subscription.endDate)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        {subscription.plan.features && subscription.plan.features.length > 0 && (
          <div className="pt-2">
            <h4 className="font-medium mb-2">Plan Features</h4>
            <ul className="space-y-1">
              {subscription.plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-success mt-1" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/subscriptions')}
        >
          Manage Subscription
        </Button>
      </CardFooter>
    </Card>
  );
}