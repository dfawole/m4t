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
  Sankey,
  Treemap,
  Rectangle
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  BookOpen, 
  GitGraph,
  Route,
  MoveRight,
  Network,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LearningPathAnalytics() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [selectedPath, setSelectedPath] = useState<string>('all');
  
  // Get learning path statistics
  const { data: pathStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/analytics/learning-paths', { timeRange }],
  });

  // Get path progression data
  const { data: pathProgression, isLoading: isLoadingProgression } = useQuery({
    queryKey: ['/api/analytics/path-progression', { timeRange, pathId: selectedPath !== 'all' ? selectedPath : undefined }],
  });

  const isLoading = isLoadingStats || isLoadingProgression;

  // Sample learning path stats
  const samplePathStats = {
    topPaths: [
      { name: 'Web Development', students: 2450, completionRate: 68, avgTimeToComplete: 85 },
      { name: 'Data Science & ML', students: 1840, completionRate: 62, avgTimeToComplete: 92 },
      { name: 'Mobile App Development', students: 1580, completionRate: 65, avgTimeToComplete: 78 },
      { name: 'UI/UX Design', students: 1420, completionRate: 72, avgTimeToComplete: 65 },
      { name: 'DevOps & Cloud', students: 1280, completionRate: 58, avgTimeToComplete: 102 },
    ],
    pathEnrollments: [
      { month: 'Jan', webDev: 180, dataSci: 145, mobile: 120, design: 110, devops: 95 },
      { month: 'Feb', webDev: 195, dataSci: 155, mobile: 125, design: 115, devops: 100 },
      { month: 'Mar', webDev: 210, dataSci: 165, mobile: 130, design: 125, devops: 105 },
      { month: 'Apr', webDev: 230, dataSci: 175, mobile: 140, design: 130, devops: 110 },
      { month: 'May', webDev: 250, dataSci: 190, mobile: 150, design: 140, devops: 120 },
      { month: 'Jun', webDev: 270, dataSci: 205, mobile: 160, design: 145, devops: 130 },
      { month: 'Jul', webDev: 290, dataSci: 220, mobile: 170, design: 155, devops: 135 },
      { month: 'Aug', webDev: 310, dataSci: 230, mobile: 180, design: 160, devops: 140 },
      { month: 'Sep', webDev: 325, dataSci: 245, mobile: 190, design: 170, devops: 145 },
      { month: 'Oct', webDev: 340, dataSci: 255, mobile: 200, design: 175, devops: 150 },
      { month: 'Nov', webDev: 355, dataSci: 270, mobile: 210, design: 185, devops: 160 },
      { month: 'Dec', webDev: 375, dataSci: 280, mobile: 220, design: 190, devops: 170 },
    ],
    courseConnections: [
      { from: 'HTML/CSS Basics', to: 'JavaScript Fundamentals', value: 580 },
      { from: 'JavaScript Fundamentals', to: 'Frontend Frameworks', value: 485 },
      { from: 'JavaScript Fundamentals', to: 'Backend Development', value: 380 },
      { from: 'Frontend Frameworks', to: 'Full Stack Development', value: 320 },
      { from: 'Backend Development', to: 'Full Stack Development', value: 290 },
      { from: 'Backend Development', to: 'API Development', value: 185 },
      { from: 'HTML/CSS Basics', to: 'Web Design Principles', value: 260 },
      { from: 'Web Design Principles', to: 'UI/UX Design', value: 210 },
      { from: 'JavaScript Fundamentals', to: 'Mobile App Development', value: 195 },
      { from: 'Full Stack Development', to: 'DevOps Basics', value: 180 },
      { from: 'Backend Development', to: 'Database Management', value: 220 },
      { from: 'Database Management', to: 'Data Science Basics', value: 150 },
    ],
    pathProgression: {
      'Web Development': [
        { step: 'HTML/CSS Basics', started: 2450, completed: 2150 },
        { step: 'JavaScript Fundamentals', started: 2150, completed: 1820 },
        { step: 'Frontend Frameworks', started: 1820, completed: 1520 },
        { step: 'Backend Development', started: 1520, completed: 1280 },
        { step: 'Full Stack Projects', started: 1280, completed: 980 },
        { step: 'DevOps Basics', started: 980, completed: 780 },
        { step: 'Advanced Projects', started: 780, completed: 650 },
      ],
    },
    pathCompletion: [
      { name: 'Completed', value: 68 },
      { name: 'In Progress', value: 22 },
      { name: 'Dropped Off', value: 10 },
    ]
  };

  // Sample learning path progression data
  const sampleProgressionData = {
    nodes: [
      { name: 'Students' },
      { name: 'HTML/CSS' },
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'MongoDB' },
      { name: 'Full Stack' },
      { name: 'Deployment' },
      { name: 'Completed' },
      { name: 'Dropped' },
    ],
    links: [
      { source: 0, target: 1, value: 1000 },
      { source: 1, target: 2, value: 950 },
      { source: 2, target: 3, value: 880 },
      { source: 2, target: 4, value: 820 },
      { source: 3, target: 6, value: 750 },
      { source: 4, target: 5, value: 790 },
      { source: 5, target: 6, value: 730 },
      { source: 6, target: 7, value: 680 },
      { source: 7, target: 8, value: 640 },
      { source: 8, target: 9, value: 580 },
      { source: 1, target: 10, value: 50 },
      { source: 2, target: 10, value: 70 },
      { source: 3, target: 10, value: 130 },
      { source: 4, target: 10, value: 30 },
      { source: 5, target: 10, value: 60 },
      { source: 6, target: 10, value: 50 },
      { source: 7, target: 10, value: 40 },
      { source: 8, target: 10, value: 60 },
    ]
  };

  // Sample skill tree data
  const sampleSkillTreeData = {
    name: 'Web Development',
    children: [
      {
        name: 'Frontend',
        children: [
          { name: 'HTML', size: 85, completionRate: 92 },
          { name: 'CSS', size: 80, completionRate: 87 },
          { name: 'JavaScript', size: 75, completionRate: 78 },
          { 
            name: 'Frameworks',
            children: [
              { name: 'React', size: 70, completionRate: 72 },
              { name: 'Vue', size: 55, completionRate: 68 },
              { name: 'Angular', size: 50, completionRate: 65 }
            ]
          }
        ]
      },
      {
        name: 'Backend',
        children: [
          { name: 'Node.js', size: 65, completionRate: 75 },
          { name: 'Express', size: 60, completionRate: 72 },
          { 
            name: 'Databases',
            children: [
              { name: 'SQL', size: 55, completionRate: 68 },
              { name: 'MongoDB', size: 50, completionRate: 65 }
            ]
          },
          { name: 'APIs', size: 60, completionRate: 70 }
        ]
      },
      {
        name: 'DevOps',
        children: [
          { name: 'Git', size: 70, completionRate: 82 },
          { name: 'CI/CD', size: 50, completionRate: 62 },
          { name: 'Docker', size: 45, completionRate: 58 },
          { name: 'AWS', size: 40, completionRate: 52 }
        ]
      }
    ]
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Learning Path Analytics</h2>
          <p className="text-muted-foreground">Track student progression through structured learning paths</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPath} onValueChange={setSelectedPath}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a learning path" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Paths</SelectItem>
              <SelectItem value="web-dev">Web Development</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="mobile-dev">Mobile Development</SelectItem>
              <SelectItem value="ui-ux">UI/UX Design</SelectItem>
              <SelectItem value="devops">DevOps & Cloud</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
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
              className={timeRange === 'quarter' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
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
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Learning Path</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : 'Web Development'}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '--' : '2,450'} enrolled students
            </p>
            <Progress className="mt-2" value={isLoading ? 68 : 68} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
            <GitGraph className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : '65'}%</div>
            <p className="text-xs text-muted-foreground">
              Across all learning paths
            </p>
            <Progress className="mt-2" value={isLoading ? 65 : 65} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Complete</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '--' : '84.4'} days
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all paths
            </p>
            <Progress className="mt-2" value={85} />
          </CardContent>
        </Card>
        
        <Card className="animate-staggered-fade">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Path Popularity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '--' : '+18.5'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Increase in enrollments
            </p>
            <Progress className="mt-2" value={85} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="completion">Completion Analysis</TabsTrigger>
          <TabsTrigger value="pathflow">Path Flow</TabsTrigger>
          <TabsTrigger value="skilltree">Skill Tree</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Enrollments</CardTitle>
              <CardDescription>
                Monthly enrollment trends by learning path
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={isLoading ? samplePathStats.pathEnrollments : pathStats?.pathEnrollments || samplePathStats.pathEnrollments}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="webDev" name="Web Development" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="dataSci" name="Data Science" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="mobile" name="Mobile Dev" stroke="#ffc658" />
                  <Line type="monotone" dataKey="design" name="UI/UX Design" stroke="#ff8042" />
                  <Line type="monotone" dataKey="devops" name="DevOps & Cloud" stroke="#0088fe" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Learning Paths</CardTitle>
                <CardDescription>
                  Most popular learning paths by enrollment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Path Name</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Students</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Completion</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Avg. Days</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(isLoading ? samplePathStats.topPaths : pathStats?.topPaths || samplePathStats.topPaths).map((path, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">{path.name}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">{path.students.toLocaleString()}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            <div className="flex items-center">
                              <span className="mr-2">{path.completionRate}%</span>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    path.completionRate >= 70 ? 'bg-green-500' : 
                                    path.completionRate >= 60 ? 'bg-yellow-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${path.completionRate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">{path.avgTimeToComplete} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Path Completion Rates</CardTitle>
                <CardDescription>
                  Overall completion status across paths
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={isLoading ? samplePathStats.pathCompletion : pathStats?.pathCompletion || samplePathStats.pathCompletion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(isLoading ? samplePathStats.pathCompletion : pathStats?.pathCompletion || samplePathStats.pathCompletion).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            index === 0 ? '#10b981' : 
                            index === 1 ? '#f59e0b' : 
                            '#ef4444'
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Completion Analysis Tab */}
        <TabsContent value="completion" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Step Progression</CardTitle>
              <CardDescription>
                Student progress through each step of the selected path
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isLoading ? 
                    samplePathStats.pathProgression['Web Development'] : 
                    pathProgression?.stepProgression || 
                    samplePathStats.pathProgression['Web Development']
                  }
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 120,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="step" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="started" name="Students Started" fill="#8884d8" />
                  <Bar dataKey="completed" name="Students Completed" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Completion Time Distribution</CardTitle>
                <CardDescription>
                  How long it takes students to complete the path
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { range: '< 30 days', students: 160 },
                      { range: '30-60 days', students: 280 },
                      { range: '60-90 days', students: 340 },
                      { range: '90-120 days', students: 220 },
                      { range: '120-150 days', students: 140 },
                      { range: '> 150 days', students: 120 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" name="Number of Students" fill="#8884d8">
                      {[
                        { range: '< 30 days', students: 160 },
                        { range: '30-60 days', students: 280 },
                        { range: '60-90 days', students: 340 },
                        { range: '90-120 days', students: 220 },
                        { range: '120-150 days', students: 140 },
                        { range: '> 150 days', students: 120 },
                      ].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            index === 0 ? '#22c55e' : 
                            index === 1 ? '#10b981' :
                            index === 2 ? '#0ea5e9' :
                            index === 3 ? '#f59e0b' :
                            index === 4 ? '#f97316' :
                            '#ef4444'
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Path Difficulty Rating</CardTitle>
                <CardDescription>
                  Student-reported difficulty for each path
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { path: 'Web Development', difficulty: 3.6 },
                      { path: 'Data Science & ML', difficulty: 4.2 },
                      { path: 'Mobile App Development', difficulty: 3.8 },
                      { path: 'UI/UX Design', difficulty: 3.4 },
                      { path: 'DevOps & Cloud', difficulty: 4.1 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 100,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <YAxis dataKey="path" type="category" width={90} />
                    <Tooltip formatter={(value) => `${value} / 5`} />
                    <Legend />
                    <Bar dataKey="difficulty" name="Difficulty Rating (out of 5)" fill="#8884d8">
                      {[
                        { path: 'Web Development', difficulty: 3.6 },
                        { path: 'Data Science & ML', difficulty: 4.2 },
                        { path: 'Mobile App Development', difficulty: 3.8 },
                        { path: 'UI/UX Design', difficulty: 3.4 },
                        { path: 'DevOps & Cloud', difficulty: 4.1 },
                      ].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.difficulty < 3 ? '#22c55e' : 
                            entry.difficulty < 4 ? '#f59e0b' :
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

        {/* Path Flow Tab */}
        <TabsContent value="pathflow" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Course Relationships</CardTitle>
              <CardDescription>
                How students flow between related courses
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex justify-center items-center h-full">
                <div className="text-center space-y-4">
                  <BookOpen className="h-16 w-16 mx-auto text-muted" />
                  <p className="text-lg font-medium">
                    Advanced Visualization
                  </p>
                  <p className="text-muted-foreground max-w-md">
                    This chart would show a Sankey diagram that visualizes how students move between courses in their learning path. It shows the flow and dropout points in the student journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Common Path Deviations</CardTitle>
                <CardDescription>
                  Where students commonly switch between paths
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Web Dev → Mobile Dev</span>
                      <span className="text-sm text-muted-foreground">32%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '32%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Data Science → ML Specialization</span>
                      <span className="text-sm text-muted-foreground">28%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '28%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Web Dev → DevOps</span>
                      <span className="text-sm text-muted-foreground">24%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '24%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Mobile Dev → UI/UX Design</span>
                      <span className="text-sm text-muted-foreground">18%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">DevOps → Cloud Certification</span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Course Combinations</CardTitle>
                <CardDescription>
                  Courses frequently taken together
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex flex-col space-y-2">
                  {[
                    { courses: 'JavaScript Fundamentals + React Framework', students: 1240, badge: 'Most Popular' },
                    { courses: 'HTML/CSS + JavaScript Fundamentals', students: 980, badge: 'Beginner Focused' },
                    { courses: 'Node.js + Express + MongoDB', students: 860, badge: 'Backend Stack' },
                    { courses: 'React + React Native', students: 780, badge: 'Cross-Platform' },
                    { courses: 'Data Science + Machine Learning', students: 740, badge: 'High Demand' },
                    { courses: 'DevOps + AWS Certification', students: 650, badge: 'Career Boost' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.courses}</span>
                          <Badge variant="outline" className="ml-2">{item.badge}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{item.students.toLocaleString()} students</div>
                      </div>
                      <MoveRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skill Tree Tab */}
        <TabsContent value="skilltree" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Web Development Skill Tree</CardTitle>
              <CardDescription>
                Breakdown of related skills and their mastery levels
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex justify-center items-center h-full">
                <div className="text-center space-y-4">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted" />
                  <p className="text-lg font-medium">
                    Interactive Skill Tree Visualization
                  </p>
                  <p className="text-muted-foreground max-w-md">
                    This chart would show a treemap visualization of the skills in the learning path, with coloring to indicate student proficiency and mastery of each skill.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Areas where students need more support
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { skill: 'Advanced JavaScript', proficiency: 62, target: 80 },
                      { skill: 'CSS Animations', proficiency: 58, target: 75 },
                      { skill: 'State Management', proficiency: 54, target: 80 },
                      { skill: 'API Authentication', proficiency: 48, target: 75 },
                      { skill: 'Performance Optimization', proficiency: 45, target: 70 },
                      { skill: 'Testing', proficiency: 42, target: 65 },
                      { skill: 'Deployment Pipelines', proficiency: 38, target: 60 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 120,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="skill" type="category" width={110} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="proficiency" name="Current Proficiency" fill="#8884d8" />
                    <Bar dataKey="target" name="Target Proficiency" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Correlation</CardTitle>
                <CardDescription>
                  How different skills relate to one another
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Key Findings:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Students proficient in <span className="font-medium">JavaScript</span> learn <span className="font-medium">React</span> 42% faster</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Strong <span className="font-medium">CSS</span> skills correlate with better <span className="font-medium">UI/UX Design</span> outcomes (65% correlation)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Students with <span className="font-medium">SQL</span> knowledge complete <span className="font-medium">Backend Development</span> modules 38% faster</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span><span className="font-medium">Git</span> proficiency reduces project completion time by 24%</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Students strong in <span className="font-medium">Algorithms</span> show 52% better performance in <span className="font-medium">Performance Optimization</span></span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Recommended Focus Areas:</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">JavaScript Fundamentals</span>
                          <span className="text-sm text-green-500">High Impact</span>
                        </div>
                        <Progress className="h-2" value={95} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Data Structures</span>
                          <span className="text-sm text-green-500">High Impact</span>
                        </div>
                        <Progress className="h-2" value={85} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Git & Version Control</span>
                          <span className="text-sm text-yellow-500">Medium Impact</span>
                        </div>
                        <Progress className="h-2" value={75} />
                      </div>
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
}