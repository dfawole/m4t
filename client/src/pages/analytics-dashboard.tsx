import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ChevronDown, 
  Download, 
  Play, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  UserPlus, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Users,
  BookOpen,
  Award,
  Zap,
  TrendingUp,
  Eye,
  Heart
} from 'lucide-react';
import RealTimeAnalytics from '@/components/analytics/real-time-analytics';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter
} from 'recharts';

const AnalyticsDashboard: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('week');
  const [showExternalView, setShowExternalView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animatedComponents, setAnimatedComponents] = useState<{[key: string]: boolean}>({});
  
  // Simulate loading state for chart transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to handle animation of components as they come into view
  const handleComponentAnimation = (componentId: string) => {
    if (!animatedComponents[componentId]) {
      setAnimatedComponents(prev => ({
        ...prev,
        [componentId]: true
      }));
    }
  };
  
  // Sample course data
  const courses = [
    { id: '1', title: 'Complete Web Development Bootcamp', students: 1247, completion: 78 },
    { id: '2', title: 'Advanced React & Node.js', students: 864, completion: 65 },
    { id: '3', title: 'Data Science Fundamentals', students: 935, completion: 72 },
    { id: '4', title: 'UI/UX Design Masterclass', students: 642, completion: 81 }
  ];
  
  // Sample top performing content
  const topContent = [
    { id: '1', title: 'Introduction to React Hooks', views: 4385, engagement: 92 },
    { id: '2', title: 'CSS Grid and Flexbox Layout', views: 3842, engagement: 88 },
    { id: '3', title: 'Building RESTful APIs with Node.js', views: 3216, engagement: 85 },
    { id: '4', title: 'JavaScript ES6+ Features', views: 2987, engagement: 83 }
  ];
  
  // Sample student activity
  const studentActivity = [
    { day: 'Monday', count: 1245 },
    { day: 'Tuesday', count: 1342 },
    { day: 'Wednesday', count: 1587 },
    { day: 'Thursday', count: 1423 },
    { day: 'Friday', count: 1376 },
    { day: 'Saturday', count: 856 },
    { day: 'Sunday', count: 742 }
  ];
  
  // Student insights data with progress sparklines
  const studentInsights = [
    { 
      id: 1, 
      name: 'Engagement Score', 
      value: 82, 
      change: '+5.2%', 
      trend: 'positive',
      sparkData: [65, 68, 71, 69, 74, 78, 82],
      icon: <Eye className="h-4 w-4 text-blue-500" />,
      description: 'Students are highly engaged with interactive content',
      insightLevel: 'high'
    },
    { 
      id: 2, 
      name: 'Completion Rate', 
      value: 76, 
      change: '+3.8%', 
      trend: 'positive',
      sparkData: [70, 68, 72, 73, 75, 74, 76],
      icon: <Award className="h-4 w-4 text-green-500" />,
      description: 'Course completion rates continue to trend upward',
      insightLevel: 'medium'
    },
    { 
      id: 3, 
      name: 'Quiz Performance', 
      value: 68, 
      change: '-2.3%', 
      trend: 'negative',
      sparkData: [73, 71, 70, 69, 67, 66, 68],
      icon: <BookOpen className="h-4 w-4 text-yellow-500" />,
      description: 'Quiz scores have slightly decreased, consider review sessions',
      insightLevel: 'medium'
    },
    { 
      id: 4, 
      name: 'Learning Velocity', 
      value: 88, 
      change: '+7.1%', 
      trend: 'positive',
      sparkData: [75, 79, 82, 80, 84, 86, 88],
      icon: <Zap className="h-4 w-4 text-purple-500" />,
      description: 'Students are progressing through material at an accelerated pace',
      insightLevel: 'high'
    }
  ];
  
  const toggleExternalView = () => {
    setShowExternalView(!showExternalView);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="flex items-center gap-3">
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={showExternalView ? "default" : "outline"}
            className="gap-1"
            onClick={toggleExternalView}
          >
            {showExternalView ? "Viewing External Data" : "Switch to External View"}
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
          
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Analytics Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Comprehensive {showExternalView ? "external" : "internal"} analytics and insights
      </p>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Students</p>
                    <h3 className="text-2xl font-bold mt-1">3,842</h3>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      12.5% increase
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Course Enrollments</p>
                    <h3 className="text-2xl font-bold mt-1">1,247</h3>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      8.3% increase
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Completion Rate</p>
                    <h3 className="text-2xl font-bold mt-1">76.2%</h3>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      4.7% increase
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <BarChartIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Watch Time</p>
                    <h3 className="text-2xl font-bold mt-1">18:24</h3>
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <ChevronDown className="h-3 w-3" />
                      2.1% decrease
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Real-time Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 h-[500px]">
              <RealTimeAnalytics
                timeRange={selectedTimeRange as 'hour' | 'day' | 'week' | 'month' | 'year'}
                isExternalView={showExternalView}
              />
            </div>
          </div>
          
          {/* Top Courses */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Top Performing Courses</CardTitle>
                <CardDescription>
                  Courses with the highest engagement and completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <h4 className="text-sm font-medium">{course.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{course.students.toLocaleString()} students enrolled</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-sm font-medium">{course.completion}%</span>
                          <p className="text-xs text-muted-foreground">completion</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          {/* Content Performance */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>
                  Most viewed and highest engagement content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Total Videos</div>
                        <div className="text-2xl font-bold">158</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Total Watch Time</div>
                        <div className="text-2xl font-bold">5,842 hours</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Engagement</div>
                        <div className="text-2xl font-bold">72%</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Interactive Quiz Completion</div>
                        <div className="text-2xl font-bold">68%</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-4">Top Performing Content</h4>
                    <div className="space-y-4">
                      {topContent.map((content) => (
                        <div key={content.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                          <div>
                            <h4 className="text-sm font-medium">{content.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{content.views.toLocaleString()} views</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={content.engagement > 85 ? "default" : "outline"}>
                              {content.engagement}% engagement
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-4">Content Engagement by Type</h4>
                    <div className="h-[200px] relative">
                      {/* Simple bar chart */}
                      <div className="flex h-full items-end justify-around">
                        {[
                          { type: 'Video', value: 84 },
                          { type: 'Quiz', value: 78 },
                          { type: 'Interactive', value: 92 },
                          { type: 'Reading', value: 65 },
                          { type: 'Discussion', value: 72 }
                        ].map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-16 bg-primary rounded-t-md" 
                              style={{ height: `${item.value}%` }}
                            ></div>
                            <div className="text-xs mt-2">{item.type}</div>
                            <div className="text-xs font-medium">{item.value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          {/* Student Insights & Key Metrics with Playful Loading Animations */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {studentInsights.map((insight, index) => (
              <Card 
                key={insight.id} 
                className={`student-insight ${isLoading ? 'chart-loading' : animatedComponents[`insight-${insight.id}`] ? 'animate-slide-in' : ''}`}
                onMouseEnter={() => handleComponentAnimation(`insight-${insight.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {insight.icon}
                        <p className="text-sm text-muted-foreground">{insight.name}</p>
                      </div>
                      <h3 className="text-2xl font-bold mt-1">{insight.value}%</h3>
                      <p className={`text-xs flex items-center mt-1 ${insight.trend === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                        <ChevronDown className={`h-3 w-3 ${insight.trend === 'positive' ? 'rotate-180' : ''}`} />
                        {insight.change}
                      </p>
                    </div>
                    <div className="sparkline-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={insight.sparkData.map((value, i) => ({ value, index: i }))}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={
                              insight.insightLevel === 'high' ? '#10b981' : 
                              insight.insightLevel === 'medium' ? '#f59e0b' : 
                              '#ef4444'
                            }
                            strokeWidth={2}
                            dot={false}
                            activeDot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={`performance-indicator performance-${insight.insightLevel} text-xs mt-3`}>
                    {insight.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Student Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={isLoading ? 'chart-loading' : animatedComponents['total-students'] ? 'animate-scale-in' : ''}
              onMouseEnter={() => handleComponentAnimation('total-students')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <h3 className="text-2xl font-bold mt-1">12,458</h3>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      8.2% increase
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={isLoading ? 'chart-loading' : animatedComponents['new-students'] ? 'animate-scale-in' : ''}
              onMouseEnter={() => handleComponentAnimation('new-students')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Students</p>
                    <h3 className="text-2xl font-bold mt-1">487</h3>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      12.3% increase
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={isLoading ? 'chart-loading' : animatedComponents['course-load'] ? 'animate-scale-in' : ''}
              onMouseEnter={() => handleComponentAnimation('course-load')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Course Load</p>
                    <h3 className="text-2xl font-bold mt-1">3.2</h3>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      4.7% increase
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <BarChartIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Student Activity */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Student Activity</CardTitle>
                <CardDescription>
                  Weekly active students and engagement patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] relative">
                  {/* Weekly activity chart using Recharts */}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={studentActivity}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.substring(0, 3)}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        width={40}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <div className="font-medium">{data.day}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-2 h-2 rounded-sm bg-blue-500"></div>
                                  <span>{data.count.toLocaleString()} active students</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      >
                        {studentActivity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 2 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.7)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Top Student Demographics</h4>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Age 25-34', value: 42 },
                              { name: 'Age 18-24', value: 31 },
                              { name: 'Age 35-44', value: 18 },
                              { name: 'Age 45+', value: 9 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            innerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Age 25-34', value: 42 },
                              { name: 'Age 18-24', value: 31 },
                              { name: 'Age 35-44', value: 18 },
                              { name: 'Age 45+', value: 9 }
                            ].map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  index === 0 ? 'hsl(var(--primary))' : 
                                  index === 1 ? 'hsl(var(--primary) / 0.8)' : 
                                  index === 2 ? 'hsl(var(--primary) / 0.6)' : 
                                  'hsl(var(--primary) / 0.4)'
                                } 
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                    <div className="font-medium">{data.name}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-2 h-2 rounded-sm" style={{ 
                                        backgroundColor: 
                                          data.name === 'Age 25-34' ? 'hsl(var(--primary))' :
                                          data.name === 'Age 18-24' ? 'hsl(var(--primary) / 0.8)' :
                                          data.name === 'Age 35-44' ? 'hsl(var(--primary) / 0.6)' :
                                          'hsl(var(--primary) / 0.4)'
                                      }}></div>
                                      <span>{data.value}% of students</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-4">Learning Preferences</h4>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Video-based', value: 68 },
                              { name: 'Interactive', value: 22 },
                              { name: 'Text-based', value: 10 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            innerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Video-based', value: 68 },
                              { name: 'Interactive', value: 22 },
                              { name: 'Text-based', value: 10 }
                            ].map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  index === 0 ? '#8884d8' : 
                                  index === 1 ? '#82ca9d' : 
                                  '#ffc658'
                                } 
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                    <div className="font-medium">{data.name}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-2 h-2 rounded-sm" style={{ 
                                        backgroundColor: 
                                          data.name === 'Video-based' ? '#8884d8' :
                                          data.name === 'Interactive' ? '#82ca9d' :
                                          '#ffc658'
                                      }}></div>
                                      <span>{data.value}% preference</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-4">Engagement by Region</h4>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={[
                            { region: 'North America', engagement: 82 },
                            { region: 'Europe', engagement: 75 },
                            { region: 'Asia', engagement: 69 },
                            { region: 'South America', engagement: 64 },
                            { region: 'Africa', engagement: 58 },
                            { region: 'Oceania', engagement: 77 }
                          ]}
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                          <XAxis 
                            type="number" 
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis 
                            dataKey="region" 
                            type="category" 
                            tick={{ fontSize: 10 }}
                            width={75}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                    <div className="font-medium">{data.region}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-2 h-2 rounded-sm" style={{ 
                                        backgroundColor: 
                                          data.engagement > 75 ? '#4CAF50' :
                                          data.engagement > 65 ? '#2196F3' :
                                          '#FFC107'
                                      }}></div>
                                      <span>{data.engagement}% engagement rate</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="engagement" 
                            radius={[0, 4, 4, 0]}
                            barSize={15}
                          >
                            {[
                              { region: 'North America', engagement: 82 },
                              { region: 'Europe', engagement: 75 },
                              { region: 'Asia', engagement: 69 },
                              { region: 'South America', engagement: 64 },
                              { region: 'Africa', engagement: 58 },
                              { region: 'Oceania', engagement: 77 }
                            ].map((entry) => (
                              <Cell 
                                key={`cell-${entry.region}`} 
                                fill={
                                  entry.engagement > 75 ? '#4CAF50' :
                                  entry.engagement > 65 ? '#2196F3' :
                                  '#FFC107'
                                } 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;