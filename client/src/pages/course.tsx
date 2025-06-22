//client/src/pages/course.tsx
// import { useState, useMemo } from "react";
// import { useParams, useLocation } from "wouter";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Check, Clock, BookOpen, Play, ChevronRight, ArrowLeft, Star, Award, Brain, Lock } from "lucide-react";
// import { ContentLoading } from "@/components/ui/loading-animation";
// import { useAuth } from "@/hooks/useAuth";
// import EnhancedVideoPlayer from "@/components/video/enhanced-video-player";
// import { useToast } from "@/hooks/use-toast";
// import { formatDuration } from "@/lib/utils";
// import { Course as CourseType} from "@/types/course";
// import { User } from "@/types/user";
// import { CourseProgress } from "@/types/enrollment";
// import { Category } from "@/types/category";


// export default function Course() {
//   const [_, setLocation] = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const { user, isAuthenticated } = useAuth();
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState("overview");
//   const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
//   const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);
  
//   // Fetch the course data
//   const { data: course, isLoading: courseLoading } = useQuery<CourseType>({
//     queryKey: [`/api/courses/${id}`],
//   });
  
//   // Fetch the category data to display the category name
//   const { data: categories } = useQuery<Category[]>({
//     queryKey: ["/api/categories"],
//   });
  
//   // Fetch course progress for authenticated users
//   const { data: progress, isLoading: progressLoading } = useQuery<CourseProgress>({
//     queryKey: [`/api/enrollments/user/course/${id}/progress`],
//     enabled: !!isAuthenticated,
//   });

//   const { data: instructor, error: instructorError } = useQuery<User>({
//   queryKey: [`/api/users/${course?.instructorId}`],
//   enabled: !!course?.instructorId,
// });

//   // Debug instructor query
//   if (instructorError) {
//     console.log("Instructor query error:", instructorError);
//   }
  
//   // Calculate course progress statistics
//   const progressStats = useMemo(() => {
//     if (!course || !progress) return { completedLessons: 0, totalLessons: 0, progressPercent: 0 };
    
//     const totalLessons = course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
//     const completedLessons = progress.completedLessons?.length || 0;
//     const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
//     return { completedLessons, totalLessons, progressPercent };
//   }, [course, progress]);
  
//   // Handle enrollment in the course {existing before moving the logic into subscription}
//   // const handleEnroll = async () => {
//   //   if (!isAuthenticated ) {
//   //     toast({
//   //       title: "Authentication Required",
//   //       description: "Please log in to enroll in this course.",
//   //       variant: "destructive",
//   //     });
//   //     setLocation("/auth");
//   //     return;
//   //   }
   

//   //   if(!user) {
//   //     toast({
//   //       title: "User not loaded",
//   //       description: "Please try logging in again",
//   //       variant: "destructive"
//   //     });
//   //     setLocation("/auth");
//   //     return;
//   //   }

//   //   setLocation("/subscription-comparison");
    
//   //   try {
//   //     const response = await fetch(`/api/enrollments`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ courseId: parseInt(id), userId: user.id }),
//   //     });
      
//   //     if (response.ok) {
//   //       toast({
//   //         title: "Enrollment Successful",
//   //         description: "You have successfully enrolled in this course.",
//   //       });
//   //       // Redirect to first lesson or refresh progress
//   //       setActiveTab("content");
//   //     } else {
//   //       const error = await response.json();
//   //       toast({
//   //         title: "Enrollment Failed",
//   //         description: error.message || "Failed to enroll in course.",
//   //         variant: "destructive",
//   //       });
//   //     }
//   //   } catch (error) {
//   //     toast({
//   //       title: "Enrollment Failed",
//   //       description: "An error occurred while enrolling in the course.",
//   //       variant: "destructive",
//   //     });
//   //   }
//   // };
//   // On the course page
//   const handleEnroll = () => {
//     console.log("Auth check:", {isAuthenticated, user})
//     if (!isAuthenticated || !user) {
//       setLocation("/auth");
//       return;
//     }

//     setLocation(`/subscription-comparison`);
//   };

  
//   // Handle starting or continuing the course
//   const handleStartCourse = () => {
//     if (course && progress && course.modules && course.modules.length > 0) {
//       // If there's a current lesson, go to it
//       if (progress.currentLessonId) {
//         // Find module and lesson indices
//         let foundModuleIndex = -1;
//         let foundLessonIndex = -1;
        
//         course.modules.forEach((module, moduleIndex) => {
//           module.lessons?.forEach((lesson, lessonIndex) => {
//             if (lesson.id === progress.currentLessonId) {
//               foundModuleIndex = moduleIndex;
//               foundLessonIndex = lessonIndex;
//             }
//           });
//         });
        
//         if (foundModuleIndex >= 0 && foundLessonIndex >= 0) {
//           setSelectedModuleIndex(foundModuleIndex);
//           setSelectedLessonIndex(foundLessonIndex);
//           setActiveTab("content");
//           return;
//         }
//       }
      
