import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import SocialLogin from '@/components/auth/social-login';
import { Link } from 'wouter';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/jwt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        // Store tokens if using JWT system
        if(result.accessToken) {
          localStorage.setItem('access_token', result.access_token);
        }
        localStorage.setItem('refresh_token', result.refresh_token);

        // Invalidate auth cache to refresh user data
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        setTimeout(() => {
          navigate('/dashboard');
          toast({
            title: 'Success',
            description: 'Login successful!',
          });
        }, 100)
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a 
                        href="/forgot-password" 
                        className="text-sm text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/forgot-password');
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                        <div className='relative'>
                            <Input type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 flex items-center pr-3'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                          {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me for 30 days
                </label>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
          <SocialLogin className="mt-4" />
          
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-medium mb-3">Test Accounts</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => fetch('/api/test-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: 'student@example.com' })
                }).then(() => window.location.href = '/dashboard')}
              >
                Student Account
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => fetch('/api/test-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: 'instructor@example.com' })
                }).then(() => window.location.href = '/instructor-dashboard')}
              >
                Instructor Account
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => fetch('/api/test-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: 'admin@example.com' })
                }).then(() => window.location.href = '/admin-dashboard')}
              >
                Admin Account
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => fetch('/api/test-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: 'company@example.com' })
                }).then(() => window.location.href = '/company-dashboard')}
              >
                Company Admin
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All test accounts use Replit Auth for authentication
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Register
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
