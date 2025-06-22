import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  ArrowUp,
  ArrowDown,
  Star,
  Users,
  BookOpen,
  BarChart3,
  Pen
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { UserRole } from "@shared/schema";
import InstructorAnalytics from "@/components/analytics/instructor-analytics";

export default function InstructorDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated or not an instructor
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    } else if (!isLoading && isAuthenticated && user?.role !== UserRole.INSTRUCTOR) {
      setLocation("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, setLocation]);

  // Fetch instructor dashboard data
  const { data, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/instructor/stats"],
    enabled: isAuthenticated && user?.role === UserRole.INSTRUCTOR,
  });

  // Fetch instructor courses
  const { data: instructorCourses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/instructor/courses"],
    enabled: isAuthenticated && user?.role === UserRole.INSTRUCTOR,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== UserRole.INSTRUCTOR) {
    return null; // Will be redirected by the useEffect
  }

  // Stats for the overview tab
  const stats = {
    totalStudents: data?.totalStudents || 0,
    studentsTrend: data?.studentsTrend || 0,
    totalCourses: data?.totalCourses || 0, 
    coursesTrend: data?.coursesTrend || 0,
    averageRating: data?.averageRating || 0,
    ratingTrend: data?.ratingTrend || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            <p className="text-neutral-medium">Manage your courses and view student progress</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> Create Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-neutral-medium mb-4">
                  To create a new course, fill out the course details and submit. You'll be redirected to the course editor.
                </p>
                <Button className="w-full">Continue to Course Creation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard 
                title="Total Students" 
                value={stats.totalStudents} 
                description="Students enrolled in your courses"
                trend={stats.studentsTrend}
              />
              <StatCard 
                title="Total Courses" 
                value={stats.totalCourses} 
                description="Courses you've created"
                trend={stats.coursesTrend}
              />
              <StatCard 
                title="Average Rating" 
                value={stats.averageRating.toFixed(1)} 
                description="Average across all courses"
                trend={stats.ratingTrend}
              />
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Your Courses</h2>
            
            {instructorCourses && instructorCourses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {instructorCourses.map(course => (
                  <CourseCard 
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    students={course.enrollmentCount}
                    rating={course.averageRating}
                    coverImage={course.coverImage}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No courses created yet"
                description="Get started by creating your first course. Share your knowledge and expertise with students worldwide."
                action={
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create First Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-neutral-medium mb-4">
                          To create a new course, fill out the course details and submit. You'll be redirected to the course editor.
                        </p>
                        <Button className="w-full">Continue to Course Creation</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="courses">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-medium" />
                <Input 
                  placeholder="Search courses..." 
                  className="pl-10"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-neutral-medium mb-4">
                      To create a new course, fill out the course details and submit. You'll be redirected to the course editor.
                    </p>
                    <Button className="w-full">Continue to Course Creation</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {instructorCourses && instructorCourses.length > 0 ? (
              <div className="space-y-4">
                {instructorCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-40 md:h-auto">
                        <img 
                          src={course.coverImage} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-lg font-bold">{course.title}</h3>
                            <p className="text-neutral-medium mb-2">
                              Created on {new Date(course.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-6 mt-2">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-neutral-medium" />
                                <span>{course.enrollmentCount} students</span>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-amber-500" />
                                <span>{course.averageRating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <Button variant="outline" size="sm">
                              <Pen className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button size="sm">View Course</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No courses created yet"
                description="Get started by creating your first course. Share your knowledge and expertise with students worldwide."
                action={
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create First Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-neutral-medium mb-4">
                          To create a new course, fill out the course details and submit. You'll be redirected to the course editor.
                        </p>
                        <Button className="w-full">Continue to Course Creation</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-medium" />
                  <Input 
                    placeholder="Search students..." 
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Student</th>
                        <th className="text-left py-3 px-4 font-medium">Courses Enrolled</th>
                        <th className="text-left py-3 px-4 font-medium">Progress</th>
                        <th className="text-left py-3 px-4 font-medium">Last Active</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[/* Student data would be mapped here */]}
                    </tbody>
                  </table>

                  <div className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Students Yet</h3>
                    <p className="text-neutral-medium max-w-md mx-auto">
                      Once students enroll in your courses, you'll see them listed here with their progress information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {user?.id && (
                <InstructorAnalytics 
                  instructorId={user.id} 
                  selectedCourseId={undefined}
                  onSelectCourse={(courseId) => {
                    console.log("Selected course:", courseId);
                    // Implementation for course selection
                  }}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  trend: number;
}

function StatCard({ title, value, description, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-neutral-medium text-sm font-medium mb-2">{title}</h3>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="text-neutral-medium text-sm">{description}</div>
        {trend !== 0 && (
          <div className={`flex items-center mt-4 text-sm ${trend > 0 ? 'text-success' : 'text-destructive'}`}>
            {trend > 0 ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CourseCardProps {
  id: number;
  title: string;
  students: number;
  rating: number;
  coverImage: string;
}

function CourseCard({ id, title, students, rating, coverImage }: CourseCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-40">
        <img 
          src={coverImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6 flex-grow flex flex-col">
        <h3 className="font-bold mb-2">{title}</h3>
        
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-neutral-medium" />
            <span className="text-sm">{students} students</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-amber-500" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action: React.ReactNode;
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <BookOpen className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-neutral-medium max-w-md mx-auto mb-6">
          {description}
        </p>
        {action}
      </CardContent>
    </Card>
  );
}