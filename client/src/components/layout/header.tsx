//client/src/components/layout/header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { withScrollToTop } from '@/lib/scroll-utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { UserRole } from '@shared/schema';
import {
  GraduationCap,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Bookmark,
  BarChart3,
  BookOpen,
  Trophy,
  Heart,
  MessageSquare,
  Calendar,
  Award, // Using Award instead of Certificate
  Home,
  Search,
  Info,
  Phone,
  Briefcase,
  FileText,
  HelpCircle,
} from 'lucide-react';

const Header: React.FC = () => {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear authentication cookies
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Clear any local storage
      localStorage.clear();
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout call fails
      window.location.href = '/';
    }
  };

  const navItems = [
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    ...(isAuthenticated ? [{ label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-4 w-4 mr-2" /> }] : []),
    { label: 'Courses', href: '/courses', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { label: 'Compare Plans', href: '/subscription-comparison', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { 
      label: 'About', 
      submenu: [
        { label: 'About Us', href: '/about-us', icon: <Info className="h-4 w-4 mr-2" /> },
        { label: 'Contact', href: '/contact', icon: <Phone className="h-4 w-4 mr-2" /> },
        { label: 'Careers', href: '/careers', icon: <Briefcase className="h-4 w-4 mr-2" /> },
        { label: 'Blog', href: '/blog', icon: <FileText className="h-4 w-4 mr-2" /> },
        { label: 'Press', href: '/press', icon: <FileText className="h-4 w-4 mr-2" /> },
        { label: 'Partners', href: '/partners', icon: <Heart className="h-4 w-4 mr-2" /> },
      ],
      icon: <ChevronDown className="h-4 w-4 ml-1" />
    },
    { 
      label: 'Features', 
      submenu: [
        { label: 'Skill Tree Demo', href: '/course-skill-tree-demo', icon: <Trophy className="h-4 w-4 mr-2" /> },
        { label: 'Interactive Quiz', href: '/interactive-quiz-demo', icon: <HelpCircle className="h-4 w-4 mr-2" /> },
        { label: 'Video Preview', href: '/video-preview-demo', icon: <BookOpen className="h-4 w-4 mr-2" /> },
        { label: 'Gamification', href: '/gamification-dashboard', icon: <Heart className="h-4 w-4 mr-2" /> },
      ],
      icon: <ChevronDown className="h-4 w-4 ml-1" />
    },
  ];

  // Dashboard items for authenticated users
  const dashboardItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { label: 'My Courses', href: '/dashboard/courses', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { label: 'Learning Path', href: '/dashboard/path', icon: <Trophy className="h-4 w-4 mr-2" /> },
    { label: 'Certificates', href: '/dashboard/certificates', icon: <Award className="h-4 w-4 mr-2" /> },
    { label: 'Calendar', href: '/dashboard/calendar', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { label: 'Messages', href: '/dashboard/messages', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];

  // Admin menu
  const adminItems = user?.role === UserRole.INTERNAL_ADMIN ? [
    { label: 'Admin Panel', href: '/admin', icon: <Settings className="h-4 w-4 mr-2" /> },
  ] : user?.role === UserRole.COMPANY_ADMIN ? [
    { label: 'Company Admin', href: '/company-admin', icon: <Settings className="h-4 w-4 mr-2" /> },
  ] : user?.role === UserRole.INSTRUCTOR ? [
    { label: 'Instructor Panel', href: '/instructor', icon: <Settings className="h-4 w-4 mr-2" /> },
  ] : [];

  const isActive = (path: string) => {
    return location === path || location.startsWith(`${path}/`);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" onClick={withScrollToTop()} className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            M4T
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            item.submenu ? (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                    {item.label}
                    {item.icon}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {item.submenu.map((subItem, subIndex) => (
                    <DropdownMenuItem key={subIndex} asChild>
                      <Link 
                        href={subItem.href} 
                        onClick={withScrollToTop()}
                        className="flex items-center cursor-pointer w-full"
                      >
                        {subItem.icon}
                        {subItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={index}
                href={item.href}
                onClick={withScrollToTop()}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href) 
                    ? 'text-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Right side: User menu or login/register */}
        <div className="flex items-center gap-4">
          {/* Search button */}
          <button 
            className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* User menu or login */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                      : user?.email 
                        ? user.email.charAt(0).toUpperCase()
                        : 'U'
                    }
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.email || 'My Account'}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    href="/profile" 
                    onClick={withScrollToTop()}
                    className="flex items-center cursor-pointer w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/settings" 
                    onClick={withScrollToTop()}
                    className="flex items-center cursor-pointer w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">M4T</span>
                </SheetTitle>
                <SheetDescription>
                  Learning platform for modern professionals
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {/* Main navigation */}
                {navItems.map((item, index) => (
                  item.submenu ? (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-gray-500">{item.label}</div>
                      <div className="ml-4 flex flex-col gap-3">
                        {item.submenu.map((subItem, subIndex) => (
                          <SheetClose key={subIndex} asChild>
                            <Link 
                              href={subItem.href} 
                              onClick={withScrollToTop()}
                              className="flex items-center text-gray-700 hover:text-primary transition-colors"
                            >
                              {subItem.icon}
                              <span>{subItem.label}</span>
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <SheetClose key={index} asChild>
                      <Link
                        href={item.href}
                        onClick={withScrollToTop()}
                        className={`flex items-center text-sm font-medium transition-colors ${
                          isActive(item.href) 
                            ? 'text-primary' 
                            : 'text-gray-700 hover:text-primary'
                        }`}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                      </Link>
                    </SheetClose>
                  )
                ))}

                {/* User related links if authenticated */}
                {isAuthenticated && (
                  <>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="text-sm font-medium text-gray-500">Dashboard</div>
                    <div className="ml-4 flex flex-col gap-3">
                      {dashboardItems.map((item, index) => (
                        <SheetClose key={index} asChild>
                          <Link 
                            href={item.href} 
                            onClick={withScrollToTop()}
                            className="flex items-center text-gray-700 hover:text-primary transition-colors"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    {/* Admin items if applicable */}
                    {adminItems.length > 0 && (
                      <>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <div className="text-sm font-medium text-gray-500">Admin</div>
                        <div className="ml-4 flex flex-col gap-3">
                          {adminItems.map((item, index) => (
                            <SheetClose key={index} asChild>
                              <Link 
                                href={item.href} 
                                onClick={withScrollToTop()}
                                className="flex items-center text-gray-700 hover:text-primary transition-colors"
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="h-px bg-gray-200 my-2"></div>
                    <SheetClose asChild>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </button>
                    </SheetClose>
                  </>
                )}

                {/* Login/Register for non-authenticated users */}
                {!isAuthenticated && (
                  <>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Link 
                          href="/login" 
                          onClick={withScrollToTop()}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full">
                            Log in
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/register" 
                          onClick={withScrollToTop()}
                          className="w-full"
                        >
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            Sign up
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
