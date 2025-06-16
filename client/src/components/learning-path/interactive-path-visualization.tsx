import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, Clock, BookOpen, Target, Award, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

interface Course {
  id: number;
  title: string;
  description: string;
  duration: number;
  level: string;
  isCompleted?: boolean;
  progress?: number;
}

interface LearningPath {
  id: number;
  name: string;
  description: string;
  goalDescription: string;
  estimatedHours: number;
  targetSkillLevel: string;
  targetCompletionDate: string;
  progress: number;
  enrolledAt?: string;
  courses: Course[];
}

interface InteractivePathVisualizationProps {
  learningPaths: LearningPath[];
  onCourseClick: (courseId: number) => void;
}

export default function InteractivePathVisualization({ 
  learningPaths, 
  onCourseClick 
}: InteractivePathVisualizationProps) {
  const [_, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePathIndex, setActivePathIndex] = useState(0);
  
  // Get the active path
  const activePath = learningPaths[activePathIndex] || null;
  
  if (!activePath || learningPaths.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Learning Journey</CardTitle>
          <CardDescription>Visualize your progress through your learning paths</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Target className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Active Learning Paths</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't enrolled in any learning paths yet. Explore available paths to start your learning journey.
          </p>
          <Button onClick={() => setLocation('/learning-path')}>
            Explore Learning Paths
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Auto-scroll to current course
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = container.querySelector('[data-active="true"]');
      
      if (activeElement) {
        const containerWidth = container.offsetWidth;
        const elementOffset = (activeElement as HTMLElement).offsetLeft;
        const elementWidth = (activeElement as HTMLElement).offsetWidth;
        
        // Center the element in the container
        container.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
      }
    }
  }, [activePath, activePathIndex]);

  // Find the first incomplete course
  const currentCourseIndex = activePath.courses.findIndex(course => !course.isCompleted);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Learning Journey</CardTitle>
            <CardDescription>Visualize your progress through your learning paths</CardDescription>
          </div>
          
          {learningPaths.length > 1 && (
            <div className="flex gap-2">
              {learningPaths.map((path, index) => (
                <Badge 
                  key={path.id}
                  variant={activePathIndex === index ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActivePathIndex(index)}
                >
                  {path.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-medium">{activePath.name}</span>
            </div>
            <Badge variant="outline" className="bg-primary/5">
              {activePath.progress}% Complete
            </Badge>
          </div>
          <Progress value={activePath.progress} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Started {new Date(activePath.enrolledAt || Date.now()).toLocaleDateString()}</span>
            <span>Target: {new Date(activePath.targetCompletionDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Interactive Path Visualization */}
        <div className="relative mb-8 overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-1 overflow-x-auto pb-4 pt-2 px-2 snap-x"
            style={{ scrollBehavior: 'smooth' }}
          >
            {activePath.courses.map((course, index) => {
              const isCompleted = course.isCompleted;
              const isCurrent = index === currentCourseIndex;
              const isLocked = !isCompleted && index > currentCourseIndex;
              
              return (
                <React.Fragment key={course.id}>
                  {/* Course Node */}
                  <div 
                    className={`
                      flex-shrink-0 flex flex-col items-center cursor-pointer transition-all duration-200
                      ${isCompleted ? 'opacity-90' : isCurrent ? 'opacity-100 scale-110' : 'opacity-70'}
                      ${isLocked ? 'cursor-not-allowed' : 'hover:scale-105'}
                    `}
                    onClick={() => !isLocked && onCourseClick(course.id)}
                    data-active={isCurrent}
                  >
                    <div 
                      className={`
                        relative rounded-full w-14 h-14 flex items-center justify-center mb-2
                        ${isCompleted ? 'bg-green-100 text-green-600 border-green-200' : 
                          isCurrent ? 'bg-primary/10 text-primary border-primary/20' : 
                          'bg-gray-100 text-gray-400 border-gray-200'}
                        ${isLocked ? 'bg-gray-100' : ''}
                        border-2 shadow-sm
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-7 w-7" />
                      ) : isLocked ? (
                        <Lock className="h-6 w-6" />
                      ) : (
                        <BookOpen className="h-6 w-6" />
                      )}
                      
                      {/* Course Progress Circle */}
                      {!isCompleted && !isLocked && course.progress !== undefined && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="26"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 26}
                            strokeDashoffset={2 * Math.PI * 26 * (1 - course.progress / 100)}
                            className="text-primary/30"
                          />
                        </svg>
                      )}
                    </div>
                    
                    <div className="text-center w-24">
                      <p className={`
                        text-xs font-medium truncate
                        ${isCompleted ? 'text-green-600' : 
                          isCurrent ? 'text-primary' : 
                          'text-muted-foreground'}
                      `}>
                        {course.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {course.duration} hrs
                      </p>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {index < activePath.courses.length - 1 && (
                    <div className={`
                      flex-shrink-0 w-8 h-0.5 mt-7
                      ${index < currentCourseIndex ? 'bg-green-500' : 
                        index === currentCourseIndex ? 'bg-primary/50' : 
                        'bg-gray-200'}
                    `} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Gradient overlay for scroll indication */}
          <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
        
        {/* Current Course Details */}
        {currentCourseIndex >= 0 && currentCourseIndex < activePath.courses.length && (
          <div className="bg-muted/30 rounded-lg p-4 border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-primary">
                  {activePath.courses[currentCourseIndex].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activePath.courses[currentCourseIndex].description}
                </p>
              </div>
              <Badge variant="outline" className="bg-background">
                {activePath.courses[currentCourseIndex].level}
              </Badge>
            </div>
            
            {activePath.courses[currentCourseIndex].progress !== undefined && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Course Progress</span>
                  <span>{activePath.courses[currentCourseIndex].progress}%</span>
                </div>
                <Progress 
                  value={activePath.courses[currentCourseIndex].progress} 
                  className="h-2" 
                />
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{activePath.courses[currentCourseIndex].duration} hours</span>
              </div>
              
              <Button 
                size="sm" 
                onClick={() => onCourseClick(activePath.courses[currentCourseIndex].id)}
                className="gap-1"
              >
                Continue Learning
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}