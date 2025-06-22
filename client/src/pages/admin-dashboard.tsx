import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AdminAnalytics from "@/components/analytics/admin-analytics";
import UserEngagementAnalytics from "@/components/analytics/user-engagement-analytics";
import LearningPathAnalytics from "@/components/analytics/learning-path-analytics";
import { UserRole } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    } else if (!isLoading && isAuthenticated && user?.role !== UserRole.INTERNAL_ADMIN) {
      setLocation("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, setLocation]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== UserRole.INTERNAL_ADMIN) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-neutral-medium">
            Monitor platform metrics, users, and content
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminAnalytics />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <div className="mb-6">
              <UserEngagementAnalytics />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium mb-2">User Management Interface</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will allow administrators to manage users, assign roles, and view detailed user information.
                  </p>
                  <Button className="bg-primary">
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <div className="mb-6">
              <LearningPathAnalytics />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Course Administration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Course Management Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will allow administrators to review, approve, and manage courses from all instructors.
                  </p>
                  <Button className="bg-primary">
                    View All Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Subscription Management</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will allow administrators to create, edit, and manage subscription plans for both individual users and companies.
                  </p>
                  <Button className="bg-primary">
                    Manage Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Global Platform Configuration</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will allow administrators to configure platform-wide settings, integrations, and appearance options.
                  </p>
                  <Button className="bg-primary">
                    Configure Platform
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}