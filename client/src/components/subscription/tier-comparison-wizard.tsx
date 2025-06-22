import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { SubscriptionPlan } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Briefcase,
  User,
  BarChart3,
  Calendar,
  CreditCard,
  Shield,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TierComparisonWizardProps {
  courseId?: string | null;
  courseTitle?: string;
}

const INDIVIDUAL_FEATURES = {
  basic: ["10 courses per month", "Basic analytics", "Email support"],
  pro: [
    "Unlimited courses",
    "Advanced analytics",
    "Priority support",
    "Course certificates",
  ],
  annual: [
    "Unlimited courses",
    "Advanced analytics",
    "Priority support",
    "Course certificates",
    "20% savings compared to monthly",
  ],
};

const BUSINESS_FEATURES = {
  team: [
    "10 user licenses",
    "Team management",
    "Basic reporting",
    "Email support",
  ],
  business: [
    "Unlimited users",
    "Advanced reporting",
    "Priority support",
    "Course certificates",
    "Custom learning paths",
  ],
  enterprise: [
    "Unlimited users",
    "Advanced reporting",
    "Dedicated support",
    "Course certificates",
    "Custom learning paths",
    "LMS integration",
    "Single sign-on (SSO)",
    "Custom branding",
  ],
};

const SINGLE_COURSE_FEATURES = [
  "Lifetime access to selected course",
  "Course certificates",
  "30-day money back guarantee",
  "Access to course Q&A",
  "Course materials and resources"
];

interface IndividualPlanFeature {
  icon: JSX.Element;
  title: string;
  singleCourse: string | boolean;
  basic: string | boolean;
  pro: string | boolean;
  annual: string | boolean;
}

interface TeamPlanFeature {
  icon: JSX.Element;
  title: string;
  team: string | boolean;
  business: string | boolean;
  enterprise: string | boolean;
}

const INDIVIDUAL_FEATURE_COMPARISON: IndividualPlanFeature[] = [
  {
    icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
    title: "Courses per month",
    singleCourse: "1",
    basic: "10",
    pro: "Unlimited",
    annual: "Unlimited",
  },
  {
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
    title: "Duration",
    singleCourse: "Lifetime",
    basic: "Monthly",
    pro: "Monthly",
    annual: "Annual",
  },
  {
    icon: <User className="h-5 w-5 text-blue-500" />,
    title: "Analytics",
    singleCourse: "Basic",
    basic: "Basic",
    pro: "Advanced",
    annual: "Advanced",
  },
  {
    icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    title: "Payment options",
    singleCourse: "One-time",
    basic: "Monthly",
    pro: "Monthly",
    annual: "Annual",
  },
  {
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    title: "Course certificates",
    singleCourse: true,
    basic: false,
    pro: true,
    annual: true,
  },
  {
    icon: <Users className="h-5 w-5 text-blue-500" />,
    title: "Community access",
    singleCourse: "Limited",
    basic: "Basic",
    pro: "Full",
    annual: "Full",
  },
];

const TEAM_FEATURE_COMPARISON: TeamPlanFeature[] = [
  {
    icon: <Users className="h-5 w-5 text-blue-500" />,
    title: "User licenses",
    team: "10",
    business: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    icon: <Briefcase className="h-5 w-5 text-blue-500" />,
    title: "Team management",
    team: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
    title: "Reporting",
    team: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
  },
  {
    icon: <User className="h-5 w-5 text-blue-500" />,
    title: "Support",
    team: "Email",
    business: "Priority",
    enterprise: "Dedicated",
  },
  {
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    title: "Custom learning paths",
    team: false,
    business: true,
    enterprise: true,
  },
  {
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    title: "LMS integration",
    team: false,
    business: false,
    enterprise: true,
  },
  {
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    title: "Custom branding",
    team: false,
    business: false,
    enterprise: true,
  },
  {
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    title: "SSO authentication",
    team: false,
    business: false,
    enterprise: true,
  },
];

