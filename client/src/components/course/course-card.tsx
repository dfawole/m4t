import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  categoryColor?: string;
  progress?: {
    completed: number;
    total: number;
  };
  rating?: {
    value: number;
    count: number;
  };
  duration?: number;
  inProgress?: boolean;
}

export default function CourseCard({
  id,
  title,
  description,
  coverImage,
  category,
  categoryColor = "bg-primary-light bg-opacity-10 text-primary",
  progress,
  rating,
  duration,
  inProgress = false
}: CourseCardProps) {
  // Calculate progress percentage with safety checks to prevent NaN
  const progressPercentage = (progress && progress.total > 0) 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;
  
  return (
    <Card className="overflow-hidden shadow h-full flex flex-col">
      <img 
        className={cn(
          "w-full object-cover",
          inProgress ? "h-48" : "h-36"
        )} 
        src={coverImage} 
        alt={`${title} course image`} 
      />
      
      <CardContent className={cn("p-5 flex-grow", inProgress ? "p-5" : "p-4")}>
        <Badge className={categoryColor}>
          {category}
        </Badge>
        
        <h3 className="text-lg font-medium text-neutral-darker mb-1 mt-2">
          {title}
        </h3>
        
        {inProgress ? (
          <p className="text-sm text-neutral-medium mb-3">
            {description}
          </p>
        ) : (
          <div className="flex items-center mt-1 mb-2">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: Math.floor(rating?.value || 0) }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              
              {rating?.value && !Number.isInteger(rating.value) && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              
              {Array.from({ length: 5 - Math.ceil(rating?.value || 0) }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.519 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
              
              <span className="text-xs text-neutral-medium ml-1">
                ({rating?.count || 0})
              </span>
            </div>
          </div>
        )}
        
        {progress && (
          <div className="mt-2">
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-primary">
                    {progressPercentage}% Complete
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-neutral-medium">
                    {progress.completed}/{progress.total} modules
                  </span>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2 mt-1 bg-neutral-light" />
            </div>
          </div>
        )}
        
        {!inProgress && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold text-neutral-darker">
              {duration} hrs total
            </span>
            <div 
              className="text-sm font-medium text-primary hover:text-primary-dark cursor-pointer"
              onClick={() => window.location.href = `/courses/${id}`}
            >
              Details
            </div>
          </div>
        )}
      </CardContent>
      
      {inProgress && (
        <CardFooter className="px-5 py-3 bg-neutral-lighter flex justify-end">
          <Button onClick={() => window.location.href = `/courses/${id}`}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
