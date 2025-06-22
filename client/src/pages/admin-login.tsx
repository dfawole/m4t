import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Shield, Users, GraduationCap } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: typeof formData) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName || user.username}!`,
      });
      
      // Redirect based on role
      if (user.role === 'internal_admin') {
        setLocation("/admin");
      } else if (user.role === 'company_admin') {
        setLocation("/company-admin");
      } else if (user.role === 'instructor') {
        setLocation("/instructor");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const testAccounts = [
    {
      icon: Shield,
      title: "Internal Admin",
      username: "admin",
      password: "admin123",
      role: "internal_admin",
      description: "Full platform administration access"
    },
    {
      icon: Users,
      title: "Company Admin",
      username: "company_admin",
      password: "company123", 
      role: "company_admin",
      description: "Company license and user management"
    },
    {
      icon: GraduationCap,
      title: "Instructor",
      username: "instructor",
      password: "instructor123",
      role: "instructor", 
      description: "Course creation and student management"
    }
  ];

  const quickLogin = (username: string, password: string) => {
    setFormData({ username, password });
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto lg:mx-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
            <CardDescription>
              Access your administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">
                For regular student access, use the <a href="/login" className="text-blue-600 hover:underline">student login page</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Accounts */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Accounts</h2>
            <p className="text-gray-600">Quick access for development and testing</p>
          </div>
          
          <div className="grid gap-4">
            {testAccounts.map((account) => (
              <Card key={account.role} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <account.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{account.title}</h3>
                      <p className="text-sm text-gray-600">{account.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Username: {account.username} | Password: {account.password}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin(account.username, account.password)}
                      disabled={loginMutation.isPending}
                    >
                      Quick Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Development Notice</h4>
                <p className="text-sm text-amber-700 mt-1">
                  These are test accounts for development purposes. In production, these should be replaced with secure authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}