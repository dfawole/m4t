import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Accessibility Statement
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              Our commitment to an inclusive learning experience
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
            <h2>Our Commitment</h2>
            <p>
              M4T is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>

            <h2>Compliance Status</h2>
            <p>
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
            </p>
            <p>
              The guidelines have three levels of accessibility (A, AA, and AAA). We've chosen Level AA as our target.
            </p>

            <h2>Accessibility Features</h2>
            <p>
              Our platform includes the following accessibility features:
            </p>
            <ul>
              <li><strong>Keyboard Navigation:</strong> All functionality is operable through a keyboard interface without requiring specific timings for individual keystrokes.</li>
              <li><strong>Text Alternatives:</strong> We provide text alternatives for non-text content such as images, videos, and interactive elements.</li>
              <li><strong>Captions and Transcripts:</strong> Video content includes synchronized captions and audio descriptions where necessary.</li>
              <li><strong>Readable Content:</strong> Text is presented in a way that is readable and understandable, with adequate color contrast.</li>
              <li><strong>Predictable Navigation:</strong> Web pages operate in predictable ways, with consistent navigation patterns throughout the site.</li>
              <li><strong>Input Assistance:</strong> We help users avoid and correct mistakes when filling out forms.</li>
              <li><strong>Compatibility:</strong> Our content is compatible with current and future user tools, including assistive technologies.</li>
            </ul>

            <h2>Assistive Technology Support</h2>
            <p>
              Our platform works with a variety of assistive technologies, including:
            </p>
            <ul>
              <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
              <li>Speech recognition software</li>
              <li>Screen magnification tools</li>
              <li>Alternative input devices</li>
            </ul>

            <h2>Limitations and Alternatives</h2>
            <p>
              Despite our best efforts, there may be some content or features that present challenges for certain users. Where possible, we offer alternatives:
            </p>
            <ul>
              <li>For interactive simulations, we provide text-based alternatives that convey the same learning objectives.</li>
              <li>For complex data visualizations, we offer tabular data or descriptive text summaries.</li>
              <li>For timed quizzes or activities, extended time options are available upon request.</li>
            </ul>

            <h2>Continuous Improvement</h2>
            <p>
              We are committed to ongoing accessibility improvements. Our development process includes:
            </p>
            <ul>
              <li>Regular accessibility audits and testing</li>
              <li>User feedback incorporation</li>
              <li>Training for our design and development team</li>
              <li>Staying current with accessibility best practices and regulations</li>
            </ul>

            <h2>Feedback and Assistance</h2>
            <p>
              We welcome your feedback on the accessibility of our platform. If you encounter accessibility barriers or would like to request specific accommodations, please contact us at accessibility@M4T.com.
            </p>
            <p>
              We aim to respond to accessibility feedback within 2 business days.
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-center">
              Last updated: May 24, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Features Overview */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Accessibility Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Keyboard Accessible</h3>
              </div>
              <p className="text-gray-600">
                Full keyboard navigation throughout the platform with visible focus indicators.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Screen Reader Compatible</h3>
              </div>
              <p className="text-gray-600">
                Proper semantic markup and ARIA attributes for screen reader compatibility.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Video Captions</h3>
              </div>
              <p className="text-gray-600">
                Closed captions and transcripts for all video content in multiple languages.
              </p>
            </div>
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
            <Link href="/cookies">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Cookie Policy</h3>
                <p className="text-gray-600">Understand how we use cookies and similar technologies.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
