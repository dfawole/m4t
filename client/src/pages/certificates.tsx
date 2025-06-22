import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Award, Download, Trophy, Calendar, Clock } from "lucide-react";

export default function Certificates() {
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
  
  // Fetch user badges
  const { data: userBadges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["/api/gamification/user/badges"],
    enabled: isAuthenticated,
  });
  
  if (isLoading || isLoadingEnrollments || isLoadingBadges) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  // Filter completed enrollments for certificates
  const completedEnrollments = enrollments?.filter(enrollment => 
    enrollment.enrollment.completedAt
  ) || [];
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text mb-2">
          My Certificates
        </h1>
        <p className="text-gray-500">
          View and download your certificates of achievement
        </p>
      </div>
      
      {/* Certificates Section */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Course Completion Certificates
                </CardTitle>
                <CardDescription>
                  Certificates earned for completing courses
                </CardDescription>
              </div>
              <Badge className="bg-primary hover:bg-primary">
                {completedEnrollments.length} Certificate{completedEnrollments.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {completedEnrollments.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
                <p className="text-neutral-medium mb-4">Complete a course to earn your first certificate.</p>
                <Button onClick={() => setLocation("/courses")}>
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedEnrollments.map((enrollment) => (
                  <div key={enrollment.enrollment.id} className="border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex-shrink-0 flex items-center justify-center">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{enrollment.course.title}</h3>
                        <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(enrollment.enrollment.completedAt || "").toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {Math.ceil((enrollment.course.duration || 0) / 60)} hours
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Badges Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                  Achievement Badges
                </CardTitle>
                <CardDescription>
                  Badges earned for various accomplishments
                </CardDescription>
              </div>
              <Badge className="bg-amber-500 hover:bg-amber-600">
                {userBadges?.length || 0} Badge{(!userBadges || userBadges.length !== 1) ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {!userBadges || userBadges.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No badges yet</h3>
                <p className="text-neutral-medium mb-4">Complete challenges to earn badges and showcase your achievements.</p>
                <Button onClick={() => setLocation("/achievements")}>
                  View Achievements
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userBadges.map((badge) => (
                  <Card key={badge.id} className="border-amber-200 bg-amber-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">{badge.icon}</span>
                      </div>
                      <h3 className="font-semibold text-amber-800">{badge.name}</h3>
                      <p className="text-sm text-amber-700 mt-1">{badge.description}</p>
                      <div className="mt-2 text-xs text-amber-600">
                        Earned on {new Date(badge.awardedAt || "").toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}