import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@shared/schema";

export default function Profile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    companyName: "",
    jobTitle: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Tabs state
  const [activeTab, setActiveTab] = useState("profile");
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/api/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  // Set form data when user loads
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        companyName: "",
        jobTitle: "",
      }));
    }
  }, [user]);
  
  // Fetch user's company if they belong to one
  const { data: company } = useQuery({
    queryKey: ["/api/companies", user?.companyId],
    enabled: isAuthenticated && !!user?.companyId,
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest("PATCH", "/api/user/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio
      });
      
      // Invalidate cached user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Your new password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest("POST", "/api/user/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
        variant: "default",
      });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "There was a problem changing your password.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  // Helper function to get user role display name
  const getRoleDisplay = (role: string) => {
    switch(role) {
      case UserRole.STUDENT:
        return "Student";
      case UserRole.INSTRUCTOR:
        return "Instructor";
      case UserRole.COMPANY_ADMIN:
        return "Company Admin";
      case UserRole.INTERNAL_ADMIN:
        return "Administrator";
      default:
        return "Student";
    }
  };
  
  // Generate user initials for avatar fallback
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-neutral-medium mb-3">{user?.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="bg-primary-light bg-opacity-10 text-primary">
                  {getRoleDisplay(user?.role || "")}
                </Badge>
                
                {user?.companyId && company && (
                  <Badge variant="outline" className="bg-accent-light bg-opacity-10 text-accent">
                    {company.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="bg-white rounded-lg shadow-sm p-1 mb-8"
        >
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
            <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="p-6">
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p className="text-neutral-medium">
                  Update your personal information and public profile.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <p className="text-xs text-neutral-medium">
                    Your email address is managed through your login provider.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a little about yourself"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={company?.name || formData.companyName}
                      onChange={handleInputChange}
                      disabled={!!user?.companyId}
                    />
                    {user?.companyId && (
                      <p className="text-xs text-neutral-medium">
                        Your company is managed by your administrator.
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account" className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Account Settings</h2>
              <p className="text-neutral-medium">
                Manage your account settings and preferences.
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Type</CardTitle>
                  <CardDescription>
                    Your current account type and privileges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Role: {getRoleDisplay(user?.role || "")}</h3>
                        <p className="text-sm text-neutral-medium">
                          {user?.role === UserRole.STUDENT && "Standard user privileges"}
                          {user?.role === UserRole.INSTRUCTOR && "Create and manage courses"}
                          {user?.role === UserRole.COMPANY_ADMIN && "Manage company users and subscriptions"}
                          {user?.role === UserRole.INTERNAL_ADMIN && "Full platform administration privileges"}
                        </p>
                      </div>
                      <Badge className="bg-primary-light bg-opacity-10 text-primary">
                        {getRoleDisplay(user?.role || "")}
                      </Badge>
                    </div>
                    
                    {user?.companyId && company && (
                      <div className="pt-4 border-t border-neutral-100">
                        <h3 className="font-medium">Company: {company.name}</h3>
                        <p className="text-sm text-neutral-medium">
                          You are part of a company account
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription>
                    Download a copy of your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-medium mb-4">
                      You can export and download all your personal data, including your profile information, course progress, certificates, and other activity.
                    </p>
                    <Button variant="outline">
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardHeader className="text-red-600">
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription className="text-red-500">
                    Permanently delete your account and all data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-medium mb-4">
                      Once you delete your account, there is no going back. All your data will be permanently removed from our servers.
                    </p>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="p-6">
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Security Settings</h2>
                <p className="text-neutral-medium">
                  Manage your password and security preferences.
                </p>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <Button type="submit">
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Session Management</CardTitle>
                    <CardDescription>
                      Manage your active sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <i className="fa-solid fa-desktop text-primary mr-3"></i>
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-xs text-neutral-medium">
                                Browser: Chrome on Windows • IP: 192.168.1.1
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-success bg-opacity-10 text-success">
                            Active
                          </Badge>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        Sign Out All Other Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Notification Preferences</h2>
              <p className="text-neutral-medium">
                Manage how and when you receive notifications.
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Control which emails you receive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Updates</p>
                        <p className="text-sm text-neutral-medium">Receive notifications about courses you're enrolled in</p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="course-updates"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Content Alerts</p>
                        <p className="text-sm text-neutral-medium">Get notified when new courses or content is added</p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="new-content"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotional Emails</p>
                        <p className="text-sm text-neutral-medium">Receive emails about special offers and promotions</p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="promotional"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-neutral-medium">Subscribe to our monthly newsletter</p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="newsletter"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button>
                  Save Preferences
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
