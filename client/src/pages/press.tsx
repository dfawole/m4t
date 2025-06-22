import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, Calendar, FileText, Award } from 'lucide-react';

export default function Press() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Press Center
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              Latest news, press releases, and media resources
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-8">Latest Press Releases</h2>
              
              {/* Press Release 1 */}
              <div className="mb-10 pb-10 border-b">
                <div className="flex items-center text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>May 24, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-3">M4T Announces Partnership with Fortune 500 Companies for Employee Upskilling</h3>
                <p className="text-gray-600 mb-4">
                  M4T today announced a new enterprise program designed to provide customized learning paths for employees of Fortune 500 companies, marking a significant expansion of its corporate training initiatives.
                </p>
                <Link href="/press/partnership-announcement">
                  <Button variant="outline" size="sm" className="flex items-center">
                    Read full release
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              {/* Press Release 2 */}
              <div className="mb-10 pb-10 border-b">
                <div className="flex items-center text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>May 10, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-3">M4T Reaches 2 Million Learner Milestone</h3>
                <p className="text-gray-600 mb-4">
                  M4T announced today that it has surpassed 2 million active learners on its platform, a 40% increase from the previous year, highlighting the growing demand for accessible, high-quality online education.
                </p>
                <Link href="/press/learner-milestone">
                  <Button variant="outline" size="sm" className="flex items-center">
                    Read full release
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              {/* Press Release 3 */}
              <div>
                <div className="flex items-center text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>April 15, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-3">M4T Launches Advanced AI Learning Assistant</h3>
                <p className="text-gray-600 mb-4">
                  The new AI-powered learning assistant uses machine learning to personalize study plans, provide real-time feedback, and adapt to individual learning styles, setting a new standard for interactive online education.
                </p>
                <Link href="/press/ai-assistant-launch">
                  <Button variant="outline" size="sm" className="flex items-center">
                    Read full release
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold mb-4">Media Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/press/brand-assets">
                      <div className="flex items-center text-primary hover:underline">
                        <FileText className="h-4 w-4 mr-2" />
                        Brand Assets & Logos
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/press/media-kit">
                      <div className="flex items-center text-primary hover:underline">
                        <FileText className="h-4 w-4 mr-2" />
                        Media Kit
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/press/executive-bios">
                      <div className="flex items-center text-primary hover:underline">
                        <FileText className="h-4 w-4 mr-2" />
                        Executive Bios
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/press/fact-sheet">
                      <div className="flex items-center text-primary hover:underline">
                        <FileText className="h-4 w-4 mr-2" />
                        Company Fact Sheet
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Awards & Recognition</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <Award className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Best E-Learning Platform 2025</p>
                      <p className="text-sm text-gray-500">EdTech Breakthrough Awards</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Award className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Most Innovative Learning Technology</p>
                      <p className="text-sm text-gray-500">Global Learning Tech Awards</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Award className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Top 10 EdTech Companies to Watch</p>
                      <p className="text-sm text-gray-500">Forbes Business</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-gray-600 mb-6">
            For press inquiries, interview requests, or additional information, please contact our media relations team.
          </p>
          <div className="flex justify-center">
            <Button size="lg">
              Contact Press Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
