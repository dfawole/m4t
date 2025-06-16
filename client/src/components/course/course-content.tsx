import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { PlayCircle, FileText, CheckCircle, Lock } from 'lucide-react';

interface CourseContentProps {
  courseId: number;
  onSelectLesson: (lessonId: number, moduleId: number) => void;
}

export default function CourseContent({ courseId, onSelectLesson }: CourseContentProps) {
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  // Fetch course modules and lessons
  const { data: modules, isLoading: isLoadingModules } = useQuery({
    queryKey: [`/api/courses/${courseId}/modules`],
    enabled: !!courseId,
  });

  // Fetch user progress for this course
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: [`/api/courses/${courseId}/progress`],
  });

  const handleLessonSelect = (lessonId: number, moduleId: number) => {
    setActiveLessonId(lessonId);
    setActiveModuleId(moduleId);
    onSelectLesson(lessonId, moduleId);
  };

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: number) => {
    if (!progress || !progress.completedLessons) return false;
    return progress.completedLessons.includes(lessonId);
  };

  // Calculate module completion percentage
  const getModuleProgress = (moduleId: number) => {
    if (!modules || !progress || !progress.completedLessons) return 0;
    
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return 0;
    
    const moduleLessons = modules[moduleIndex].lessons || [];
    if (!moduleLessons.length) return 0;
    
    const completedCount = moduleLessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length;
    
    return Math.round((completedCount / moduleLessons.length) * 100);
  };

  // Check if a module is locked (based on prerequisites, enrollment, etc.)
  const isModuleLocked = (moduleIndex: number) => {
    if (!modules || !progress) return true;
    if (moduleIndex === 0) return false; // First module is always unlocked
    
    // Logic for unlocking modules (e.g., based on previous module completion)
    const previousModule = modules[moduleIndex - 1];
    if (!previousModule || !previousModule.lessons) return true;
    
    const previousModuleLessons = previousModule.lessons;
    const completedLessonsInPreviousModule = previousModuleLessons.filter(
      lesson => progress.completedLessons && progress.completedLessons.includes(lesson.id)
    ).length;
    
    // Unlock if 70% of previous module is completed
    return completedLessonsInPreviousModule < (previousModuleLessons.length * 0.7);
  };

  if (isLoadingModules || isLoadingProgress) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-100 rounded animate-pulse ml-4"></div>
            <div className="h-8 bg-gray-100 rounded animate-pulse ml-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">No content available</h3>
        <p className="text-muted-foreground">This course doesn't have any modules yet.</p>
      </div>
    );
  }

  return (
    <div className="course-content">
      <div className="overall-progress mb-6 px-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Course Progress</span>
          <span className="text-sm font-medium">
            {progress?.completed || 0}/{progress?.total || 0} lessons
          </span>
        </div>
        <Progress 
          value={progress ? (progress.completed / progress.total) * 100 : 0} 
          className="h-2" 
        />
      </div>

      <Accordion 
        type="single" 
        collapsible 
        className="w-full"
        defaultValue={modules[0]?.id.toString()}
      >
        {modules.map((module, moduleIndex) => {
          const moduleProgress = getModuleProgress(module.id);
          const isLocked = isModuleLocked(moduleIndex);
          
          return (
            <AccordionItem 
              key={module.id} 
              value={module.id.toString()}
              className={isLocked ? 'opacity-70' : ''}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center w-full">
                    <span className="font-medium">
                      Module {moduleIndex + 1}: {module.title}
                    </span>
                    {isLocked && (
                      <Lock className="ml-2 h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full mt-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{module.lessons?.length || 0} lessons</span>
                      <span className="mx-2">•</span>
                      <span>{module.duration || 0} mins</span>
                    </div>
                    <span className="text-xs font-medium">{moduleProgress}% complete</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 py-2">
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const isCompleted = isLessonCompleted(lesson.id);
                    
                    return (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className={`w-full justify-start px-4 py-2 h-auto text-left ${
                          activeLessonId === lesson.id ? 'bg-muted' : ''
                        } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => !isLocked && handleLessonSelect(lesson.id, module.id)}
                        disabled={isLocked}
                      >
                        <div className="flex items-center w-full">
                          <div className="mr-3">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : lesson.type === 'video' ? (
                              <PlayCircle className="h-5 w-5 text-primary" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-sm">
                              {lessonIndex + 1}. {lesson.title}
                            </span>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration} mins
                              </span>
                              {lesson.type && (
                                <Badge variant="outline" className="ml-2 py-0 h-5 text-xs">
                                  {lesson.type}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}