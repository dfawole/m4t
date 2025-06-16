import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  Users, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  Mail, 
  Phone, 
  Globe,
  MapPin,
  FileText,
  Shield,
  Star
} from "lucide-react";

const companyOnboardingSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  companySize: z.string().min(1, "Please select company size"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  description: z.string().min(10, "Company description must be at least 10 characters"),
  contactPerson: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    jobTitle: z.string().min(2, "Job title is required")
  }),
  address: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State/Province is required"),
    zipCode: z.string().min(3, "ZIP/Postal code is required"),
    country: z.string().min(2, "Country is required")
  }),
  licensesNeeded: z.number().min(5, "Minimum 5 licenses required for enterprise plans"),
  preferredPlan: z.string().min(1, "Please select a plan"),
  specialRequirements: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions")
});

type CompanyOnboardingForm = z.infer<typeof companyOnboardingSchema>;

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Consulting", "Real Estate", "Legal", "Government",
  "Non-Profit", "Media", "Transportation", "Energy", "Other"
];

const companySizes = [
  "5-50 employees", "51-200 employees", "201-500 employees", 
  "501-1000 employees", "1001-5000 employees", "5000+ employees"
];

const enterprisePlans = [
  { id: "business-pro", name: "Business Pro", price: "$49/user/month", features: ["Advanced Analytics", "Priority Support", "Custom Integrations"] },
  { id: "enterprise", name: "Enterprise", price: "$79/user/month", features: ["White-label Options", "Dedicated Success Manager", "Custom Development"] },
  { id: "enterprise-plus", name: "Enterprise Plus", price: "Custom Pricing", features: ["On-premise Deployment", "24/7 Support", "Full Customization"] }
];

export default function CompanyOnboarding() {
  const [step, setStep] = useState(1);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<CompanyOnboardingForm>({
    resolver: zodResolver(companyOnboardingSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      companySize: "",
      website: "",
      description: "",
      contactPerson: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: ""
      },
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      },
      licensesNeeded: 10,
      preferredPlan: "",
      specialRequirements: "",
      termsAccepted: false
    }
  });

  const submitOnboardingMutation = useMutation({
    mutationFn: async (data: CompanyOnboardingForm) => {
      const response = await apiRequest("POST", "/api/company-onboarding", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSubmissionSuccess(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "Our team will review your application and contact you within 2 business days.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanyOnboardingForm) => {
    submitOnboardingMutation.mutate(data);
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Application Submitted!</CardTitle>
              <CardDescription className="text-lg">
                Thank you for your interest in M4T Enterprise Solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Your enterprise onboarding application has been successfully submitted. 
                Our team will review your requirements and contact you within 2 business days.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Initial review and requirement analysis</li>
                  <li>• Custom proposal and pricing discussion</li>
                  <li>• Demo and technical setup consultation</li>
                  <li>• Contract finalization and implementation</li>
                </ul>
              </div>
              <Button onClick={() => window.location.href = "/"} className="mt-6">
                Return to Home Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Enterprise Onboarding
          </h1>
          <p className="text-xl text-gray-600">
            Join thousands of companies using M4T for employee learning and development
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step === 1 && <><Building2 className="w-5 h-5" /> Company Information</>}
                  {step === 2 && <><Users className="w-5 h-5" /> Contact & Location</>}
                  {step === 3 && <><CreditCard className="w-5 h-5" /> Plan & Requirements</>}
                  {step === 4 && <><FileText className="w-5 h-5" /> Review & Submit</>}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Tell us about your company"}
                  {step === 2 && "Primary contact and company location"}
                  {step === 3 && "Choose your plan and specify requirements"}
                  {step === 4 && "Review your information and submit"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Step 1: Company Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {companySizes.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your company, its mission, and why you're interested in M4T"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Contact & Location */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Primary Contact Person
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contactPerson.firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPerson.lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPerson.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input placeholder="john.doe@company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPerson.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPerson.jobTitle"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Job Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Chief Technology Officer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Company Address
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address.street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address *</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Business Ave, Suite 100" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City *</FormLabel>
                                <FormControl>
                                  <Input placeholder="San Francisco" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province *</FormLabel>
                                <FormControl>
                                  <Input placeholder="California" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP/Postal Code *</FormLabel>
                                <FormControl>
                                  <Input placeholder="94105" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country *</FormLabel>
                                <FormControl>
                                  <Input placeholder="United States" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Plan & Requirements */}
                {step === 3 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="licensesNeeded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Licenses Needed *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="5" 
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="text-base font-semibold">Choose Your Plan *</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {enterprisePlans.map((plan) => (
                          <Card 
                            key={plan.id} 
                            className={`cursor-pointer transition-all ${
                              form.watch("preferredPlan") === plan.id 
                                ? "ring-2 ring-blue-500 bg-blue-50" 
                                : "hover:shadow-md"
                            }`}
                            onClick={() => form.setValue("preferredPlan", plan.id)}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{plan.name}</CardTitle>
                              <CardDescription className="text-xl font-bold text-blue-600">
                                {plan.price}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {form.formState.errors.preferredPlan && (
                        <p className="text-sm text-red-500 mt-2">Please select a plan</p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="specialRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requirements or Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any specific integration requirements, custom features, or other needs..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h3 className="text-lg font-semibold">Application Summary</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Company:</span> {form.watch("companyName")}
                        </div>
                        <div>
                          <span className="font-medium">Industry:</span> {form.watch("industry")}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span> {form.watch("companySize")}
                        </div>
                        <div>
                          <span className="font-medium">Licenses:</span> {form.watch("licensesNeeded")}
                        </div>
                        <div>
                          <span className="font-medium">Contact:</span> {form.watch("contactPerson.firstName")} {form.watch("contactPerson.lastName")}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {form.watch("contactPerson.email")}
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              I accept the Terms and Conditions *
                            </FormLabel>
                            <p className="text-sm text-gray-600">
                              By checking this box, you agree to our enterprise terms of service and privacy policy.
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  
                  {step < 4 ? (
                    <Button 
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      disabled={submitOnboardingMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      {submitOnboardingMutation.isPending ? "Submitting..." : "Submit Application"}
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}