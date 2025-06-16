import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import EmojiReactions from '@/components/emoji-reactions';
import { PlayCircle, FileText, Book, MessageSquare, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import LearningTip from '@/components/ui/learning-tip';
import EnhancedVideoPlayer from '@/components/video/enhanced-video-player';

interface LessonViewerProps {
  courseId: number;
  lessonId: number | null;
  moduleId: number | null;
  onNavigate?: (direction: 'prev' | 'next') => void;
  isSubscribed?: boolean;
}

export default function LessonViewer({ courseId, lessonId, moduleId, onNavigate, isSubscribed = true }: LessonViewerProps) {
  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current lesson data
  const { data: lesson, isLoading: isLoadingLesson } = useQuery({
    queryKey: [`/api/lessons/${lessonId}`],
    enabled: !!lessonId,
  });

  // Fetch course modules and lessons for navigation
  const { data: modules } = useQuery({
    queryKey: [`/api/courses/${courseId}/modules`],
    enabled: !!courseId,
  });

  // Mark lesson as completed
  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (!lessonId) return null;
      return apiRequest('POST', `/api/lessons/${lessonId}/complete`);
    },
    onSuccess: () => {
      toast({
        title: 'Progress saved',
        description: 'This lesson has been marked as completed.',
      });
      
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}/progress`] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark lesson as completed',
        variant: 'destructive',
      });
    },
  });

  const handleCompleteLesson = () => {
    completeLessonMutation.mutate();
  };

  // Find current lesson index and adjacent lessons for navigation
  const getPrevNextLessons = () => {
    if (!modules || !moduleId || !lessonId) return { prevLesson: null, nextLesson: null };
    
    const currentModuleIndex = modules.findIndex(m => m.id === moduleId);
    if (currentModuleIndex === -1) return { prevLesson: null, nextLesson: null };
    
    const currentModule = modules[currentModuleIndex];
    const lessonIndex = currentModule.lessons?.findIndex(l => l.id === lessonId) || -1;
    
    let prevLesson = null;
    let nextLesson = null;
    
    // Previous lesson in same module
    if (lessonIndex > 0 && currentModule.lessons) {
      prevLesson = {
        id: currentModule.lessons[lessonIndex - 1].id,
        moduleId: moduleId
      };
    } 
    // Previous lesson in previous module
    else if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      if (prevModule.lessons && prevModule.lessons.length > 0) {
        prevLesson = {
          id: prevModule.lessons[prevModule.lessons.length - 1].id,
          moduleId: prevModule.id
        };
      }
    }
    
    // Next lesson in same module
    if (currentModule.lessons && lessonIndex < currentModule.lessons.length - 1) {
      nextLesson = {
        id: currentModule.lessons[lessonIndex + 1].id,
        moduleId: moduleId
      };
    } 
    // Next lesson in next module
    else if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      if (nextModule.lessons && nextModule.lessons.length > 0) {
        nextLesson = {
          id: nextModule.lessons[0].id,
          moduleId: nextModule.id
        };
      }
    }
    
    return { prevLesson, nextLesson };
  };

  const { prevLesson, nextLesson } = getPrevNextLessons();

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (onNavigate) {
      onNavigate(direction);
    }
  };

  if (!lessonId) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-6">
          <div className="mb-4">
            <Book className="w-12 h-12 mx-auto text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Select a lesson</h3>
          <p className="text-muted-foreground">
            Choose a lesson from the course content to start learning.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingLesson) {
    return (
      <Card className="h-full">
        <CardHeader className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lesson) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-6">
          <h3 className="text-xl font-medium mb-2">Lesson not found</h3>
          <p className="text-muted-foreground">
            The requested lesson could not be found or is not available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {lesson.type === 'video' ? (
              <PlayCircle className="h-5 w-5 mr-2 text-primary" />
            ) : (
              <FileText className="h-5 w-5 mr-2 text-primary" />
            )}
            <CardTitle>{lesson.title}</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompleteLesson}
            disabled={completeLessonMutation.isPending}
            className="ml-auto"
          >
            {completeLessonMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Mark as completed
          </Button>
        </div>
      </CardHeader>
      <Tabs defaultValue="content" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>
        </div>
        
        <Separator className="my-2" />
        
        <CardContent className="flex-1 overflow-auto pt-4">
          <TabsContent value="content" className="mt-0 h-full">
            {lesson.type === 'video' ? (
              <div className="aspect-video mb-4 rounded-md relative overflow-hidden">
                {lesson.videoUrl ? (
                  <EnhancedVideoPlayer
                    videoUrl={lesson.videoUrl}
                    title={lesson.title || ''}
                    poster={lesson.thumbnailUrl}
                    requiresSubscription={true}
                    isSubscribed={isSubscribed}
                    tracks={lesson.captionTracks || []}
                    onComplete={() => {
                      if (isSubscribed) {
                        completeLessonMutation.mutate();
                      }
                    }}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="p-6 text-center bg-black rounded-md text-white h-full flex flex-col items-center justify-center">
                    <PlayCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Video not available</p>
                  </div>
                )}
              </div>
            ) : null}
            
            <div className="prose prose-sm max-w-none animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h2>Lesson Description</h2>
              <p>{lesson.description}</p>
              
              {lesson.content && (
                <>
                  {isSubscribed ? (
                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                  ) : (
                    <>
                      <div dangerouslySetInnerHTML={{ 
                        __html: lesson.content.substring(0, 300) + '...' 
                      }} />
                      <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-md animate-fade-in">
                        <p className="text-sm font-medium">
                          Subscribe to access the full lesson content and materials.
                        </p>
                        <Button 
                          className="mt-2 bg-primary hover:bg-primary-dark text-white animate-pulse-on-hover"
                          size="sm"
                          onClick={() => window.location.href = '/subscriptions'}
                        >
                          View Subscription Plans
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
              
              {/* Contextual learning tips */}
              <div className="mt-8 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <LearningTip context="lesson_viewer" compact={true} />
              </div>
              
              {/* Add emoji reactions for lesson feedback */}
              <div className="mt-8 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h3 className="text-sm font-medium">How did you find this lesson?</h3>
                  <EmojiReactions contentType="lesson" contentId={lessonId || 0} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="materials" className="mt-0 h-full">
            {lesson.materials && lesson.materials.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Downloadable Materials</h3>
                <div className="grid gap-2">
                  {lesson.materials.map((material, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-xs text-muted-foreground">{material.type} • {material.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={material.url} download target="_blank" rel="noreferrer">
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-1">No materials available</h3>
                <p className="text-muted-foreground">
                  There are no downloadable materials for this lesson.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="discussion" className="mt-0 h-full">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-1">Discussion</h3>
              <p className="text-muted-foreground mb-4">
                Discuss this lesson with other students and the instructor.
              </p>
              <Button>Join Discussion</Button>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation('prev')}
          disabled={!prevLesson}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Lesson
        </Button>
        
        <Button
          variant="outline" 
          size="sm"
          onClick={() => handleNavigation('next')}
          disabled={!nextLesson}
        >
          Next Lesson
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}