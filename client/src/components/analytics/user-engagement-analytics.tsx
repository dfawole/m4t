import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Clock,
  CreditCard,
  Activity,
  BarChart as BarChartIcon,
  CalendarDays,
  CircleUser,
  LucideIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function UserEngagementAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [userType, setUserType] = useState<'all' | 'student' | 'instructor' | 'company'>('all');
  
  // Fetch engagement data
  const { data: engagementData, isLoading: isLoadingEngagement } = useQuery({
    queryKey: ['/api/analytics/user-engagement', { timeRange, userType }],
  });

  // Fetch retention data
  const { data: retentionData, isLoading: isLoadingRetention } = useQuery({
    queryKey: ['/api/analytics/user-retention', { timeRange, userType }],
  });

  // Fetch conversion data
  const { data: conversionData, isLoading: isLoadingConversion } = useQuery({
    queryKey: ['/api/analytics/user-conversion', { userType }],
  });

  const isLoading = isLoadingEngagement || isLoadingRetention || isLoadingConversion;

  // Sample engagement data by platform section
  const sampleSectionEngagementData = [
    { name: 'Course Catalog', visitors: 8500, avgTimeMinutes: 4.2, bounceRate: 35 },
    { name: 'Course Pages', visitors: 6200, avgTimeMinutes: 8.7, bounceRate: 28 },
    { name: 'Lesson Content', visitors: 4700, avgTimeMinutes: 32.5, bounceRate: 18 },
    { name: 'Dashboard', visitors: 3900, avgTimeMinutes: 6.8, bounceRate: 22 },
    { name: 'Subscription Plans', visitors: 2800, avgTimeMinutes: 5.3, bounceRate: 42 },
    { name: 'User Profile', visitors: 2100, avgTimeMinutes: 3.2, bounceRate: 30 },
    { name: 'Checkout Process', visitors: 1400, avgTimeMinutes: 4.8, bounceRate: 38 },
  ];

  // Sample daily active users data
  const sampleDailyActiveData = [
    { date: '2023-05-01', users: 2150 },
    { date: '2023-05-02', users: 2280 },
    { date: '2023-05-03', users: 2380 },
    { date: '2023-05-04', users: 2290 },
    { date: '2023-05-05', users: 2180 },
    { date: '2023-05-06', users: 1950 },
    { date: '2023-05-07', users: 1890 },
    { date: '2023-05-08', users: 2210 },
    { date: '2023-05-09', users: 2340 },
    { date: '2023-05-10', users: 2420 },
    { date: '2023-05-11', users: 2380 },
    { date: '2023-05-12', users: 2290 },
    { date: '2023-05-13', users: 2100 },
    { date: '2023-05-14', users: 2050 },
  ].map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd')
  }));

  // Sample device usage data
  const sampleDeviceData = [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 32 },
    { name: 'Tablet', value: 10 },
  ];

  // Sample retention data
  const sampleRetentionData = [
    { cohort: 'Jan 2023', month1: 100, month2: 85, month3: 72, month4: 68, month5: 62, month6: 58 },
    { cohort: 'Feb 2023', month1: 100, month2: 82, month3: 70, month4: 65, month5: 60, month6: 0 },
    { cohort: 'Mar 2023', month1: 100, month2: 88, month3: 75, month4: 70, month5: 0, month6: 0 },
    { cohort: 'Apr 2023', month1: 100, month2: 86, month3: 74, month4: 0, month5: 0, month6: 0 },
    { cohort: 'May 2023', month1: 100, month2: 90, month3: 0, month4: 0, month5: 0, month6: 0 },
    { cohort: 'Jun 2023', month1: 100, month2: 0, month3: 0, month4: 0, month5: 0, month6: 0 },
  ];

  // Sample conversion funnel data
  const sampleConversionData = [
    { name: 'Visitors', value: 15000 },
    { name: 'Registered', value: 4500 },
    { name: 'Course Started', value: 3200 },
    { name: 'Subscription', value: 1800 },
    { name: 'Repeat Subscriber', value: 1100 },
  ];

  // Sample user satisfaction data
  const sampleSatisfactionData = [
    { name: 'Very Satisfied', value: 42 },
    { name: 'Satisfied', value: 38 },
    { name: 'Neutral', value: 12 },
    { name: 'Dissatisfied', value: 6 },
    { name: 'Very Dissatisfied', value: 2 },
  ];

  // Sample user behavior clusters (engagement vs. course completion)
  const sampleUserBehaviorData = [
    { x: 10, y: 15, z: 50, name: 'Casual Browsers' },
    { x: 25, y: 20, z: 80, name: 'Content Samplers' },
    { x: 40, y: 35, z: 120, name: 'Regular Learners' },
    { x: 70, y: 55, z: 200, name: 'Committed Students' },
    { x: 90, y: 90, z: 260, name: 'Power Users' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

  const StatCard = ({ 
    title, 
    value, 
    description, 
    change, 
    Icon 
  }: { 
    title: string; 
    value: string | number;
    description: string;
    change: number;
    Icon: LucideIcon;
  }) => (
    <Card className="animate-staggered-fade">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="ml-1">from last {timeRange}</span>
        </p>
        <Progress className="mt-2" value={Math.abs(change) * 2} />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">User Engagement Analytics</h2>
          <p className="text-muted-foreground">Insights into user activity and platform interaction</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={userType} onValueChange={(value: 'all' | 'student' | 'instructor' | 'company') => setUserType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="instructor">Instructors</SelectItem>
              <SelectItem value="company">Companies</SelectItem>
            </SelectContent>
          </Select>
          
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Daily Active Users" 
          value={isLoading ? '--' : '2,325'}
          description="Users engaging with platform daily" 
          change={8.5}
          Icon={Users}
        />
        
        <StatCard 
          title="Avg. Session Duration" 
          value={isLoading ? '--' : '24m 12s'}
          description="Time spent per user session" 
          change={5.2}
          Icon={Clock}
        />
        
        <StatCard 
          title="Conversion Rate" 
          value={isLoading ? '--' : '12.4%'}
          description="Visitors to paying customers" 
          change={3.7}
          Icon={CreditCard}
        />
        
        <StatCard 
          title="Bounce Rate" 
          value={isLoading ? '--' : '28.7%'}
          description="Single page visits" 
          change={-2.5}
          Icon={Activity}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-staggered-fade">
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>
                  Platform activity over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={isLoading ? sampleDailyActiveData : engagementData?.dailyActive || sampleDailyActiveData}
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
                      name="Active Users"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="animate-staggered-fade">
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>
                  Platform access by device type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={isLoading ? sampleDeviceData : engagementData?.deviceUsage || sampleDeviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(isLoading ? sampleDeviceData : engagementData?.deviceUsage || sampleDeviceData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-staggered-fade">
            <CardHeader>
              <CardTitle>Platform Section Engagement</CardTitle>
              <CardDescription>
                User activity by platform section
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isLoading ? sampleSectionEngagementData : engagementData?.sectionEngagement || sampleSectionEngagementData}
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
                  <Bar yAxisId="left" dataKey="visitors" name="Unique Visitors" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="avgTimeMinutes" name="Avg. Time (minutes)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>User Cohort Retention</CardTitle>
              <CardDescription>
                Percentage of users retained each month after sign-up
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isLoading ? sampleRetentionData : retentionData?.cohortData || sampleRetentionData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cohort" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="month1" name="Month 1" fill="#8884d8" />
                  <Bar dataKey="month2" name="Month 2" fill="#82ca9d" />
                  <Bar dataKey="month3" name="Month 3" fill="#ffc658" />
                  <Bar dataKey="month4" name="Month 4" fill="#ff8042" />
                  <Bar dataKey="month5" name="Month 5" fill="#0088fe" />
                  <Bar dataKey="month6" name="Month 6" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Renewal Rate</CardTitle>
                <CardDescription>
                  Percentage of users renewing subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', rate: 82 },
                      { month: 'Feb', rate: 85 },
                      { month: 'Mar', rate: 83 },
                      { month: 'Apr', rate: 86 },
                      { month: 'May', rate: 88 },
                      { month: 'Jun', rate: 87 },
                      { month: 'Jul', rate: 91 },
                      { month: 'Aug', rate: 90 },
                      { month: 'Sep', rate: 92 },
                      { month: 'Oct', rate: 91 },
                      { month: 'Nov', rate: 93 },
                      { month: 'Dec', rate: 94 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#8884d8"
                      name="Renewal Rate (%)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Satisfaction</CardTitle>
                <CardDescription>
                  Overall satisfaction ratings
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={isLoading ? sampleSatisfactionData : retentionData?.satisfaction || sampleSatisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(isLoading ? sampleSatisfactionData : retentionData?.satisfaction || sampleSatisfactionData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          index === 0 ? '#22c55e' : // Very Satisfied: green
                          index === 1 ? '#10b981' : // Satisfied: light green
                          index === 2 ? '#f59e0b' : // Neutral: amber
                          index === 3 ? '#ef4444' : // Dissatisfied: red
                          '#b91c1c'                 // Very Dissatisfied: dark red
                        } />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                User journey from visitor to loyal customer
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isLoading ? sampleConversionData : conversionData?.funnel || sampleConversionData}
                  layout="vertical"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: '#888888' }}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    label={{ 
                      position: 'right',
                      formatter: (value: number, idx: number) => {
                        if (idx === 0) return value.toLocaleString();
                        const prevValue = sampleConversionData[idx - 1].value;
                        const percentage = Math.round((value / prevValue) * 100);
                        return `${value.toLocaleString()} (${percentage}%)`;
                      }
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  User acquisition channels
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Organic Search', value: 38 },
                        { name: 'Direct', value: 22 },
                        { name: 'Social Media', value: 18 },
                        { name: 'Referral', value: 12 },
                        { name: 'Email', value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Organic Search', value: 38 },
                        { name: 'Direct', value: 22 },
                        { name: 'Social Media', value: 18 },
                        { name: 'Referral', value: 12 },
                        { name: 'Email', value: 10 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Signup Completion Rate</CardTitle>
                <CardDescription>
                  Percentage of users completing signup steps
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { step: 'Email Entry', value: 100 },
                      { step: 'Email Verification', value: 78 },
                      { step: 'Profile Creation', value: 65 },
                      { step: 'Interests Selection', value: 58 },
                      { step: 'Course Browsing', value: 52 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" name="Completion %" fill="#8884d8">
                      {[
                        { step: 'Email Entry', value: 100 },
                        { step: 'Email Verification', value: 78 },
                        { step: 'Profile Creation', value: 65 },
                        { step: 'Interests Selection', value: 58 },
                        { step: 'Course Browsing', value: 52 },
                      ].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.value > 80 ? '#22c55e' : 
                            entry.value > 60 ? '#10b981' :
                            entry.value > 40 ? '#f59e0b' :
                            '#ef4444'
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Clusters</CardTitle>
              <CardDescription>
                User behaviors by engagement and completion rates
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Time Spent" 
                    unit="hr/month" 
                    label={{ value: 'Engagement (hours/month)', position: 'bottom' }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Completion" 
                    unit="%" 
                    label={{ value: 'Course Completion (%)', angle: -90, position: 'left' }} 
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[60, 400]} 
                    name="Users" 
                    unit=" users" 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => {
                      if (name === 'Time Spent') return `${value} hr/month`;
                      if (name === 'Completion') return `${value}%`;
                      if (name === 'Users') return `${value} users`;
                      return value;
                    }}
                  />
                  <Legend />
                  <Scatter 
                    name="User Segments" 
                    data={isLoading ? sampleUserBehaviorData : conversionData?.behaviorClusters || sampleUserBehaviorData} 
                    fill="#8884d8"
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Activity by Time of Day</CardTitle>
                <CardDescription>
                  When users are most active on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { hour: '6am', users: 420 },
                      { hour: '8am', users: 680 },
                      { hour: '10am', users: 850 },
                      { hour: '12pm', users: 780 },
                      { hour: '2pm', users: 910 },
                      { hour: '4pm', users: 1100 },
                      { hour: '6pm', users: 1350 },
                      { hour: '8pm', users: 1680 },
                      { hour: '10pm', users: 1220 },
                      { hour: '12am', users: 780 },
                      { hour: '2am', users: 380 },
                      { hour: '4am', users: 220 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" name="Active Users" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Heatmap</CardTitle>
                <CardDescription>
                  Most frequently used platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-2">
                  {[
                    { name: 'Video Lessons', usage: 92 },
                    { name: 'Quizzes', usage: 84 },
                    { name: 'Progress Tracking', usage: 78 },
                    { name: 'Search', usage: 73 },
                    { name: 'Notes', usage: 65 },
                    { name: 'Forums', usage: 58 },
                    { name: 'Downloads', usage: 49 },
                    { name: 'Bookmarks', usage: 45 },
                    { name: 'Certificates', usage: 42 },
                  ].map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center justify-center p-4 rounded"
                      style={{ 
                        backgroundColor: `rgba(136, 132, 216, ${feature.usage / 100})`,
                        color: feature.usage > 70 ? 'white' : 'black'
                      }}
                    >
                      <div className="text-lg font-semibold">{feature.usage}%</div>
                      <div className="text-center text-xs">{feature.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}