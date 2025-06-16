import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Award, User, Building2 } from 'lucide-react';

export default function QuickLogin() {
  // Simple login page with direct links to login with different test users
  const testAccounts = [
    { 
      name: 'Student Account', 
      description: 'Access courses and track your learning progress', 
      icon: <User className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200',
      link: '/api/login'
    },
    { 
      name: 'Instructor Account', 
      description: 'Create and manage courses, view analytics', 
      icon: <Award className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200 border-purple-200',
      link: '/api/login'
    },
    { 
      name: 'Admin Account', 
      description: 'Full access to all platform features', 
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600 hover:bg-red-200 border-red-200',
      link: '/api/login'
    },
    { 
      name: 'Company Admin', 
      description: 'Manage company subscriptions and employees', 
      icon: <Building2 className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600 hover:bg-green-200 border-green-200',
      link: '/api/login'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-4xl">
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">E-Learning Platform Login</CardTitle>
            <CardDescription className="text-lg pt-2">
              Select an account to login directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testAccounts.map((account, index) => (
                <Card key={index} className="overflow-hidden border">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-full ${account.color.split(' ')[0]}`}>
                        {account.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{account.name}</h3>
                        <p className="text-sm text-muted-foreground">{account.description}</p>
                      </div>
                    </div>
                    <Button 
                      className={`w-full ${account.color}`}
                      variant="outline"
                      onClick={() => window.location.href = account.link}
                    >
                      Login with this account
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col text-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              These are test accounts for demonstration purposes only.
              All accounts use secure JWT authentication.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}