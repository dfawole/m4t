import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Trophy,
  Heart
} from 'lucide-react';

const EnhancedFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top section with newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Join our learning community</h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates, learning tips, and special offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-medium"
              >
                Subscribe
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-center lg:items-end">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 mr-2 text-primary" />
              <span className="font-bold text-2xl">M4T</span>
            </div>
            <p className="text-gray-300 mb-4 lg:text-right">
              Empowering professionals with the skills they need to succeed in today's competitive workplace.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700 my-8" />

        {/* Main footer links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Platform */}
          <div>
            <h3 className="font-bold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/courses">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    Courses
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/course-skill-tree-demo">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <Trophy className="h-4 w-4 mr-2 text-primary" />
                    Skill Tree
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/gamification-dashboard">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <Heart className="h-4 w-4 mr-2 text-primary" />
                    Gamification
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/subscriptions">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    Subscriptions
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">About Us</div>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">Careers</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">Contact Us</div>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">Partners</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">Terms of Service</div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">Privacy Policy</div>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">Cookie Policy</div>
                </Link>
              </li>
              <li>
                <Link href="/accessibility">
                  <div className="text-gray-300 hover:text-white hover:underline cursor-pointer">Accessibility</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span className="text-gray-300">
                  123 Learning Ave, Suite 400<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span className="text-gray-300">support@M4T.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} M4T. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Sitemap</a>
              <span>|</span>
              <a href="#" className="hover:text-white">FAQ</a>
              <span>|</span>
              <a href="#" className="hover:text-white">Support</a>
              <span>|</span>
              <a href="#" className="hover:text-white">Investors</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
