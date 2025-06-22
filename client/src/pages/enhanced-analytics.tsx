import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartJSExamples from "@/components/analytics/chart-js-examples";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  ChevronDown,
  Users,
  Clock,
  CalendarDays,
  GraduationCap,
  Target,
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  Layers,
  Globe,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Sector,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

// Sample time series data for engagement
const timeSeriesData = [
  { date: '2025-01', students: 2400, engagement: 65, completion: 42 },
  { date: '2025-02', students: 2800, engagement: 68, completion: 45 },
  { date: '2025-03', students: 3200, engagement: 72, completion: 51 },
  { date: '2025-04', students: 3000, engagement: 70, completion: 49 },
  { date: '2025-05', students: 3500, engagement: 75, completion: 55 },
  { date: '2025-06', students: 4000, engagement: 78, completion: 62 },
  { date: '2025-07', students: 4200, engagement: 82, completion: 68 },
  { date: '2025-08', students: 4500, engagement: 85, completion: 72 },
  { date: '2025-09', students: 4800, engagement: 87, completion: 78 },
  { date: '2025-10', students: 5200, engagement: 84, completion: 75 },
  { date: '2025-11', students: 5500, engagement: 86, completion: 80 },
  { date: '2025-12', students: 6000, engagement: 88, completion: 83 },
];

// Sample geographical data
const geoData = [
  { name: 'North America', value: 42, students: 2560 },
  { name: 'Europe', value: 28, students: 1680 },
  { name: 'Asia', value: 18, students: 1120 },
  { name: 'South America', value: 7, students: 420 },
  { name: 'Africa', value: 3, students: 180 },
  { name: 'Oceania', value: 2, students: 120 },
];

// Sample device data
const deviceData = [
  { name: 'Desktop', value: 55 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 10 },
];

// Sample content engagement data
const contentEngagementData = [
  { name: 'Videos', interactive: 85, passive: 45 },
  { name: 'Quizzes', interactive: 92, passive: 65 },
  { name: 'Readings', interactive: 45, passive: 72 },
  { name: 'Discussions', interactive: 78, passive: 58 },
  { name: 'Projects', interactive: 88, passive: 62 },
];

// Sample learning style radar data
const learningStyleData = [
  {
    subject: 'Visual',
    user: 80,
    average: 65,
    fullMark: 100,
  },
  {
    subject: 'Auditory',
    user: 65,
    average: 70,
    fullMark: 100,
  },
  {
    subject: 'Reading',
    user: 90,
    average: 60,
    fullMark: 100,
  },
  {
    subject: 'Kinesthetic',
    user: 75,
    average: 55,
    fullMark: 100,
  },
  {
    subject: 'Social',
    user: 60,
    average: 75,
    fullMark: 100,
  },
  {
    subject: 'Solitary',
    user: 85,
    average: 65,
    fullMark: 100,
  },
];

// Sample completion time vs. engagement scatter data
const scatterData = [
  { completionTime: 5, engagement: 20, name: 'Course A', students: 120 },
  { completionTime: 10, engagement: 40, name: 'Course B', students: 260 },
  { completionTime: 22, engagement: 75, name: 'Course C', students: 430 },
  { completionTime: 35, engagement: 90, name: 'Course D', students: 580 },
  { completionTime: 15, engagement: 35, name: 'Course E', students: 210 },
  { completionTime: 28, engagement: 80, name: 'Course F', students: 490 },
  { completionTime: 8, engagement: 25, name: 'Course G', students: 150 },
  { completionTime: 18, engagement: 60, name: 'Course H', students: 320 },
  { completionTime: 32, engagement: 85, name: 'Course I', students: 520 },
  { completionTime: 12, engagement: 45, name: 'Course J', students: 280 },
];

// Sample time spent by day of week
const weekdayData = [
  { day: 'Monday', hours: 4.5, sessions: 12 },
  { day: 'Tuesday', hours: 5.2, sessions: 15 },
  { day: 'Wednesday', hours: 6.1, sessions: 18 },
  { day: 'Thursday', hours: 5.8, sessions: 16 },
  { day: 'Friday', hours: 4.9, sessions: 14 },
  { day: 'Saturday', hours: 3.2, sessions: 8 },
  { day: 'Sunday', hours: 2.8, sessions: 7 },
];

// Sample assessment score distribution
const scoreDistributionData = [
  { score: '0-10', count: 5 },
  { score: '11-20', count: 12 },
  { score: '21-30', count: 18 },
  { score: '31-40', count: 25 },
  { score: '41-50', count: 32 },
  { score: '51-60', count: 48 },
  { score: '61-70', count: 65 },
  { score: '71-80', count: 78 },
  { score: '81-90', count: 92 },
  { score: '91-100', count: 45 },
];

