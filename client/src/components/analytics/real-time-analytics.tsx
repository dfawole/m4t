import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Clock,
  Calendar,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Globe,
  Timer,
  Target,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Scatter
} from 'recharts';

// Interface for geographic user data
interface GeoData {
  country: string;
  count: number;
  percentage: number;
}

// Interface for real-time viewer data
interface RealTimeViewerData {
  timestamp: Date;
  activeViewers: number;
  joiningViewers: number;
  leavingViewers: number;
}

// Interface for engagement metrics
interface EngagementMetrics {
  avgWatchTime: number;
  completionRate: number;
  interactionRate: number;
  replayRate: number;
  shareRate: number;
  engagementScore: number;
}

// Interface for platform breakdown
interface PlatformData {
  platform: string;
  count: number;
  percentage: number;
}

// Interface for time-of-day analysis
interface TimeOfDayData {
  hour: number;
  viewCount: number;
  completionCount: number;
  averageEngagement: number;
}

// Component props
interface RealTimeAnalyticsProps {
  courseId?: string;
  contentId?: string;
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year';
  isExternalView?: boolean;
  onExport?: (format: 'csv' | 'pdf' | 'json') => void;
}

// Generate sample geographic data
const generateGeoData = (): GeoData[] => {
  return [
    { country: 'United States', count: 342, percentage: 34.2 },
    { country: 'India', count: 156, percentage: 15.6 },
    { country: 'United Kingdom', count: 98, percentage: 9.8 },
    { country: 'Canada', count: 87, percentage: 8.7 },
    { country: 'Germany', count: 64, percentage: 6.4 },
    { country: 'Australia', count: 52, percentage: 5.2 },
    { country: 'Brazil', count: 47, percentage: 4.7 },
    { country: 'France', count: 38, percentage: 3.8 },
    { country: 'Japan', count: 36, percentage: 3.6 },
    { country: 'Other', count: 80, percentage: 8.0 }
  ];
};

// Generate sample real-time viewer data
const generateRealTimeData = (dataPoints: number): RealTimeViewerData[] => {
  const data: RealTimeViewerData[] = [];
  const now = new Date();
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
    // Use deterministic values to avoid NaN errors
    const baseViewers = 50 + (i % 20) * 5; 
    const noise = Math.sin(i / 5) * 15; // Add some sinusoidal pattern
    
    data.push({
      timestamp,
      activeViewers: Math.max(1, Math.round(baseViewers + noise)),
      joiningViewers: Math.max(0, Math.round((i % 10) + 1)),
      leavingViewers: Math.max(0, Math.round((i % 8)))
    });
  }
  
  return data;
};

// Generate sample engagement metrics
const generateEngagementMetrics = (): EngagementMetrics => {
  return {
    avgWatchTime: Math.round(340 + Math.random() * 240), // 5-10 minutes in seconds
    completionRate: Math.round(65 + Math.random() * 25), // 65-90%
    interactionRate: Math.round(25 + Math.random() * 40), // 25-65%
    replayRate: Math.round(15 + Math.random() * 20), // 15-35%
    shareRate: Math.round(5 + Math.random() * 10), // 5-15%
    engagementScore: Math.round(72 + Math.random() * 18) // 72-90
  };
};

// Generate sample platform data
const generatePlatformData = (): PlatformData[] => {
  return [
    { platform: 'Desktop', count: 587, percentage: 58.7 },
    { platform: 'Mobile', count: 312, percentage: 31.2 },
    { platform: 'Tablet', count: 86, percentage: 8.6 },
    { platform: 'Smart TV', count: 15, percentage: 1.5 }
  ];
};

// Generate sample time-of-day data
const generateTimeOfDayData = (): TimeOfDayData[] => {
  const data: TimeOfDayData[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Create a natural curve with peak at working hours
    const baseValue = 20;
    let multiplier = 1;
    
    // More activity during business hours (8am-6pm)
    if (hour >= 8 && hour <= 18) {
      multiplier = 3 + Math.sin((hour - 8) / 10 * Math.PI) * 2;
    } else if (hour >= 19 && hour <= 23) {
      // Evening hours (7pm-11pm)
      multiplier = 2.5 - (hour - 19) * 0.3;
    } else if (hour >= 0 && hour <= 7) {
      // Night/early morning (12am-7am)
      multiplier = 0.5 + hour * 0.1;
    }
    
    const viewCount = Math.round(baseValue * multiplier * (1 + Math.random() * 0.5));
    const completionCount = Math.round(viewCount * (0.4 + Math.random() * 0.3));
    
    data.push({
      hour,
      viewCount,
      completionCount,
      averageEngagement: 40 + Math.random() * 40
    });
  }
  
  return data;
};

