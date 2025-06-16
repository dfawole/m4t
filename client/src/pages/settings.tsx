import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, Save, UserCircle, Bell, Lock, Smartphone, Mail, Globe, Palette, Sliders } from "lucide-react";

export default function Settings() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States for form values
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [timezone, setTimezone] = useState(user?.timezone || "UTC");
  const [language, setLanguage] = useState(user?.language || "en");
  const [theme, setTheme] = useState(user?.theme || "system");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  
  // Learning preferences
  const [learningStyle, setLearningStyle] = useState("visual");
  const [difficultyPreference, setDifficultyPreference] = useState("adaptive");
  const [feedbackFrequency, setFeedbackFrequency] = useState("medium");
  
  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(false);
  const [shareAchievements, setShareAchievements] = useState(true);
  const [shareProgress, setShareProgress] = useState(false);
  
  // Security settings - placeholders
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  // Profile update mutation
  const updateProfile = useMutation({
    mutationFn: async (profileData: any) => {
      return apiRequest("PUT", "/api/user/profile", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  });
  
  // Notification settings mutation
  const updateNotificationSettings = useMutation({
    mutationFn: async (notificationData: any) => {
      return apiRequest("PUT", "/api/user/notifications", notificationData);
    },
    onSuccess: () => {
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your notification settings.",
        variant: "destructive",
      });
    }
  });
  
  // Learning preferences mutation
  const updateLearningPreferences = useMutation({
    mutationFn: async (preferencesData: any) => {
      return apiRequest("PUT", "/api/user/learning-preferences", preferencesData);
    },
    onSuccess: () => {
      toast({
        title: "Learning Preferences Updated",
        description: "Your learning preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your learning preferences.",
        variant: "destructive",
      });
    }
  });
  
  // Privacy settings mutation
  const updatePrivacySettings = useMutation({
    mutationFn: async (privacyData: any) => {
      return apiRequest("PUT", "/api/user/privacy", privacyData);
    },
    onSuccess: () => {
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy settings have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your privacy settings.",
        variant: "destructive",
      });
    }
  });
  
  // Security settings mutation
  const updateSecuritySettings = useMutation({
    mutationFn: async (securityData: any) => {
      return apiRequest("PUT", "/api/user/security", securityData);
    },
    onSuccess: () => {
      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your security settings.",
        variant: "destructive",
      });
    }
  });
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      firstName,
      lastName,
      email,
      phone,
      bio,
      timezone,
      language,
      theme
    });
  };
  
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationSettings.mutate({
      emailNotifications,
      courseUpdates,
      weeklyDigest,
      achievementAlerts
    });
  };
  
  const handleLearningPreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearningPreferences.mutate({
      learningStyle,
      difficultyPreference,
      feedbackFrequency
    });
  };
  
  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrivacySettings.mutate({
      publicProfile,
      shareAchievements,
      shareProgress
    });
  };
  
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecuritySettings.mutate({
      twoFactorEnabled
    });
  };
  
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
    return null; // Will be redirected by useEffect
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="profile">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="learning">
              <Sliders className="mr-2 h-4 w-4" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Globe className="mr-2 h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information and preferences
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      rows={3}
                      className="w-full min-h-[100px] p-2 border border-input rounded-md"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (GMT-4)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (GMT-5)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (GMT-6)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (GMT-7)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
                          <SelectItem value="Europe/Paris">Central Europe (GMT+2)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System Default</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto" 
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleNotificationSubmit}>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="course-updates" 
                        checked={courseUpdates}
                        onCheckedChange={(checked) => 
                          setCourseUpdates(!!checked)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="course-updates"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Course Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about course content updates and new lessons
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="weekly-digest" 
                        checked={weeklyDigest}
                        onCheckedChange={(checked) => 
                          setWeeklyDigest(!!checked)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="weekly-digest"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Weekly Learning Digest
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get a weekly summary of your learning progress and achievements
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="achievement-alerts" 
                        checked={achievementAlerts}
                        onCheckedChange={(checked) => 
                          setAchievementAlerts(!!checked)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="achievement-alerts"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Achievement Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you earn new badges, level up, or reach learning milestones
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto" 
                    disabled={updateNotificationSettings.isPending}
                  >
                    {updateNotificationSettings.isPending ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Learning Preferences Tab */}
          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
                <CardDescription>
                  Customize your learning experience and content recommendations
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLearningPreferencesSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="learning-style">Learning Style</Label>
                    <Select value={learningStyle} onValueChange={setLearningStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select learning style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual Learner</SelectItem>
                        <SelectItem value="auditory">Auditory Learner</SelectItem>
                        <SelectItem value="reading">Reading/Writing Learner</SelectItem>
                        <SelectItem value="kinesthetic">Hands-on Learner</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll prioritize content that matches your preferred learning style
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-preference">Content Difficulty</Label>
                    <Select value={difficultyPreference} onValueChange={setDifficultyPreference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easier">Easier than my current level</SelectItem>
                        <SelectItem value="matched">Matched to my current level</SelectItem>
                        <SelectItem value="challenging">More challenging than my current level</SelectItem>
                        <SelectItem value="adaptive">Adaptive (automatically adjusts)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      This helps us recommend content at the right difficulty level for you
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback-frequency">Feedback Frequency</Label>
                    <Select value={feedbackFrequency} onValueChange={setFeedbackFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Minimal (end of modules only)</SelectItem>
                        <SelectItem value="medium">Moderate (at key checkpoints)</SelectItem>
                        <SelectItem value="high">Frequent (after most activities)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      How often would you like to receive progress checks and feedback?
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto" 
                    disabled={updateLearningPreferences.isPending}
                  >
                    {updateLearningPreferences.isPending ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control what information is visible to others
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePrivacySubmit}>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="public-profile">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={publicProfile}
                      onCheckedChange={setPublicProfile}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-achievements">Share Achievements</Label>
                      <p className="text-sm text-muted-foreground">
                        Show your badges and accomplishments on your profile
                      </p>
                    </div>
                    <Switch
                      id="share-achievements"
                      checked={shareAchievements}
                      onCheckedChange={setShareAchievements}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-progress">Share Learning Progress</Label>
                      <p className="text-sm text-muted-foreground">
                        Show your course progress and learning statistics
                      </p>
                    </div>
                    <Switch
                      id="share-progress"
                      checked={shareProgress}
                      onCheckedChange={setShareProgress}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto" 
                    disabled={updatePrivacySettings.isPending}
                  >
                    {updatePrivacySettings.isPending ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication options
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSecuritySubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        id="2fa"
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                    
                    {twoFactorEnabled && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                          Two-factor authentication setup coming soon!
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" disabled />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" disabled />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" disabled />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Password change functionality coming soon. Since you're using our authentication system, 
                    you can manage your password through your account settings.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto" 
                    disabled={updateSecuritySettings.isPending}
                  >
                    {updateSecuritySettings.isPending ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}