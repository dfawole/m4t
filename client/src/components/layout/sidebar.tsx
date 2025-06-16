import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, BookOpen, GraduationCap, Calendar, MessageSquare, User, 
  CreditCard, HelpCircle, BarChart3, Users, FileText, DollarSign, Menu
} from 'lucide-react';

interface SidebarItem {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  divider?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  items: SidebarItem[];
  accountItems: SidebarItem[];
}

// Map icon strings to Lucide React components
const iconMap: Record<string, React.ElementType> = {
  'home': Home,
  'book': BookOpen,
  'clipboard-list': GraduationCap,
  'certificate': GraduationCap,
  'calendar': Calendar,
  'message': MessageSquare,
  'user-gear': User,
  'credit-card': CreditCard,
  'hand-holding-heart': HelpCircle,
  'users-cog': Users,
  'chalkboard-teacher': BookOpen,
  'chart-line': BarChart3,
  'file-chart-line': FileText,
  'money-bill': DollarSign,
  'books': BookOpen,
  'building': Home,
  'users': Users
};

export default function Sidebar({ isOpen, isCollapsed = false, onToggleCollapse, items, accountItems }: SidebarProps) {
  const [location] = useLocation();
  
  return (
    <div 
      id="sidebar" 
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg overflow-y-auto flex flex-col transition-all duration-300`}
    >
      <div className="pt-5 pb-4">
        <div className="px-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              title="Close menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {items.map((item, index) => {
            // Check if current location matches this item's href
            const isActive = location === item.href || item.active;
            // Get the icon component
            const IconComponent = iconMap[item.icon] || Home;
            
            return (
              <div key={item.href}>
                {item.divider && <div className="pt-4 border-t border-neutral-light" />}
                <div 
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
                    isActive 
                      ? "bg-primary-light bg-opacity-10 text-primary" 
                      : "text-neutral-dark hover:bg-neutral-light hover:text-primary"
                  )}
                  onClick={() => window.location.href = item.href}
                >
                  <IconComponent className={cn(
                    "h-5 w-5",
                    !isCollapsed && "mr-3",
                    isActive 
                      ? "text-primary" 
                      : "text-neutral-medium group-hover:text-primary"
                  )} />
                  {!isCollapsed && item.label}
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-neutral-light">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-neutral-medium uppercase tracking-wider">
                Account
              </h3>
            )}
            <div className="mt-3 space-y-1">
              {accountItems.map((item) => {
                // Get the icon component
                const IconComponent = iconMap[item.icon] || User;
                
                return (
                  <div
                    key={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-dark hover:bg-neutral-light hover:text-primary cursor-pointer"
                    onClick={() => window.location.href = item.href}
                  >
                    <IconComponent className={cn(
                      "h-5 w-5 text-neutral-medium group-hover:text-primary",
                      !isCollapsed && "mr-3"
                    )} />
                    {!isCollapsed && item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