//       // Otherwise start from the beginning
//       setSelectedModuleIndex(0);
//       setSelectedLessonIndex(0);
//       setActiveTab("content");
//     }
//   };

//   // Get next lesson for auto-advance
//   const getNextLesson = () => {
//   if (!course || !course.modules) return null;

//   let found = false;
//   for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
//     const module = course.modules[moduleIndex];
//     if (module.lessons) {
//       for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
//         const lesson = module.lessons[lessonIndex];
//         if (found) {
//           return { lesson, moduleIndex, lessonIndex };
//         }
//         if (currentLesson && lesson.id === currentLesson.id) {
//           found = true;
//         }
//       }
//     }
//   }
//   return null;
// };


//   // Handle lesson click with scroll functionality
//   const handleLessonClick = (lesson: any, moduleIndex: number, lessonIndex: number) => {
//     console.log("Lesson clicked:", lesson.title, lesson);
//     setSelectedModuleIndex(moduleIndex);
//     setSelectedLessonIndex(lessonIndex);
//     console.log("Setting lesson indexes:", moduleIndex, lessonIndex);
    
//     // Scroll video player into view when lesson is clicked
//     setTimeout(() => {
//       const videoPlayer = document.querySelector('#video-player-container');
//       if (videoPlayer) {
//         videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100);
//   };


//   // Mark a lesson as completed
//   const markLessonComplete = async (lessonId: number | string) => {
//   if (!course) return;

//   try {
//     const response = await fetch(`/api/enrollments/user/course/${id}/lesson/${lessonId}/complete`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (response.ok) {
//       const data = await response.json();

//       if (data.gamification?.pointsEarned) {
//         toast({
//           title: "Points Earned!",
//           description: `You earned ${data.gamification.pointsEarned} points for completing this lesson.`,
//         });
//       }

//       if (data.gamification?.badgesEarned?.length > 0) {
//         toast({
//           title: "Badge Unlocked!",
//           description: `You earned the "${data.gamification.badgesEarned[0].name}" badge.`,
//         });
//       }

//       if (data.gamification?.challengesCompleted?.length > 0) {
//         toast({
//           title: "Challenge Completed!",
//           description: `You completed the "${data.gamification.challengesCompleted[0].name}" challenge.`,
//         });
//       }

//       // Auto-advance logic
//       if (selectedModuleIndex !== null && selectedLessonIndex !== null) {
//         const currentModule = course.modules[selectedModuleIndex];

//         if (currentModule?.lessons && selectedLessonIndex < currentModule.lessons.length - 1) {
//           setSelectedLessonIndex(selectedLessonIndex + 1);
//         } else if (selectedModuleIndex < course.modules.length - 1) {
//           setSelectedModuleIndex(selectedModuleIndex + 1);
//           setSelectedLessonIndex(0);
//         } else {
//           toast({
//             title: "Course Completed!",
//             description: "Congratulations on completing this course!",
//           });
//         }
//       }
//     } else {
//       toast({
//         title: "Error",
//         description: "Failed to mark lesson as complete.",
//         variant: "destructive",
//       });
//     }
//   } catch (error) {
//     toast({
//       title: "Error",
//       description: "An error occurred while updating progress.",
//       variant: "destructive",
//     });
//   }
// };

  
//   // Get the current lesson content
//   const currentLesson = useMemo(() => {
//     if (!course?.modules || selectedModuleIndex === null || selectedLessonIndex === null) {
//       return null;
//     }
    
//     const module = course.modules[selectedModuleIndex];
//     if (!module?.lessons) return null;
    
//     return module.lessons[selectedLessonIndex];
//   }, [course, selectedModuleIndex, selectedLessonIndex]);
  
//   // Check if a specific lesson is completed
//   const isLessonCompleted = (lessonId: number | string) => {
//     if (!progress || !progress.completedLessons) return false;
//     return (progress.completedLessons as Array<string | number>).includes(lessonId);
//   };
  
//   // Determine category color
//   const getCategoryColor = (categoryId: number) => {
//     const colors: Record<number, string> = {
//       1: "bg-primary-light bg-opacity-10 text-primary",
//       2: "bg-secondary bg-opacity-10 text-secondary",
//       3: "bg-accent bg-opacity-10 text-accent",
//       4: "bg-success bg-opacity-10 text-success",
//     };
//     return colors[categoryId] || colors[1];
//   };
  
//   if (courseLoading) {
//     return (
//       <div className="min-h-screen bg-neutral-lighter flex items-center justify-center">
//         <ContentLoading />
//       </div>
//     );
//   }
  