export default function TierComparisonWizard({ courseId, courseTitle }: TierComparisonWizardProps) {
  const [selectedTab, setSelectedTab] = useState(courseId ? "single-course" : "individual");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currency, setCurrency] = useState<"USD" | "GBP" | "EUR">("USD");
  
  // Currency conversion rates
  const exchangeRates = {
    USD: 1,
    GBP: 0.78,
    EUR: 0.91
  };
  
  // Currency symbols
  const currencySymbols = {
    USD: "$",
    GBP: "£",
    EUR: "€"
  };

  // Function to convert price based on selected currency
  const convertPrice = (priceUSD: number) => {
    const convertedPrice = priceUSD * exchangeRates[currency];
    return `${currencySymbols[currency]}${convertedPrice.toFixed(2)}`;
  };
  
  // Calculate single course price (typically around 1/5 of the annual plan price)
  const singleCoursePrice = courseId ? 49.99 : 0;

  const { data: plans } = useQuery({
    queryKey: ["/api/subscription-plans"],
  });

  const handleSubscribe = async (planId: number) => {
    try {
      // Direct fetch with proper error handling
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planId
        }),
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.clientSecret) {
          // Redirect to checkout page
          navigate("/checkout?clientSecret=" + data.clientSecret);
        } else if (data.redirect) {
          // Handle PayPal or other redirects
          window.location.href = data.redirect;
        } else {
          // Fallback
          navigate("/dashboard");
        }
      } else {
        toast({
          title: "Error",
          description: "There was a problem creating your subscription. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem with your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBuySingleCourse = () => {
    if (!courseId) return;
    
    // Directly navigate to the checkout summary page
    navigate(`/checkout-summary/${courseId}`);
    
    // Track this event (would integrate with analytics in a real app)
    console.log('User chose to purchase individual course', { courseId, courseTitle });
  };

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center space-y-6 text-center mb-8">
        {courseId && (
          <div className="w-full flex justify-start mb-4">
            <Link href={`/courses/${courseId}`} className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              Back to course
            </Link>
          </div>
        )}
        
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent">
          {courseId 
            ? `Purchase ${courseTitle || 'Course'}`
            : 'Choose Your Perfect Plan'
          }
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          {courseId
            ? `Get lifetime access to ${courseTitle || 'this course'} or choose a subscription for unlimited access to our entire course library.`
            : "Flexible options designed to fit your learning journey, whether you're an individual learner or part of a team."
          }
        </p>
        
        <div className="w-full max-w-3xl">
          <div className="bg-gray-100 p-2 rounded-lg inline-flex mx-auto">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-2 rounded-md ${
                currency === "USD" 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-gray-200"
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency("GBP")}
              className={`px-4 py-2 rounded-md ${
                currency === "GBP" 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-gray-200"
              }`}
            >
              £ GBP
            </button>
            <button
              onClick={() => setCurrency("EUR")}
              className={`px-4 py-2 rounded-md ${
                currency === "EUR" 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-gray-200"
              }`}
            >
              € EUR
            </button>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full max-w-lg mx-auto mb-8 grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="individual" className="relative">
            <User className="h-4 w-4 mr-2" />
            <span>Individual</span>
          </TabsTrigger>
          <TabsTrigger value="business">
            <Briefcase className="h-4 w-4 mr-2" />
            <span>Business</span>
          </TabsTrigger>
          {courseId && (
            <TabsTrigger value="single-course" className="relative border-2 border-primary font-bold">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              <span className="text-primary">Individual Course</span>
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                RECOMMENDED
              </span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Single Course Tab */}
        {courseId && (
          <TabsContent value="single-course">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card className="border-2 border-primary relative h-full">
                  <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
                    <Badge className="bg-primary hover:bg-primary-dark">Limited Time</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{courseTitle || 'Course'}</CardTitle>
                    <CardDescription>One-time purchase</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-gray-400 line-through text-lg">{convertPrice(singleCoursePrice * 1.25)}</p>
                        <Badge className="bg-red-500 hover:bg-red-600">25% OFF</Badge>
                      </div>
                      <p className="text-3xl font-bold">{convertPrice(singleCoursePrice)}</p>
                      <p className="text-sm text-gray-500">one-time payment</p>
                    </div>
                    <ul className="space-y-2">
                      {SINGLE_COURSE_FEATURES.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-primary hover:bg-primary-dark py-6 text-lg font-bold shadow-lg" 
                      onClick={handleBuySingleCourse}
                    >
                      Continue to Payment <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-center mt-2 text-sm text-primary font-medium">Secure checkout with 6-month access</p>
                  </CardFooter>
                </Card>
              </div>

              <div className="md:col-span-2">
                {/* Course Preview Section */}
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Preview</CardTitle>
                      <CardDescription>Get a taste of what you'll learn</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                        <div className="text-center p-8">
                          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Course Preview Video</h3>
                          <p className="text-sm text-gray-500">Preview the first chapter and discover what this course offers</p>
                          <Button variant="outline" className="mt-4">
                            Watch Preview
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">What you'll learn:</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>Comprehensive introduction to key concepts</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>Practical projects with real-world applications</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>Advanced techniques used by professionals</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>Certification-ready skills and knowledge</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Testimonials Section */}
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Testimonials</CardTitle>
                      <CardDescription>See what others say about this course</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Sarah Johnson</h4>
                              <div className="flex text-yellow-400">
                                {Array(5).fill(null).map((_, i) => (
                                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">"This course exceeded my expectations. The instructor explains complex topics in a way that's easy to understand and the practical exercises helped reinforce my learning."</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Michael Chen</h4>
                              <div className="flex text-yellow-400">
                                {Array(5).fill(null).map((_, i) => (
                                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">"Worth every penny! I landed a job within a month of completing this course. The curriculum is well-structured and the community support is fantastic."</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Frequently Bought Together */}
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Bought Together</CardTitle>
                      <CardDescription>Complete your learning journey with these related courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                              <BookOpen className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Advanced Techniques</h4>
                              <p className="text-sm text-gray-500">Take your skills to the next level</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{convertPrice(39.99)}</p>
                            <Button variant="outline" size="sm" className="mt-1">Add</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                              <BookOpen className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Practical Projects</h4>
                              <p className="text-sm text-gray-500">Build your portfolio with real projects</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{convertPrice(29.99)}</p>
                            <Button variant="outline" size="sm" className="mt-1">Add</Button>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Bundle Price:</span>
                            <div>
                              <span className="text-gray-400 line-through mr-2">{convertPrice(singleCoursePrice + 39.99 + 29.99)}</span>
                              <span className="font-bold text-lg">{convertPrice((singleCoursePrice + 39.99 + 29.99) * 0.8)}</span>
                            </div>
                          </div>
                          <Button className="w-full">
                            Buy Bundle & Save 20%
                          </Button>
                          <p className="text-xs text-center mt-2 text-gray-500">Or subscribe for unlimited access to all courses</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Feature Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compare with Subscription Plans</CardTitle>
                    <CardDescription>Get more value with our subscription plans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {INDIVIDUAL_FEATURE_COMPARISON.map((feature, i) => (
                        <div key={i} className="grid grid-cols-5 items-center py-2 border-b">
                          <div className="flex items-center col-span-2">
                            {feature.icon}
                            <span className="ml-2">{feature.title}</span>
                          </div>
                          <div className="text-center">
                            {typeof feature.singleCourse === "boolean" ? (
                              feature.singleCourse ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )
                            ) : (
                              <span>{feature.singleCourse}</span>
                            )}
                          </div>
                          <div className="text-center">
                            {typeof feature.basic === "boolean" ? (
                              feature.basic ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )
                            ) : (
                              <span>{feature.basic}</span>
                            )}
                          </div>
                          <div className="text-center">
                            {typeof feature.pro === "boolean" ? (
                              feature.pro ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )
                            ) : (
                              <span>{feature.pro}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8">
                      <Button onClick={() => setSelectedTab("individual")} variant="outline" className="w-full">
                        View Subscription Plans
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Individual Tab */}
        <TabsContent value="individual">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>Essential learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold">{convertPrice(19.99)}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
                <ul className="space-y-2">
                  {INDIVIDUAL_FEATURES.basic.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleSubscribe(1)}
                >
                  Subscribe
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary relative">
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
                <Badge className="bg-primary hover:bg-primary-dark">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Advanced learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold">{convertPrice(29.99)}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
                <ul className="space-y-2">
                  {INDIVIDUAL_FEATURES.pro.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe(2)}
                >
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annual Pro</CardTitle>
                <CardDescription>Save 20% with yearly billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold">{convertPrice(239.88)}</p>
                  <p className="text-sm text-gray-500">per year ({convertPrice(19.99)}/mo)</p>
                </div>
                <ul className="space-y-2">
                  {INDIVIDUAL_FEATURES.annual.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleSubscribe(3)}
                >
                  Subscribe
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-center">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Basic</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pro</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {INDIVIDUAL_FEATURE_COMPARISON.map((feature, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {feature.icon}
                          <span className="ml-2">{feature.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {typeof feature.basic === "boolean" ? (
                          feature.basic ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span>{feature.basic}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span>{feature.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {typeof feature.annual === "boolean" ? (
                          feature.annual ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span>{feature.annual}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>For small teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold">{convertPrice(99.99)}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
                <ul className="space-y-2">
                  {BUSINESS_FEATURES.team.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleSubscribe(4)}
                >
                  Subscribe
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary relative">
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
                <Badge className="bg-primary hover:bg-primary-dark">Best Value</Badge>
              </div>
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <CardDescription>For organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold">{convertPrice(299.99)}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
                <ul className="space-y-2">
                  {BUSINESS_FEATURES.business.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe(5)}
                >
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold">Custom</p>
                  <p className="text-sm text-gray-500">contact sales</p>
                </div>
                <ul className="space-y-2">
                  {BUSINESS_FEATURES.enterprise.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Contact Sales",
                      description: "Our team will reach out to discuss custom pricing.",
                      variant: "default",
                    });
                    navigate("/contact");
                  }}
                >
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-center">Business Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {TEAM_FEATURE_COMPARISON.map((feature, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {feature.icon}
                          <span className="ml-2">{feature.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {typeof feature.team === "boolean" ? (
                          feature.team ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span>{feature.team}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {typeof feature.business === "boolean" ? (
                          feature.business ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span>{feature.business}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {typeof feature.enterprise === "boolean" ? (
                          feature.enterprise ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span>{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. For Enterprise plans, we also support invoicing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer a 7-day free trial for all our subscription plans. You can cancel before the trial ends without being charged.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
            <AccordionContent>
              For course purchases, we offer a 30-day money-back guarantee. For subscription plans, we don't provide refunds for partial months, but you can cancel anytime to prevent future charges.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>What's the difference between purchasing a course and subscribing?</AccordionTrigger>
            <AccordionContent>
              When you purchase a course, you get lifetime access to that specific course. With a subscription, you get access to our entire library of courses for as long as your subscription is active, plus additional features like advanced analytics and priority support.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
