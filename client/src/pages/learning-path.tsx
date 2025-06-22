import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
// Using a standard layout instead of 3D visualization for better compatibility
import { SearchX, Sparkles, BookOpen, Globe, Target, ChevronRight, CheckCircle, Circle, BarChart4, Clock } from "lucide-react";
import InteractivePathVisualization from "@/components/learning-path/interactive-path-visualization";

// 3D graph types
interface GraphNode {
  id: string;
  name: string;
  level: number;
  status: "locked" | "available" | "completed";
  type: string;
  description: string;
  color: string;
  size: number;
}

interface GraphLink {
  source: string;
  target: string;
  color: string;
}

// Interface for learning path
interface LearningPath {
  id: number;
  name: string;
  description: string;
  goalDescription: string;
  estimatedHours: number;
  targetSkillLevel: string;
  targetCompletionDate?: string;
  progress: number;
  enrolledAt?: string;
  courses: {
    id: number;
    title: string;
    description: string;
    duration: number;
    level: string;
    coverImage: string;
    skills: string[];
    isCompleted?: boolean;
  }[];
}

export default function LearningPathPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("current");
  
  // Fetch user's learning paths
  const { data: learningPaths, isLoading: isLoadingPaths } = useQuery({
    queryKey: ["/api/learning-paths"],
    enabled: isAuthenticated,
  });
  
  // Fetch available learning paths
  const { data: availablePaths, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ["/api/learning-paths/available"],
    enabled: isAuthenticated,
  });
  
  // Fetch user skills
  const { data: userSkills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["/api/user-skills"],
    enabled: isAuthenticated,
  });
  
  // Mock data for development
  const mockLearningPaths: LearningPath[] = [
    {
      id: 1,
      name: "Full-Stack Web Development",
      description: "Comprehensive path to become a skilled full-stack developer",
      goalDescription: "Master both frontend and backend technologies to build complete web applications",
      estimatedHours: 120,
      targetSkillLevel: "Advanced",
      targetCompletionDate: "2025-08-30",
      progress: 45,
      enrolledAt: "2025-03-15",
      courses: [
        {
          id: 1,
          title: "HTML & CSS Fundamentals",
          description: "Learn the building blocks of web pages",
          duration: 15,
          level: "Beginner",
          coverImage: "https://images.unsplash.com/photo-1621839673705-6617adf9e890",
          skills: ["HTML", "CSS", "Responsive Design"],
          isCompleted: true
        },
        {
          id: 2,
          title: "JavaScript Essentials",
          description: "Master core JavaScript concepts and modern ES6+ features",
          duration: 25,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
          skills: ["JavaScript", "ES6", "DOM Manipulation"],
          isCompleted: true
        },
        {
          id: 3,
          title: "React Framework",
          description: "Build dynamic, interactive UIs with React",
          duration: 30,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
          skills: ["React", "State Management", "Hooks"],
          isCompleted: false
        },
        {
          id: 4,
          title: "Backend with Node.js",
          description: "Create scalable server-side applications",
          duration: 35,
          level: "Advanced",
          coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
          skills: ["Node.js", "Express", "RESTful APIs"],
          isCompleted: false
        },
        {
          id: 5,
          title: "Database Design & Implementation",
          description: "Work with SQL and NoSQL databases",
          duration: 25,
          level: "Advanced",
          coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
          skills: ["SQL", "PostgreSQL", "MongoDB"],
          isCompleted: false
        }
      ]
    },
    {
      id: 2,
      name: "UI/UX Design Specialization",
      description: "Learn to create beautiful, user-friendly interfaces",
      goalDescription: "Develop skills in user research, wireframing, prototyping, and visual design",
      estimatedHours: 80,
      targetSkillLevel: "Intermediate",
      targetCompletionDate: "2025-07-15",
      progress: 25,
      enrolledAt: "2025-04-10",
      courses: [
        {
          id: 6,
          title: "Design Thinking",
          description: "Learn user-centered design principles",
          duration: 12,
          level: "Beginner",
          coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c",
          skills: ["Design Thinking", "User Research", "Empathy Mapping"],
          isCompleted: true
        },
        {
          id: 7,
          title: "Wireframing & Prototyping",
          description: "Create low and high-fidelity prototypes",
          duration: 18,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
          skills: ["Wireframing", "Prototyping", "Figma"],
          isCompleted: false
        },
        {
          id: 8,
          title: "Visual Design Fundamentals",
          description: "Master color theory, typography, and layout",
          duration: 20,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
          skills: ["Visual Design", "Color Theory", "Typography"],
          isCompleted: false
        },
        {
          id: 9,
          title: "UI Animation & Interaction",
          description: "Create engaging micro-interactions and animations",
          duration: 15,
          level: "Advanced",
          coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
          skills: ["UI Animation", "Interaction Design", "Motion Design"],
          isCompleted: false
        }
      ]
    }
  ];
  
  const mockAvailablePaths: LearningPath[] = [
    {
      id: 3,
      name: "Data Science & Analytics",
      description: "Master data analysis, visualization, and machine learning",
      goalDescription: "Develop skills to extract insights from data and build predictive models",
      estimatedHours: 150,
      targetSkillLevel: "Advanced",
      progress: 0,
      courses: [
        {
          id: 10,
          title: "Python for Data Science",
          description: "Learn Python fundamentals for data analysis",
          duration: 25,
          level: "Beginner",
          coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
          skills: ["Python", "NumPy", "Pandas"],
          isCompleted: false
        },
        {
          id: 11,
          title: "Data Visualization",
          description: "Create effective visual representations of data",
          duration: 20,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
          skills: ["Visualization", "Matplotlib", "Seaborn"],
          isCompleted: false
        },
        {
          id: 12,
          title: "Machine Learning Fundamentals",
          description: "Introduction to key ML algorithms and concepts",
          duration: 35,
          level: "Advanced",
          coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
          skills: ["Machine Learning", "Supervised Learning", "Unsupervised Learning"],
          isCompleted: false
        },
        {
          id: 13,
          title: "Deep Learning",
          description: "Neural networks and advanced ML techniques",
          duration: 40,
          level: "Expert",
          coverImage: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9",
          skills: ["Deep Learning", "Neural Networks", "TensorFlow"],
          isCompleted: false
        }
      ]
    },
    {
      id: 4,
      name: "Mobile App Development",
      description: "Build cross-platform mobile applications",
      goalDescription: "Learn to develop apps for iOS and Android using React Native",
      estimatedHours: 100,
      targetSkillLevel: "Intermediate",
      progress: 0,
      courses: [
        {
          id: 14,
          title: "React Native Basics",
          description: "Introduction to mobile development with React Native",
          duration: 25,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1526498460520-4c246339dccb",
          skills: ["React Native", "Mobile UI", "Navigation"],
          isCompleted: false
        },
        {
          id: 15,
          title: "Mobile UX Design",
          description: "Design principles for mobile interfaces",
          duration: 15,
          level: "Intermediate",
          coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
          skills: ["Mobile UX", "Design Systems", "Accessibility"],
          isCompleted: false
        },
        {
          id: 16,
          title: "Mobile App State Management",
          description: "Managing complex state in mobile applications",
          duration: 20,
          level: "Advanced",
          coverImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051",
          skills: ["Redux", "Context API", "Async Storage"],
          isCompleted: false
        },
        {
          id: 17,
          title: "Native Device Features",
          description: "Working with device cameras, sensors, and notifications",
          duration: 25,
          level: "Advanced",
          coverImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
          skills: ["Device APIs", "Notifications", "Geolocation"],
          isCompleted: false
        }
      ]
    }
  ];
  
  // Create 3D graph data from learning paths
  const createGraphData = (paths: LearningPath[]) => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    
    // Add path nodes
    paths.forEach((path) => {
      const pathNode: GraphNode = {
        id: `path-${path.id}`,
        name: path.name,
        level: 0,
        status: path.progress > 0 ? "available" : "locked",
        type: "path",
        description: path.description,
        color: "#6366f1", // Indigo color for path nodes
        size: 6
      };
      nodes.push(pathNode);
      
      // Add course nodes and links to path
      path.courses.forEach((course, index) => {
        const courseNode: GraphNode = {
          id: `course-${course.id}`,
          name: course.title,
          level: 1,
          status: course.isCompleted ? "completed" : (path.progress > 0 ? "available" : "locked"),
          type: "course",
          description: course.description,
          color: course.isCompleted ? "#22c55e" : "#f97316", // Green if completed, orange if not
          size: 4
        };
        nodes.push(courseNode);
        
        // Link course to path
        links.push({
          source: `path-${path.id}`,
          target: `course-${course.id}`,
          color: "#94a3b8" // Slate color for links
        });
        
        // Link courses in sequence
        if (index > 0) {
          const prevCourseId = path.courses[index - 1].id;
          links.push({
            source: `course-${prevCourseId}`,
            target: `course-${course.id}`,
            color: "#94a3b8"
          });
        }
      });
    });
    
    return { nodes, links };
  };
  
  // Enrollment handler
  const handleEnroll = (pathId: number) => {
    toast({
      title: "Enrollment Successful",
      description: "You've been enrolled in this learning path",
    });
  };
  
  // Prepare data for display
  const currentPaths = learningPaths || mockLearningPaths;
  const explorePaths = availablePaths || mockAvailablePaths;
  const graphData = createGraphData([...currentPaths, ...explorePaths]);
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Learning Paths</h1>
          <p className="mb-4">Please log in to view your personalized learning paths.</p>
          <Button onClick={() => window.location.href = "/api/login"}>Log In</Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Globe className="mr-2 h-8 w-8 text-primary" /> 
              Learning Paths
            </h1>
            <p className="text-muted-foreground mt-1">
              Structured learning journeys designed to help you achieve your career goals
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={() => setLocation("/personalized-learning")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            View Personalized Recommendations
          </Button>
        </div>
        
        {/* Learning statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Active Paths</p>
                  <p className="text-2xl font-bold">{currentPaths.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Courses</p>
                  <p className="text-2xl font-bold">
                    {currentPaths.reduce((total, path) => 
                      total + path.courses.filter(c => c.isCompleted).length, 0
                    )}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Hours</p>
                  <p className="text-2xl font-bold">
                    {currentPaths.reduce((total, path) => 
                      total + path.courses.filter(c => c.isCompleted).reduce((h, c) => h + c.duration, 0), 0
                    )}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Next Goal</p>
                  <p className="text-2xl font-bold">
                    {currentPaths.length > 0 ? 
                      Math.round(currentPaths[0].progress) + "% Complete" : 
                      "No goals yet"}
                  </p>
                </div>
                <Target className="h-8 w-8 text-indigo-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Interactive Learning Path Visualization */}
        <div className="mb-6">
          <InteractivePathVisualization 
            learningPaths={currentPaths}
            onCourseClick={(courseId) => {
              toast({
                title: "Course Selected",
                description: "Navigating to course details page",
              });
              // Navigate to course page would go here in production
              // setLocation(`/course/${courseId}`);
            }}
          />
        </div>
        
        {/* Traditional Path Cards */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Learning Universe</CardTitle>
            <CardDescription>
              Overview of your learning paths and course progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPaths.map((path) => (
                <div 
                  key={path.id} 
                  className="border rounded-md p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-primary mb-2">{path.name}</h3>
                  <Progress value={path.progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground mb-3">
                    <span>Progress: {path.progress}%</span>
                    <span>{path.courses.filter(c => c.isCompleted).length}/{path.courses.length} courses</span>
                  </div>
                  <div className="text-sm grid grid-cols-1 gap-1">
                    {path.courses.map((course) => (
                      <div key={course.id} className="flex items-center">
                        {course.isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{course.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6 gap-6">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                <span className="text-sm">Learning Path</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                <span className="text-sm">In Progress</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm">Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="current">My Learning Paths</TabsTrigger>
            <TabsTrigger value="explore">Explore Paths</TabsTrigger>
          </TabsList>
          
          {/* Current Learning Paths Tab */}
          <TabsContent value="current">
            {currentPaths.length === 0 ? (
              <div className="text-center py-12">
                <SearchX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Learning Paths Yet</h3>
                <p className="text-muted-foreground mb-6">You haven't enrolled in any learning paths yet.</p>
                <Button onClick={() => setActiveTab("explore")}>
                  Explore Learning Paths
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {currentPaths.map((path) => (
                  <Card key={path.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{path.name}</CardTitle>
                          <CardDescription>{path.description}</CardDescription>
                        </div>
                        <Badge variant={path.progress === 100 ? "success" : "secondary"}>
                          {path.progress === 100 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex">
                            <BarChart4 className="h-5 w-5 mr-2 text-primary" />
                            <div>
                              <p className="font-medium">Target Level</p>
                              <p className="text-muted-foreground">{path.targetSkillLevel}</p>
                            </div>
                          </div>
                          <div className="flex">
                            <Clock className="h-5 w-5 mr-2 text-primary" />
                            <div>
                              <p className="font-medium">Estimated Duration</p>
                              <p className="text-muted-foreground">{path.estimatedHours} hours</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-3">Courses in this path ({path.courses.length})</h4>
                          <div className="space-y-3">
                            {path.courses.map((course) => (
                              <div key={course.id} className="flex items-center gap-3">
                                {course.isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                )}
                                <div className="flex-grow">
                                  <span 
                                    className="font-medium hover:text-primary cursor-pointer"
                                    onClick={() => setLocation(`/courses/${course.id}`)}
                                  >
                                    {course.title}
                                  </span>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">{course.level}</Badge>
                                    <span className="text-xs text-muted-foreground">{course.duration} hours</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/courses/${course.id}`}>
                                    <a className="flex items-center">
                                      <span className="mr-1">View</span>
                                      <ChevronRight className="h-4 w-4" />
                                    </a>
                                  </Link>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 border-t">
                      <div className="flex flex-wrap gap-2">
                        {path.courses.flatMap(course => course.skills).filter(
                          (value, index, self) => self.indexOf(value) === index
                        ).slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                        {path.courses.flatMap(course => course.skills).filter(
                          (value, index, self) => self.indexOf(value) === index
                        ).length > 5 && (
                          <Badge variant="outline">
                            +{path.courses.flatMap(course => course.skills).filter(
                              (value, index, self) => self.indexOf(value) === index
                            ).length - 5} more
                          </Badge>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Explore Paths Tab */}
          <TabsContent value="explore">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {explorePaths.map((path) => (
                <Card key={path.id}>
                  <CardHeader>
                    <CardTitle>{path.name}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex">
                          <BarChart4 className="h-5 w-5 mr-2 text-primary" />
                          <div>
                            <p className="font-medium">Target Level</p>
                            <p className="text-muted-foreground">{path.targetSkillLevel}</p>
                          </div>
                        </div>
                        <div className="flex">
                          <Clock className="h-5 w-5 mr-2 text-primary" />
                          <div>
                            <p className="font-medium">Duration</p>
                            <p className="text-muted-foreground">{path.estimatedHours} hours</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">Skills you'll learn:</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {path.courses.flatMap(course => course.skills).filter(
                            (value, index, self) => self.indexOf(value) === index
                          ).slice(0, 8).map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                          {path.courses.flatMap(course => course.skills).filter(
                            (value, index, self) => self.indexOf(value) === index
                          ).length > 8 && (
                            <Badge variant="secondary">
                              +{path.courses.flatMap(course => course.skills).filter(
                                (value, index, self) => self.indexOf(value) === index
                              ).length - 8} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Includes {path.courses.length} courses:</h4>
                        <ul className="text-sm space-y-1">
                          {path.courses.slice(0, 3).map((course) => (
                            <li key={course.id} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              {course.title}
                            </li>
                          ))}
                          {path.courses.length > 3 && (
                            <li className="text-muted-foreground text-sm mt-1">
                              +{path.courses.length - 3} more courses
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50">
                    <Button 
                      className="w-full" 
                      onClick={() => handleEnroll(path.id)}
                    >
                      Enroll in Learning Path
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}