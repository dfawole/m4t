import React, { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  ClockIcon, 
  PlayIcon, 
  PauseIcon, 
  SkipForward, 
  Activity, 
  BookOpenCheck,
  BarChart,
  LineChart,
  Gauge,
  Flag,
  Timer
} from "lucide-react";

// Type for viewer analytics data
export interface ViewerAnalytics {
  totalViews: number;
  uniqueViewers: number;
  averageCompletionRate: number;
  averageWatchTime: number;
  totalWatchTime: number;
  completionsByDay: { day: string; count: number }[];
  dropOffPoints: { timestamp: number; percentage: number }[];
  engagementHotspots: { timestamp: number; count: number }[];
  rewatchedSegments: { startTime: number; endTime: number; count: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  completionsByUser: { userId: string; username: string; completionTime: number; date: string }[];
}

// Type for personal analytics for the current user
export interface PersonalAnalytics {
  watched: boolean;
  lastWatchedAt?: Date;
  completedAt?: Date;
  completionPercentage: number;
  watchedDuration: number;
  totalPauses: number;
  totalPlaybacks: number;
  averagePlaybackSpeed: number;
  timeSpentOnSegments: { startTime: number; endTime: number; duration: number }[];
  bookmarkedSegments: { timestamp: number; label: string }[];
  notesCount: number;
  quizPerformance?: {
    attempted: number;
    correct: number;
    score: number;
  };
}

// Generate sample viewer analytics data (in a real app, this would come from an API)
const generateSampleViewerAnalytics = (): ViewerAnalytics => {
  return {
    totalViews: 1872,
    uniqueViewers: 843,
    averageCompletionRate: 78.4,
    averageWatchTime: 13.7, // minutes
    totalWatchTime: 11523, // minutes
    completionsByDay: [
      { day: '2023-05-15', count: 32 },
      { day: '2023-05-16', count: 45 },
      { day: '2023-05-17', count: 67 },
      { day: '2023-05-18', count: 51 },
      { day: '2023-05-19', count: 58 },
      { day: '2023-05-20', count: 72 },
      { day: '2023-05-21', count: 49 }
    ],
    dropOffPoints: [
      { timestamp: 42, percentage: 5 },
      { timestamp: 187, percentage: 15 },
      { timestamp: 312, percentage: 25 },
      { timestamp: 498, percentage: 35 }
    ],
    engagementHotspots: [
      { timestamp: 78, count: 143 },
      { timestamp: 156, count: 98 },
      { timestamp: 232, count: 187 },
      { timestamp: 345, count: 112 }
    ],
    rewatchedSegments: [
      { startTime: 120, endTime: 180, count: 45 },
      { startTime: 240, endTime: 300, count: 78 },
      { startTime: 450, endTime: 480, count: 52 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 64 },
      { device: 'Mobile', percentage: 28 },
      { device: 'Tablet', percentage: 8 }
    ],
    completionsByUser: [
      { userId: '1', username: 'Amy Johnson', completionTime: 27.5, date: '2023-05-21' },
      { userId: '2', username: 'Michael Chen', completionTime: 18.2, date: '2023-05-20' },
      { userId: '3', username: 'Sarah Williams', completionTime: 22.7, date: '2023-05-20' },
      { userId: '4', username: 'David Rodriguez', completionTime: 19.8, date: '2023-05-19' },
      { userId: '5', username: 'Emily Taylor', completionTime: 24.3, date: '2023-05-19' }
    ]
  };
};

// Generate sample personal analytics data (in a real app, this would come from an API)
const generateSamplePersonalAnalytics = (): PersonalAnalytics => {
  return {
    watched: true,
    lastWatchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    completionPercentage: 100,
    watchedDuration: 23.5, // minutes
    totalPauses: 7,
    totalPlaybacks: 12,
    averagePlaybackSpeed: 1.25,
    timeSpentOnSegments: [
      { startTime: 0, endTime: 120, duration: 125 }, // slightly longer due to rewatching
      { startTime: 120, endTime: 240, duration: 130 },
      { startTime: 240, endTime: 360, duration: 145 },
      { startTime: 360, endTime: 480, duration: 120 }
    ],
    bookmarkedSegments: [
      { timestamp: 75, label: 'Important concept' },
      { timestamp: 230, label: 'Key example' },
      { timestamp: 412, label: 'Review this later' }
    ],
    notesCount: 5,
    quizPerformance: {
      attempted: 8,
      correct: 7,
      score: 87.5
    }
  };
};

// Format minutes into hours and minutes
const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
};

// Format timestamp to MM:SS
const formatTimestamp = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

