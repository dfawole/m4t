import React, { useState, useEffect } from 'react';
import { useJwtAuth } from '@/hooks/useJwtAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Redirect, Link } from 'wouter';
import { Loader2, Shield, Award, Bookmark, LucideIcon, User, UserPlus, Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function JwtLoginDemo() {
  const { user, isLoading, login, logout, isAuthenticated } = useJwtAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const testUsers = [
    { email: 'student@example.com', role: 'Student', description: 'Regular user account with access to courses and learning features' },
    { email: 'instructor@example.com', role: 'Instructor', description: 'Can create and manage courses, view student analytics' },
    { email: 'admin@example.com', role: 'Admin', description: 'Full administrative access to all platform features' },
    { email: 'companyadmin@example.com', role: 'Company Admin', description: 'Manages company subscriptions and employee accounts' },
  ];

  const handleLogin = async (email: string) => {
    setIsLoggingIn(true);
    try {
      console.log('Starting login with email:', email);
      
      // Direct fetch call for simplicity and debugging
      const response = await fetch('/api/jwt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.accessToken) {
        localStorage.setItem('jwt_token', data.accessToken);
        window.location.reload(); // Simple reload to reflect login state
      } else {
        console.error('No access token received');
      }
    } catch (error) {
      console.error('Login error in component:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    // Simple logout by removing the token
    localStorage.removeItem('jwt_token');
    window.location.reload(); // Reload to update UI
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">JWT Authentication Demo</CardTitle>
          <CardDescription>
            {isAuthenticated 
              ? `Logged in as ${user?.email} (${user?.role})` 
              : 'Select a test account to log in with JWT'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  {user?.role === 'Admin' && <Shield className="h-5 w-5 text-primary" />}
                  {user?.role === 'Instructor' && <Award className="h-5 w-5 text-primary" />}
                  {user?.role === 'Student' && <User className="h-5 w-5 text-primary" />}
                  {user?.role === 'Company Admin' && <Building2 className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-medium leading-none">Welcome, {user?.firstName || user?.email?.split('@')[0]}</h3>
                  <Badge variant="outline" className="mt-1">{user?.role}</Badge>
                </div>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="font-medium mb-2">User Information</h3>
                <div className="text-sm space-y-1.5">
                  <div><span className="font-medium">ID:</span> {user?.id}</div>
                  <div><span className="font-medium">Email:</span> {user?.email}</div>
                  <div><span className="font-medium">Name:</span> {user?.firstName || 'N/A'} {user?.lastName || ''}</div>
                  <div><span className="font-medium">Role:</span> {user?.role}</div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/10">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> JWT Authentication Status
                </h3>
                <div className="space-y-2 text-sm">
                  <Alert variant="default" className="py-2">
                    <AlertTitle className="text-xs">Authentication Active</AlertTitle>
                    <AlertDescription className="text-xs text-muted-foreground">
                      Your session is valid and authenticated
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-xs text-muted-foreground space-y-1 ml-1">
                    <div>• JWT tokens stored in localStorage</div>
                    <div>• Access token valid for 15 minutes</div>
                    <div>• Refresh token valid for 7 days</div>
                    <div>• Protected routes use tokens for auth</div>
                  </div>
                </div>
              </div>
              
              {user?.role === 'Admin' && (
                <div className="bg-secondary/10 p-4 rounded-md border border-secondary/20">
                  <h3 className="font-medium mb-2">Admin Access</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    As an admin, you have access to platform management features.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link href="/admin-dashboard">
                      <Button variant="secondary" size="sm" className="w-full">
                        <Users className="h-4 w-4 mr-2" /> View Admin Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {user?.role === 'Instructor' && (
                <div className="bg-secondary/10 p-4 rounded-md border border-secondary/20">
                  <h3 className="font-medium mb-2">Instructor Access</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    As an instructor, you have access to course management features.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link href="/instructor-dashboard">
                      <Button variant="secondary" size="sm" className="w-full">
                        <Award className="h-4 w-4 mr-2" /> View Instructor Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {user?.role === 'Student' && (
                <div className="bg-secondary/10 p-4 rounded-md border border-secondary/20">
                  <h3 className="font-medium mb-2">Student Access</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    As a student, you have access to learning content and your personal dashboard.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link href="/dashboard">
                      <Button variant="secondary" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" /> View Student Dashboard
                      </Button>
                    </Link>
                    <Link href="/learning-path">
                      <Button variant="outline" size="sm" className="w-full">
                        <Bookmark className="h-4 w-4 mr-2" /> My Learning Path
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {user?.role === 'Company Admin' && (
                <div className="bg-secondary/10 p-4 rounded-md border border-secondary/20">
                  <h3 className="font-medium mb-2">Company Admin Access</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    As a company admin, you can manage organization accounts and subscriptions.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link href="/company-dashboard">
                      <Button variant="secondary" size="sm" className="w-full">
                        <Building2 className="h-4 w-4 mr-2" /> Company Dashboard
                      </Button>
                    </Link>
                    <Link href="/subscriptions">
                      <Button variant="outline" size="sm" className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" /> Manage Subscriptions
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="student">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
              </TabsList>
              
              {testUsers.map((testUser) => (
                <TabsContent key={testUser.email} value={testUser.role.toLowerCase().replace(' ', '')}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Role: {testUser.role}</h3>
                      <p className="text-sm text-muted-foreground">{testUser.description}</p>
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Email:</span> {testUser.email}</div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleLogin(testUser.email)}
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        `Login as ${testUser.role} with JWT`
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex flex-col border-t pt-4">
          <div className="text-xs text-muted-foreground mb-2">
            JWT authentication provides enterprise-standard security with stateless tokens
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Note:</span> This is using the new JWT authentication system
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}