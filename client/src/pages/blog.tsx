import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              M4T Blog
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white text-opacity-90">
              Stay updated with the latest insights, tips, and news in e-learning
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-opacity-30 text-6xl font-bold">
                M4T
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">May 24, 2025</div>
                <h3 className="text-xl font-bold mb-2">The Future of Online Learning in 2025</h3>
                <p className="text-gray-600 mb-4">
                  Explore the latest trends that are shaping the future of e-learning platforms and how M4T is staying ahead of the curve.
                </p>
                <Link href="/blog/future-learning">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read more <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-opacity-30 text-6xl font-bold">
                M4T
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">May 20, 2025</div>
                <h3 className="text-xl font-bold mb-2">5 Ways to Make the Most of Your Learning Path</h3>
                <p className="text-gray-600 mb-4">
                  Practical tips to help you maximize your learning experience and achieve your educational goals faster.
                </p>
                <Link href="/blog/learning-tips">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read more <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-r from-amber-500 to-red-600 flex items-center justify-center text-white text-opacity-30 text-6xl font-bold">
                M4T
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">May 15, 2025</div>
                <h3 className="text-xl font-bold mb-2">How Gamification Is Transforming Education</h3>
                <p className="text-gray-600 mb-4">
                  Discover how gamification elements are increasing engagement and improving learning outcomes for students of all ages.
                </p>
                <Link href="/blog/gamification-education">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read more <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* More blog posts section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-6">More Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* More article items would go here */}
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Personalized Learning: The New Standard</h3>
                <p className="text-gray-600 text-sm mb-3">May 10, 2025</p>
                <Link href="/blog/personalized-learning">
                  <Button variant="outline" size="sm">Read article</Button>
                </Link>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Interactive Content: Engagement Strategies</h3>
                <p className="text-gray-600 text-sm mb-3">May 5, 2025</p>
                <Link href="/blog/interactive-content">
                  <Button variant="outline" size="sm">Read article</Button>
                </Link>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">AI in Education: What's Next?</h3>
                <p className="text-gray-600 text-sm mb-3">April 28, 2025</p>
                <Link href="/blog/ai-education">
                  <Button variant="outline" size="sm">Read article</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Get the latest articles, updates, and learning tips delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-2 border border-gray-300 rounded-md flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