//   if (!course) {
//     return (
//       <div className="min-h-screen bg-neutral-lighter flex items-center justify-center flex-col">
//         <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
//         <p className="text-neutral-medium mb-6">The course you're looking for does not exist.</p>
//         <Button onClick={() => setLocation("/courses")}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Courses
//         </Button>
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen bg-neutral-lighter">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Back button */}
//         <div className="mb-6">
//           <Button
//             variant="ghost"
//             className="flex items-center gap-2 text-neutral-medium hover:text-neutral-dark"
//             onClick={() => setLocation("/courses")}
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Courses
//           </Button>
//         </div>
        
//         {/* Course header */}
//         <div id="video-player-container" className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
//           <div className="aspect-video bg-neutral-dark relative">
//             {currentLesson ? (
//               <div className="w-full h-full">
//                 <EnhancedVideoPlayer 
//                   src={currentLesson.videoUrl}
//                   title={currentLesson.title}
//                   poster={currentLesson.thumbnailUrl || `https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop`}
//                   tracks={[
//                     {
//                       kind: "subtitles",
//                       label: "English",
//                       language: "en",
//                       src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt"
//                     },
//                     {
//                       kind: "subtitles",
//                       label: "Français",
//                       language: "fr",
//                       src: "/captions/sample-french.vtt"
//                     },
//                     {
//                       kind: "subtitles",
//                       label: "Español",
//                       language: "es",
//                       src: "/captions/sample-spanish.vtt"
//                     },
//                     {
//                       kind: "subtitles",
//                       label: "Deutsch",
//                       language: "de",
//                       src: "/captions/sample-german.vtt"
//                     },
//                     {
//                       kind: "subtitles",
//                       label: "中文",
//                       language: "zh",
//                       src: "/captions/sample-chinese.vtt"
//                     },
//                     {
//                       kind: "subtitles",
//                       label: "日本語",
//                       language: "ja",
//                       src: "/captions/sample-japanese.vtt"
//                     }
//                   ]}
//                   quizQuestions={currentLesson?.title === "Introduction to Python Programming" ? [
//                     {
//                       id: "python-q1",
//                       time: 30,
//                       question: "What is Python primarily known for?",
//                       options: [
//                         "Low-level system programming",
//                         "Simple syntax and readability",
//                         "Compiled execution only",
//                         "Hardware-specific operations"
//                       ],
//                       correctAnswer: 1,
//                       explanation: "Python is renowned for its simple, readable syntax that makes it perfect for beginners and data science applications."
//                     },
//                     {
//                       id: "python-q2",
//                       time: 60,
//                       question: "Which of these is a popular Python library for data analysis?",
//                       options: [
//                         "React",
//                         "Pandas",
//                         "Angular",
//                         "jQuery"
//                       ],
//                       correctAnswer: 1,
//                       explanation: "Pandas is one of the most popular Python libraries for data manipulation and analysis, offering powerful data structures like DataFrames."
//                     }
//                   ] : []}
//                   onQuizComplete={(questionId, isCorrect, timeTaken) => {
//                     console.log('Quiz completed:', { questionId, isCorrect, timeTaken });
//                     // Track quiz results for analytics
//                     if (isCorrect) {
//                       toast({
//                         title: "Correct Answer!",
//                         description: "Great job! You're learning well.",
//                       });
//                     }
//                   }}
//                   isSubscribed={true}
//                   requiresSubscription={false}
//                   className="aspect-video w-full"
//                   onComplete={() => {
//                     // Auto-mark lesson as complete when video ends
//                     if (isAuthenticated && currentLesson) {
//                       markLessonComplete(currentLesson.id);
                      
//                       // Auto-advance to next lesson after 2 seconds
//                       setTimeout(() => {
//                         const nextLesson = getNextLesson();
//                         if (nextLesson) {
//                           handleLessonClick(nextLesson.lesson, nextLesson.moduleIndex, nextLesson.lessonIndex);
//                         }
//                       }, 2000);
//                     }
//                   }}
//                 />

//               </div>
//             ) : (
//               <div className="relative w-full h-full">
//                 <img
//                   src={course.coverImage || '/images/course-placeholder.jpg'}
//                   alt={course.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                   <div className="text-center text-white">
//                     <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
//                       <Play className="h-8 w-8 text-white ml-1" />
//                     </div>
//                     <h3 className="text-xl font-semibold mb-2">Select a lesson to start learning</h3>
//                     <p className="text-white/80">Choose any lesson from the course modules below</p>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {isAuthenticated && progress && (
//               <div className="absolute top-4 right-4 bg-white rounded-md p-2 shadow-md">
//                 <div className="text-sm font-medium mb-1">Course Progress</div>
//                 <Progress value={progressStats.progressPercent} className="h-2 mb-1" />
//                 <div className="text-xs text-neutral-medium">
//                   {progressStats.completedLessons} of {progressStats.totalLessons} lessons completed
//                 </div>
//               </div>
//             )}

//           </div>
          
//           <div className="p-6">
//             <div className="flex flex-wrap justify-between gap-4">
//               <div className="max-w-3xl">
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   <Badge className={getCategoryColor(course.categoryId)}>
//                     {categories?.find(c => c.id === course.categoryId)?.name || 'Course'}
//                   </Badge>
//                   <Badge variant="outline" className="flex items-center gap-1">
//                     <BookOpen className="h-3 w-3" />
//                     {course.level}
//                   </Badge>
//                 </div>
                
//                 <h1 className="text-2xl md:text-3xl font-bold mb-3">
//                   {course.title}
//                 </h1>
                
//                 <p className="text-neutral-medium mb-6">
//                   {course.description}
//                 </p>
                
//                 <div className="flex flex-wrap gap-6 mb-4">
//                   <div className="flex items-center gap-1 text-sm text-neutral-dark">
//                     <Clock className="h-4 w-4 text-neutral-medium" />
//                     <span>{formatDuration(course.duration)}</span>
//                   </div>
                  
//                   <div className="flex items-center gap-1 text-sm text-neutral-dark">
//                     <BookOpen className="h-4 w-4 text-neutral-medium" />
//                     <span>{course.modules?.length || 0} modules</span>
//                   </div>
                  
//                   {typeof course.rating === "number" && course.rating > 0 && (
//                     <div className="flex items-center gap-1 text-sm text-neutral-dark">
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Star
//                             key={star}
//                             className={`h-4 w-4 ${
//                               star <= course.rating!
//                                 ? "text-yellow-400 fill-yellow-400"
//                                 : "text-neutral-light"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span>{course.rating}/5</span>
//                     </div>
//                   )}
//                 </div>
                
//                 {instructor && (
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-light">
//                       {instructor.profileImageUrl ? (
//                         <img
//                           src={instructor.profileImageUrl}
//                           alt={`${instructor.firstName} ${instructor.lastName}`}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="h-full w-full flex items-center justify-center bg-primary text-white font-bold">
//                           {instructor.firstName?.[0] || ''}
//                           {instructor.lastName?.[0] || ''}
//                         </div>
//                       )}
//                     </div>
//                     <div>
//                       <div className="text-sm font-medium">Instructor</div>
//                       <div className="text-neutral-dark">
//                         {instructor.firstName} {instructor.lastName}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               <div className="w-full sm:w-auto">
//                 {isAuthenticated && progress ? (
//                   <Button 
//                     size="lg" 
//                     className="w-full sm:w-auto"
//                     onClick={handleStartCourse}
//                   >
//                     {progressStats.completedLessons > 0 ? 'Continue Course' : 'Start Course'}
//                     <ChevronRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 ) : (
//                   <Button 
//                     size="lg" 
//                     className="w-full sm:w-auto"
//                     onClick={handleEnroll}
//                   >
//                     Enroll in Course
//                     <ChevronRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Course content tabs */}
//         <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="mb-6">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="content">Course Content</TabsTrigger>
//             <TabsTrigger value="resources">Resources</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="overview" className="space-y-6">
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                   <Award className="h-5 w-5 text-primary" />
//                   What You'll Learn
//                 </h2>
                
//                 {course.learningOutcomes ? (
//                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {(Array.isArray(course.learningOutcomes) ? course.learningOutcomes : []).map((outcome, index) => (
//                       <li key={index} className="flex items-start gap-2">
//                         <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
//                         <span>{outcome}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-neutral-medium">No learning outcomes specified for this course.</p>
//                 )}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                   <Brain className="h-5 w-5 text-primary" />
//                   Prerequisites
//                 </h2>
                
//                 {course.prerequisites ? (
//                   <ul className="space-y-2">
//                     {(Array.isArray(course.prerequisites) ? course.prerequisites : []).map((prereq, index) => (
//                       <li key={index} className="flex items-start gap-2">
//                         <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//                         <span>{prereq}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-neutral-medium">No prerequisites required for this course.</p>
//                 )}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4">Course Description</h2>
//                 <p className="whitespace-pre-line">{course.description}</p>
//               </CardContent>
//             </Card>
//           </TabsContent>
          
//           <TabsContent value="content">
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4">
//                   Course Content
//                 </h2>
                
//                 {!isAuthenticated && (
//                   <div className="bg-neutral-lighter p-4 rounded-md mb-6 flex items-center gap-4">
//                     <Lock className="h-5 w-5 text-neutral-medium" />
//                     <div>
//                       <p className="font-medium">Sign in to access the full course</p>
//                       <p className="text-sm text-neutral-medium">Free preview content is available for some lessons</p>
//                     </div>
//                     <Button 
//                       className="ml-auto"
//                       onClick={() => setLocation("/auth")}
//                     >
//                       Sign In
//                     </Button>
//                   </div>
//                 )}
                
