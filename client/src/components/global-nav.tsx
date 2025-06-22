import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, Award, User, Building2, Home, BookOpen, Trophy, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const routes = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: User },
  { name: 'Learning Path', path: '/learning-path', icon: BookOpen },
  { name: 'JWT Login', path: '/jwt-login', icon: Shield },
  { name: 'Login', path: '/login', icon: User },
  { name: 'Gamification', path: '/gamification-dashboard', icon: Trophy },
  { name: 'Instructor', path: '/instructor-dashboard', icon: Award },
  { name: 'Admin', path: '/admin-dashboard', icon: Shield },
  { name: 'Company', path: '/company-dashboard', icon: Building2 },
];

export function GlobalNav() {
  const [location] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in with JWT
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem('jwt_token');
    // Reload page
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Link href="/">
          <Button variant="link" className="font-bold">
            E-Learning Platform
          </Button>
        </Link>
        <div className="flex items-center space-x-1 ml-6 overflow-x-auto pb-1">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = location === route.path;
            return (
              <Link key={route.path} href={route.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9",
                    isActive && "bg-muted font-medium"
                  )}
                >
                  <Icon className="mr-1 h-4 w-4" />
                  {route.name}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Logout button - always visible */}
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
            onClick={handleLogout}
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}