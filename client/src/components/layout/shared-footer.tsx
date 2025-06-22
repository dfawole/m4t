import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Trophy,
  Heart
} from 'lucide-react';

const SharedFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-dark to-primary/90 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Top section with newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
          <div>
            <h3 className="text-lg font-bold mb-3">Join our learning community</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get the latest updates, learning tips, and special offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border-white/20 text-white placeholder-gray-300 text-sm h-9"
              />
              <Button 
                className="bg-white text-primary hover:bg-white/90 font-medium h-9"
                size="sm"
              >
                Subscribe
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-center lg:items-end">
            <div className="flex items-center mb-3">
              <GraduationCap className="h-5 w-5 mr-2 text-white" />
              <span className="font-bold text-xl">M4T</span>
            </div>
            <p className="text-gray-300 mb-3 lg:text-right text-sm">
              Empowering professionals with the skills they need to succeed in today's competitive workplace.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 p-1.5 rounded-full hover:bg-white/25 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/10 p-1.5 rounded-full hover:bg-white/25 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/10 p-1.5 rounded-full hover:bg-white/25 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/10 p-1.5 rounded-full hover:bg-white/25 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/10 p-1.5 rounded-full hover:bg-white/25 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 my-6" />

        {/* Main footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm">
          {/* Column 1 - Platform */}
          <div>
            <h4 className="font-bold text-base mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                    Courses
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/course-skill-tree-demo">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <Trophy className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                    Skill Tree
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/gamification-dashboard">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <Heart className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                    Gamification
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/subscriptions">
                  <div className="text-gray-300 hover:text-white hover:underline flex items-center cursor-pointer">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                    Subscriptions
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h4 className="font-bold text-base mb-3">Company</h4>
            <ul className="space-y-2">
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
            <h4 className="font-bold text-base mb-3">Legal</h4>
            <ul className="space-y-2">
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
            <h4 className="font-bold text-base mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-white/70" />
                <span className="text-gray-300">
                  123 Learning Ave, Suite 400<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                <span className="text-gray-300">support@M4T.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-white/20 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs mb-3 md:mb-0">
              © {new Date().getFullYear()} M4T. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
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

export default SharedFooter;
