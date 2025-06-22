import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  LegendItem,
  defaults,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar, getElementAtEvent } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

// Set default styles
defaults.font.family = 'var(--font-sans)';
defaults.color = 'hsl(var(--foreground))';
defaults.borderColor = 'hsl(var(--border))';

// Interface for component props
interface ChartJSExamplesProps {
  isDarkMode?: boolean;
  courseId?: number;
  userId?: number;
}

// Sample course progress data
const courseProgressData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  datasets: [
    {
      label: 'Progress (%)',
      data: [12, 28, 31, 45, 58, 72, 85, 92],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      tension: 0.4,
    },
    {
      label: 'Course Average (%)',
      data: [15, 25, 35, 40, 50, 60, 68, 75],
      fill: false,
      borderColor: 'rgba(156, 163, 175, 0.8)',
      borderDash: [5, 5],
      tension: 0.4,
    },
  ],
};

// Sample skills assessment data
const skillsRadarData = {
  labels: [
    'JavaScript',
    'React',
    'CSS',
    'Node.js',
    'Database',
    'Testing',
  ],
  datasets: [
    {
      label: 'Current Skills',
      data: [65, 75, 70, 80, 60, 50],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    },
    {
      label: 'Target Skills',
      data: [80, 90, 85, 90, 75, 70],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
    },
  ],
};

// Sample time spent data
const timeSpentData = {
  labels: ['Video Lectures', 'Reading Materials', 'Coding Exercises', 'Quizzes', 'Discussions', 'Projects'],
  datasets: [
    {
      label: 'Hours Spent',
      data: [12, 8, 15, 5, 4, 10],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// Sample quiz performance data
const quizPerformanceData = {
  labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5', 'Final Assessment'],
  datasets: [
    {
      label: 'Your Score',
      data: [85, 70, 90, 75, 95, 88],
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
    },
    {
      label: 'Class Average',
      data: [75, 68, 80, 72, 82, 78],
      backgroundColor: 'rgba(209, 213, 219, 0.7)',
    },
  ],
};

// Sample engagement metrics
const engagementData = {
  labels: ['Video Completion', 'On-Time Submissions', 'Discussion Posts', 'Resources Accessed', 'Exercise Completion', 'Peer Interactions'],
  datasets: [
    {
      label: 'Engagement Metrics',
      data: [92, 85, 65, 78, 90, 70],
      fill: true,
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      borderColor: 'rgba(124, 58, 237, 1)',
      pointBackgroundColor: 'rgba(124, 58, 237, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(124, 58, 237, 1)',
    },
  ],
};

// Sample learning outcomes achievements
const learningOutcomesData = {
  labels: [
    'Core Concepts',
    'Problem Solving',
    'Technical Skills',
    'Best Practices',
    'Project Delivery',
  ],
  datasets: [
    {
      label: 'Mastery Level',
      data: [85, 75, 90, 70, 80],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(99, 102, 241, 0.7)',
        'rgba(236, 72, 153, 0.7)',
      ],
      hoverOffset: 4,
    },
  ],
};

// Chart options
const getLineOptions = (isDarkMode: boolean): ChartOptions<'line'> => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        padding: 20,
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
    },
    x: {
      grid: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 3,
      hoverRadius: 6,
    },
  },
});

const getBarOptions = (isDarkMode: boolean): ChartOptions<'bar'> => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
    },
    x: {
      grid: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
    },
  },
});

const getDoughnutOptions = (isDarkMode: boolean): ChartOptions<'doughnut'> => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
    },
  },
  cutout: '70%',
});

const getRadarOptions = (isDarkMode: boolean): ChartOptions<'radar'> => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
    },
  },
  scales: {
    r: {
      angleLines: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      grid: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      pointLabels: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        font: {
          size: 12,
        },
      },
      ticks: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        backdropColor: 'transparent',
      },
    },
  },
});