interface VideoAnalyticsProps {
  courseId?: number;
  lessonId?: number;
  videoDuration: number;
  videoRef?: React.RefObject<HTMLVideoElement>;
  isInstructor?: boolean;
  isAdmin?: boolean;
}

export default function VideoAnalytics({
  courseId,
  lessonId,
  videoDuration,
  videoRef,
  isInstructor = false,
  isAdmin = false
}: VideoAnalyticsProps) {
  const [viewerAnalytics, setViewerAnalytics] = useState<ViewerAnalytics | null>(null);
  const [personalAnalytics, setPersonalAnalytics] = useState<PersonalAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setViewerAnalytics(generateSampleViewerAnalytics());
      setPersonalAnalytics(generateSamplePersonalAnalytics());
      
      setLoading(false);
    };
    
    loadData();
  }, [courseId, lessonId]);

  // In a real app, you'd update analytics when player events occur
  useEffect(() => {
    if (!videoRef?.current) return;
    
    const video = videoRef.current;
    
    const handlePlay = () => {
      console.log("Video played - would log to analytics in a real app");
      // In a real app, you'd send this event to your analytics API
    };
    
    const handlePause = () => {
      console.log("Video paused - would log to analytics in a real app");
      // In a real app, you'd send this event to your analytics API
    };
    
    const handleEnded = () => {
      console.log("Video ended - would log to analytics in a real app");
      // In a real app, you'd send this event to your analytics API and update completion status
    };
    
    const handleTimeUpdate = () => {
      // For performance, you might throttle this or only send updates at specific intervals
      // console.log("Time update at", video.currentTime);
    };
    
    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    // Clean up
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoRef]);

  // Loading state
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Video Analytics</CardTitle>
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
    <Card className="h-full overflow-hidden">
      <Tabs defaultValue="personal" className="h-full flex flex-col">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg font-semibold">Video Analytics</CardTitle>
            <TabsList>
              <TabsTrigger value="personal">
                Personal
              </TabsTrigger>
              {(isInstructor || isAdmin) && (
                <TabsTrigger value="viewers">
                  Viewers
                </TabsTrigger>
              )}
            </TabsList>
          </div>
        </CardHeader>
        
        <TabsContent value="personal" className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
          {!personalAnalytics ? (
            <div className="text-center py-8 text-muted-foreground">
              No personal analytics data available yet.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium">Completion</div>
                      <Badge 
                        variant={personalAnalytics.completionPercentage === 100 ? "default" : "outline"}
                        className="text-xs"
                      >
                        {personalAnalytics.completionPercentage}%
                      </Badge>
                    </div>
                    <Progress 
                      value={personalAnalytics.completionPercentage} 
                      className="h-2 mt-2" 
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium">Watch Time</div>
                      <div className="text-xs">{formatMinutes(personalAnalytics.watchedDuration)}</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex text-xs text-muted-foreground items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Last watched
                      </div>
                      <div className="text-xs">
                        {personalAnalytics.lastWatchedAt?.toLocaleDateString() || 'Never'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Viewing Behavior
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Total Plays</div>
                      <div className="flex items-center justify-center">
                        <PlayIcon className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-lg font-semibold">{personalAnalytics.totalPlaybacks}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Total Pauses</div>
                      <div className="flex items-center justify-center">
                        <PauseIcon className="h-3 w-3 mr-1 text-amber-500" />
                        <span className="text-lg font-semibold">{personalAnalytics.totalPauses}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Average Playback Speed</div>
                    <div className="text-lg font-semibold">
                      {personalAnalytics.averagePlaybackSpeed}x
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">Time Spent on Segments</div>
                    <div className="space-y-2">
                      {personalAnalytics.timeSpentOnSegments.map((segment, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span>
                            {formatTimestamp(segment.startTime)} - {formatTimestamp(segment.endTime)}
                          </span>
                          <Badge variant="outline">
                            {Math.round(segment.duration / 60)} min
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {personalAnalytics.bookmarkedSegments.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-medium mb-2">Bookmarked Moments</div>
                      <div className="space-y-2">
                        {personalAnalytics.bookmarkedSegments.map((bookmark, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span>{bookmark.label}</span>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                              {formatTimestamp(bookmark.timestamp)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {personalAnalytics.quizPerformance && (
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <BookOpenCheck className="h-4 w-4 mr-2" />
                      Quiz Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Score</div>
                        <div className="text-lg font-semibold">
                          {personalAnalytics.quizPerformance.score}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Correct</div>
                        <div className="text-lg font-semibold text-green-500">
                          {personalAnalytics.quizPerformance.correct}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Attempts</div>
                        <div className="text-lg font-semibold">
                          {personalAnalytics.quizPerformance.attempted}
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={personalAnalytics.quizPerformance.score} 
                      className={`h-2 ${
                        personalAnalytics.quizPerformance.score >= 80 
                          ? 'bg-green-100' 
                          : personalAnalytics.quizPerformance.score >= 60 
                            ? 'bg-amber-100' 
                            : 'bg-red-100'
                      }`}
                    />
                  </CardContent>
                </Card>
              )}
              
              <div className="text-center mt-2">
                <p className="text-xs text-muted-foreground">
                  Your activity data is used to improve your learning experience.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="viewers" className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
          {!viewerAnalytics ? (
            <div className="text-center py-8 text-muted-foreground">
              No viewer analytics data available yet.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <div className="text-xs font-medium mb-1">Total Views</div>
                      <div className="text-2xl font-semibold">
                        {viewerAnalytics.totalViews.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {viewerAnalytics.uniqueViewers.toLocaleString()} unique viewers
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <div className="text-xs font-medium mb-1">Average Completion</div>
                      <div className="text-2xl font-semibold">
                        {viewerAnalytics.averageCompletionRate}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatMinutes(viewerAnalytics.averageWatchTime)} avg. watch time
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Engagement Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">Engagement Hotspots</div>
                    <div className="h-20 relative bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                      {/* Simple visual representation of engagement hotspots */}
                      {viewerAnalytics.engagementHotspots.map((hotspot, index) => {
                        const position = (hotspot.timestamp / videoDuration) * 100;
                        const height = (hotspot.count / 200) * 100; // Normalize height
                        
                        return (
                          <div
                            key={index}
                            className="absolute bottom-0 bg-primary rounded-t-sm w-2"
                            style={{
                              left: `${position}%`,
                              height: `${Math.min(height, 100)}%`,
                              transform: 'translateX(-50%)'
                            }}
                            title={`${hotspot.count} interactions at ${formatTimestamp(hotspot.timestamp)}`}
                          />
                        );
                      })}
                      
                      {/* Timeline markers */}
                      <div className="absolute bottom-0 w-full flex justify-between px-2 text-xs text-muted-foreground">
                        <span>0:00</span>
                        <span>{formatTimestamp(videoDuration / 2)}</span>
                        <span>{formatTimestamp(videoDuration)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">Top Rewatched Segments</div>
                    <div className="space-y-2">
                      {viewerAnalytics.rewatchedSegments
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 3)
                        .map((segment, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span>
                              {formatTimestamp(segment.startTime)} - {formatTimestamp(segment.endTime)}
                            </span>
                            <Badge variant="outline">
                              {segment.count} rewatches
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium mb-2">Drop-off Points</div>
                    <div className="space-y-2">
                      {viewerAnalytics.dropOffPoints.map((point, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span>
                            {formatTimestamp(point.timestamp)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={
                              point.percentage > 30 
                                ? 'text-red-500 border-red-200' 
                                : point.percentage > 15 
                                  ? 'text-amber-500 border-amber-200'
                                  : 'text-slate-500'
                            }
                          >
                            {point.percentage}% drop-off
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    Completion Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">Completions by Day</div>
                    <div className="h-24 flex items-end justify-between space-x-1">
                      {viewerAnalytics.completionsByDay.map((day, index) => {
                        const maxCount = Math.max(...viewerAnalytics.completionsByDay.map(d => d.count));
                        const height = (day.count / maxCount) * 100;
                        
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-primary rounded-t-sm" 
                              style={{ height: `${height}%` }}
                              title={`${day.count} completions`}
                            />
                            <div className="text-xs mt-1 text-muted-foreground">
                              {new Date(day.day).toLocaleDateString(undefined, { weekday: 'short' })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium mb-2">Device Breakdown</div>
                    <div className="flex items-center space-x-2">
                      {viewerAnalytics.deviceBreakdown.map((device, index) => (
                        <div 
                          key={index} 
                          className="flex-1 bg-slate-100 dark:bg-slate-800 h-4 rounded-full relative"
                          title={`${device.device}: ${device.percentage}%`}
                        >
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full ${
                              index === 0 
                                ? 'bg-blue-500' 
                                : index === 1 
                                  ? 'bg-green-500' 
                                  : 'bg-amber-500'
                            }`}
                            style={{ width: `${device.percentage}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
                            {device.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {viewerAnalytics.deviceBreakdown.map((device, index) => (
                        <div key={index} className="text-xs flex items-center">
                          <div 
                            className={`w-2 h-2 rounded-full mr-1 ${
                              index === 0 
                                ? 'bg-blue-500' 
                                : index === 1 
                                  ? 'bg-green-500' 
                                  : 'bg-amber-500'
                            }`}
                          />
                          {device.device}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}