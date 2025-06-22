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
  Radar
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Star, 
  TrendingUp,
  Activity,
  BarChart as BarChartIcon,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CourseAnalyticsProps {
  courseId: number;
}

export default function CourseAnalytics({ courseId }: CourseAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Get course details including analytics
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['/api/courses', courseId],
  });

  // Get enrollment stats over time
  const { data: enrollmentStats, isLoading: isLoadingEnrollmentStats } = useQuery({
    queryKey: ['/api/courses', courseId, 'enrollments', { timeRange }],
  });

  // Get student progress and completion stats
  const { data: progressStats, isLoading: isLoadingProgressStats } = useQuery({
    queryKey: ['/api/courses', courseId, 'progress'],
  });

  // Get lesson engagement stats
  const { data: lessonStats, isLoading: isLoadingLessonStats } = useQuery({
    queryKey: ['/api/courses', courseId, 'lessons'],
  });

  // Get student feedback stats
  const { data: feedbackStats, isLoading: isLoadingFeedbackStats } = useQuery({
    queryKey: ['/api/courses', courseId, 'feedback'],
  });

  const isLoading = 
    isLoadingCourse || 
    isLoadingEnrollmentStats || 
    isLoadingProgressStats || 
    isLoadingLessonStats || 
    isLoadingFeedbackStats;

  // Sample enrollment stats data
  const sampleEnrollmentData = [
    { date: 'Jan', enrollments: 15, completions: 5 },
    { date: 'Feb', enrollments: 20, completions: 8 },
    { date: 'Mar', enrollments: 25, completions: 10 },
    { date: 'Apr', enrollments: 22, completions: 9 },
    { date: 'May', enrollments: 30, completions: 12 },
    { date: 'Jun', enrollments: 35, completions: 14 },
    { date: 'Jul', enrollments: 40, completions: 18 },
    { date: 'Aug', enrollments: 38, completions: 20 },
    { date: 'Sep', enrollments: 45, completions: 22 },
    { date: 'Oct', enrollments: 50, completions: 24 },
    { date: 'Nov', enrollments: 48, completions: 27 },
    { date: 'Dec', enrollments: 55, completions: 30 },
  ];

  // Sample lesson engagement data
  const sampleLessonEngagementData = [
    { name: 'Introduction to Web Development', views: 180, completions: 150, averageTime: 15 },
    { name: 'HTML Basics', views: 175, completions: 145, averageTime: 25 },
    { name: 'CSS Fundamentals', views: 165, completions: 130, averageTime: 40 },
    { name: 'JavaScript Basics', views: 160, completions: 120, averageTime: 45 },
    { name: 'DOM Manipulation', views: 150, completions: 110, averageTime: 38 },
    { name: 'Forms and Validation', views: 140, completions: 95, averageTime: 42 },
    { name: 'Responsive Design', views: 155, completions: 115, averageTime: 35 },
    { name: 'API Integration', views: 130, completions: 85, averageTime: 50 },
    { name: 'Project: Portfolio Website', views: 125, completions: 70, averageTime: 120 },
    { name: 'Deployment and Hosting', views: 120, completions: 80, averageTime: 30 },
  ];

  // Sample skill distribution data
  const sampleSkillDistributionData = [
    { subject: 'HTML', value: 85 },
    { subject: 'CSS', value: 80 },
    { subject: 'JavaScript', value: 70 },
    { subject: 'Responsive Design', value: 75 },
    { subject: 'API Integration', value: 60 },
    { subject: 'Debugging', value: 55 },
    { subject: 'Performance', value: 45 },
  ];

  // Sample feedback distribution data
  const sampleFeedbackData = [
    { name: '5 Stars', value: 65 },
    { name: '4 Stars', value: 20 },
    { name: '3 Stars', value: 10 },
    { name: '2 Stars', value: 3 },
    { name: '1 Star', value: 2 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">{isLoading ? 'Course Analytics' : course?.title}</h2>
          <p className="text-muted-foreground">Detailed insights and performance metrics</p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : progressStats?.total || 345}</div>
            <p className="text-xs text-muted-foreground">
              +{isLoading ? '--' : progressStats?.growth || 12.5}% from last {timeRange}
            </p>
            <Progress className="mt-2" value={65} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : progressStats?.rate || 32}%</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '--' : progressStats?.finished || 110} students finished
            </p>
            <Progress 
              className="mt-2" 
              value={isLoading ? 32 : progressStats?.rate || 32} 
            />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '--' : progressStats?.avgDays || 24} days
            </div>
            <p className="text-xs text-muted-foreground">
              Target: {isLoading ? '--' : progressStats?.avgDays || 24 - 5} days
            </p>
            <Progress className="mt-2" value={75} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '--' : progressStats?.active || 212} active
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '--' : progressStats?.engagementRate || 78}% engagement rate
            </p>
            <Progress className="mt-2" value={78} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Analytics</TabsTrigger>
          <TabsTrigger value="students">Student Data</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-staggered-fade">
              <CardHeader>
                <CardTitle>Enrollment vs. Completion</CardTitle>
                <CardDescription>
                  Trends over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={isLoading ? sampleEnrollmentData : enrollmentStats?.timeline || sampleEnrollmentData}
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
                      dataKey="enrollments"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completions" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="animate-staggered-fade">
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>
                  Student competency after course completion
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    outerRadius={90} 
                    data={isLoading ? sampleSkillDistributionData : feedbackStats?.skillDistribution || sampleSkillDistributionData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Skills" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-staggered-fade">
            <CardHeader>
              <CardTitle>Course Rating Breakdown</CardTitle>
              <CardDescription>
                Student satisfaction metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="flex flex-col justify-center items-center">
                <div className="text-5xl font-bold text-center mb-2">{isLoading ? '--' : '4.4'}</div>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-6 w-6 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Based on {isLoading ? '--' : '158'} ratings
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <div className="w-12 text-sm text-muted-foreground">{rating} stars</div>
                      <div className="w-full mx-2">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              rating >= 4 ? 'bg-green-500' : 
                              rating >= 3 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ 
                              width: isLoading ? 
                                (rating === 5 ? '65%' : 
                                 rating === 4 ? '20%' : 
                                 rating === 3 ? '10%' : 
                                 rating === 2 ? '3%' : '2%') : 
                                (feedbackStats?.ratingDistribution?.[5-rating]?.percentage || 
                                 (rating === 5 ? '65%' : 
                                  rating === 4 ? '20%' : 
                                  rating === 3 ? '10%' : 
                                  rating === 2 ? '3%' : '2%'))
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm text-muted-foreground">
                        {isLoading ? 
                          (rating === 5 ? '65%' : 
                           rating === 4 ? '20%' : 
                           rating === 3 ? '10%' : 
                           rating === 2 ? '3%' : '2%') : 
                          (feedbackStats?.ratingDistribution?.[5-rating]?.percentage || 
                           (rating === 5 ? '65%' : 
                            rating === 4 ? '20%' : 
                            rating === 3 ? '10%' : 
                            rating === 2 ? '3%' : '2%'))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lesson Analytics Tab */}
        <TabsContent value="lessons" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Engagement Analysis</CardTitle>
              <CardDescription>
                Lesson views, completions, and average time spent
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isLoading ? sampleLessonEngagementData : lessonStats?.lessonEngagement || sampleLessonEngagementData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 100,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" name="Views" stackId="a" fill="#8884d8" />
                  <Bar dataKey="completions" name="Completions" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time Spent on Lessons</CardTitle>
                <CardDescription>
                  Average minutes per lesson
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={isLoading ? sampleLessonEngagementData : lessonStats?.lessonEngagement || sampleLessonEngagementData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 100,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 11 }} />
                    <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="averageTime" name="Average Time (minutes)" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Completion Rates</CardTitle>
                <CardDescription>
                  Percentage of students completing each lesson
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={isLoading ? 
                      sampleLessonEngagementData.map(item => ({
                        name: item.name,
                        rate: Math.round((item.completions / item.views) * 100)
                      })) : 
                      lessonStats?.completionRates || 
                      sampleLessonEngagementData.map(item => ({
                        name: item.name,
                        rate: Math.round((item.completions / item.views) * 100)
                      }))
                    }
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 100,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" name="Completion Rate (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Student Data Tab */}
        <TabsContent value="students" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Progression</CardTitle>
                <CardDescription>
                  Course progression distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Not Started', value: 10 },
                        { name: 'In Progress (0-50%)', value: 25 },
                        { name: 'Advanced (51-99%)', value: 33 },
                        { name: 'Completed', value: 32 },
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
                        { name: 'Not Started', value: 10 },
                        { name: 'In Progress (0-50%)', value: 25 },
                        { name: 'Advanced (51-99%)', value: 33 },
                        { name: 'Completed', value: 32 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Activity</CardTitle>
                <CardDescription>
                  Active students over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: 'Jan', active: 80, inactive: 20 },
                      { date: 'Feb', active: 85, inactive: 15 },
                      { date: 'Mar', active: 90, inactive: 10 },
                      { date: 'Apr', active: 88, inactive: 12 },
                      { date: 'May', active: 92, inactive: 8 },
                      { date: 'Jun', active: 95, inactive: 5 },
                      { date: 'Jul', active: 91, inactive: 9 },
                      { date: 'Aug', active: 89, inactive: 11 },
                      { date: 'Sep', active: 93, inactive: 7 },
                      { date: 'Oct', active: 96, inactive: 4 },
                      { date: 'Nov', active: 94, inactive: 6 },
                      { date: 'Dec', active: 97, inactive: 3 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="active"
                      name="Active Students (%)"
                      stroke="#2563eb"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inactive" 
                      name="Inactive Students (%)" 
                      stroke="#ef4444" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Course Progression by Module</CardTitle>
              <CardDescription>
                Percentage of students completing each module
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Module 1: Fundamentals', completion: 95 },
                    { name: 'Module 2: Advanced Concepts', completion: 85 },
                    { name: 'Module 3: Practical Application', completion: 70 },
                    { name: 'Module 4: Project Development', completion: 55 },
                    { name: 'Module 5: Advanced Techniques', completion: 45 },
                    { name: 'Module 6: Final Project', completion: 35 },
                  ]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 80,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="completion" name="Completion Rate (%)" fill="#2563eb">
                    {[
                      { name: 'Module 1: Fundamentals', completion: 95 },
                      { name: 'Module 2: Advanced Concepts', completion: 85 },
                      { name: 'Module 3: Practical Application', completion: 70 },
                      { name: 'Module 4: Project Development', completion: 55 },
                      { name: 'Module 5: Advanced Techniques', completion: 45 },
                      { name: 'Module 6: Final Project', completion: 35 },
                    ].map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.completion > 80 ? '#10b981' : 
                              entry.completion > 60 ? '#3b82f6' : 
                              entry.completion > 40 ? '#f59e0b' : 
                              '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Analysis Tab */}
        <TabsContent value="feedback" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Breakdown of student ratings
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={isLoading ? sampleFeedbackData : feedbackStats?.ratingDistribution || sampleFeedbackData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(isLoading ? sampleFeedbackData : feedbackStats?.ratingDistribution || sampleFeedbackData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Student review sentiment over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: 'Jan', positive: 75, neutral: 15, negative: 10 },
                      { date: 'Feb', positive: 78, neutral: 14, negative: 8 },
                      { date: 'Mar', positive: 80, neutral: 12, negative: 8 },
                      { date: 'Apr', positive: 76, neutral: 16, negative: 8 },
                      { date: 'May', positive: 82, neutral: 10, negative: 8 },
                      { date: 'Jun', positive: 85, neutral: 10, negative: 5 },
                      { date: 'Jul', positive: 88, neutral: 8, negative: 4 },
                      { date: 'Aug', positive: 86, neutral: 9, negative: 5 },
                      { date: 'Sep', positive: 84, neutral: 11, negative: 5 },
                      { date: 'Oct', positive: 87, neutral: 8, negative: 5 },
                      { date: 'Nov', positive: 89, neutral: 7, negative: 4 },
                      { date: 'Dec', positive: 90, neutral: 6, negative: 4 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="positive"
                      name="Positive"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="neutral" 
                      name="Neutral" 
                      stroke="#f59e0b" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="negative" 
                      name="Negative" 
                      stroke="#ef4444" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Comments and Feedback</CardTitle>
              <CardDescription>
                Most common themes from student feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { category: 'Engaging Content', value: 78 },
                    { category: 'Clear Explanations', value: 85 },
                    { category: 'Practical Examples', value: 72 },
                    { category: 'More Exercises Needed', value: 45 },
                    { category: 'Helpful Resources', value: 65 },
                    { category: 'Better Code Examples', value: 42 },
                    { category: 'Challenging Projects', value: 58 },
                    { category: 'Good Instructor Support', value: 68 },
                  ]}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 130,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} label={{ value: 'Percentage', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="category" type="category" width={120} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#8884d8">
                    {[
                      { category: 'Engaging Content', value: 78 },
                      { category: 'Clear Explanations', value: 85 },
                      { category: 'Practical Examples', value: 72 },
                      { category: 'More Exercises Needed', value: 45 },
                      { category: 'Helpful Resources', value: 65 },
                      { category: 'Better Code Examples', value: 42 },
                      { category: 'Challenging Projects', value: 58 },
                      { category: 'Good Instructor Support', value: 68 },
                    ].map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value >= 70 ? '#10b981' : 
                               entry.value >= 50 ? '#3b82f6' : 
                               entry.value >= 30 ? '#f59e0b' : 
                               '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}