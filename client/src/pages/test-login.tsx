import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Redirect } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

export default function TestLogin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const testUsers = [
    { email: 'student@example.com', role: 'Student', description: 'Regular user account with access to courses and learning features' },
    { email: 'instructor@example.com', role: 'Instructor', description: 'Can create and manage courses, view student analytics' },
    { email: 'admin@example.com', role: 'Admin', description: 'Full administrative access to all platform features' },
    { email: 'companyadmin@example.com', role: 'Company Admin', description: 'Manages company subscriptions and employee accounts' },
  ];

  const handleTestLogin = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/test-login', { email });
      const data = await response.json();
      
      queryClient.setQueryData(['/api/auth/user'], data);
      
      toast({
        title: 'Login Successful',
        description: `Logged in as ${data.email} (${data.role})`,
      });
      
      setLoggedIn(true);
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Could not log in with test account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Test User Accounts</CardTitle>
          <CardDescription>
            Select a test account to log in with different user roles
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
            
            {testUsers.map((user, index) => (
              <TabsContent key={user.email} value={user.role.toLowerCase().replace(' ', '')}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Role: {user.role}</h3>
                    <p className="text-sm text-muted-foreground">{user.description}</p>
                    <div className="text-sm space-y-1">
                      <div><span className="font-medium">Email:</span> {user.email}</div>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleTestLogin(user.email)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : `Login as ${user.role}`}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            These accounts are for testing purposes only
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}