export const ChartJSExamples: React.FC<ChartJSExamplesProps> = ({ 
  isDarkMode = false,
  courseId,
  userId
}) => {
  const { toast } = useToast();
  const chartRef = useRef<any>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  
  // Interactive click handler for charts
  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (chartRef.current) {
      const element = getElementAtEvent(chartRef.current, event);
      
      if (element.length > 0) {
        const { datasetIndex, index } = element[0];
        const label = quizPerformanceData.labels[index];
        const value = quizPerformanceData.datasets[datasetIndex].data[index];
        
        toast({
          title: `${quizPerformanceData.datasets[datasetIndex].label}`,
          description: `${label}: ${value}%`,
        });
      }
    }
  };
  
  // Customize chart theme based on dark/light mode
  useEffect(() => {
    // No side effects needed here since we're using the isDarkMode prop directly
  }, [isDarkMode]);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Weekly progress tracking compared to class average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Line 
                data={courseProgressData} 
                options={getLineOptions(isDarkMode)} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Current progress: <span className="font-medium">92%</span>
            </div>
            <Badge variant="outline">17% above average</Badge>
          </CardFooter>
        </Card>
        
        {/* Skills Assessment Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Current skills vs. target competencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Radar 
                data={skillsRadarData} 
                options={getRadarOptions(isDarkMode)} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-sm text-muted-foreground">
              <div className="flex justify-between mb-1">
                <span>Overall Skill Level:</span>
                <span className="font-medium">67%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Spent Distribution */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>Hours spent across different activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <Doughnut 
                data={timeSpentData} 
                options={getDoughnutOptions(isDarkMode)} 
              />
            </div>
          </CardContent>
          <CardFooter className="text-center">
            <div className="w-full text-sm">
              <div className="font-medium">Total Hours: 54</div>
              <div className="text-muted-foreground">Last updated: Today</div>
            </div>
          </CardFooter>
        </Card>
        
        {/* Quiz Performance Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Assessment scores compared to class average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <Bar 
                ref={chartRef}
                data={quizPerformanceData} 
                options={getBarOptions(isDarkMode)} 
                onClick={handleChartClick}
              />
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <div>Click on any bar to see detailed score information</div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Key engagement indicators across course activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <PolarArea 
                data={engagementData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                      },
                    },
                  },
                  scales: {
                    r: {
                      ticks: {
                        backdropColor: 'transparent',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      },
                    },
                  },
                }} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-medium">80%</div>
                <div className="text-muted-foreground">Avg. Engagement</div>
              </div>
              <div>
                <div className="font-medium">92%</div>
                <div className="text-muted-foreground">Video Completion</div>
              </div>
              <div>
                <div className="font-medium">65%</div>
                <div className="text-muted-foreground">Discussion Posts</div>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        {/* Learning Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Outcomes</CardTitle>
            <CardDescription>Mastery level across course objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <Pie 
                data={learningOutcomesData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                      },
                    },
                  },
                }} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-sm text-center">
              <div className="font-medium">80% Average Mastery</div>
              <div className="text-muted-foreground">
                Strongest area: Technical Skills (90%)
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Course Insights</CardTitle>
            <CardDescription>AI-powered recommendations based on your learning data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  🔍
                </div>
                <div>
                  <h3 className="font-medium mb-1">Study Recommendation</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on your quiz performance, consider revisiting the materials on <span className="font-medium">State Management</span> and <span className="font-medium">Hooks API</span>. Your scores in these areas are below your typical performance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                <div className="mt-0.5 h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  ⏱️
                </div>
                <div>
                  <h3 className="font-medium mb-1">Time Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    You're spending significantly more time on coding exercises than your peers. Try using the provided code templates and exploring the documentation resources to improve efficiency.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5">
                <div className="mt-0.5 h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  🚀
                </div>
                <div>
                  <h3 className="font-medium mb-1">Next Focus Area</h3>
                  <p className="text-sm text-muted-foreground">
                    Given your strong progress, you're ready to explore advanced topics. We recommend the optional module on <span className="font-medium">Advanced Component Patterns</span> which aligns with your learning goals.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Detailed Learning Report</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChartJSExamples;