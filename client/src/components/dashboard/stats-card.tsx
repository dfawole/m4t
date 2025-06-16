import { useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  BookOpen, Award, Clock, Calendar,
  GraduationCap, BarChart2, Users
} from 'lucide-react';

interface StatsCardProps {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string | number | React.ReactNode;
  linkText: string;
  linkHref: string;
}

// Map icon strings to Lucide React components
const iconMap: {[key: string]: React.ElementType} = {
  'book-open': BookOpen,
  'certificate': Award,
  'clock': Clock,
  'calendar-check': Calendar,
  'graduation-cap': GraduationCap,
  'award': Award,
  'bar-chart': BarChart2,
  'users': Users
};

export default function StatsCard({ 
  icon, 
  iconBgColor, 
  iconColor,
  title, 
  value, 
  linkText, 
  linkHref 
}: StatsCardProps) {
  const [, setLocation] = useLocation();
  const IconComponent = iconMap[icon] || BookOpen;
  
  return (
    <Card className="overflow-hidden shadow">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={cn(
            "flex-shrink-0 rounded-md p-3",
            iconBgColor
          )}>
            <IconComponent className={cn(
              "h-5 w-5",
              iconColor
            )} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-medium truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-neutral-darker">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-neutral-lighter px-5 py-3">
        <div 
          className="text-sm font-medium text-primary hover:text-primary-dark cursor-pointer"
          onClick={() => window.location.href = linkHref}
        >
          {linkText}
        </div>
      </CardFooter>
    </Card>
  );
}
