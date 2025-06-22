import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              How we collect, use, and protect your information
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
            <h2>1. Introduction</h2>
            <p>
              M4T ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, subscribe to our service, or communicate with us. This may include:
            </p>
            <ul>
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Account credentials</li>
              <li>Billing information</li>
              <li>Course preferences and learning history</li>
              <li>Communications with us</li>
            </ul>
            <p>
              We also automatically collect certain information when you use our platform, including:
            </p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, time spent)</li>
              <li>IP address and location data</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and managing your account</li>
              <li>Personalizing your learning experience</li>
              <li>Improving our platform and developing new features</li>
              <li>Communicating with you about our services</li>
              <li>Analyzing usage patterns and trends</li>
              <li>Protecting against fraud and unauthorized access</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Service providers who perform services on our behalf</li>
              <li>Partners who offer integrated services with our platform</li>
              <li>Legal authorities when required by law</li>
              <li>Business transferees in the event of a merger, acquisition, or sale</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide you services. We may also retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Object to certain processing of your information</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Our platform is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe we have collected information from your child, please contact us.
            </p>

            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@M4T.com.
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-center">
              Last updated: May 24, 2025
            </p>
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
            <Link href="/cookies">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Cookie Policy</h3>
                <p className="text-gray-600">Understand how we use cookies and similar technologies.</p>
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
