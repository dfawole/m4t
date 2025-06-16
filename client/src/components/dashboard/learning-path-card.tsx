import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { BookOpen, Compass, GitBranch, Map, CheckCircle, Circle, ChevronRight } from 'lucide-react';

interface LearningPathCardProps {
  enrollments?: any[];
  courseId?: number;
  isLoading?: boolean;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  enrollments = [],
  courseId,
  isLoading = false
}) => {
  const [, setLocation] = useLocation();
  
  // Calculate overall progress
  const totalLessons = enrollments?.reduce((total: number, enrollment: any) => 
    total + (enrollment.progress?.total || 0), 0) || 0;
    
  const completedLessons = enrollments?.reduce((total: number, enrollment: any) => 
    total + (enrollment.progress?.completed || 0), 0) || 0;
    
  const overallProgress = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;
  
  if (isLoading) {
    return (
      <Card className="w-full min-h-[280px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Learning Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-36 bg-gray-200 rounded-lg"></div>
            <div className="flex justify-center items-center space-x-3">
              <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
              <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Your Learning Path</CardTitle>
        <div 
          onClick={() => setLocation("/learning-path")} 
          className="cursor-pointer"
        >
          <Badge variant="outline" className="hover:bg-primary/5">
            Explore Full Path
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {enrollments && enrollments.length > 0 ? (
          <div className="space-y-4">
            {/* Overall Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{completedLessons} of {totalLessons} lessons completed</span>
                <span>{enrollments.length} courses</span>
              </div>
            </div>
            
            {/* Course Cards - limit to 3 for dashboard */}
            <div className="space-y-3">
              {enrollments.slice(0, 3).map((enrollment: any) => {
                const progress = enrollment.progress?.completed && enrollment.progress?.total
                  ? Math.round((enrollment.progress.completed / enrollment.progress.total) * 100)
                  : 0;
                const isCompleted = progress >= 100;
                
                return (
                  <div 
                    key={enrollment.enrollment?.id || enrollment.course?.id} 
                    className="p-2 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setLocation(`/courses/${enrollment.course?.id}`)}
                  >
                    <div className="flex items-start gap-2">
                      {isCompleted ? 
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> : 
                        <Circle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      }
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{enrollment.course?.title}</span>
                          <Badge variant="outline" className="text-xs">{enrollment.course?.level}</Badge>
                        </div>
                        <Progress value={progress} className="h-1 mt-1.5 mb-1" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progress}% complete</span>
                          <span>{enrollment.progress?.completed || 0}/{enrollment.progress?.total || 0} lessons</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {enrollments.length > 3 && (
                <div className="text-center text-sm text-muted-foreground">
                  + {enrollments.length - 3} more courses
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center p-4 text-center">
            <Map className="w-12 h-12 text-primary/30 mb-3" />
            <p className="text-muted-foreground mb-2">No courses in your learning path yet</p>
            <p className="text-sm text-muted-foreground">Enroll in courses to build your personalized learning journey</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-4 pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5"
          onClick={() => setLocation(courseId ? `/courses/${courseId}` : "/courses")}
        >
          <GitBranch className="h-4 w-4" />
          View Skill Tree
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5"
          onClick={() => setLocation("/personalized-learning")}
        >
          <Compass className="h-4 w-4" />
          Find Courses
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningPathCard;