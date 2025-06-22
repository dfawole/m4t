import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield, Award, User, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function TestAccountLogin() {
  const [, navigate] = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  
  const testUsers = [
    { email: 'student@example.com', role: 'Student', description: 'Regular user account with access to courses and learning features' },
    { email: 'instructor@example.com', role: 'Instructor', description: 'Can create and manage courses, view student analytics' },
    { email: 'admin@example.com', role: 'Admin', description: 'Full administrative access to all platform features' },
    { email: 'companyadmin@example.com', role: 'Company Admin', description: 'Manages company subscriptions and employee accounts' },
  ];

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-5 w-5 text-primary" />;
      case 'Instructor':
        return <Award className="h-5 w-5 text-primary" />;
      case 'Student':
        return <User className="h-5 w-5 text-primary" />;
      case 'Company Admin':
        return <Building2 className="h-5 w-5 text-primary" />;
      default:
        return <User className="h-5 w-5 text-primary" />;
    }
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    
    // For simplicity, just redirect to the built-in login endpoint
    window.location.href = '/api/login';
    
    toast({
      title: 'Redirecting...',
      description: 'Taking you to the authentication service',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Test Account Login</CardTitle>
          <CardDescription>
            Select a test account to log in to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getRoleIcon(testUser.role)}
                    </div>
                    <div>
                      <h3 className="font-medium">{testUser.role} Account</h3>
                      <Badge variant="outline" className="mt-1">{testUser.email}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{testUser.description}</p>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      `Login as ${testUser.role}`
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col border-t pt-4">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Note:</span> These are test accounts for demonstration purposes
          </div>
          <div className="mt-2 w-full flex justify-center">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Return to Standard Login
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}