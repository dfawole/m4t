import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              How we use cookies and similar technologies
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              We use cookies for various purposes, including:
            </p>
            <ul>
              <li><strong>Essential cookies:</strong> These cookies are necessary for the website to function properly and cannot be switched off in our systems.</li>
              <li><strong>Performance cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
              <li><strong>Functional cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.</li>
              <li><strong>Targeting cookies:</strong> These cookies may be set through our site by our advertising partners to build a profile of your interests.</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <h3>Essential Cookies</h3>
            <p>
              These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions.
            </p>
            
            <h3>Performance Cookies</h3>
            <p>
              These cookies collect information about how visitors use a website, for instance which pages visitors go to most often, and if they get error messages from web pages. These cookies don't collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous.
            </p>
            
            <h3>Functional Cookies</h3>
            <p>
              These cookies allow the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. They may also be used to provide services you have asked for such as watching a video or commenting on a blog.
            </p>
            
            <h3>Targeting Cookies</h3>
            <p>
              These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign.
            </p>

            <h2>4. Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.
            </p>

            <h2>5. Cookie Management</h2>
            <p>
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies or delete certain cookies. Generally, you can also manage similar technologies in the same way that you manage cookies.
            </p>
            <p>
              Please note that if you choose to block cookies, you may not be able to use the full functionality of our website.
            </p>

            <h2>6. Cookie Consent</h2>
            <p>
              When you first visit our website, you will be presented with a cookie banner that allows you to accept or decline non-essential cookies. You can change your preferences at any time by clicking on the "Cookie Settings" button in the footer of our website.
            </p>

            <h2>7. Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Cookie Policy, please contact us at privacy@M4T.com.
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-center">
              Last updated: May 24, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Management Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Manage Your Cookie Preferences</h2>
          <p className="text-lg mb-8 text-gray-600">
            You can customize which cookies you accept by adjusting your preferences below.
          </p>
          <div className="flex justify-center">
            <Button size="lg">
              Cookie Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Related Policies</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/terms">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Terms of Service</h3>
                <p className="text-gray-600">The rules and guidelines for using our platform.</p>
              </div>
            </Link>
            <Link href="/privacy">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Privacy Policy</h3>
                <p className="text-gray-600">How we collect, use, and protect your information.</p>
              </div>
            </Link>
            <Link href="/accessibility">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Accessibility Statement</h3>
                <p className="text-gray-600">Our commitment to making our platform accessible to all users.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
