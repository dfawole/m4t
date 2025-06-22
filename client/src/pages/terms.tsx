import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              Please read these terms carefully before using our platform.
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
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using M4T services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              M4T provides an online learning platform with various educational content, including but not limited to courses, quizzes, and interactive learning materials. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of our platform, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2>4. User Conduct</h2>
            <p>
              You agree not to use our services for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services. You also agree not to attempt to gain unauthorized access to any part of our services, other accounts, or computer systems.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content on M4T, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of M4T or its content suppliers and is protected by copyright and other intellectual property laws.
            </p>

            <h2>6. Payment Terms</h2>
            <p>
              Some of our services require payment. By subscribing to a paid service, you agree to pay all fees associated with the service. All payments are non-refundable unless otherwise specified in our refund policy.
            </p>

            <h2>7. Termination</h2>
            <p>
              We may terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              M4T shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will provide notice of any material changes by posting the new Terms of Service on our website. Your continued use of our services after such changes constitutes your acceptance of the new terms.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-center">
              Last updated: May 24, 2025
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Have Questions About Our Terms?</h2>
          <p className="text-lg mb-8 text-gray-600 max-w-3xl mx-auto">
            Our support team is here to help clarify any concerns you may have about our terms of service.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
              Contact Support
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Related Links */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Related Policies</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/privacy">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Privacy Policy</h3>
                <p className="text-gray-600">Learn how we collect, use, and protect your personal information.</p>
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
