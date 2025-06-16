import React from 'react';
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
  Cell
} from 'recharts';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen
} from 'lucide-react';
import CourseAnalytics from './course-analytics';

interface InstructorAnalyticsProps {
  instructorId: string;
  selectedCourseId?: number;
  onSelectCourse?: (courseId: number) => void;
}

export default function InstructorAnalytics({ 
  instructorId, 
  selectedCourseId,
  onSelectCourse 
}: InstructorAnalyticsProps) {
  
  // Get instructor's courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: [`/api/instructor/${instructorId}/courses`],
    enabled: !!instructorId,
  });

  // Get instructor overview statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [`/api/instructor/${instructorId}/stats`],
    enabled: !!instructorId,
  });

  // Get student activity
  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: [`/api/instructor/${instructorId}/activity`],
    enabled: !!instructorId,
  });

  const isLoading = isLoadingCourses || isLoadingStats || isLoadingActivity;

  // Sample data for statistics
  const sampleStats = {
    totalStudents: 324,
    totalCourses: 5,
    totalCompletions: 142,
    revenue: 12580,
    avgRating: 4.7,
    studentGrowth: 12.5,
  };

  // Sample data for course popularity
  const sampleCoursePopularity = [
    { name: 'Web Development', students: 145 },
    { name: 'Python Data Science', students: 87 },
    { name: 'Mobile App Development', students: 56 },
    { name: 'UI/UX Design', students: 36 },
    { name: 'Business Management', students: 24 },
  ];

  // Sample data for student activity
  const sampleActivityData = [
    { date: 'Monday', active: 75 },
    { date: 'Tuesday', active: 89 },
    { date: 'Wednesday', active: 110 },
    { date: 'Thursday', active: 92 },
    { date: 'Friday', active: 87 },
    { date: 'Saturday', active: 120 },
    { date: 'Sunday', active: 135 },
  ];

  // Sample data for completion distribution
  const sampleCompletionData = [
    { name: 'Completed', value: 142 },
    { name: 'In Progress', value: 162 },
    { name: 'Not Started', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (selectedCourseId) {
    return <CourseAnalytics courseId={selectedCourseId} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h2>
        <p className="text-muted-foreground">Monitor your courses, student engagement, and earnings.</p>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : stats?.totalStudents || sampleStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +{isLoading ? '--' : stats?.studentGrowth || sampleStats.studentGrowth}% from last month
            </p>
            <Progress className="mt-2" value={65} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completions</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : stats?.totalCompletions || sampleStats.totalCompletions}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '--' : (stats?.totalCompletions / stats?.totalStudents * 100 || (sampleStats.totalCompletions / sampleStats.totalStudents * 100).toFixed(1))}% completion rate
            </p>
            <Progress className="mt-2" value={48} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructor Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : stats?.avgRating || sampleStats.avgRating}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Based on {isLoading ? '--' : stats?.totalReviews || 215} reviews
            </p>
            <Progress 
              className="mt-2" 
              value={isLoading ? 0 : (stats?.avgRating / 5 * 100) || (sampleStats.avgRating / 5 * 100)}
            />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${isLoading ? '--' : stats?.revenue || sampleStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +${isLoading ? '--' : stats?.revenueGrowth || '1,245'} this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 animate-staggered-fade">
          <CardHeader>
            <CardTitle>Student Activity</CardTitle>
            <CardDescription>Daily active students across all your courses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={isLoading ? sampleActivityData : activity?.dailyActive || sampleActivityData}
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
                  dataKey="active" 
                  stroke="#8884d8" 
                  name="Active Students"
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-staggered-fade">
          <CardHeader>
            <CardTitle>Course Completion</CardTitle>
            <CardDescription>Student progress statistics</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={isLoading ? sampleCompletionData : activity?.completionStats || sampleCompletionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(isLoading ? sampleCompletionData : activity?.completionStats || sampleCompletionData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-staggered-fade">
        <CardHeader>
          <CardTitle>Course Popularity</CardTitle>
          <CardDescription>Student enrollment by course</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={isLoading ? sampleCoursePopularity : courses || sampleCoursePopularity}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="students" 
                fill="#8884d8" 
                name="Enrolled Students" 
                onClick={(data) => {
                  const courseId = data.id;
                  if (courseId && onSelectCourse) {
                    onSelectCourse(courseId);
                  }
                }}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}