//                 {course.modules && course.modules.length > 0 ? (
//                   <div className="space-y-4">
//                     {course.modules.map((module, moduleIndex) => (
//                       <div key={moduleIndex} className="border rounded-md overflow-hidden">
//                         <div 
//                           className="p-4 bg-neutral-lighter flex items-center justify-between cursor-pointer"
//                           onClick={() => setSelectedModuleIndex(selectedModuleIndex === moduleIndex ? null : moduleIndex)}
//                         >
//                           <div>
//                             <h3 className="font-medium">Module {moduleIndex + 1}: {module.title}</h3>
//                             <div className="text-sm text-neutral-medium">
//                               {module.lessons?.length || 0} lessons · {formatDuration(module.duration || 0)}
//                             </div>
//                           </div>
//                           <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${
//                             selectedModuleIndex === moduleIndex ? 'rotate-90' : ''
//                           }`} />
//                         </div>
                        
//                         {selectedModuleIndex === moduleIndex && module.lessons && (
//                           <div className="divide-y">
//                             {module.lessons.map((lesson, lessonIndex) => (
//                               <div 
//                                 key={lessonIndex}
//                                 className={`p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
//                                   (isAuthenticated || lesson.preview)
//                                     ? 'hover:bg-blue-50 hover:shadow-sm'
//                                     : 'cursor-not-allowed opacity-60'
//                                 } ${
//                                   selectedModuleIndex === moduleIndex && selectedLessonIndex === lessonIndex
//                                     ? 'bg-blue-50 border-l-4 border-primary'
//                                     : ''
//                                 }`}
//                                 onClick={() => {
//                                   if (isAuthenticated || lesson.preview) {
//                                     handleLessonClick(lesson, moduleIndex, lessonIndex);
//                                   } else {
//                                     toast({
//                                       title: "Access Restricted",
//                                       description: "Please enroll in this course to access this lesson.",
//                                     });
//                                   }
//                                 }}
//                               >
//                                 <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
//                                   isLessonCompleted(lesson.id)
//                                     ? 'bg-green-100 text-green-600'
//                                     : selectedModuleIndex === moduleIndex && selectedLessonIndex === lessonIndex
//                                     ? 'bg-primary text-white'
//                                     : (isAuthenticated || lesson.preview)
//                                     ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
//                                     : 'bg-neutral-lighter text-neutral-medium'
//                                 }`}>
//                                   {isLessonCompleted(lesson.id) ? (
//                                     <Check className="h-4 w-4" />
//                                   ) : (isAuthenticated || lesson.preview) ? (
//                                     <Play className="h-4 w-4 ml-0.5" />
//                                   ) : (
//                                     <Lock className="h-3 w-3" />
//                                   )}
//                                 </div>
                                
//                                 <div className="flex-grow">
//                                   <div className="font-medium">
//                                     {lesson.title}
//                                     {lesson.preview && (
//                                       <Badge variant="outline" className="ml-2 text-xs">Free Preview</Badge>
//                                     )}
//                                   </div>
//                                   <div className="text-xs text-neutral-medium flex items-center gap-2">
//                                     <span className="flex items-center">
//                                       <Clock className="h-3 w-3 mr-1" />
//                                       {formatDuration(lesson.duration || 0)}
//                                     </span>
//                                   </div>
//                                 </div>
                                
//                                 {isAuthenticated && !isLessonCompleted(lesson.id) && (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       markLessonComplete(lesson.id);
//                                     }}
//                                     className="ml-2 text-xs"
//                                   >
//                                     Mark Complete
//                                   </Button>
//                                 )}
                                
//                                 {!isAuthenticated && !lesson.preview && (
//                                   <Lock className="h-4 w-4 text-neutral-medium" />
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-neutral-medium">No modules available for this course.</p>
//                 )}
                
//                 {/* {console.log("Current lesson calculated:", currentLesson)} */}
//                 {/* Lesson completion section - now appears below the main video player */}
//                 {currentLesson && isAuthenticated && (
//                   <div className="mt-6 p-4 bg-white rounded-lg border border-neutral-lighter">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-medium">Complete This Course</h4>
//                         <p className="text-sm text-muted-foreground">{currentLesson.content}</p>
//                       </div>
//                       <Button 
//                         onClick={() => markLessonComplete(currentLesson.id)}
//                         disabled={isLessonCompleted(currentLesson.id)}
//                         variant={isLessonCompleted(currentLesson.id) ? "outline" : "default"}
//                       >
//                         {isLessonCompleted(currentLesson.id) ? (
//                           <>
//                             <Check className="mr-2 h-4 w-4" />
//                             Completed
//                           </>
//                         ) : (
//                           'Mark as Complete'
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
          
//           <TabsContent value="resources">
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4">Resources</h2>
//                 <p className="text-neutral-medium">No additional resources available for this course.</p>
//               </CardContent>
//             </Card>
//           </TabsContent>
          

//         </Tabs>
//       </main>
//     </div>
//   );
// }

///.  =====

