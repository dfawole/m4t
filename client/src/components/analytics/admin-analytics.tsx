import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BookOpen,
  GraduationCap,
  School,
  Building
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get platform statistics
  const { data: platformStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/admin/platform-stats', { timeRange }],
  });

  // Get revenue metrics
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['/api/admin/revenue', { timeRange }],
  });

  // Get user growth metrics
  const { data: growthData, isLoading: isLoadingGrowth } = useQuery({
    queryKey: ['/api/admin/user-growth', { timeRange }],
  });

  // Get course metrics
  const { data: courseData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['/api/admin/courses', { categoryId: selectedCategory !== 'all' ? selectedCategory : undefined }],
  });

  // Get category list
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const isLoading = isLoadingStats || isLoadingRevenue || isLoadingGrowth || isLoadingCourses || isLoadingCategories;

  // Sample platform stats data
  const samplePlatformStats = {
    totalUsers: 1425,
    totalCourses: 42,
    totalEnrollments: 3876,
    totalCompletions: 1254,
    totalRevenue: 58750,
    activeCourses: 35,
    activeInstructors: 12,
    activeCompanies: 8,
    userGrowth: 15.2,
    revenueGrowth: 23.5,
    courseGrowth: 8.3,
  };

  // Sample revenue data
  const sampleRevenueData = [
    { date: 'Jan', revenue: 4200, subscriptions: 45 },
    { date: 'Feb', revenue: 4800, subscriptions: 52 },
    { date: 'Mar', revenue: 5300, subscriptions: 58 },
    { date: 'Apr', revenue: 4900, subscriptions: 53 },
    { date: 'May', revenue: 5800, subscriptions: 62 },
    { date: 'Jun', revenue: 6200, subscriptions: 68 },
    { date: 'Jul', revenue: 6800, subscriptions: 75 },
    { date: 'Aug', revenue: 7200, subscriptions: 79 },
    { date: 'Sep', revenue: 7500, subscriptions: 82 },
    { date: 'Oct', revenue: 8100, subscriptions: 88 },
    { date: 'Nov', revenue: 8400, subscriptions: 92 },
    { date: 'Dec', revenue: 8900, subscriptions: 97 },
  ];
  
  // Sample growth data
  const sampleGrowthData = [
    { date: 'Jan', users: 850, instructors: 8, companies: 4 },
    { date: 'Feb', users: 920, instructors: 9, companies: 4 },
    { date: 'Mar', users: 975, instructors: 9, companies: 5 },
    { date: 'Apr', users: 1050, instructors: 10, companies: 5 },
    { date: 'May', users: 1120, instructors: 10, companies: 6 },
    { date: 'Jun', users: 1180, instructors: 11, companies: 6 },
    { date: 'Jul', users: 1250, instructors: 11, companies: 7 },
    { date: 'Aug', users: 1290, instructors: 11, companies: 7 },
    { date: 'Sep', users: 1325, instructors: 12, companies: 7 },
    { date: 'Oct', users: 1360, instructors: 12, companies: 7 },
    { date: 'Nov', users: 1390, instructors: 12, companies: 8 },
    { date: 'Dec', users: 1425, instructors: 12, companies: 8 },
  ];

  // Sample top courses data
  const sampleTopCoursesData = [
    { name: 'Complete Web Development Bootcamp', enrollments: 345, revenue: 10350, rating: 4.8 },
    { name: 'Python for Data Science', enrollments: 278, revenue: 8340, rating: 4.7 },
    { name: 'Mobile App Development with Flutter', enrollments: 195, revenue: 5850, rating: 4.6 },
    { name: 'UI/UX Design Fundamentals', enrollments: 156, revenue: 4680, rating: 4.5 },
    { name: 'Business Management Essentials', enrollments: 124, revenue: 3720, rating: 4.4 },
  ];

  // Sample user type distribution
  const sampleUserTypeData = [
    { name: 'Students', value: 1315 },
    { name: 'Instructors', value: 42 },
    { name: 'Company Admins', value: 28 },
    { name: 'Internal Admins', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Platform Administration</h2>
          <p className="text-muted-foreground">Monitor platform metrics, user growth, and revenue statistics.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={timeRange === 'week' ? 'bg-primary text-primary-foreground' : ''}
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={timeRange === 'month' ? 'bg-primary text-primary-foreground' : ''}
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={timeRange === 'year' ? 'bg-primary text-primary-foreground' : ''}
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : platformStats?.totalUsers || samplePlatformStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{isLoading ? '--' : platformStats?.userGrowth || samplePlatformStats.userGrowth}% from last {timeRange}
            </p>
            <Progress className="mt-2" value={65} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : platformStats?.activeCourses || samplePlatformStats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              +{isLoading ? '--' : platformStats?.courseGrowth || samplePlatformStats.courseGrowth}% from last {timeRange}
            </p>
            <Progress className="mt-2" value={75} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : platformStats?.totalEnrollments || samplePlatformStats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '--' : platformStats?.completionRate || '32.4'}% completion rate
            </p>
            <Progress className="mt-2" value={48} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${isLoading ? '--' : platformStats?.totalRevenue?.toLocaleString() || samplePlatformStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{isLoading ? '--' : platformStats?.revenueGrowth || samplePlatformStats.revenueGrowth}% from last {timeRange}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-staggered-fade">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Platform revenue and subscriptions over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={isLoading ? sampleRevenueData : revenueData?.timeline || sampleRevenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue ($)"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="subscriptions" 
                      name="Subscriptions" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="animate-staggered-fade">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Growth of users by type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={isLoading ? sampleGrowthData : growthData?.timeline || sampleGrowthData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Students"
                    />
                    <Area
                      type="monotone"
                      dataKey="instructors"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Instructors"
                    />
                    <Area
                      type="monotone"
                      dataKey="companies"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                      name="Companies"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-staggered-fade">
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
              <CardDescription>
                Highest revenue-generating courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3.5 text-left text-sm font-semibold">Course</th>
                      <th className="px-4 py-3.5 text-left text-sm font-semibold">Enrollments</th>
                      <th className="px-4 py-3.5 text-left text-sm font-semibold">Revenue</th>
                      <th className="px-4 py-3.5 text-left text-sm font-semibold">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(isLoading ? sampleTopCoursesData : courseData?.topCourses || sampleTopCoursesData).map((course, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">{course.name}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">{course.enrollments}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">${course.revenue.toLocaleString()}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                          <div className="flex items-center">
                            <span className={`mr-2 ${
                              course.rating >= 4.5 ? 'text-green-500' : 
                              course.rating >= 4.0 ? 'text-yellow-500' : 
                              'text-red-500'
                            }`}>
                              {course.rating}
                            </span>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  course.rating >= 4.5 ? 'bg-green-500' : 
                                  course.rating >= 4.0 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${(course.rating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${isLoading ? '--' : platformStats?.totalRevenue?.toLocaleString() || samplePlatformStats.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                  <span className="text-green-500">+{isLoading ? '--' : platformStats?.revenueGrowth || samplePlatformStats.revenueGrowth}%</span>
                  <span className="ml-1">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${isLoading ? '--' : ((platformStats?.totalRevenue || samplePlatformStats.totalRevenue) / 
                  (platformStats?.totalUsers || samplePlatformStats.totalUsers)).toFixed(2)}
                </div>
                <div className="pt-1 text-xs text-muted-foreground">
                  Based on {isLoading ? '--' : platformStats?.totalUsers || samplePlatformStats.totalUsers} active users
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Subscription Renewal Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '--' : '87.5'}%
                </div>
                <Progress className="mt-2" value={87.5} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Subscription Length</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '--' : '9.2'} months
                </div>
                <div className="pt-1 text-xs text-muted-foreground">
                  Target: 12 months
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>
                Revenue by subscription type and time period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Jan', individual: 2800, company: 1400 },
                    { name: 'Feb', individual: 3200, company: 1600 },
                    { name: 'Mar', individual: 3500, company: 1800 },
                    { name: 'Apr', individual: 3100, company: 1800 },
                    { name: 'May', individual: 3800, company: 2000 },
                    { name: 'Jun', individual: 4000, company: 2200 },
                    { name: 'Jul', individual: 4400, company: 2400 },
                    { name: 'Aug', individual: 4600, company: 2600 },
                    { name: 'Sep', individual: 4800, company: 2700 },
                    { name: 'Oct', individual: 5200, company: 2900 },
                    { name: 'Nov', individual: 5400, company: 3000 },
                    { name: 'Dec', individual: 5800, company: 3100 },
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="individual" name="Individual Subscriptions" stackId="a" fill="#8884d8" />
                  <Bar dataKey="company" name="Company Subscriptions" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Growth Over Time</CardTitle>
                <CardDescription>
                  Total users by month
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={isLoading ? sampleGrowthData : growthData?.timeline || sampleGrowthData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      name="Total Users"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>
                  Distribution by user type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={isLoading ? sampleUserTypeData : growthData?.distribution || sampleUserTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(isLoading ? sampleUserTypeData : growthData?.distribution || sampleUserTypeData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} users`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Activity Metrics</CardTitle>
              <CardDescription>
                Key engagement indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Active Users</span>
                    <Badge variant="outline">{isLoading ? '--' : 325}</Badge>
                  </div>
                  <Progress value={72} />
                  <p className="text-xs text-muted-foreground">72% of monthly active users</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Session Duration</span>
                    <Badge variant="outline">{isLoading ? '--' : '42m 18s'}</Badge>
                  </div>
                  <Progress value={65} />
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Completion Rate</span>
                    <Badge variant="outline">{isLoading ? '--' : '32.4%'}</Badge>
                  </div>
                  <Progress value={32.4} />
                  <p className="text-xs text-muted-foreground">Industry avg: 28%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Course Analytics</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Filter by category:</span>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {(isLoading ? [
                    { id: '1', name: 'Web Development' },
                    { id: '2', name: 'Data Science' },
                    { id: '3', name: 'Mobile Development' },
                    { id: '4', name: 'Design' },
                    { id: '5', name: 'Business' }
                  ] : categories || []).map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '--' : platformStats?.totalCourses || samplePlatformStats.totalCourses}
                </div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                  <span className="text-green-500">+{isLoading ? '--' : platformStats?.courseGrowth || samplePlatformStats.courseGrowth}%</span>
                  <span className="ml-1">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '--' : platformStats?.activeInstructors || samplePlatformStats.activeInstructors}
                </div>
                <div className="pt-1 text-xs text-muted-foreground">
                  Published at least one course
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Course Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '--' : '4.65'}/5.0
                </div>
                <div className="pt-1 text-xs text-muted-foreground">
                  Based on {isLoading ? '--' : '3,478'} ratings
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '--' : '24'} days
                </div>
                <div className="pt-1 text-xs text-muted-foreground">
                  For completed courses
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Performance Comparison</CardTitle>
              <CardDescription>
                Comparing key metrics across top courses
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sampleTopCoursesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="enrollments" name="Enrollments" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}