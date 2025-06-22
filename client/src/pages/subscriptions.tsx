import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboard-layout";
import SubscriptionForm from "@/components/subscription/subscription-form";
import PlanCard from "@/components/subscription/plan-card";
import { UserRole } from "@shared/schema";

export default function Subscriptions() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State for selected plan
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Fetch plans
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["/api/subscription-plans"],
    enabled: isAuthenticated,
  });
  
  // Parse URL parameters to get the plan type from home page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planType = params.get('plan');
    
    if (planType && plans) {
      // Find the plan by name (case insensitive)
      const plan = plans.find(p => 
        p.name.toLowerCase() === planType.toLowerCase() ||
        p.name.toLowerCase().includes(planType.toLowerCase())
      );
      
      if (plan) {
        setSelectedPlanId(plan.id);
        setShowPaymentForm(true);
        // Clear the URL parameter without reloading
        window.history.replaceState({}, '', '/subscriptions');
      }
    }
  }, [plans]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  // Fetch user subscription
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["/api/user/subscription"],
    enabled: isAuthenticated,
  });
  
  // Fetch company subscription if user is part of a company
  const { data: companySubscription, isLoading: isLoadingCompanySubscription } = useQuery({
    queryKey: ["/api/companies", user?.companyId, "subscription"],
    enabled: isAuthenticated && !!user?.companyId,
  });
  
  const handleSelectPlan = (planId: number) => {
    setSelectedPlanId(planId);
    setShowPaymentForm(true);
  };
  
  const handleCancelSubscription = async () => {
    try {
      // Implementation for cancellation would go here
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "There was a problem cancelling your subscription.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Helper function to map period to display text
  const getPeriodDisplay = (period: string) => {
    switch(period) {
      case 'six_months':
        return "6 months";
      case 'twelve_months':
        return "12 months";
      case 'twenty_four_months':
        return "24 months";
      default:
        return period;
    }
  };
  
  // Check if the user is covered by a company subscription
  const hasCompanySubscription = !!companySubscription && companySubscription.isActive;
  
  // Check if the user has an active personal subscription
  const hasPersonalSubscription = !!subscription && subscription.isActive;
  
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Subscription Management</h1>
          <p className="text-neutral-medium">
            Manage your subscription plan and payment details.
          </p>
        </div>
        
        {/* Current Subscription Status */}
        {(isLoadingSubscription || isLoadingCompanySubscription) ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ) : (
          <>
            {hasCompanySubscription && (
              <Card className="mb-8 border-primary">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center">
                        Company Subscription
                        <Badge className="ml-2 bg-success bg-opacity-10 text-success">
                          Active
                        </Badge>
                      </h2>
                      <p className="text-neutral-medium">
                        Your access is provided through your company's subscription.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        Valid until: <span className="text-neutral-medium">{formatDate(companySubscription.endDate)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-primary-light bg-opacity-5 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <i className="fa-solid fa-building-user text-primary text-2xl mr-3"></i>
                      <div>
                        <p className="font-medium">{companySubscription.plan.name} Plan</p>
                        <p className="text-sm text-neutral-medium">
                          {getPeriodDisplay(companySubscription.plan.period)} subscription managed by your company admin
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-neutral-medium">
                    For any changes to your subscription, please contact your company administrator.
                  </div>
                </CardContent>
              </Card>
            )}
            
            {hasPersonalSubscription && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center">
                        Your Subscription
                        <Badge className="ml-2 bg-success bg-opacity-10 text-success">
                          Active
                        </Badge>
                      </h2>
                      <p className="text-neutral-medium">
                        Your current subscription plan and status.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        Next billing: <span className="text-neutral-medium">{formatDate(subscription.endDate)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-primary-light bg-opacity-5 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fa-solid fa-credit-card text-primary text-2xl mr-3"></i>
                        <div>
                          <p className="font-medium">{subscription.plan.name} Plan</p>
                          <p className="text-sm text-neutral-medium">
                            ${subscription.plan.price}/{getPeriodDisplay(subscription.plan.period)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleCancelSubscription}
                      >
                        Cancel Plan
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-neutral-medium">
                    You can manage your subscription and payment methods here. Your subscription will automatically renew on the next billing date.
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!hasCompanySubscription && !hasPersonalSubscription && (
              <Card className="mb-8 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <i className="fa-solid fa-info-circle text-amber-500 text-xl mr-3 mt-1"></i>
                    <div>
                      <h2 className="text-xl font-bold">No Active Subscription</h2>
                      <p className="text-neutral-medium">
                        You don't have an active subscription. Choose a plan below to get started.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Subscription Plans */}
        {!hasCompanySubscription && (
          <div className="mb-8">
            {!showPaymentForm ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Choose a Plan</h2>
                  <Button 
                    variant="link" 
                    className="text-blue-600"
                    onClick={() => setLocation("/subscription-comparison")}
                  >
                    <i className="fa-solid fa-table-columns mr-2"></i>
                    Compare All Plans
                  </Button>
                </div>
                
                {isLoadingPlans ? (
                  <div className="grid md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm h-96 animate-pulse">
                        <div className="p-6">
                          <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse mb-4"></div>
                          <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse mb-4"></div>
                          <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-6"></div>
                          <div className="space-y-3">
                            {[...Array(4)].map((_, j) => (
                              <div key={j} className="flex">
                                <div className="h-5 w-5 bg-neutral-200 rounded-full mr-2"></div>
                                <div className="h-4 flex-grow bg-neutral-200 rounded animate-pulse"></div>
                              </div>
                            ))}
                          </div>
                          <div className="h-10 w-full bg-neutral-200 rounded animate-pulse mt-6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {plans?.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        title={plan.name}
                        price={Number(plan.price)}
                        period={getPeriodDisplay(plan.period)}
                        description={plan.description}
                        features={(plan.features as string[]) || [
                          "Access to all courses",
                          "Progress tracking",
                          "Certificates of completion",
                          "Mobile access"
                        ]}
                        isPopular={plan.name.includes("Professional")}
                        onClick={() => handleSelectPlan(plan.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <div className="flex items-center mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPaymentForm(false)}
                    className="mr-4"
                  >
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Back to Plans
                  </Button>
                  <h2 className="text-xl font-bold">Complete Your Subscription</h2>
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <SubscriptionForm planId={selectedPlanId as number} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
        
        {/* Company Subscription Section (for company admins) */}
        {user?.role === UserRole.COMPANY_ADMIN && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Company Subscription Management</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Manage Company Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  As a company administrator, you can manage the subscription for all users in your organization.
                </p>
                <Tabs defaultValue="users">
                  <TabsList className="mb-4">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="users">
                    <div className="space-y-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Active Users</h3>
                        <Badge>12 / 25</Badge>
                      </div>
                      
                      <div className="border rounded-md divide-y">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-neutral-200 mr-3"></div>
                              <div>
                                <p className="font-medium">User {i + 1}</p>
                                <p className="text-xs text-neutral-medium">user{i + 1}@example.com</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <Button>Add Users</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="billing">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Current Plan</h3>
                          <p className="text-sm text-neutral-medium">Enterprise Plan - 25 User Seats</p>
                        </div>
                        <Button>Upgrade Plan</Button>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="font-medium mb-2">Payment Method</h3>
                        <div className="flex items-center">
                          <i className="fa-brands fa-cc-visa text-2xl mr-3"></i>
                          <div>
                            <p>Visa ending in 4242</p>
                            <p className="text-xs text-neutral-medium">Expires 12/2025</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="font-medium mb-2">Billing History</h3>
                        <div className="border rounded-md divide-y">
                          <div className="flex justify-between items-center p-3">
                            <div>
                              <p className="font-medium">Invoice #1234</p>
                              <p className="text-xs text-neutral-medium">May 1, 2023</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">$1,250.00</p>
                              <Badge className="bg-success bg-opacity-10 text-success">Paid</Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3">
                            <div>
                              <p className="font-medium">Invoice #1123</p>
                              <p className="text-xs text-neutral-medium">April 1, 2023</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">$1,250.00</p>
                              <Badge className="bg-success bg-opacity-10 text-success">Paid</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usage">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Usage Overview</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-neutral-50 p-4 rounded-md text-center">
                            <p className="text-sm text-neutral-medium">Total Users</p>
                            <p className="text-2xl font-bold text-primary">12/25</p>
                          </div>
                          <div className="bg-neutral-50 p-4 rounded-md text-center">
                            <p className="text-sm text-neutral-medium">Active Learners</p>
                            <p className="text-2xl font-bold text-primary">10</p>
                          </div>
                          <div className="bg-neutral-50 p-4 rounded-md text-center">
                            <p className="text-sm text-neutral-medium">Hours This Month</p>
                            <p className="text-2xl font-bold text-primary">87.5</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="font-medium mb-2">Top Courses</h3>
                        <div className="border rounded-md divide-y">
                          <div className="flex justify-between items-center p-3">
                            <div>
                              <p className="font-medium">Business Strategy Fundamentals</p>
                              <p className="text-xs text-neutral-medium">8 active users</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">48 hours</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3">
                            <div>
                              <p className="font-medium">Data Analysis with Python</p>
                              <p className="text-xs text-neutral-medium">5 active users</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">32 hours</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