// Format seconds to mm:ss or hh:mm:ss
const formatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Format hour to 12-hour format
const formatHour = (hour: number): string => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h} ${ampm}`;
};

export default function RealTimeAnalytics({
  courseId,
  contentId,
  timeRange = 'day',
  isExternalView = false,
  onExport
}: RealTimeAnalyticsProps) {
  const { toast } = useToast();
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRange);
  const [geoData, setGeoData] = useState<GeoData[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeViewerData[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics | null>(null);
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [timeOfDayData, setTimeOfDayData] = useState<TimeOfDayData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load sample data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGeoData(generateGeoData());
      setRealTimeData(generateRealTimeData(60)); // 60 data points (1 hour)
      setEngagementMetrics(generateEngagementMetrics());
      setPlatformData(generatePlatformData());
      setTimeOfDayData(generateTimeOfDayData());
      
      setLastUpdated(new Date());
      setIsLoading(false);
    };
    
    loadData();
  }, [courseId, contentId]);
  
  // Set up the auto-refresh interval
  useEffect(() => {
    if (!isLive) return;
    
    const intervalId = setInterval(() => {
      // Update real-time data
      const newDataPoint: RealTimeViewerData = {
        timestamp: new Date(),
        activeViewers: realTimeData.length > 0 
          ? Math.round(
              realTimeData[realTimeData.length - 1].activeViewers * 
              (0.95 + Math.random() * 0.1)
            )
          : Math.round(50 + Math.random() * 100),
        joiningViewers: Math.round(Math.random() * 10),
        leavingViewers: Math.round(Math.random() * 8)
      };
      
      setRealTimeData(prev => {
        const updated = [...prev.slice(1), newDataPoint];
        return updated;
      });
      
      // Update engagement metrics slightly
      setEngagementMetrics(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          avgWatchTime: prev.avgWatchTime * (0.99 + Math.random() * 0.02),
          engagementScore: Math.min(100, Math.max(0, prev.engagementScore * (0.99 + Math.random() * 0.02)))
        };
      });
      
      setLastUpdated(new Date());
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [isLive, refreshInterval, realTimeData]);
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setRealTimeData(generateRealTimeData(60));
    setEngagementMetrics(generateEngagementMetrics());
    setLastUpdated(new Date());
    
    setIsLoading(false);
    
    toast({
      title: "Analytics refreshed",
      description: "The data has been updated to the latest available information.",
    });
  };
  
  // Handle export
  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    if (onExport) {
      onExport(format);
    } else {
      // Simple example of exporting to JSON
      if (format === 'json') {
        const data = {
          geoData,
          realTimeData,
          engagementMetrics,
          platformData,
          timeOfDayData,
          exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${courseId || 'all'}-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Export successful",
          description: "The analytics data has been exported in JSON format.",
        });
      } else {
        toast({
          title: "Export not available",
          description: `Exporting in ${format.toUpperCase()} format is not implemented in this demo.`,
          variant: "destructive"
        });
      }
    }
  };
  
  // Update refresh interval
  const updateRefreshInterval = (interval: number) => {
    setRefreshInterval(interval);
    
    toast({
      title: "Refresh interval updated",
      description: `Analytics will now refresh every ${interval} seconds.`,
    });
  };
  
  // Loading state
  if (isLoading && !realTimeData.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Real-Time Analytics</CardTitle>
          <CardDescription>
            Loading analytics data...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Real-Time Analytics
            </CardTitle>
            <CardDescription>
              {isExternalView 
                ? 'External analytics dashboard for course performance'
                : 'Internal performance and engagement analytics'
              }
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Time Range:</span>
              <Select 
                value={selectedTimeRange} 
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Refresh:</span>
              <Select 
                value={refreshInterval.toString()} 
                onValueChange={(value) => updateRefreshInterval(parseInt(value))}
              >
                <SelectTrigger className="w-24 h-8" disabled={!isLive}>
                  <SelectValue placeholder="Seconds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="15">15s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                  <SelectItem value="60">1m</SelectItem>
                  <SelectItem value="300">5m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={isLive ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="h-8 px-3 gap-1"
            >
              <Zap className="h-3.5 w-3.5" />
              {isLive ? "Live" : "Paused"}
            </Button>
            
            <Select
              onValueChange={(value) => handleExport(value as 'csv' | 'pdf' | 'json')}
            >
              <SelectTrigger className="w-[110px] h-8">
                <div className="flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-0 flex-grow overflow-auto">
        <Tabs defaultValue="overview" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 h-[calc(100%-40px)] overflow-auto pr-1">
            {/* Real-time viewers chart with Recharts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Real-Time Viewers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={realTimeData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="timestamp" 
                        scale="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => value}
                        tick={{ fontSize: 10 }}
                      />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <p className="font-medium">
                                  {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <p>{data.activeViewers} viewers</p>
                                </div>
                                <div className="flex items-center justify-between gap-3 mt-1 text-xs text-muted-foreground">
                                  <div className="text-green-500">+{data.joiningViewers} joining</div>
                                  <div className="text-red-500">-{data.leavingViewers} leaving</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activeViewers" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1}
                        fill="url(#colorViewers)"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                      <ReferenceLine 
                        y={Math.round((realTimeData.reduce((acc, data) => acc + data.activeViewers, 0) / realTimeData.length) * 1000) / 1000} 
                        stroke="hsl(var(--primary) / 0.5)" 
                        strokeDasharray="3 3"
                        label={{ 
                          value: 'Avg', 
                          position: 'right',
                          fill: 'hsl(var(--primary))',
                          fontSize: 10
                        }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Current values summary */}
                <div className="mt-2 flex justify-between items-center bg-muted/30 p-2 rounded-md text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="font-medium">{realTimeData[realTimeData.length - 1]?.activeViewers || 0} viewers</div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div className="text-green-500">+{realTimeData[realTimeData.length - 1]?.joiningViewers || 0} joining</div>
                    <div className="text-red-500">-{realTimeData[realTimeData.length - 1]?.leavingViewers || 0} leaving</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Watch Time</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {formatSeconds(engagementMetrics?.avgWatchTime || 0)}
                      </h3>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Timer className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {engagementMetrics?.completionRate || 0}%
                      </h3>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Interaction Rate</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {engagementMetrics?.interactionRate || 0}%
                      </h3>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement Score</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {engagementMetrics?.engagementScore || 0}/100
                      </h3>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Time of day activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Activity by Time of Day
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeOfDayData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={(hour) => formatHour(hour)}
                        tick={{ fontSize: 10 }}
                        interval={3}
                      />
                      <YAxis 
                        tickFormatter={(value) => value}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <p className="font-medium">{formatHour(data.hour)}</p>
                                <div className="flex flex-col gap-1 mt-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-primary/20"></div>
                                    <span>{data.viewCount} views</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-primary"></div>
                                    <span>{data.completionCount} completions</span>
                                  </div>
                                  <div className="text-muted-foreground mt-1">
                                    {Math.round((data.completionCount/Math.max(data.viewCount, 1)) * 1000) / 10}% completion rate
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconSize={8}
                        iconType="square"
                        wrapperStyle={{ fontSize: 10, paddingBottom: 10 }}
                      />
                      <Bar 
                        dataKey="viewCount" 
                        name="Views" 
                        fill="hsl(var(--primary) / 0.2)" 
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar 
                        dataKey="completionCount" 
                        name="Completions" 
                        fill="hsl(var(--primary))" 
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4 h-[calc(100%-40px)] overflow-auto pr-1">
            {/* Engagement score with Radar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Engagement Score Breakdown
                  </CardTitle>
                  <Badge variant={
                    (engagementMetrics?.engagementScore || 0) >= 80 ? 'default' : 
                    (engagementMetrics?.engagementScore || 0) >= 60 ? 'outline' : 'destructive'
                  }>
                    {engagementMetrics?.engagementScore || 0}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      outerRadius={90} 
                      width={500} 
                      height={250} 
                      data={[
                        {
                          subject: "Watch Time",
                          A: Math.round(((engagementMetrics?.avgWatchTime || 0) / 600) * 100),
                          fullMark: 100
                        },
                        {
                          subject: "Completion",
                          A: Math.round((engagementMetrics?.completionRate || 0) * 10) / 10,
                          fullMark: 100
                        },
                        {
                          subject: "Interaction",
                          A: Math.round((engagementMetrics?.interactionRate || 0) * 10) / 10,
                          fullMark: 100
                        },
                        {
                          subject: "Replay",
                          A: Math.round((engagementMetrics?.replayRate || 0) * 10) / 10,
                          fullMark: 100
                        },
                        {
                          subject: "Share",
                          A: Math.round((engagementMetrics?.shareRate || 0) * 10) / 10,
                          fullMark: 100
                        }
                      ]}
                    >
                      <PolarGrid strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Radar
                        name="Engagement"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.3)"
                        fillOpacity={0.6}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <div className="font-medium">{data.subject}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-2 h-2 rounded-sm bg-primary"></div>
                                  <span>{data.A}% of maximum</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                  <div className="text-center">
                    <div className="text-xs font-medium mb-1">Watch Time</div>
                    <div className="text-xs text-muted-foreground">{formatSeconds(engagementMetrics?.avgWatchTime || 0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium mb-1">Completion</div>
                    <div className="text-xs text-muted-foreground">{engagementMetrics?.completionRate || 0}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium mb-1">Interaction</div>
                    <div className="text-xs text-muted-foreground">{engagementMetrics?.interactionRate || 0}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium mb-1">Replay</div>
                    <div className="text-xs text-muted-foreground">{engagementMetrics?.replayRate || 0}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium mb-1">Share</div>
                    <div className="text-xs text-muted-foreground">{engagementMetrics?.shareRate || 0}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Multi-metric Composed Chart - Engagement Trends */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Engagement Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={Array.from({ length: 7 }, (_, i) => {
                        // Generate realistic looking engagement data with safe values
                        const day = new Date();
                        day.setDate(day.getDate() - (6 - i));
                        const date = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        
                        // Use fixed values instead of random to avoid NaN errors
                        const baseValue = 50 + (i * 5);
                        
                        return {
                          date,
                          views: Math.round(baseValue + 20 + (i * 2)),
                          completions: Math.round(baseValue + (i * 1.5)),
                          interactions: Math.round(baseValue - 10 + (i * 3)),
                          avgWatchTime: Math.round((baseValue / 100) * 600),
                          engagementScore: Math.round(baseValue + 15 + i)
                        };
                      })}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        domain={[0, 600]} 
                        tickFormatter={(value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <div className="font-medium">{data.date}</div>
                                <div className="flex flex-col gap-1 mt-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
                                    <span>{data.views} views</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#8884d8' }}></div>
                                    <span>{data.completions} completions</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#82ca9d' }}></div>
                                    <span>{data.interactions} interactions</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#ff7300' }}></div>
                                    <span>Watch time: {formatSeconds(data.avgWatchTime)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#0088fe' }}></div>
                                    <span>Engagement score: {data.engagementScore}/100</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        fill="hsl(var(--primary) / 0.1)" 
                        stroke="hsl(var(--primary))" 
                        name="Views"
                        yAxisId="left"
                      />
                      <Bar 
                        dataKey="completions" 
                        fill="#8884d8" 
                        name="Completions"
                        yAxisId="left"
                        barSize={20}
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar 
                        dataKey="interactions" 
                        fill="#82ca9d" 
                        name="Interactions"
                        yAxisId="left"
                        barSize={20}
                        radius={[2, 2, 0, 0]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgWatchTime" 
                        stroke="#ff7300" 
                        name="Watch Time (sec)"
                        yAxisId="right"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagementScore" 
                        stroke="#0088fe" 
                        name="Engagement Score"
                        yAxisId="left"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Benchmarks */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Benchmarks</CardTitle>
                <CardDescription>
                  Comparison with similar content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Average Watch Time</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {formatSeconds(engagementMetrics?.avgWatchTime || 0)}
                      </div>
                      <Badge 
                        variant={
                          (engagementMetrics?.avgWatchTime || 0) > 300 ? 'default' : 'outline'
                        }
                        className={
                          (engagementMetrics?.avgWatchTime || 0) > 300 
                            ? 'bg-green-500 hover:bg-green-500' 
                            : 'text-muted-foreground'
                        }
                      >
                        {(engagementMetrics?.avgWatchTime || 0) > 300 ? '+32%' : '-12%'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Completion Rate</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {engagementMetrics?.completionRate || 0}%
                      </div>
                      <Badge 
                        variant={
                          (engagementMetrics?.completionRate || 0) > 70 ? 'default' : 'outline'
                        }
                        className={
                          (engagementMetrics?.completionRate || 0) > 70 
                            ? 'bg-green-500 hover:bg-green-500' 
                            : 'text-muted-foreground'
                        }
                      >
                        {(engagementMetrics?.completionRate || 0) > 70 ? '+15%' : '-5%'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Interaction Rate</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {engagementMetrics?.interactionRate || 0}%
                      </div>
                      <Badge 
                        variant={
                          (engagementMetrics?.interactionRate || 0) > 40 ? 'default' : 'outline'
                        }
                        className={
                          (engagementMetrics?.interactionRate || 0) > 40 
                            ? 'bg-green-500 hover:bg-green-500' 
                            : 'text-muted-foreground'
                        }
                      >
                        {(engagementMetrics?.interactionRate || 0) > 40 ? '+28%' : '-8%'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Overall Engagement</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {engagementMetrics?.engagementScore || 0}/100
                      </div>
                      <Badge 
                        variant={
                          (engagementMetrics?.engagementScore || 0) > 75 ? 'default' : 'outline'
                        }
                        className={
                          (engagementMetrics?.engagementScore || 0) > 75 
                            ? 'bg-green-500 hover:bg-green-500' 
                            : 'text-muted-foreground'
                        }
                      >
                        {(engagementMetrics?.engagementScore || 0) > 75 ? '+18%' : '-7%'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Key Behaviors - Using Recharts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Key Viewer Behaviors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Speed changes', value: 64 },
                        { name: 'Pauses', value: 48 },
                        { name: 'Seeking forward', value: 37 },
                        { name: 'Seeking backward', value: 22 },
                        { name: 'Caption usage', value: 18 }
                      ]}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                      <XAxis 
                        type="number" 
                        domain={[0, 100]} 
                        tickFormatter={(value) => `${Math.round(value)}%`}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <div className="font-medium">{data.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-2 h-2 rounded-sm" style={{ 
                                    backgroundColor: `hsl(var(--primary) / ${Math.round((0.5 + data.value / 200) * 1000) / 1000})` 
                                  }}></div>
                                  <span>{data.value}% of viewers</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      >
                        {[
                          { name: 'Speed changes', value: 64 },
                          { name: 'Pauses', value: 48 },
                          { name: 'Seeking forward', value: 37 },
                          { name: 'Seeking backward', value: 22 },
                          { name: 'Caption usage', value: 18 }
                        ].map((entry, index) => {
                          // Color gradient based on value
                          const colorOpacity = Math.round((0.5 + entry.value / 200) * 1000) / 1000;
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`hsl(var(--primary) / ${colorOpacity})`}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4 h-[calc(100%-40px)] overflow-auto pr-1">
            {/* Device breakdown - Using Recharts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Devices className="h-4 w-4" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={platformData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                      <XAxis 
                        type="number" 
                        domain={[0, 100]} 
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        dataKey="platform" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <div className="font-medium">{data.platform}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-2 h-2 rounded-sm bg-primary"></div>
                                  <span>{data.percentage}% of users</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {data.count} active sessions
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="percentage" 
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                        barSize={16}
                      >
                        {platformData.map((entry, index) => {
                          // Create a gradient from primary to lighter shade based on percentage
                          const opacity = Math.round((0.7 + (0.3 * (entry.percentage / 100))) * 1000) / 1000;
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`hsl(var(--primary) / ${opacity})`}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Geographic breakdown - Using Recharts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={geoData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis 
                        dataKey="country" 
                        type="category" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 border rounded-md shadow-sm p-2 text-sm">
                                <div className="font-medium">{data.country}</div>
                                <div className="flex items-center justify-between gap-3 mt-1">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-primary"></div>
                                    <span>{data.percentage}% of users</span>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {data.count} active sessions
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="percentage" 
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                      >
                        {geoData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index < 3 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.7)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Average engagement by country */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Engagement by Region</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Highest Engagement</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Germany</div>
                        <div className="text-sm font-medium">92/100</div>
                      </div>
                      <Progress value={92} className="h-1.5" />
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm">Japan</div>
                        <div className="text-sm font-medium">89/100</div>
                      </div>
                      <Progress value={89} className="h-1.5" />
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm">Canada</div>
                        <div className="text-sm font-medium">87/100</div>
                      </div>
                      <Progress value={87} className="h-1.5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Lowest Engagement</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Brazil</div>
                        <div className="text-sm font-medium">68/100</div>
                      </div>
                      <Progress value={68} className="h-1.5" />
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm">India</div>
                        <div className="text-sm font-medium">65/100</div>
                      </div>
                      <Progress value={65} className="h-1.5" />
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm">Mexico</div>
                        <div className="text-sm font-medium">62/100</div>
                      </div>
                      <Progress value={62} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}

// This component isn't imported anywhere so we need to create it here
function Devices(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <rect x="6" y="12" width="12" height="4" rx="1" />
    </svg>
  );
}