// client/src/pages/course.tsx
import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Check,
  Clock,
  BookOpen,
  Play,
  ChevronRight,
  ArrowLeft,
  Star,
  Award,
  Brain,
  Lock,
} from "lucide-react";
import { ContentLoading } from "@/components/ui/loading-animation";
import { useAuth } from "@/hooks/useAuth";
import EnhancedVideoPlayer from "@/components/video/enhanced-video-player";
import { useToast } from "@/hooks/use-toast";
import { formatDuration } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Course as CourseType } from "@/types/course";
import { User } from "@/types/user";
import { CourseProgress } from "@/types/enrollment";
import { Category } from "@/types/category";

export default function Course() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

  // Fetch the course data
  const { data: course, isLoading: courseLoading } = useQuery<CourseType>({
    queryKey: ["course", id],
    queryFn: () =>
      fetchWithAuth(`/api/courses/${id}`).then((res) => res.json()),
  });

  // Fetch the category data to display the category name
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () =>
      fetchWithAuth(`/api/categories`).then((res) => res.json()),
  });

  // Fetch course progress for authenticated users
  const { data: progress, isLoading: progressLoading } =
    useQuery<CourseProgress>({
      queryKey: ["progress", id],
      enabled: !!isAuthenticated,
      queryFn: () =>
        fetchWithAuth(
          `/api/enrollments/user/course/${id}/progress`
        ).then((res) => res.json()),
    });

  // Fetch the instructor data
  const { data: instructor, error: instructorError } = useQuery<User>({
    queryKey: ["user", course?.instructorId],
    enabled: !!course?.instructorId,
    queryFn: () =>
      fetchWithAuth(`/api/users/${course!.instructorId}`).then((res) =>
        res.json()
      ),
  });

  // Debug instructor query
  if (instructorError) {
    console.log("Instructor query error:", instructorError);
  }

  // Calculate course progress statistics
  const progressStats = useMemo(() => {
    if (!course || !progress)
      return { completedLessons: 0, totalLessons: 0, progressPercent: 0 };

    const totalLessons =
      course.modules?.reduce(
        (total, module) => total + (module.lessons?.length || 0),
        0
      ) || 0;
    const completedLessons = progress.completedLessons?.length || 0;
    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return { completedLessons, totalLessons, progressPercent };
  }, [course, progress]);

  // const handleEnroll = () => {
  //   if (!isAuthenticated || !user) {
  //     setLocation(`/login?next=/courses/${id}`);
  //     return;
  //   }
  //   setLocation(`/subscription-comparison?courseId=${id}`);
  // };

  // Handle starting or continuing the course
  const handleEnroll = () => {
    if (!isAuthenticated || !user) {
      // send unauthenticated users to login, then back to this course
      setLocation(`/login?next=/courses/${id}`);
    } else {
      // signed‐in users go pick a plan
      setLocation(`/subscription-comparison?courseId=${id}`);
    }
  };
  
  const handleStartCourse = () => {
    if (course && progress && course.modules && course.modules.length > 0) {
      // If there's a current lesson, go to it
      if (progress.currentLessonId) {
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

  // Get next lesson for auto-advance
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

  // Handle lesson click with scroll functionality
  const handleLessonClick = (
    lesson: any,
    moduleIndex: number,
    lessonIndex: number
  ) => {
    setSelectedModuleIndex(moduleIndex);
    setSelectedLessonIndex(lessonIndex);

    setTimeout(() => {
      const videoPlayer = document.querySelector(
        "#video-player-container"
      );
      if (videoPlayer) {
        videoPlayer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Mark a lesson as completed
  const markLessonComplete = async (lessonId: number | string) => {
    if (!course) return;

    try {
      const response = await fetchWithAuth(
        `/api/enrollments/user/course/${id}/lesson/${lessonId}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.gamification?.pointsEarned) {
          toast({
            title: "Points Earned!",
            description: `You earned ${data.gamification.pointsEarned} points for completing this lesson.`,
          });
        }

        if (data.gamification?.badgesEarned?.length > 0) {
          toast({
            title: "Badge Unlocked!",
            description: `You earned the "${data.gamification.badgesEarned[0].name}" badge.`,
          });
        }

        if (data.gamification?.challengesCompleted?.length > 0) {
          toast({
            title: "Challenge Completed!",
            description: `You completed the "${data.gamification.challengesCompleted[0].name}" challenge.`,
          });
        }

        // Auto-advance logic
        if (selectedModuleIndex !== null && selectedLessonIndex !== null) {
          const currentModule = course.modules[selectedModuleIndex];

          if (
            currentModule?.lessons &&
            selectedLessonIndex < currentModule.lessons.length - 1
          ) {
            setSelectedLessonIndex(selectedLessonIndex + 1);
          } else if (selectedModuleIndex < course.modules.length - 1) {
            setSelectedModuleIndex(selectedModuleIndex + 1);
            setSelectedLessonIndex(0);
          } else {
            toast({
              title: "Course Completed!",
              description: "Congratulations on completing this course!",
            });
          }
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to mark lesson as complete.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating progress.",
        variant: "destructive",
      });
    }
  };

  // Get the current lesson content
  const currentLesson = useMemo(() => {
    if (
      !course?.modules ||
      selectedModuleIndex === null ||
      selectedLessonIndex === null
    ) {
      return null;
    }

    const module = course.modules[selectedModuleIndex];
    if (!module?.lessons) return null;

    return module.lessons[selectedLessonIndex];
  }, [course, selectedModuleIndex, selectedLessonIndex]);

  // Check if a specific lesson is completed
  const isLessonCompleted = (lessonId: number | string) => {
    if (!progress || !progress.completedLessons) return false;
    return (progress.completedLessons as Array<string | number>).includes(
      lessonId
    );
  };

  // Determine category color
  const getCategoryColor = (categoryId: number) => {
    const colors: Record<number, string> = {
      1: "bg-primary-light bg-opacity-10 text-primary",
      2: "bg-secondary bg-opacity-10 text-secondary",
      3: "bg-accent bg-opacity-10 text-accent",
      4: "bg-success bg-opacity-10 text-success",
    };
    return colors[categoryId] || colors[1];
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
        <p className="text-neutral-medium mb-6">
          The course you're looking for does not exist.
        </p>
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
        {/* Back button */}
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

        {/* Course header */}
        <div
          id="video-player-container"
          className="bg-white rounded-lg shadow-sm overflow-hidden mb-8"
        >
          <div className="aspect-video bg-neutral-dark relative">
            {currentLesson ? (
              <div className="w-full h-full">
                <EnhancedVideoPlayer
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  poster={
                    currentLesson.thumbnailUrl ||
                    `https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop`
                  }
                  tracks={[
                    {
                      kind: "subtitles",
                      label: "English",
                      language: "en",
                      src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt",
                    },
                    {
                      kind: "subtitles",
                      label: "Français",
                      language: "fr",
                      src: "/captions/sample-french.vtt",
                    },
                    {
                      kind: "subtitles",
                      label: "Español",
                      language: "es",
                      src: "/captions/sample-spanish.vtt",
                    },
                    {
                      kind: "subtitles",
                      label: "Deutsch",
                      language: "de",
                      src: "/captions/sample-german.vtt",
                    },
                    {
                      kind: "subtitles",
                      label: "中文",
                      language: "zh",
                      src: "/captions/sample-chinese.vtt",
                    },
                    {
                      kind: "subtitles",
                      label: "日本語",
                      language: "ja",
                      src: "/captions/sample-japanese.vtt",
                    },
                  ]}
                  quizQuestions={
                    currentLesson?.title === "Introduction to Python Programming"
                      ? [
                          {
                            id: "python-q1",
                            time: 30,
                            question: "What is Python primarily known for?",
                            options: [
                              "Low-level system programming",
                              "Simple syntax and readability",
                              "Compiled execution only",
                              "Hardware-specific operations",
                            ],
                            correctAnswer: 1,
                            explanation:
                              "Python is renowned for its simple, readable syntax that makes it perfect for beginners and data science applications.",
                          },
                          {
                            id: "python-q2",
                            time: 60,
                            question:
                              "Which of these is a popular Python library for data analysis?",
                            options: ["React", "Pandas", "Angular", "jQuery"],
                            correctAnswer: 1,
                            explanation:
                              "Pandas is one of the most popular Python libraries for data manipulation and analysis, offering powerful data structures like DataFrames.",
                          },
                        ]
                      : []
                  }
                  onQuizComplete={(questionId, isCorrect, timeTaken) => {
                    if (isCorrect) {
                      toast({
                        title: "Correct Answer!",
                        description: "Great job! You're learning well.",
                      });
                    }
                  }}
                  isSubscribed={true}
                  requiresSubscription={false}
                  className="aspect-video w-full"
                  onComplete={() => {
                    if (isAuthenticated && currentLesson) {
                      markLessonComplete(currentLesson.id);
                      setTimeout(() => {
                        const nextLesson = getNextLesson();
                        if (nextLesson) {
                          handleLessonClick(
                            nextLesson.lesson,
                            nextLesson.moduleIndex,
                            nextLesson.lessonIndex
                          );
                        }
                      }, 2000);
                    }
                  }}
                />
              </div>
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
                    <h3 className="text-xl font-semibold mb-2">
                      Select a lesson to start learning
                    </h3>
                    <p className="text-white/80">
                      Choose any lesson from the course modules below
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated && progress && (
              <div className="absolute top-4 right-4 bg-white rounded-md p-2 shadow-md">
                <div className="text-sm font-medium mb-1">Course Progress</div>
                <Progress value={progressStats.progressPercent} className="h-2 mb-1" />
                <div className="text-xs text-neutral-medium">
                  {progressStats.completedLessons} of {progressStats.totalLessons} lessons
                  completed
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getCategoryColor(course.categoryId)}>
                    {categories?.find((c) => c.id === course.categoryId)?.name ||
                      "Course"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.level}
                  </Badge>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                  {course.title}
                </h1>

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
                    {progressStats.completedLessons > 0
                      ? "Continue Course"
                      : "Start Course"}
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

        {/* Course content tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  What You'll Learn
                </h2>

                {course.learningOutcomes ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Array.isArray(course.learningOutcomes)
                      ? course.learningOutcomes
                      : []
                    ).map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-medium">
                    No learning outcomes specified for this course.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Prerequisites
                </h2>

                {course.prerequisites ? (
                  <ul className="space-y-2">
                    {(Array.isArray(course.prerequisites)
                      ? course.prerequisites
                      : []
                    ).map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-medium">
                    No prerequisites required for this course.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                <p className="whitespace-pre-line">{course.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Course Content</h2>

                {!isAuthenticated && (
                  <div className="bg-neutral-lighter p-4 rounded-md mb-6 flex items-center gap-4">
                    <Lock className="h-5 w-5 text-neutral-medium" />
                    <div>
                      <p className="font-medium">
                        Sign in to access the full course
                      </p>
                      <p className="text-sm text-neutral-medium">
                        Free preview content is available for some lessons
                      </p>
                    </div>
                    <Button className="ml-auto" onClick={() => setLocation("/login")}>
                      Sign In
                    </Button>
                  </div>
                )}

                {course.modules && course.modules.length > 0 ? (
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div
                        key={moduleIndex}
                        className="border rounded-md overflow-hidden"
                      >
                        <div
                          className="p-4 bg-neutral-lighter flex items-center justify-between cursor-pointer"
                          onClick={() =>
                            setSelectedModuleIndex(
                              selectedModuleIndex === moduleIndex ? null : moduleIndex
                            )
                          }
                        >
                          <div>
                            <h3 className="font-medium">
                              Module {moduleIndex + 1}: {module.title}
                            </h3>
                            <div className="text-sm text-neutral-medium">
                              {module.lessons?.length || 0} lessons ·{" "}
                              {formatDuration(module.duration || 0)}
                            </div>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 transition-transform duration-200 ${
                              selectedModuleIndex === moduleIndex ? "rotate-90" : ""
                            }`}
                          />
                        </div>

                        {selectedModuleIndex === moduleIndex && module.lessons && (
                          <div className="divide-y">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className={`p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                                  (isAuthenticated || lesson.preview)
                                    ? "hover:bg-blue-50 hover:shadow-sm"
                                    : "cursor-not-allowed opacity-60"
                                } ${
                                  selectedModuleIndex === moduleIndex &&
                                  selectedLessonIndex === lessonIndex
                                    ? "bg-blue-50 border-l-4 border-primary"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (isAuthenticated || lesson.preview) {
                                    handleLessonClick(
                                      lesson,
                                      moduleIndex,
                                      lessonIndex
                                    );
                                  } else {
                                    toast({
                                      title: "Access Restricted",
                                      description:
                                        "Please enroll in this course to access this lesson.",
                                    });
                                  }
                                }}
                              >
                                <div
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                    isLessonCompleted(lesson.id)
                                      ? "bg-green-100 text-green-600"
                                      : selectedModuleIndex === moduleIndex &&
                                        selectedLessonIndex === lessonIndex
                                      ? "bg-primary text-white"
                                      : (isAuthenticated || lesson.preview)
                                      ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                      : "bg-neutral-lighter text-neutral-medium"
                                  }`}
                                >
                                  {isLessonCompleted(lesson.id) ? (
                                    <Check className="h-4 w-4" />
                                  ) : (isAuthenticated || lesson.preview) ? (
                                    <Play className="h-4 w-4 ml-0.5" />
                                  ) : (
                                    <Lock className="h-3 w-3" />
                                  )}
                                </div>

                                <div className="flex-grow">
                                  <div className="font-medium">
                                    {lesson.title}
                                    {lesson.preview && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Free Preview
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-neutral-medium flex items-center gap-2">
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDuration(lesson.duration || 0)}
                                    </span>
                                  </div>
                                </div>

                                {isAuthenticated && !isLessonCompleted(lesson.id) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markLessonComplete(lesson.id);
                                    }}
                                    className="ml-2 text-xs"
                                  >
                                    Mark Complete
                                  </Button>
                                )}

                                {!isAuthenticated && !lesson.preview && (
                                  <Lock className="h-4 w-4 text-neutral-medium" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-medium">
                    No modules available for this course.
                  </p>
                )}

                {currentLesson && isAuthenticated && (
                  <div className="mt-6 p-4 bg-white rounded-lg border border-neutral-lighter">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Complete This Course</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentLesson.content}
                        </p>
                      </div>
                      <Button
                        onClick={() => markLessonComplete(currentLesson.id)}
                        disabled={isLessonCompleted(currentLesson.id)}
                        variant={
                          isLessonCompleted(currentLesson.id)
                            ? "outline"
                            : "default"
                        }
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Resources</h2>
                <p className="text-neutral-medium">
                  No additional resources available for this course.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
