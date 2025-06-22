import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, Building, ArrowRight, Zap, Shield, TrendingUp, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubscriptionComparisonPage() {
  const { isAuthenticated } = useAuth();
  const [viewType, setViewType] = useState<'individual' | 'business'>('individual');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  
  // Get courseId from URL if present
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const courseId = params.get('courseId');
  
  // Currency conversion rates (in production, fetch from API)
  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const convertPrice = (priceUSD: number): number => {
    return Math.round(priceUSD * exchangeRates[currency]);
  };
  
  // Fetch subscription plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
  });

  const individualPlans = [
    {
      name: "Basic",
      price: 29,
      period: "month",
      description: "Perfect for individual learners getting started",
      features: [
        "Access to 50+ courses",
        "HD video streaming",
        "Mobile app access",
        "Community forums",
        "Basic certificates"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Pro",
      price: 49,
      period: "month", 
      description: "Advanced features for serious learners",
      features: [
        "Access to 500+ courses",
        "4K video streaming",
        "Offline downloads",
        "1-on-1 mentorship sessions",
        "Verified certificates",
        "Advanced analytics",
        "Priority support"
      ],
      popular: true,
      color: "border-primary ring-2 ring-primary"
    },
    {
      name: "Premium",
      price: 79,
      period: "month",
      description: "Complete access with exclusive content",
      features: [
        "Access to ALL courses",
        "Exclusive masterclasses",
        "Live workshops",
        "Career coaching",
        "Industry certifications",
        "Custom learning paths",
        "24/7 premium support"
      ],
      popular: false,
      color: "border-gray-200"
    }
  ];

  const businessPlans = [
    {
      name: "Team",
      price: 199,
      period: "month",
      description: "For small teams and startups",
      users: "Up to 10 users",
      features: [
        "All Pro features for team",
        "Team analytics dashboard",
        "Bulk user management",
        "Team progress tracking",
        "Custom branding",
        "Priority support"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Enterprise",
      price: 499,
      period: "month",
      description: "Comprehensive solution for organizations",
      users: "Up to 100 users",
      features: [
        "All Premium features for team",
        "Advanced analytics & reporting",
        "SSO integration",
        "Custom content creation",
        "Dedicated account manager",
        "API access",
        "White-label solution"
      ],
      popular: true,
      color: "border-primary ring-2 ring-primary"
    },
    {
      name: "Custom",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for large enterprises",
      users: "Unlimited users",
      features: [
        "Everything in Enterprise",
        "Custom integrations",
        "On-premise deployment",
        "24/7 dedicated support",
        "Custom training programs",
        "SLA guarantees",
        "Advanced security features"
      ],
      popular: false,
      color: "border-gray-200"
    }
  ];

  type PlanType = typeof individualPlans[0] | typeof businessPlans[0];

  const currentPlans = viewType === 'individual' ? individualPlans : businessPlans;

  const handleGetStarted = (planName: string) => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/subscriptions?plan=${planName.toLowerCase()}`;
    } else {
      window.location.href = `/subscriptions?plan=${planName.toLowerCase()}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>Compare Subscription Plans | M4T Learning Platform</title>
        <meta 
          name="description" 
          content="Choose the perfect learning plan for individuals or businesses. Compare features, pricing, and benefits across all our subscription tiers."
        />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Choose Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Unlock your potential with our comprehensive learning platform. Compare plans designed for individuals and businesses.
            </p>
            
            {/* Plan Type Toggle and Currency Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setViewType('individual')}
                  className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
                    viewType === 'individual'
                      ? 'bg-white shadow-sm text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Star className="h-4 w-4" />
                  Individual Plans
                </button>
                <button
                  onClick={() => setViewType('business')}
                  className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
                    viewType === 'business'
                      ? 'bg-white shadow-sm text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  Business Plans
                </button>
              </div>
              
              {/* Currency Selector */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <Select value={currency} onValueChange={(value: 'USD' | 'EUR' | 'GBP') => setCurrency(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert-Led Content</h3>
              <p className="text-gray-600">Learn from industry professionals with real-world experience</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your learning journey with detailed analytics</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Learning</h3>
              <p className="text-gray-600">Earn recognized certificates to advance your career</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {currentPlans.map((plan, index) => (
              <Card key={plan.name} className={`relative ${plan.color} ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-3xl font-bold">
                      {typeof plan.price === 'number' 
                        ? `${currencySymbols[currency]}${convertPrice(plan.price)}` 
                        : plan.price}
                    </span>
                    {typeof plan.price === 'number' && (
                      <span className="text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  {viewType === 'business' && 'users' in plan && (
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {plan.users}
                    </div>
                  )}
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => handleGetStarted(plan.name)}
                  >
                    {isAuthenticated ? 'Get Started' : 'Login to Subscribe'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of learners advancing their careers with M4T
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = isAuthenticated ? '/subscriptions' : '/register'}
              >
                {isAuthenticated ? 'Choose Your Plan' : 'Start Free Trial'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.location.href = '/courses'}
              >
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}