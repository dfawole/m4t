import { useState, useEffect } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@shared/schema";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebar-toggle');
      
      if (
        sidebar && 
        !sidebar.contains(event.target as Node) && 
        sidebarToggle && 
        !sidebarToggle.contains(event.target as Node)
      ) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate sidebar items based on user role
  let sidebarItems = [
    { href: '/dashboard', icon: 'home', label: 'Overview', active: true },
    { href: '/dashboard/courses', icon: 'book', label: 'My Courses' },
    { href: '/dashboard/path', icon: 'clipboard-list', label: 'Learning Path' },
    { href: '/dashboard/certificates', icon: 'certificate', label: 'Certificates' },
    { href: '/dashboard/calendar', icon: 'calendar', label: 'Calendar' },
    { href: '/dashboard/messages', icon: 'message', label: 'Messages' },
  ];

  const accountItems = [
    { href: '/profile', icon: 'user-gear', label: 'Profile Settings' },
    { href: '/subscriptions', icon: 'credit-card', label: 'Subscription' },
    { href: '/help', icon: 'hand-holding-heart', label: 'Help Center' },
  ];
  
  // Add role-specific sidebar items
  if (user?.role === UserRole.INSTRUCTOR) {
    sidebarItems = [
      ...sidebarItems,
      { href: '/instructor/courses', icon: 'chalkboard-teacher', label: 'My Courses', divider: true },
      { href: '/instructor/students', icon: 'users', label: 'My Students' },
      { href: '/instructor/analytics', icon: 'chart-line', label: 'Analytics' },
    ];
  } else if (user?.role === UserRole.COMPANY_ADMIN) {
    sidebarItems = [
      ...sidebarItems,
      { href: '/company-admin/users', icon: 'users-cog', label: 'Manage Users', divider: true },
      { href: '/company-admin/reports', icon: 'file-chart-line', label: 'Reports' },
      { href: '/company-admin/billing', icon: 'money-bill', label: 'Billing' },
    ];
  } else if (user?.role === UserRole.INTERNAL_ADMIN) {
    sidebarItems = [
      ...sidebarItems,
      { href: '/admin/users', icon: 'users-cog', label: 'Manage Users', divider: true },
      { href: '/admin/courses', icon: 'books', label: 'Manage Courses' },
      { href: '/admin/companies', icon: 'building', label: 'Manage Companies' },
      { href: '/admin/instructors', icon: 'chalkboard-teacher', label: 'Manage Instructors' },
      { href: '/admin/subscriptions', icon: 'money-check', label: 'Subscriptions' },
      { href: '/admin/settings', icon: 'cog', label: 'Platform Settings' },
    ];
  }

  return (
    <div className="min-h-screen bg-neutral-lighter relative">
      {/* Sidebar - overlay when visible */}
      {isSidebarVisible && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarVisible(false)}
          />
          {/* Sidebar */}
          <div className="fixed left-0 top-24 z-50">
            <Sidebar 
              isOpen={true}
              isCollapsed={false}
              onToggleCollapse={() => setIsSidebarVisible(false)}
              items={sidebarItems} 
              accountItems={accountItems}
            />
          </div>
        </>
      )}
      
      {/* Main content area */}
      <div className="flex flex-col w-full">
        {/* Header with hamburger menu */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 mr-3">Dashboard</h1>
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              title="Toggle navigation menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile Nav - only show on small screens */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
