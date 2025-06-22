import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Users, 
  FileQuestion,
  Briefcase,
  HelpCircle 
} from "lucide-react";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  reason: z.string({
    required_error: "Please select a reason for contact.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      reason: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would send the form data to your backend
      console.log("Form submitted:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              Have questions or feedback? We'd love to hear from you. Our team is here to help.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information + Form Section */}
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex gap-12">
            {/* Contact Information */}
            <div className="md:w-1/3 mb-12 md:mb-0">
              <h2 className="text-2xl font-bold mb-6 text-neutral-dark">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-light bg-opacity-10 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-neutral-medium">support@M4T.com</p>
                    <p className="text-neutral-medium">info@M4T.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-light bg-opacity-10 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-neutral-medium">+1 (555) 123-4567</p>
                    <p className="text-neutral-medium">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-light bg-opacity-10 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-neutral-medium">123 Learning Lane</p>
                    <p className="text-neutral-medium">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-neutral-lighter hover:bg-neutral-light p-3 rounded-full transition-colors">
                    <i className="fa-brands fa-twitter text-neutral-dark"></i>
                  </a>
                  <a href="#" className="bg-neutral-lighter hover:bg-neutral-light p-3 rounded-full transition-colors">
                    <i className="fa-brands fa-linkedin-in text-neutral-dark"></i>
                  </a>
                  <a href="#" className="bg-neutral-lighter hover:bg-neutral-light p-3 rounded-full transition-colors">
                    <i className="fa-brands fa-facebook-f text-neutral-dark"></i>
                  </a>
                  <a href="#" className="bg-neutral-lighter hover:bg-neutral-light p-3 rounded-full transition-colors">
                    <i className="fa-brands fa-instagram text-neutral-dark"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-neutral-dark">Send Us a Message</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Contact</FormLabel>
                          <FormControl>
                            <select 
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="" disabled>Select a reason</option>
                              <option value="general">General Inquiry</option>
                              <option value="support">Technical Support</option>
                              <option value="sales">Sales & Pricing</option>
                              <option value="partnership">Partnership Opportunities</option>
                              <option value="feedback">Product Feedback</option>
                              <option value="other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Subject of your message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Type your message here..." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-primary hover:bg-primary-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Categories Section */}
      <div className="py-16 bg-neutral-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Can We Help?</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              Find quick answers to your questions by category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
              <p className="text-neutral-medium mb-4">
                Questions about our platform or services
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Learn More
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Technical Support</h3>
              <p className="text-neutral-medium mb-4">
                Help with account access or platform issues
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Get Support
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Solutions</h3>
              <p className="text-neutral-medium mb-4">
                Enterprise and team licensing information
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Contact Sales
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">FAQ</h3>
              <p className="text-neutral-medium mb-4">
                Answers to commonly asked questions
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
            <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
              We're located in the heart of San Francisco's tech district
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-neutral-lighter flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Map Placeholder</h3>
              <p className="text-neutral-medium">
                123 Learning Lane, San Francisco, CA 94105
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
