import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Icons
import { Sparkles, BookOpen, Trophy, Clock, BarChart4, Calendar, ChevronRight, Bookmark, Award, Star, Tag } from "lucide-react";

interface CourseRecommendation {
  id: number;
  courseId: number;
  score: number;
  reason: string;
  source: string;
  isViewed: boolean;
  course: {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: number;
    coverImage: string;
    difficulty: number;
  };
}

interface LearningPath {
  id: number;
  name: string;
  description: string;
  goalDescription: string;
  estimatedHours: number;
  targetSkillLevel: string;
  progress: number;
  enrolledAt?: string;
  courses: {
    id: number;
    title: string;
    description: string;
    duration: number;
    level: string;
    coverImage: string;
    isCompleted?: boolean;
  }[];
}

interface UserSkill {
  id: number;
  tagId: number;
  proficiencyLevel: number;
  tag: {
    id: number;
    name: string;
    category: string;
  };
}

export default function PersonalizedLearningPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("recommendations");
  
  // State for skill update dialog
  const [isUpdateSkillOpen, setIsUpdateSkillOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);
  const [skillLevel, setSkillLevel] = useState<number>(1);

  // Fetch course recommendations
  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["/api/recommendations"],
    enabled: isAuthenticated,
  });

  // Fetch learning paths
  const { data: learningPaths, isLoading: isLoadingPaths } = useQuery({
    queryKey: ["/api/learning-paths"],
    enabled: isAuthenticated,
  });

  // Fetch user skills
  const { data: userSkills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["/api/user-skills"],
    enabled: isAuthenticated,
  });
  
  // Add mock data for testing and development
  const mockRecommendations = [
    {
      id: 1,
      courseId: 101,
      score: "8.7",
      reason: "Matches your JavaScript proficiency",
      source: "algorithm",
      isViewed: false,
      course: {
        id: 101,
        title: "Advanced React Patterns",
        description: "Learn advanced React patterns including render props, HOCs, and hooks from the ground up",
        level: "Advanced",
        duration: 240,
        coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        difficulty: 8
      }
    },
    {
      id: 2,
      courseId: 102,
      score: "9.2",
      reason: "Based on your recent learning history",
      source: "algorithm",
      isViewed: false,
      course: {
        id: 102,
        title: "Full-Stack TypeScript Development",
        description: "Build end-to-end type-safe applications with TypeScript, React, Node.js and PostgreSQL",
        level: "Intermediate",
        duration: 320,
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        difficulty: 6
      }
    },
    {
      id: 3,
      courseId: 103,
      score: "7.5",
      reason: "Popular among learners like you",
      source: "algorithm", 
      isViewed: false,
      course: {
        id: 103,
        title: "Cloud Architecture Fundamentals",
        description: "Learn how to design and implement scalable, high-performance cloud architectures",
        level: "Beginner",
        duration: 180,
        coverImage: "https://images.unsplash.com/photo-1603575448878-868a20723f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        difficulty: 4
      }
    }
  ];

  // Mock learning paths for testing and development
  const mockLearningPaths = [
    {
      id: 1,
      name: "Full-Stack Development",
      description: "Complete path to becoming a full-stack developer",
      goalDescription: "Learn all aspects of web development from frontend to backend to deployment",
      estimatedHours: 120,
      targetSkillLevel: "Advanced",
      progress: 35,
      enrolledAt: "2023-08-15T14:00:00.000Z",
      courses: [
        {
          id: 201,
          title: "HTML & CSS Fundamentals",
          description: "Build a strong foundation with modern HTML5 and CSS3",
          duration: 180,
          level: "Beginner",
          coverImage: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
          isCompleted: true
        },
        {
          id: 202,
          title: "JavaScript Essentials",
          description: "Become proficient with modern JavaScript (ES6+)",
          duration: 240,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
          isCompleted: true
        },
        {
          id: 203,
          title: "React Framework",
          description: "Build interactive UIs with React",
          duration: 260,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
          isCompleted: false
        },
        {
          id: 204,
          title: "Node.js Backend",
          description: "Create robust backend applications with Node.js",
          duration: 280,
          level: "Advanced",
          coverImage: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
          isCompleted: false
        }
      ]
    },
    {
      id: 2,
      name: "Data Science Specialist",
      description: "Become proficient in data science and machine learning",
      goalDescription: "Gain expertise in data analysis, visualization, and machine learning algorithms",
      estimatedHours: 150,
      targetSkillLevel: "Expert",
      progress: 0,
      enrolledAt: null,
      courses: [
        {
          id: 301,
          title: "Python for Data Science",
          description: "Learn Python fundamentals for data science applications",
          duration: 210,
          level: "Beginner",
          coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
          isCompleted: false
        },
        {
          id: 302,
          title: "Data Analysis with Pandas",
          description: "Master data manipulation and analysis with Pandas",
          duration: 230,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
          isCompleted: false
        }
      ]
    }
  ];
  
  // Mock user skills for testing and development
  const mockUserSkills = [
    {
      id: 1,
      tagId: 1,
      proficiencyLevel: 7,
      tag: {
        id: 1,
        name: "JavaScript",
        category: "Programming"
      }
    },
    {
      id: 2,
      tagId: 2,
      proficiencyLevel: 6,
      tag: {
        id: 2,
        name: "React",
        category: "Framework"
      }
    },
    {
      id: 3,
      tagId: 3,
      proficiencyLevel: 4,
      tag: {
        id: 3,
        name: "Node.js",
        category: "Backend"
      }
    },
    {
      id: 4,
      tagId: 4,
      proficiencyLevel: 3,
      tag: {
        id: 4,
        name: "UI/UX Design",
        category: "Design"
      }
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Personalized Learning</h1>
            <p className="mb-4">Please log in to access your personalized learning recommendations.</p>
            <Button onClick={() => window.location.href = "/api/login"}>Log In</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const enrollInLearningPath = async (pathId: number) => {
    try {
      await apiRequest("POST", `/api/learning-paths/${pathId}/enroll`);
      toast({
        title: "Enrolled Successfully",
        description: "You've been enrolled in this learning path",
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in this learning path",
        variant: "destructive",
      });
    }
  };

  const updateLearningPreferences = async () => {
    // This would open a modal or redirect to a preferences page
    // For now we'll just show a toast
    toast({
      title: "Coming Soon",
      description: "Learning preferences customization will be available soon!",
    });
  };
  
  // Open skill update dialog
  const openSkillUpdateDialog = (skill: UserSkill) => {
    setSelectedSkill(skill);
    setSkillLevel(skill.proficiencyLevel);
    setIsUpdateSkillOpen(true);
  };
  
  // Handle skill update
  const handleSkillUpdate = async () => {
    if (!selectedSkill) return;
    
    try {
      await apiRequest("PUT", `/api/user-skills/${selectedSkill.id}`, {
        proficiencyLevel: skillLevel
      });
      
      // Update cache and close dialog
      queryClient.invalidateQueries({ queryKey: ["/api/user-skills"] });
      
      toast({
        title: "Skill Updated",
        description: `Your ${selectedSkill.tag.name} skill level has been updated.`,
      });
      
      setIsUpdateSkillOpen(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your skill level.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Sparkles className="mr-2 h-8 w-8 text-primary" /> 
              Personalized Learning
            </h1>
            <p className="text-muted-foreground mt-1">
              Tailored recommendations based on your interests, skills, and learning history
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={updateLearningPreferences}
          >
            <BarChart4 className="mr-2 h-4 w-4" />
            Customize Learning Preferences
          </Button>
        </div>

        {/* Learning stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Streak</p>
                  <p className="text-2xl font-bold">7 days</p>
                </div>
                <Calendar className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Trophy className="h-8 w-8 text-amber-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Hours</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <Clock className="h-8 w-8 text-emerald-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <p className="text-2xl font-bold">Advanced</p>
                </div>
                <Award className="h-8 w-8 text-indigo-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="recommendations">Course Recommendations</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="skills">My Skills</TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoadingRecommendations ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-[150px] bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 bg-muted rounded w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : (recommendations?.length > 0 || mockRecommendations?.length > 0) ? (
                (recommendations?.length > 0 ? recommendations : mockRecommendations).map((rec: CourseRecommendation) => (
                  <Card key={rec.id} className="overflow-hidden flex flex-col">
                    <div 
                      className="h-[150px] bg-cover bg-center" 
                      style={{ 
                        backgroundImage: rec.course.coverImage 
                          ? `url(${rec.course.coverImage})` 
                          : 'linear-gradient(to right, var(--primary-500), var(--primary-600))'
                      }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{rec.course.title}</CardTitle>
                        <Badge variant={getBadgeVariant(rec.course.level)}>
                          {rec.course.level}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 
                        {rec.course.duration} min
                        <Separator className="mx-2 h-3" orientation="vertical" />
                        <Star className="h-3 w-3 mr-1 text-amber-500" />
                        {(rec.score * 5 / 10).toFixed(1)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 text-sm text-muted-foreground flex-grow">
                      <p className="line-clamp-3">{rec.course.description}</p>
                      <p className="mt-2 text-primary font-medium text-xs">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        {rec.reason}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button className="w-full" variant="default">
                        View Course <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Recommendations Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete more courses or update your interests to get personalized recommendations
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={updateLearningPreferences}
                  >
                    Update Learning Preferences
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths">
            <div className="grid grid-cols-1 gap-6">
              {isLoadingPaths ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-1/2 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-5/6 mb-6" />
                      <div className="h-5 bg-muted rounded w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (learningPaths?.length > 0 || mockLearningPaths?.length > 0) ? (
                (learningPaths?.length > 0 ? learningPaths : mockLearningPaths).map((path: LearningPath) => (
                  <Card key={path.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{path.name}</CardTitle>
                          <CardDescription>
                            {path.goalDescription || path.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2 flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {path.estimatedHours} hours
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {path.progress}% Complete
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Target: {path.targetSkillLevel}
                          </span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Included Courses</h4>
                        <div className="space-y-3">
                          {path.courses.slice(0, 3).map((course) => (
                            <div key={course.id} className="flex items-start">
                              <div className={`w-4 h-4 mt-0.5 mr-2 rounded-full flex items-center justify-center ${
                                course.isCompleted ? 'bg-green-500' : 'border border-muted-foreground'
                              }`}>
                                {course.isCompleted && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{course.title}</div>
                                <div className="text-xs text-muted-foreground">{course.duration} min • {course.level}</div>
                              </div>
                            </div>
                          ))}
                          {path.courses.length > 3 && (
                            <div className="text-xs text-muted-foreground pl-6">
                              +{path.courses.length - 3} more courses
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        {path.enrolledAt ? (
                          <Button variant="secondary" className="flex-1 mr-2">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            className="flex-1 mr-2"
                            onClick={() => enrollInLearningPath(path.id)}
                          >
                            <Bookmark className="mr-2 h-4 w-4" />
                            Enroll in Path
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Learning Paths Available</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on creating learning paths tailored to your interests
                  </p>
                  <Button 
                    variant="default"
                    onClick={() => setActiveTab("recommendations")}
                  >
                    View Recommended Courses
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Skills & Competencies</CardTitle>
                  <CardDescription>
                    Your current skill levels based on completed courses and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSkills ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-5 bg-muted rounded w-1/3 mb-1" />
                          <div className="h-3 bg-muted rounded w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (userSkills?.length > 0 || mockUserSkills?.length > 0) ? (
                    <div className="space-y-4">
                      {(userSkills?.length > 0 ? userSkills : mockUserSkills).map((skill: UserSkill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium flex items-center">
                              <Tag className="mr-2 h-3 w-3" />
                              {skill.tag.name}
                            </span>
                            <div className="flex items-center">
                              <Badge variant={getSkillBadgeVariant(skill.proficiencyLevel)} className="mr-2">
                                {getSkillLevelName(skill.proficiencyLevel)}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2"
                                onClick={() => openSkillUpdateDialog(skill)}
                              >
                                <span className="sr-only">Edit</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div
                              className={`h-full rounded-full ${getSkillProgressColor(skill.proficiencyLevel)}`}
                              style={{ width: `${skill.proficiencyLevel * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart4 className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="font-medium mb-1">No Skills Tracked Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete courses to start building your skill profile
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Skills</CardTitle>
                  <CardDescription>
                    Skills to develop based on your learning goals and industry trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedSkills.map((skill) => (
                      <div key={skill.id} className="flex justify-between items-start pb-3 border-b border-muted last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-sm text-muted-foreground">{skill.description}</div>
                          <div className="flex gap-2 mt-1">
                            {skill.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Explore
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="w-full">
                    View All Recommended Skills
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Skill Update Dialog */}
      <Dialog open={isUpdateSkillOpen} onOpenChange={setIsUpdateSkillOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Skill Level</DialogTitle>
            <DialogDescription>
              Adjust your proficiency level for {selectedSkill?.tag.name || 'this skill'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Beginner</span>
                <Badge variant={getSkillBadgeVariant(skillLevel)}>
                  {getSkillLevelName(skillLevel)}
                </Badge>
                <span className="text-sm text-muted-foreground">Expert</span>
              </div>
              <Slider 
                value={[skillLevel]} 
                min={1} 
                max={10} 
                step={1} 
                onValueChange={values => setSkillLevel(values[0])}
                className="py-4"
              />
              <div className="w-full h-2 bg-muted rounded-full mt-2">
                <div
                  className={`h-full rounded-full ${getSkillProgressColor(skillLevel)}`}
                  style={{ width: `${skillLevel * 10}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {skillLevel <= 3 && "Basic understanding with limited practical experience"}
                {skillLevel > 3 && skillLevel <= 6 && "Comfortable with core concepts and regular application"}
                {skillLevel > 6 && skillLevel <= 8 && "Advanced knowledge with substantial experience"}
                {skillLevel > 8 && "Expert level with deep mastery and teaching ability"}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateSkillOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSkillUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

// Helper functions
function getBadgeVariant(level: string) {
  switch (level.toLowerCase()) {
    case 'beginner': return 'secondary';
    case 'intermediate': return 'default';
    case 'advanced': return 'destructive';
    default: return 'outline';
  }
}

function getSkillBadgeVariant(level: number) {
  if (level <= 3) return 'secondary';
  if (level <= 6) return 'default';
  if (level <= 8) return 'destructive';
  return 'outline';
}

function getSkillLevelName(level: number) {
  if (level <= 2) return 'Beginner';
  if (level <= 4) return 'Basic';
  if (level <= 6) return 'Intermediate';
  if (level <= 8) return 'Advanced';
  return 'Expert';
}

function getSkillProgressColor(level: number) {
  if (level <= 2) return 'bg-slate-400';
  if (level <= 4) return 'bg-blue-500';
  if (level <= 6) return 'bg-green-500';
  if (level <= 8) return 'bg-amber-500';
  return 'bg-red-500';
}

// Mock data for recommended skills
const recommendedSkills = [
  {
    id: 1,
    name: 'Data Visualization',
    description: 'Crucial for presenting complex data in a clear and effective manner',
    tags: ['Analytics', 'Design']
  },
  {
    id: 2,
    name: 'Machine Learning Fundamentals',
    description: 'Increasingly important across industries for automation and insight',
    tags: ['AI', 'Analytics']
  },
  {
    id: 3,
    name: 'Cloud Infrastructure',
    description: 'Essential for modern applications and scalable systems',
    tags: ['DevOps', 'Architecture']
  }
];