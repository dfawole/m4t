import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Calendar as CalendarIcon, Clock, BookOpen, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FullPageLoading } from "@/components/ui/loading-animation";

export default function Calendar() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  // Fetch user enrollments
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["/api/user/enrollments"],
    enabled: isAuthenticated,
  });
  
  if (isLoading || isLoadingEnrollments) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  // Mock upcoming sessions - in a real app, these would come from an API
  const upcomingSessions = [
    {
      id: 1,
      title: "Introduction to React Hooks",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
      time: "10:00 AM - 11:30 AM",
      instructor: "Dr. Sarah Johnson",
      type: "Live Lecture"
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      time: "2:00 PM - 3:30 PM",
      instructor: "Prof. Michael Chen",
      type: "Workshop"
    },
    {
      id: 3, 
      title: "UI/UX Design Principles",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      time: "11:00 AM - 12:30 PM",
      instructor: "Emma Rodriguez",
      type: "Discussion"
    }
  ];
  
  // Mock deadlines - in a real app, these would come from an API
  const upcomingDeadlines = [
    {
      id: 1,
      title: "JavaScript Fundamentals Quiz",
      courseTitle: "Web Development Bootcamp",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day from now
      type: "Quiz"
    },
    {
      id: 2,
      title: "React Component Architecture",
      courseTitle: "Advanced React Development",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // 4 days from now
      type: "Assignment"
    },
    {
      id: 3,
      title: "Final Project Milestone 1",
      courseTitle: "Full Stack Development",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      type: "Project"
    }
  ];
  
  // Function to format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text mb-2">
          My Calendar
        </h1>
        <p className="text-gray-500">
          Keep track of your upcoming sessions, deadlines, and important dates
        </p>
      </div>
      
      {/* Calendar Section */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        {/* Upcoming Live Sessions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Live Sessions
                </CardTitle>
                <CardDescription>
                  Live lectures, workshops, and discussion sessions with instructors
                </CardDescription>
              </div>
              <Badge className="bg-primary hover:bg-primary">
                {upcomingSessions.length} Session{upcomingSessions.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                <p className="text-neutral-medium mb-4">Check back later for new scheduled sessions or enroll in more courses.</p>
                <Button onClick={() => setLocation("/courses")}>
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex-shrink-0 flex items-center justify-center">
                        <CalendarIcon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.time}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {session.instructor}
                          </span>
                        </div>
                        <Badge variant="outline" className="mt-2">{session.type}</Badge>
                      </div>
                    </div>
                    <Button>
                      Join Session
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>
                  Quizzes, assignments, and project milestones
                </CardDescription>
              </div>
              <Badge className="bg-amber-500 hover:bg-amber-600">
                {upcomingDeadlines.length} Deadline{upcomingDeadlines.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No upcoming deadlines</h3>
                <p className="text-neutral-medium mb-4">You're all caught up! Check back later for new assignments.</p>
                <Button onClick={() => setLocation("/dashboard/courses")}>
                  View My Courses
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex-shrink-0 flex items-center justify-center">
                        <Clock className="h-8 w-8 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{deadline.title}</h3>
                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {deadline.courseTitle}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Due {formatDate(deadline.dueDate)}
                          </span>
                          <Badge variant="outline" className="ml-3">{deadline.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}