// Custom colors for charts
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];
const COURSE_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

// Custom active shape for interactive pie chart
const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-midAngle * Math.PI / 180);
  const cos = Math.cos(-midAngle * Math.PI / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">{`${value} students`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// Custom tooltip for scatterplot
const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md text-xs">
        <p className="font-medium">{data.name}</p>
        <p>Students: {data.students}</p>
        <p>Completion Time: {data.completionTime} hrs</p>
        <p>Engagement Score: {data.engagement}/100</p>
      </div>
    );
  }

  return null;
};

const EnhancedAnalytics: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('year');
  const [selectedRole, setSelectedRole] = useState<string>('student');
  
  // Handle loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle pie chart hover
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Handle data export
  const handleExportData = (format: string) => {
    toast({
      title: "Data Export Started",
      description: `Your analytics data is being exported in ${format.toUpperCase()} format.`,
    });
  };
  
  // Handle data refresh
  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated with the latest information.",
      });
    }, 1200);
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
          
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select perspective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student View</SelectItem>
              <SelectItem value="instructor">Instructor View</SelectItem>
              <SelectItem value="admin">Admin View</SelectItem>
              <SelectItem value="company">Company View</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => handleRefreshData()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Select onValueChange={handleExportData}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">Export as CSV</SelectItem>
              <SelectItem value="excel">Export as Excel</SelectItem>
              <SelectItem value="pdf">Export as PDF</SelectItem>
              <SelectItem value="json">Export as JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Enhanced Analytics Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Interactive data visualizations and in-depth learning insights
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <h3 className="text-2xl font-bold mt-1">{selectedTimeRange === 'year' ? '6,842' : '3,216'}</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronDown className="h-3 w-3 rotate-180" />
                  14.2% increase
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
                <p className="text-sm text-muted-foreground">Course Completions</p>
                <h3 className="text-2xl font-bold mt-1">{selectedTimeRange === 'year' ? '12,587' : '4,925'}</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronDown className="h-3 w-3 rotate-180" />
                  8.7% increase
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Engagement</p>
                <h3 className="text-2xl font-bold mt-1">{selectedTimeRange === 'year' ? '83' : '79'}/100</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronDown className="h-3 w-3 rotate-180" />
                  5.2% increase
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Hours</p>
                <h3 className="text-2xl font-bold mt-1">{selectedTimeRange === 'year' ? '284,562' : '92,745'}</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronDown className="h-3 w-3 rotate-180" />
                  12.8% increase
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="learning">Learning Styles</TabsTrigger>
          <TabsTrigger value="chartjs">Chart.js</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Time Series Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth & Engagement</CardTitle>
              <CardDescription>Student enrollment, engagement rates, and course completions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    width={500}
                    height={400}
                    data={timeSeriesData}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderColor: 'var(--border)',
                        borderRadius: '0.375rem'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="students" 
                      name="Active Students" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="engagement" 
                      name="Engagement Score" 
                      stroke="#ff7300" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="completion" 
                      name="Completion Rate" 
                      stroke="#82ca9d" 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Geographical Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographical Distribution</CardTitle>
                <CardDescription>Student distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={geoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                      >
                        {geoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Course Completion vs Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Completion Time vs. Engagement</CardTitle>
                <CardDescription>Analysis of course completion time and engagement levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="completionTime" 
                        name="Completion Time" 
                        unit=" hrs" 
                        label={{ 
                          value: 'Course Completion Time (hours)', 
                          position: 'insideBottom', 
                          offset: -10 
                        }} 
                      />
                      <YAxis 
                        type="number" 
                        dataKey="engagement" 
                        name="Engagement" 
                        unit="/100" 
                        label={{ 
                          value: 'Engagement Score', 
                          angle: -90, 
                          position: 'insideLeft' 
                        }} 
                      />
                      <ZAxis 
                        type="number" 
                        dataKey="students" 
                        range={[60, 400]} 
                        name="Students" 
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip />} />
                      <Scatter name="Courses" data={scatterData} fill="#8884d8">
                        {scatterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COURSE_COLORS[index % COURSE_COLORS.length]} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Performers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Courses and resources with highest engagement and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <h3 className="text-sm font-medium">Top Courses</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Advanced JavaScript Programming', value: 92 },
                      { name: 'Data Science Fundamentals', value: 89 },
                      { name: 'UX Design Principles', value: 87 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {index + 1}
                          </div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <Badge variant={item.value > 90 ? 'default' : 'outline'}>
                          {item.value}/100
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-sm font-medium">Top Instructors</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah Johnson', value: 94 },
                      { name: 'Michael Chen', value: 91 },
                      { name: 'Emily Rodriguez', value: 88 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <Badge variant="outline">
                          {item.value}/100
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-sm font-medium">Top Content Types</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Interactive Quizzes', value: 95 },
                      { name: 'Video Tutorials', value: 88 },
                      { name: 'Coding Exercises', value: 86 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-medium text-green-600 dark:text-green-400">
                            {index + 1}
                          </div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <Badge variant="outline">
                          {item.value}/100
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          {/* Content Type Engagement */}
          <Card>
            <CardHeader>
              <CardTitle>Content Type Engagement</CardTitle>
              <CardDescription>Engagement metrics across different content types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={contentEngagementData}
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
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderColor: 'var(--border)',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="interactive" 
                      name="Interactive Learning" 
                      stackId="a" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="passive" 
                      name="Passive Learning" 
                      stackId="a" 
                      fill="#82ca9d" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Device Usage and Weekly Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>Platform access by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          borderColor: 'var(--border)',
                          borderRadius: '0.375rem'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Learning hours by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      width={500}
                      height={400}
                      data={weekdayData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          borderColor: 'var(--border)',
                          borderRadius: '0.375rem'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        name="Learning Hours" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sessions" 
                        name="Learning Sessions" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Assessment Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Score Distribution</CardTitle>
              <CardDescription>Distribution of assessment scores across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={scoreDistributionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderColor: 'var(--border)',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      name="Number of Students" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    >
                      {scoreDistributionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            index < 5 
                              ? `rgba(255, 99, 132, ${0.4 + index * 0.12})` 
                              : `rgba(54, 162, 235, ${0.4 + (index - 5) * 0.12})`
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-6">
          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Student Demographics</CardTitle>
              <CardDescription>Detailed breakdown of student demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Age Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { age: '18-24', percentage: 24 },
                      { age: '25-34', percentage: 38 },
                      { age: '35-44', percentage: 22 },
                      { age: '45-54', percentage: 12 },
                      { age: '55+', percentage: 4 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{item.age}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-4">Professional Background</h3>
                  <div className="space-y-4">
                    {[
                      { background: 'Technology', percentage: 42 },
                      { background: 'Business', percentage: 28 },
                      { background: 'Education', percentage: 15 },
                      { background: 'Healthcare', percentage: 8 },
                      { background: 'Other', percentage: 7 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{item.background}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-4">Education Level</h3>
                  <div className="space-y-4">
                    {[
                      { level: 'High School', percentage: 15 },
                      { level: 'Bachelor\'s', percentage: 45 },
                      { level: 'Master\'s', percentage: 28 },
                      { level: 'PhD', percentage: 7 },
                      { level: 'Other', percentage: 5 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{item.level}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Geographic Detailed View */}
                <div>
                  <h3 className="text-sm font-medium mb-4">Top Countries</h3>
                  <div className="space-y-3">
                    {[
                      { country: 'United States', percentage: 38 },
                      { country: 'India', percentage: 14 },
                      { country: 'United Kingdom', percentage: 9 },
                      { country: 'Canada', percentage: 7 },
                      { country: 'Australia', percentage: 6 },
                      { country: 'Germany', percentage: 5 },
                      { country: 'Brazil', percentage: 4 },
                      { country: 'Others', percentage: 17 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1 flex justify-between">
                          <span className="text-sm">{item.country}</span>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Language Preference */}
                <div>
                  <h3 className="text-sm font-medium mb-4">Language Preference</h3>
                  <div className="space-y-3">
                    {[
                      { language: 'English', percentage: 65 },
                      { language: 'Spanish', percentage: 12 },
                      { language: 'Hindi', percentage: 8 },
                      { language: 'French', percentage: 5 },
                      { language: 'German', percentage: 4 },
                      { language: 'Portuguese', percentage: 3 },
                      { language: 'Chinese', percentage: 2 },
                      { language: 'Others', percentage: 1 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1 flex justify-between">
                          <span className="text-sm">{item.language}</span>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Subject Interest Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Interest Distribution</CardTitle>
              <CardDescription>Distribution of subjects students are interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    width={500}
                    height={400}
                    data={[
                      { subject: 'Web Development', count: 2845 },
                      { subject: 'Data Science', count: 2456 },
                      { subject: 'Machine Learning', count: 2120 },
                      { subject: 'Mobile Development', count: 1875 },
                      { subject: 'UX/UI Design', count: 1642 },
                      { subject: 'Cloud Computing', count: 1520 },
                      { subject: 'Cybersecurity', count: 1320 },
                      { subject: 'DevOps', count: 1240 },
                      { subject: 'Blockchain', count: 980 },
                      { subject: 'Game Development', count: 845 },
                    ]}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 150,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="subject" type="category" width={140} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderColor: 'var(--border)',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      name="Number of Students" 
                      fill="#8884d8" 
                      radius={[0, 4, 4, 0]}
                    >
                      {[
                        { subject: 'Web Development', count: 2845 },
                        { subject: 'Data Science', count: 2456 },
                        { subject: 'Machine Learning', count: 2120 },
                        { subject: 'Mobile Development', count: 1875 },
                        { subject: 'UX/UI Design', count: 1642 },
                        { subject: 'Cloud Computing', count: 1520 },
                        { subject: 'Cybersecurity', count: 1320 },
                        { subject: 'DevOps', count: 1240 },
                        { subject: 'Blockchain', count: 980 },
                        { subject: 'Game Development', count: 845 },
                      ].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning" className="space-y-6">
          {/* Learning Style Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Style Analysis</CardTitle>
              <CardDescription>Comparison of your learning preferences vs. platform average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={learningStyleData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Your Profile"
                      dataKey="user"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Platform Average"
                      dataKey="average"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderColor: 'var(--border)',
                        borderRadius: '0.375rem'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Pattern Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Frequency</CardTitle>
                <CardDescription>Number of learning sessions by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={500}
                      height={300}
                      data={[
                        { time: '12am', sessions: 12 },
                        { time: '3am', sessions: 8 },
                        { time: '6am', sessions: 25 },
                        { time: '9am', sessions: 45 },
                        { time: '12pm', sessions: 32 },
                        { time: '3pm', sessions: 48 },
                        { time: '6pm', sessions: 78 },
                        { time: '9pm', sessions: 62 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          borderColor: 'var(--border)',
                          borderRadius: '0.375rem'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        name="Learning Sessions"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
                <CardDescription>Average time spent per learning session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={[
                        { duration: '<15 min', sessions: 120 },
                        { duration: '15-30 min', sessions: 240 },
                        { duration: '30-45 min', sessions: 320 },
                        { duration: '45-60 min', sessions: 280 },
                        { duration: '1-2 hrs', sessions: 180 },
                        { duration: '>2 hrs', sessions: 60 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="duration" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          borderColor: 'var(--border)',
                          borderRadius: '0.375rem'
                        }}
                      />
                      <Bar 
                        dataKey="sessions" 
                        name="Number of Sessions" 
                        fill="#82ca9d" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Learning Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Learning Recommendations</CardTitle>
              <CardDescription>Content and study pattern recommendations based on your learning style</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                        <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium">Optimal Study Time</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your activity patterns, your optimal study times are:
                      </p>
                      <div className="mt-2 font-medium text-blue-600 dark:text-blue-400">
                        6:00 PM - 9:00 PM
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        You show 28% higher engagement during these hours
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                        <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-medium">Content Format Preference</h3>
                      <p className="text-sm text-muted-foreground">
                        Your learning data shows you learn best through:
                      </p>
                      <div className="mt-2 font-medium text-green-600 dark:text-green-400">
                        Visual & Interactive Content
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        You complete 42% more interactive lessons than text-based ones
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                        <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="font-medium">Session Duration</h3>
                      <p className="text-sm text-muted-foreground">
                        Your optimal learning session length is:
                      </p>
                      <div className="mt-2 font-medium text-amber-600 dark:text-amber-400">
                        30-45 minute sessions
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your retention drops 35% in sessions longer than 60 minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Recommended Content Based on Your Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Interactive Data Visualization Workshop",
                      type: "Workshop",
                      match: 98,
                      reason: "Matches your visual learning style and interactive content preference."
                    },
                    {
                      title: "Practical Machine Learning Projects",
                      type: "Hands-on Course",
                      match: 94,
                      reason: "Aligns with your preference for practical application over theory."
                    },
                    {
                      title: "Microlearning: Web Development Concepts",
                      type: "Series",
                      match: 92,
                      reason: "Structured in your optimal learning session duration of 30-45 minutes."
                    }
                  ].map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="mb-2">
                              {item.type}
                            </Badge>
                            <Badge variant="default">
                              {item.match}% Match
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.reason}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chartjs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chart.js Visualizations</CardTitle>
              <CardDescription>
                Interactive analytics powered by Chart.js with advanced visualization capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartJSExamples isDarkMode={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalytics;