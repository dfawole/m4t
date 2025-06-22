import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, BookOpen, Play, ChevronRight, ArrowLeft, Star, Award, Brain, Lock } from "lucide-react";
import { ContentLoading } from "@/components/ui/loading-animation";
import { useAuth } from "@/hooks/useAuth";
import EnhancedVideoPlayer from "@/components/video/enhanced-video-player";
import { useToast } from "@/hooks/use-toast";
import { formatDuration } from "@/lib/utils";
import { Course as CourseType} from "@/types/course";
import { User } from "@/types/user";
import { CourseProgress } from "@/types/enrollment";
import { Category } from "@/types/category";


export default function Course() {
  const [_, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

  const { data: course, isLoading: courseLoading } = useQuery<CourseType>({ queryKey: [`/api/courses/${id}`] });

  const { data: categories } = useQuery<Category[]>({ queryKey: ["/api/categories"] });

  const { data: progress, isLoading: progressLoading } = useQuery<CourseProgress>({
    queryKey: [`/api/enrollments/user/course/${id}/progress`],
    enabled: !!isAuthenticated,
  });


   const { data: instructor, error: instructorError } = useQuery<User>({
    queryKey: [`/api/users/${course?.instructorId}`],
    enabled: !!course?.instructorId,
  });
  
    // Debug instructor query
    if (instructorError) {
      console.log("Instructor query error:", instructorError);
    }

  const progressStats = useMemo(() => {
    if (!course || !progress) return { completedLessons: 0, totalLessons: 0, progressPercent: 0 };
    const total = course.modules?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0) || 0;
    const completed = progress.completedLessons?.length || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedLessons: completed, totalLessons: total, progressPercent: percent };
  }, [course, progress]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", description: "Please log in to enroll", variant: "destructive" });
      setLocation("/login");
      return;
    }
      if(!user) {
      toast({
        title: "User not loaded",
        description: "Please try logging in again",
        variant: "destructive"
      });
      setLocation("/login");
      return;
    }

    try {
      const res = await fetch(`/api/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: parseInt(id), userId: user.id }),
      });
      if (res.ok) {
        toast({ title: "Enrolled!", description: "You’re enrolled in the course." });
        setActiveTab("content");
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message || "Enrollment failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Enrollment failed", variant: "destructive" });
    }
  };

  // const handleStartCourse = () => {
  //   if (!course?.modules?.length) return;
  //   if (progress?.currentLessonId) {
  //     for (let m = 0; m < course.modules.length; m++) {
  //       const module = course.modules[m];
  //       const lIndex = module.lessons?.findIndex(l => l.id === progress.currentLessonId);
  //       if (lIndex >= 0) {
  //         setSelectedModuleIndex(m);
  //         setSelectedLessonIndex(lIndex);
  //         setActiveTab("content");
  //         return;
  //       }
  //     }
  //   }
  //   setSelectedModuleIndex(0);
  //   setSelectedLessonIndex(0);
  //   setActiveTab("content");
  // };

  // const getNextLesson = () => {
  //   if (!course || !course.modules || !currentLesson) return null;
  //   let found = false;
  //   for (let m = 0; m < course.modules.length; m++) {
  //     for (let l = 0; l < course.modules[m].lessons?.length || 0; l++) {
  //       const lesson = course.modules[m].lessons[l];
  //       if (found) return { lesson, moduleIndex: m, lessonIndex: l };
  //       if (lesson.id === currentLesson.id) found = true;
  //     }
  //   }
  //   return null;
  // };

     // Get next lesson for auto-advance
  

    // Handle starting or continuing the course
  const handleStartCourse = () => {
    if (course && progress && course.modules && course.modules.length > 0) {
      // If there's a current lesson, go to it
      if (progress.currentLessonId) {
        // Find module and lesson indices
        let foundModuleIndex = -1;
        let foundLessonIndex = -1;
        
        course.modules.forEach((module, moduleIndex) => {
          module.lessons?.forEach((lesson, lessonIndex) => {
            if (lesson.id === progress.currentLessonId) {
              foundModuleIndex = moduleIndex;
              foundLessonIndex = lessonIndex;
            }
          });
        });
        
        if (foundModuleIndex >= 0 && foundLessonIndex >= 0) {
          setSelectedModuleIndex(foundModuleIndex);
          setSelectedLessonIndex(foundLessonIndex);
          setActiveTab("content");
          return;
        }
      }
      
      // Otherwise start from the beginning
      setSelectedModuleIndex(0);
      setSelectedLessonIndex(0);
      setActiveTab("content");
    }
  };
  
  const getNextLesson = () => {
    if (!course || !course.modules) return null;

    let found = false;
    for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
      const module = course.modules[moduleIndex];
      if (module.lessons) {
        for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
          const lesson = module.lessons[lessonIndex];
          if (found) {
            return { lesson, moduleIndex, lessonIndex };
          }
          if (currentLesson && lesson.id === currentLesson.id) {
            found = true;
          }
        }
      }
    }
    return null;  
  };

  const handleLessonClick = (lesson: any, modIdx: number, lesIdx: number) => {
    setSelectedModuleIndex(modIdx);
    setSelectedLessonIndex(lesIdx);
    setTimeout(() => {
      const el = document.querySelector("#video-player-container");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const markLessonComplete = async (lessonId: number | string) => {
    if(!course) return;
    try {
      const res = await fetch(`/api/enrollments/user/course/${id}/lesson/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      if (data.gamification?.pointsEarned)
        toast({ title: "Points Earned!", description: `+${data.gamification.pointsEarned} points` });
      if (data.gamification?.badgesEarned?.length)
        toast({ title: "Badge!", description: data.gamification.badgesEarned[0].name });
      if (data.gamification?.challengesCompleted?.length)
        toast({ title: "Challenge Complete!", description: data.gamification.challengesCompleted[0].name });
      const next = getNextLesson();
      if (next) handleLessonClick(next.lesson, next.moduleIndex, next.lessonIndex);
      else toast({ title: "Course Completed!", description: "🎉 You've completed the course!" });
    } catch {
      toast({ title: "Error", description: "Could not mark lesson complete", variant: "destructive" });
    }
  };

  const currentLesson = useMemo(() => {
    if (selectedModuleIndex == null || selectedLessonIndex == null || !course?.modules) return null;
    return course.modules[selectedModuleIndex]?.lessons?.[selectedLessonIndex] || null;
  }, [course, selectedModuleIndex, selectedLessonIndex]);

  const isLessonCompleted = (id: number | string) => {
    return progress?.completedLessons?.includes(id);
  };

  const getCategoryColor = (id: number) => {
    const colors: Record<number, string> = {
      1: "bg-primary-light bg-opacity-10 text-primary",
      2: "bg-secondary bg-opacity-10 text-secondary",
      3: "bg-accent bg-opacity-10 text-accent",
      4: "bg-success bg-opacity-10 text-success",
    };
    return colors[id] || colors[1];
  };

    if (courseLoading) {
    return (
      <div className="min-h-screen bg-neutral-lighter flex items-center justify-center">
        <ContentLoading />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-neutral-lighter flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-neutral-medium mb-6">The course you're looking for does not exist.</p>
        <Button onClick={() => setLocation("/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-lighter">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-neutral-medium hover:text-neutral-dark"
            onClick={() => setLocation("/courses")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        <div id="video-player-container" className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="aspect-video bg-neutral-dark relative">
            {currentLesson ? (
              <EnhancedVideoPlayer
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                poster={currentLesson.thumbnailUrl || "/images/course-placeholder.jpg"}
                quizQuestions={[]}
                onQuizComplete={() => {}}
                onComplete={() => {
                  if (isAuthenticated && currentLesson) {
                    markLessonComplete(currentLesson.id);
                  }
                }}
                isSubscribed={true}
                requiresSubscription={false}
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={course.coverImage || "/images/course-placeholder.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Select a lesson to start learning</h3>
                    <p className="text-white/80">Choose any lesson from the course modules below</p>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated && progress && (
              <div className="absolute top-4 right-4 bg-white rounded-md p-2 shadow-md">
                <div className="text-sm font-medium mb-1">Course Progress</div>
                <Progress value={progressStats.progressPercent} className="h-2 mb-1" />
                <div className="text-xs text-neutral-medium">
                  {progressStats.completedLessons} of {progressStats.totalLessons} lessons completed
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getCategoryColor(course.categoryId)}>
                    {categories?.find(c => c.id === course.categoryId)?.name || "Course"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.level}
                  </Badge>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-3">{course.title}</h1>

                <p className="text-neutral-medium mb-6">{course.description}</p>

                <div className="flex flex-wrap gap-6 mb-4">
                  <div className="flex items-center gap-1 text-sm text-neutral-dark">
                    <Clock className="h-4 w-4 text-neutral-medium" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-dark">
                    <BookOpen className="h-4 w-4 text-neutral-medium" />
                    <span>{course.modules?.length || 0} modules</span>
                  </div>
                  {typeof course.rating === "number" && course.rating > 0 && (
                    <div className="flex items-center gap-1 text-sm text-neutral-dark">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= course.rating!
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-neutral-light"
                            }`}
                          />
                        ))}
                      </div>
                      <span>{course.rating}/5</span>
                    </div>
                  )}
                </div>

                {instructor && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-light">
                      {instructor.profileImageUrl ? (
                        <img
                          src={instructor.profileImageUrl}
                          alt={`${instructor.firstName} ${instructor.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary text-white font-bold">
                          {instructor.firstName?.[0] || ""}
                          {instructor.lastName?.[0] || ""}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">Instructor</div>
                      <div className="text-neutral-dark">
                        {instructor.firstName} {instructor.lastName}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-auto">
                {isAuthenticated && progress ? (
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleStartCourse}>
                    {progressStats.completedLessons > 0 ? "Continue Course" : "Start Course"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleEnroll}>
                    Enroll in Course
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

              {/* Course Content Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">What You'll Learn</h2>
                {Array.isArray(course.learningOutcomes) ? (
                  <ul className="list-disc list-inside text-neutral-dark space-y-2">
                    {course.learningOutcomes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-medium">No learning outcomes listed.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Prerequisites</h2>
                {Array.isArray(course.prerequisites) ? (
                  <ul className="list-disc list-inside text-neutral-dark space-y-2">
                    {course.prerequisites.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-medium">No prerequisites required.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="mb-4">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{module.title}</h3>
                    <div className="space-y-2">
                      {module.lessons?.map((lesson, lessonIndex) => {
                        const isSelected =
                          selectedModuleIndex === moduleIndex && selectedLessonIndex === lessonIndex;
                        return (
                          <div
                            key={lesson.id}
                            onClick={() =>
                              (isAuthenticated || lesson.preview) &&
                              handleLessonClick(lesson, moduleIndex, lessonIndex)
                            }
                            className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                              isSelected ? "bg-blue-100" : "hover:bg-neutral-light"
                            } ${!isAuthenticated && !lesson.preview ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              <span className="text-sm font-medium">{lesson.title}</span>
                              {lesson.preview && (
                                <Badge variant="outline" className="text-xs ml-2">
                                  Free Preview
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {formatDuration(lesson.duration || 0)}
                              {isLessonCompleted(lesson.id) && (
                                <Check className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-neutral-medium">No modules or lessons found.</p>
            )}
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Resources</h2>
                <p className="text-neutral-medium">No additional resources available for this course.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {currentLesson && isAuthenticated && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-neutral-lighter">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Complete This Lesson</h4>
                <p className="text-sm text-muted-foreground">{currentLesson.content}</p>
              </div>
              <Button
                onClick={() => markLessonComplete(currentLesson.id)}
                disabled={isLessonCompleted(currentLesson.id)}
                variant={isLessonCompleted(currentLesson.id) ? "outline" : "default"}
              >
                {isLessonCompleted(currentLesson.id) ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Completed
                  </>
                ) : (
                  "Mark as Complete"
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


