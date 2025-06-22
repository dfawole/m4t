import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface CourseProgressProps {
  courseId: number;
}

export default function CourseProgress({ courseId }: CourseProgressProps) {
  const { data: progress, isLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}/progress`],
  });

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-4 bg-neutral-200 rounded-full w-full"></div>
        <div className="h-4 bg-neutral-200 rounded-full w-3/4"></div>
      </div>
    );
  }

  // Safe calculation to avoid NaN values
  const completedPercentage = (progress?.completed && progress?.total && progress.total > 0)
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
          <span className="font-medium">Your Progress</span>
        </div>
        <span className="text-sm font-medium">
          {completedPercentage}% complete
        </span>
      </div>
      
      <Progress 
        value={completedPercentage} 
        className="h-2 bg-neutral-200" 
      />

      <p className="mt-2 text-sm text-neutral-medium">
        {progress?.completed || 0} of {progress?.total || 0} lessons completed
      </p>
    </div>
  );
}