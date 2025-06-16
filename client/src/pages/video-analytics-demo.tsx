import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Play, PauseIcon, LightbulbIcon } from 'lucide-react';
import VideoAnalytics from '@/components/video/video-analytics';
import { useToast } from '@/hooks/use-toast';

const VideoAnalyticsDemo: React.FC = () => {
  const [_, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [isInstructor, setIsInstructor] = useState(false);
  
  // Toggle instructor view
  const toggleInstructorView = () => {
    setIsInstructor(!isInstructor);
    toast({
      title: `${!isInstructor ? 'Instructor' : 'Student'} view activated`,
      description: `You are now viewing analytics as a ${!isInstructor ? 'instructor' : 'student'}.`,
    });
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

      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Video Analytics Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Track viewing behavior, engagement metrics, and learning progress
      </p>
      
      <div className="mb-4 flex justify-end">
        <Button 
          variant={isInstructor ? "default" : "outline"} 
          size="sm"
          onClick={toggleInstructorView}
          className="gap-1"
        >
          {isInstructor ? "Viewing as Instructor" : "Switch to Instructor View"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-black">
                <video
                  ref={videoRef}
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  className="w-full h-full object-contain"
                  controls
                  poster="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1000&auto=format&fit=crop"
                >
                  <track 
                    kind="subtitles" 
                    label="English" 
                    srcLang="en" 
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/captions_en.vtt" 
                    default 
                  />
                  <track 
                    kind="subtitles" 
                    label="Français" 
                    srcLang="fr" 
                    src="/captions/sample-french.vtt" 
                  />
                  <track 
                    kind="subtitles" 
                    label="Español" 
                    srcLang="es" 
                    src="/captions/sample-spanish.vtt" 
                  />
                </video>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Advanced Analytics Features</h2>
                
                <Tabs defaultValue="students" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="students">For Learners</TabsTrigger>
                    <TabsTrigger value="instructors">For Instructors</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="students" className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">1</Badge>
                      <div>
                        <h3 className="font-medium">Personal Progress Tracking</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Monitor your viewing history, completion rates, and quiz performance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">2</Badge>
                      <div>
                        <h3 className="font-medium">Time Spent Analysis</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          See which parts of the video you spent the most time on, helping identify challenging concepts.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">3</Badge>
                      <div>
                        <h3 className="font-medium">Learning Behavior Insights</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Understand your learning patterns through playback speed choices and pause frequency.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">4</Badge>
                      <div>
                        <h3 className="font-medium">Integrated Assessment Performance</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Track your quiz and assessment performance in relation to video content.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructors" className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">1</Badge>
                      <div>
                        <h3 className="font-medium">Audience Engagement Metrics</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Identify which parts of your videos generate the most engagement and interest.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">2</Badge>
                      <div>
                        <h3 className="font-medium">Content Effectiveness Analysis</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Track drop-off points and rewatched segments to improve your teaching material.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">3</Badge>
                      <div>
                        <h3 className="font-medium">Completion Trends</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Monitor how many students complete videos and track trends over time.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">4</Badge>
                      <div>
                        <h3 className="font-medium">Device and Platform Insights</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Understand how students access your content to optimize the viewing experience.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Separator className="my-6" />
                
                <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <div className="mt-1">
                    <LightbulbIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Analytics Privacy</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Personal analytics are only visible to you and your instructors. 
                      Instructors can only see anonymized aggregated data unless explicit permission is granted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-1 h-[calc(100vh-220px)]">
          <VideoAnalytics 
            videoDuration={596} // Sample duration in seconds
            videoRef={videoRef}
            courseId={123}
            lessonId={456}
            isInstructor={isInstructor}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoAnalyticsDemo;