//client/src/pages/checkout-summary.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, ArrowLeft, ShoppingCart, Gift } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function CheckoutSummaryPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/checkout-summary/:courseId");
  const courseId = params?.courseId;
  const { toast } = useToast();
  const [currency, setCurrency] = useState<"USD" | "GBP" | "EUR">("USD");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "paypal">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  // Get course details
  const { data: course, isLoading } = useQuery<Course | undefined>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });
  
  // Get frequently bought together courses
  const [selectedAdditionalCourses, setSelectedAdditionalCourses] = useState<number[]>([]);
  
  // These would typically come from the API, hardcoding for now
  const additionalCourses = [
    { id: 2, title: "Advanced Techniques", price: 39.99 },
    { id: 3, title: "Practical Projects", price: 29.99 }
  ];
  
  // Calculate base price
  const basePrice = 49.99;
  
  // Calculate additional courses price
  const additionalCoursesPrice = additionalCourses
    .filter(c => selectedAdditionalCourses.includes(c.id))
    .reduce((sum, course) => sum + course.price, 0);
  
  // Calculate subtotal
  const subtotal = basePrice + additionalCoursesPrice;
  
  // Calculate discount (20% if bundle, 0 if single course)
  const discountPercentage = selectedAdditionalCourses.length > 0 ? 20 : 0;
  const discountAmount = (subtotal * discountPercentage) / 100;
  
  // Calculate total
  const total = subtotal - discountAmount;

  // Handle payment submission
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Create the purchase with selected payment method
      const response = await fetch("/api/purchase-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          courseId,
          additionalCourseIds: selectedAdditionalCourses,
          paymentMethod: selectedPaymentMethod,
          currency
        }),
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.clientSecret) {
          // Redirect to payment processing with Stripe
          navigate(`/checkout?clientSecret=${data.clientSecret}`);
        } else if (data.redirect) {
          // Handle PayPal redirect
          window.location.href = data.redirect;
        } else {
          // Fallback - should not happen with proper backend
          toast({
            title: "Success",
            description: "Your purchase was successful!",
            variant: "default",
          });
          navigate("/dashboard");
        }
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Payment Error", 
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAdditionalCourse = (courseId: number) => {
    setSelectedAdditionalCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout Summary | LearnEdge</title>
        <meta 
          name="description" 
          content="Complete your purchase and get access to your selected courses."
        />
      </Helmet>
      
      <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/courses/${courseId}`} className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> 
            Back to course
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout Summary</h1>
          <p className="text-lg text-gray-600">Review your order before payment</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Order summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main course */}
            <Card>
              <CardHeader>
                <CardTitle>Your Course</CardTitle>
                <CardDescription>One-time purchase with lifetime access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                    <ShoppingCart className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{course?.title || 'Course'}</h3>
                    <p className="text-gray-500 text-sm">{course?.description?.substring(0, 120) || 'Course description'}...</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold">{convertPrice(basePrice)}</p>
                    <Badge className="mt-1">Lifetime Access</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Add additional courses */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Bought Together</CardTitle>
                <CardDescription>Add complementary courses and save 20%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {additionalCourses.map(course => (
                  <div key={course.id} className="flex items-center border-b pb-4">
                    <input 
                      type="checkbox" 
                      id={`course-${course.id}`}
                      checked={selectedAdditionalCourses.includes(course.id)}
                      onChange={() => toggleAdditionalCourse(course.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`course-${course.id}`} className="ml-3 flex-grow cursor-pointer">
                      <span className="font-medium">{course.title}</span>
                      <p className="text-sm text-gray-500">Perfect companion to your main course</p>
                    </label>
                    <span className="font-medium">{convertPrice(course.price)}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {selectedAdditionalCourses.length > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-md p-3 w-full flex items-center">
                    <Gift className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700">Bundle discount: <span className="font-bold">20% off</span></span>
                  </div>
                )}
              </CardFooter>
            </Card>
            
            {/* Payment methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedPaymentMethod} 
                  onValueChange={(value: string) => setSelectedPaymentMethod(value as "card" | "paypal")}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4 relative">
                    <RadioGroupItem value="card" id="card" className="absolute left-4" />
                    <Label htmlFor="card" className="ml-6 flex items-center flex-grow cursor-pointer">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Credit or Debit Card</span>
                    </Label>
                    <div className="flex space-x-1">
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-4 relative">
                    <RadioGroupItem value="paypal" id="paypal" className="absolute left-4" />
                    <Label htmlFor="paypal" className="ml-6 flex items-center flex-grow cursor-pointer">
                      <div className="text-blue-600 font-bold">Pay<span className="text-blue-800">Pal</span></div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Order total */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{convertPrice(subtotal)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bundle Discount (20%)</span>
                    <span>-{convertPrice(discountAmount)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{convertPrice(total)}</span>
                </div>
                
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">30-Day Money-Back Guarantee</p>
                      <p className="text-sm text-gray-600">Not satisfied? Get a full refund within 30 days</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full text-base py-6" 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Complete Payment`
                    )}
                  </Button>
                  
                  <div className="text-center text-xs text-gray-500">
                    By completing your purchase you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
