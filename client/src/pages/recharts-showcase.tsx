import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import { DynamicChart, ChartType, ColorTheme } from '@/components/analytics/dynamic-chart';

const RechartsShowcase: React.FC = () => {
  const [_, setLocation] = useLocation();
  
  // Sample dataset for various charts
  const timeSeriesData = [
    { date: 'Jan', value: 1000, users: 400, engagement: 80 },
    { date: 'Feb', value: 1500, users: 500, engagement: 85 },
    { date: 'Mar', value: 1200, users: 480, engagement: 82 },
    { date: 'Apr', value: 1800, users: 600, engagement: 87 },
    { date: 'May', value: 2000, users: 700, engagement: 90 },
    { date: 'Jun', value: 2200, users: 850, engagement: 92 },
    { date: 'Jul', value: 2500, users: 900, engagement: 95 },
    { date: 'Aug', value: 2300, users: 850, engagement: 93 },
    { date: 'Sep', value: 2400, users: 880, engagement: 94 },
    { date: 'Oct', value: 2600, users: 950, engagement: 96 },
    { date: 'Nov', value: 2800, users: 980, engagement: 97 },
    { date: 'Dec', value: 3000, users: 1000, engagement: 98 },
  ];
  
  const categoryData = [
    { name: 'JavaScript', value: 85, average: 70 },
    { name: 'Python', value: 78, average: 65 },
    { name: 'Java', value: 65, average: 60 },
    { name: 'C#', value: 72, average: 62 },
    { name: 'PHP', value: 68, average: 58 },
    { name: 'Ruby', value: 60, average: 55 },
    { name: 'TypeScript', value: 82, average: 68 },
    { name: 'Swift', value: 70, average: 59 },
  ];
  
  const engagementData = [
    { subject: 'Video Completion', user: 80, average: 65, fullMark: 100 },
    { subject: 'Quiz Participation', user: 90, average: 70, fullMark: 100 },
    { subject: 'Forum Activity', user: 65, average: 55, fullMark: 100 },
    { subject: 'Assignment Submission', user: 85, average: 75, fullMark: 100 },
    { subject: 'Peer Reviews', user: 70, average: 50, fullMark: 100 },
    { subject: 'Live Session Attendance', user: 75, average: 60, fullMark: 100 },
  ];
  
  const timeDistributionData = [
    { name: 'Video Lectures', value: 40 },
    { name: 'Reading Materials', value: 15 },
    { name: 'Interactive Exercises', value: 25 },
    { name: 'Quizzes & Assessments', value: 10 },
    { name: 'Discussion Forums', value: 5 },
    { name: 'Projects', value: 5 },
  ];
  
  const scatterData = [
    { difficulty: 2, engagement: 30, size: 20, name: 'Intro to HTML' },
    { difficulty: 3, engagement: 45, size: 30, name: 'CSS Basics' },
    { difficulty: 5, engagement: 60, size: 40, name: 'JavaScript Fundamentals' },
    { difficulty: 7, engagement: 80, size: 45, name: 'React Essentials' },
    { difficulty: 8, engagement: 75, size: 50, name: 'Node.js & Express' },
    { difficulty: 4, engagement: 70, size: 35, name: 'Responsive Design' },
    { difficulty: 6, engagement: 55, size: 30, name: 'API Integration' },
    { difficulty: 9, engagement: 85, size: 55, name: 'Full-Stack Development' },
    { difficulty: 10, engagement: 90, size: 60, name: 'Advanced Frameworks' },
    { difficulty: 5, engagement: 65, size: 40, name: 'Database Design' },
    { difficulty: 7, engagement: 72, size: 45, name: 'Authentication & Security' },
    { difficulty: 3, engagement: 50, size: 25, name: 'Web Accessibility' },
  ];
  
  const treeMapData = [
    {
      name: 'Web Development',
      value: 400,
      children: [
        { name: 'HTML/CSS', value: 120 },
        { name: 'JavaScript', value: 180 },
        { name: 'React', value: 100 },
      ],
    },
    {
      name: 'Data Science',
      value: 300,
      children: [
        { name: 'Python', value: 130 },
        { name: 'Statistics', value: 80 },
        { name: 'Machine Learning', value: 90 },
      ],
    },
    {
      name: 'Mobile Development',
      value: 200,
      children: [
        { name: 'iOS', value: 80 },
        { name: 'Android', value: 70 },
        { name: 'React Native', value: 50 },
      ],
    },
    {
      name: 'DevOps',
      value: 100,
      children: [
        { name: 'Docker', value: 40 },
        { name: 'CI/CD', value: 30 },
        { name: 'Cloud Services', value: 30 },
      ],
    },
  ];
  
  // Handle chart export
  const handleExport = (format: 'png' | 'svg' | 'csv' | 'json') => {
    console.log(`Exporting chart as ${format}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
        Advanced Analytics Visualization
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Interactive Recharts visualizations with customizable chart types, colors, and data views
      </p>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="charts">Chart Types</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DynamicChart
              data={timeSeriesData}
              title="Learning Progress Over Time"
              description="Monthly value, user count, and engagement metrics"
              dataKeys={['value', 'users', 'engagement']}
              xAxisKey="date"
              defaultChartType="composed"
              availableChartTypes={['line', 'area', 'bar', 'composed']}
              allowTimeRangeSelection={true}
              colorTheme="blue"
              onExport={handleExport}
            />
            
            <DynamicChart
              data={engagementData}
              title="Learning Engagement Radar"
              description="Your activity vs. platform average"
              dataKeys={['user', 'average']}
              categoryKey="subject"
              defaultChartType="radar"
              availableChartTypes={['radar']}
              colorTheme="purple"
              onExport={handleExport}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DynamicChart
              data={timeDistributionData}
              title="Time Distribution"
              description="How you spend time across activities"
              valueKey="value"
              nameKey="name"
              defaultChartType="pie"
              availableChartTypes={['pie']}
              colorTheme="pastel"
              onExport={handleExport}
            />
            
            <div className="md:col-span-2">
              <DynamicChart
                data={categoryData}
                title="Programming Skills"
                description="Your proficiency vs. platform average"
                dataKeys={['value', 'average']}
                xAxisKey="name"
                defaultChartType="bar"
                availableChartTypes={['bar', 'line']}
                colorTheme="green"
                onExport={handleExport}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DynamicChart
              data={timeSeriesData}
              title="Line Chart"
              description="Standard line chart with multiple series"
              dataKeys={['value', 'users']}
              xAxisKey="date"
              defaultChartType="line"
              availableChartTypes={['line']}
              colorTheme="blue"
            />
            
            <DynamicChart
              data={timeSeriesData}
              title="Area Chart"
              description="Area chart showing trends over time"
              dataKeys={['value', 'users']}
              xAxisKey="date"
              defaultChartType="area"
              availableChartTypes={['area']}
              colorTheme="green"
              stacked={true}
            />
            
            <DynamicChart
              data={categoryData}
              title="Bar Chart"
              description="Bar chart comparing values across categories"
              dataKeys={['value', 'average']}
              xAxisKey="name"
              defaultChartType="bar"
              availableChartTypes={['bar']}
              colorTheme="purple"
            />
            
            <DynamicChart
              data={timeSeriesData}
              title="Composed Chart"
              description="Combined chart with multiple visualization types"
              dataKeys={['value', 'users', 'engagement']}
              xAxisKey="date"
              defaultChartType="composed"
              availableChartTypes={['composed']}
              colorTheme="default"
            />
            
            <DynamicChart
              data={scatterData}
              title="Scatter Chart"
              description="Scatter plot showing relationships between variables"
              xAxisKey="difficulty"
              yAxisKeys={['engagement']}
              zAxisKey="size"
              nameKey="name"
              defaultChartType="scatter"
              availableChartTypes={['scatter']}
              colorTheme="rainbow"
            />
            
            <DynamicChart
              data={engagementData}
              title="Radar Chart"
              description="Radar chart comparing multiple categories"
              dataKeys={['user', 'average']}
              categoryKey="subject"
              defaultChartType="radar"
              availableChartTypes={['radar']}
              colorTheme="blue"
            />
            
            <DynamicChart
              data={categoryData}
              title="Programming Skills"
              description="Circular progress bars for skill categories"
              dataKeys={['value']}
              nameKey="name"
              defaultChartType="radialBar"
              availableChartTypes={['radialBar']}
              colorTheme="purple"
              className="programming-skills-card"
            />
            
            <DynamicChart
              data={timeDistributionData}
              title="Time Distribution"
              description="Proportion of time spent on learning activities"
              valueKey="value"
              nameKey="name"
              defaultChartType="pie"
              availableChartTypes={['pie']}
              colorTheme="pastel"
              className="time-distribution-card"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="customization" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Themes</CardTitle>
                <CardDescription>
                  Different color palettes available for charts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(["default", "blue", "green", "purple", "rainbow", "pastel", "monochrome", "diverging"] as ColorTheme[]).map((theme) => (
                    <Card key={theme}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{theme.charAt(0).toUpperCase() + theme.slice(1)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DynamicChart
                          data={timeSeriesData.slice(0, 6)}
                          dataKeys={['value']}
                          xAxisKey="date"
                          defaultChartType="line"
                          availableChartTypes={['line']}
                          colorTheme={theme}
                          height={150}
                          showLegend={false}
                          allowChartTypeChange={false}
                          allowColorThemeChange={false}
                          allowDataFilter={false}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Chart Types</CardTitle>
                <CardDescription>
                  Different visualization options for the same dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(["line", "area", "bar", "composed"] as ChartType[]).map((chartType) => (
                    <Card key={chartType}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{chartType.charAt(0).toUpperCase() + chartType.slice(1)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DynamicChart
                          data={timeSeriesData.slice(0, 6)}
                          dataKeys={['value', 'users']}
                          xAxisKey="date"
                          defaultChartType={chartType}
                          availableChartTypes={[chartType]}
                          colorTheme="blue"
                          height={150}
                          showLegend={false}
                          allowChartTypeChange={false}
                          allowColorThemeChange={false}
                          allowDataFilter={false}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="card-title">Data Visualization Features</CardTitle>
                <CardDescription className="card-description">
                  Advanced capabilities of our visualization system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="card-title">Interactive Filtering</CardTitle>
                        <CardDescription>
                          Toggle data series visibility and change chart parameters
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DynamicChart
                          data={timeSeriesData}
                          title="Interactive Controls"
                          dataKeys={['value', 'users', 'engagement']}
                          xAxisKey="date"
                          defaultChartType="line"
                          availableChartTypes={['line', 'area', 'bar']}
                          colorTheme="blue"
                          height={300}
                          allowChartTypeChange={true}
                          allowColorThemeChange={true}
                          allowDataFilter={true}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Reference Lines & Areas</CardTitle>
                        <CardDescription>
                          Annotate charts with reference markers and highlights
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DynamicChart
                          data={timeSeriesData}
                          title="Performance Thresholds"
                          dataKeys={['value']}
                          xAxisKey="date"
                          defaultChartType="line"
                          availableChartTypes={['line']}
                          colorTheme="purple"
                          height={300}
                          allowChartTypeChange={false}
                          referenceLines={[
                            { dataKey: 'value', value: 2000, label: 'Target', color: '#ff0000' },
                            { dataKey: 'value', value: 1000, label: 'Minimum', color: '#00ff00' }
                          ]}
                          referenceAreas={[
                            { x1: 0, x2: 3, y1: 0, y2: 1000, label: 'Low Performance', color: '#ff0000' },
                            { x1: 0, x2: 11, y1: 2000, y2: 5000, label: 'Excellent', color: '#00ff00' }
                          ]}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Time Range Filtering</CardTitle>
                        <CardDescription>
                          View data across different time periods
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DynamicChart
                          data={timeSeriesData}
                          title="Time-Based Analysis"
                          dataKeys={['value']}
                          xAxisKey="date"
                          defaultChartType="area"
                          availableChartTypes={['area']}
                          colorTheme="green"
                          height={300}
                          allowChartTypeChange={false}
                          allowTimeRangeSelection={true}
                          timeRanges={[
                            { label: 'Q1', value: 'q1', filter: (item: any, index: number) => index < 3 },
                            { label: 'Q2', value: 'q2', filter: (item: any, index: number) => index >= 3 && index < 6 },
                            { label: 'Q3', value: 'q3', filter: (item: any, index: number) => index >= 6 && index < 9 },
                            { label: 'Q4', value: 'q4', filter: (item: any, index: number) => index >= 9 },
                            { label: 'All Year', value: 'all', filter: () => true }
                          ]}
                        />
                      </CardContent>
                    </Card>
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

export default RechartsShowcase;