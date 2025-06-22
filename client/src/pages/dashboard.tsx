import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { useLocation } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import DashboardLayout from "@/components/layout/dashboard-layout";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import StatsCard from "@/components/dashboard/stats-card";
import CourseCard from "@/components/course/course-card";
import SubscriptionCard from "@/components/dashboard/subscription-card";
import UpcomingSessions from "@/components/dashboard/upcoming-sessions";
import AchievementSummary from "@/components/dashboard/achievement-summary";
import LearningPathCard from "@/components/dashboard/learning-path-card";
import LearningTip from "@/components/ui/learning-tip";
import { EmailVerificationBanner } from "@/components/auth/email-verification-banner";
import { UserRole } from "@shared/schema";
import { FullPageLoading, ContentLoading, AchievementLoading } from "@/components/ui/loading-animation";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isVerified, isLoading: isVerificationLoading, email } = useEmailVerification();
  const [_, setLocation] = useLocation();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
    
    // Redirect to specific dashboard based on role
    if (!isLoading && isAuthenticated && user) {
      if (user.role === UserRole.INTERNAL_ADMIN) {
        setLocation("/admin");
      } else if (user.role === UserRole.COMPANY_ADMIN) {
        setLocation("/company-admin");
      } else if (user.role === UserRole.INSTRUCTOR) {
        setLocation("/instructor");
      }
    }
  }, [isLoading, isAuthenticated, user, setLocation]);
  
  // Fetch user enrollments
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["/api/user/enrollments"],
    enabled: isAuthenticated,
  });
  
  // Fetch recommended courses
  const { data: recommendedCourses, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated,
  });
  
  // Fetch user subscription
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["/api/user/subscription"],
    enabled: isAuthenticated,
  });
  
  // Fetch user gamification data
  const { data: userBadges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["/api/gamification/user/badges"],
    enabled: isAuthenticated,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const { data: userPoints, isLoading: isLoadingPoints } = useQuery({
    queryKey: ["/api/gamification/user/points"],
    enabled: isAuthenticated,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const { data: userStreak, isLoading: isLoadingStreak } = useQuery({
    queryKey: ["/api/gamification/user/streak"],
    enabled: isAuthenticated,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const { data: activeChallenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ["/api/gamification/user/challenges/active"],
    enabled: isAuthenticated,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  if (isLoading) {
    return (
      <div className="h-screen">
        <FullPageLoading type="book" text="Loading your learning dashboard..." />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  // Filter active enrollments
  const activeEnrollments = enrollments?.filter(enrollment => 
    !enrollment.enrollment.completedAt
  ) || [];
  
  // Filter completed enrollments
  const completedEnrollments = enrollments?.filter(enrollment => 
    enrollment.enrollment.completedAt
  ) || [];
  
  // Calculate total learning hours
  const totalHours = enrollments?.reduce((total, enrollment) => {
    const durationMinutes = enrollment.course.duration || 0;
    return total + (durationMinutes / 60);
  }, 0) || 0;
  
  // Prepare recommended courses (exclude enrolled courses)
  const filtered = recommendedCourses?.filter(course => 
    !enrollments?.some(e => e.course.id === course.id)
  ).slice(0, 4) || [];
  
  return (
    <DashboardLayout>

      
      {/* Welcome Banner */}
      <WelcomeBanner />
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard 
          icon="book-open"
          iconBgColor="bg-primary-light bg-opacity-10"
          iconColor="text-primary"
          title="Courses In Progress"
          value={activeEnrollments.length}
          linkText="View all"
          linkHref="/dashboard/courses"
        />
        
        <StatsCard 
          icon="certificate"
          iconBgColor="bg-success bg-opacity-10"
          iconColor="text-success"
          title="Completed Courses"
          value={completedEnrollments.length}
          linkText="View certificates"
          linkHref="/dashboard/certificates"
        />
        
        <StatsCard 
          icon="clock"
          iconBgColor="bg-accent bg-opacity-10"
          iconColor="text-accent"
          title="Learning Hours"
          value={totalHours.toFixed(1)}
          linkText="View history"
          linkHref="/dashboard/history"
        />
        
        <StatsCard 
          icon="calendar-check"
          iconBgColor="bg-primary bg-opacity-10"
          iconColor="text-primary"
          title="Subscription Status"
          value={
            <div className="flex items-center">
              <span className="text-sm font-medium text-success mr-2">
                {subscription ? "Active" : "Inactive"}
              </span>
              {subscription && (
                <span className="text-xs text-neutral-medium">
                  {new Date(subscription.endDate) > new Date() 
                    ? `${Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))} months left` 
                    : "Expired"}
                </span>
              )}
            </div>
          }
          linkText="Manage subscription"
          linkHref="/subscriptions"
        />
      </div>
      
      {/* Dashboard Learning Tips */}
      <div className="mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-2">
          <LearningTip context="dashboard" />
        </div>
      </div>
      
      {/* Continue Learning Section */}
      <h2 className="text-xl font-bold text-neutral-darker mb-4">Continue Learning</h2>
      {isLoadingEnrollments ? (
        <div className="mb-8">
          <ContentLoading type="book" text="Loading your courses..." />
        </div>
      ) : activeEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {activeEnrollments.slice(0, 3).map(enrollment => (
            <CourseCard
              key={enrollment.course.id}
              id={enrollment.course.id}
              title={enrollment.course.title}
              description={enrollment.course.description}
              coverImage={enrollment.course.coverImage || `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300`}
              category={enrollment.category ? enrollment.category.name : "Course"}
              progress={enrollment.progress}
              inProgress={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 text-center">
          <div className="w-16 h-16 bg-primary-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-book-open text-primary text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">No courses in progress</h3>
          <p className="text-neutral-medium mb-4">Start learning by enrolling in a course today.</p>
          <a href="/courses" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark">
            Browse Courses
          </a>
        </div>
      )}
      
      {/* Recommended Courses Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-darker">Recommended For You</h2>
        <a href="/courses" className="text-sm font-medium text-primary hover:text-primary-dark">
          View all <i className="fa-solid fa-arrow-right ml-1"></i>
        </a>
      </div>
      
      {isLoadingRecommended ? (
        <div className="mb-8">
          <ContentLoading type="lightbulb" text="Finding courses just for you..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {filtered.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              coverImage={course.coverImage || `https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300`}
              category={"Course"}
              duration={Math.ceil(course.duration / 60)}
              rating={{ value: 4.5, count: 178 }}
              inProgress={false}
            />
          ))}
        </div>
      )}
      
      {/* Gamification & Skill Trees Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-1/2">
          <AchievementSummary 
            badges={userBadges}
            points={userPoints}
            streak={userStreak}
            challenges={activeChallenges}
            isLoading={isLoadingBadges || isLoadingPoints || isLoadingStreak || isLoadingChallenges}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <LearningPathCard 
            enrollments={enrollments}
            courseId={activeEnrollments[0]?.course?.id}
            isLoading={isLoadingEnrollments}
          />
        </div>
      </div>
      
      {/* Subscription Section */}
      <SubscriptionCard 
        subscription={subscription}
        isLoading={isLoadingSubscription}
      />
      
      {/* Upcoming Sessions */}
      <h2 className="text-xl font-bold text-neutral-darker mb-4">Upcoming Sessions</h2>
      <UpcomingSessions />
    </DashboardLayout>
  );
}
