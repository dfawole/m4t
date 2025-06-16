import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Building, 
  Globe, 
  Award,
  Users,
  BookOpen,
  Briefcase
} from 'lucide-react';

export default function Partners() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our Partners
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              Working together to create exceptional learning experiences
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

      {/* Enterprise Partners Section */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Partners</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We work with leading organizations to deliver customized learning solutions that drive business growth and employee development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Partner 1 */}
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <div className="h-20 w-20 bg-blue-100 rounded-full mb-6 flex items-center justify-center mx-auto">
                <Building className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Global Tech Solutions</h3>
              <p className="text-gray-600 text-center mb-4">
                Enterprise technology partner providing custom learning paths for technical teams.
              </p>
              <div className="flex justify-center">
                <Link href="/partners/global-tech">
                  <Button variant="outline" size="sm">Learn more</Button>
                </Link>
              </div>
            </div>

            {/* Partner 2 */}
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <div className="h-20 w-20 bg-blue-100 rounded-full mb-6 flex items-center justify-center mx-auto">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">International Business Academy</h3>
              <p className="text-gray-600 text-center mb-4">
                Leading business school offering accredited courses through our platform.
              </p>
              <div className="flex justify-center">
                <Link href="/partners/business-academy">
                  <Button variant="outline" size="sm">Learn more</Button>
                </Link>
              </div>
            </div>

            {/* Partner 3 */}
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <div className="h-20 w-20 bg-blue-100 rounded-full mb-6 flex items-center justify-center mx-auto">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Excellence Training Group</h3>
              <p className="text-gray-600 text-center mb-4">
                Professional certification provider specializing in industry-recognized credentials.
              </p>
              <div className="flex justify-center">
                <Link href="/partners/excellence-training">
                  <Button variant="outline" size="sm">Learn more</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Partners Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Content Partners</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We collaborate with leading content creators and subject matter experts to deliver high-quality educational materials.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Using simple branded blocks with icons for content partners */}
            <div className="aspect-square bg-white rounded-lg border flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
              <Users className="h-12 w-12 text-primary mb-2" />
              <div className="text-center font-medium">Expert Academy</div>
            </div>
            
            <div className="aspect-square bg-white rounded-lg border flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
              <BookOpen className="h-12 w-12 text-primary mb-2" />
              <div className="text-center font-medium">Learning Press</div>
            </div>
            
            <div className="aspect-square bg-white rounded-lg border flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
              <Briefcase className="h-12 w-12 text-primary mb-2" />
              <div className="text-center font-medium">Business Insights</div>
            </div>
            
            <div className="aspect-square bg-white rounded-lg border flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
              <Globe className="h-12 w-12 text-primary mb-2" />
              <div className="text-center font-medium">Global Skills</div>
            </div>
            
            <div className="aspect-square bg-white rounded-lg border flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
              <Award className="h-12 w-12 text-primary mb-2" />
              <div className="text-center font-medium">Certified Pro</div>
            </div>
            
            <div className="aspect-square bg-white rounded-lg border flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
              <Building className="h-12 w-12 text-primary mb-2" />
              <div className="text-center font-medium">Tech Experts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Become a Partner CTA */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Become a Partner</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our network of educational partners and help shape the future of online learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Partner Program
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}