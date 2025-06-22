import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Calendar, User } from 'lucide-react';

export default function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', icon: 'home', label: 'Home', IconComponent: Home },
    { path: '/courses', icon: 'book', label: 'Courses', IconComponent: BookOpen },
    { path: '/dashboard/calendar', icon: 'calendar', label: 'Schedule', IconComponent: Calendar },
    { path: '/profile', icon: 'user', label: 'Profile', IconComponent: User }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-neutral-light shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const { IconComponent } = item;
          
          return (
            <div 
              key={item.path}
              onClick={() => window.location.href = item.path}
              className={cn(
                "flex flex-col items-center justify-center p-4 cursor-pointer",
                isActive ? "text-primary" : "text-neutral-medium hover:text-primary"
              )}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
