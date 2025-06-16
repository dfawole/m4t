import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Unlock, Subtitles } from 'lucide-react';
import EnhancedVideoPlayer from '@/components/video/enhanced-video-player';
import TeaserVideo from '@/components/course/teaser-video';

export default function VideoPreviewDemo() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // Sample video URLs (these would typically come from your backend)
  const sampleVideos = [
    {
      id: 1,
      title: "Introduction to Web Development",
      description: "Learn about the fundamental concepts of web development and the tools you'll need to get started.",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=500&h=300&auto=format&fit=crop",
      duration: "5:12",
      tracks: [
        {
          kind: "subtitles",
          label: "English",
          language: "en",
          src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt"
        },
        {
          kind: "subtitles",
          label: "Français",
          language: "fr",
          src: "/captions/sample-french.vtt"
        },
        {
          kind: "subtitles",
          label: "Español",
          language: "es",
          src: "/captions/sample-spanish.vtt"
        },
        {
          kind: "subtitles",
          label: "Deutsch",
          language: "de",
          src: "/captions/sample-german.vtt"
        },
        {
          kind: "subtitles",
          label: "中文",
          language: "zh",
          src: "/captions/sample-chinese.vtt"
        },
        {
          kind: "subtitles",
          label: "日本語",
          language: "ja",
          src: "/captions/sample-japanese.vtt"
        }
      ],
      // Chapter markers for interactive navigation
      chapters: [
        { time: 0, title: "Introduction" },
        { time: 30, title: "Getting Started" },
        { time: 62, title: "Essential Tools" },
        { time: 118, title: "Development Workflow" },
        { time: 210, title: "Next Steps" }
      ]
    },
    {
      id: 2,
      title: "HTML Basics: Structure and Semantics",
      description: "Explore how to create well-structured HTML documents with proper semantic elements.",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=500&h=300&auto=format&fit=crop",
      duration: "12:34",
      tracks: [
        {
          kind: "subtitles",
          label: "English",
          language: "en",
          src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt"
        }
      ]
    },
    {
      id: 3,
      title: "CSS Fundamentals: Styling Your Web Pages",
      description: "Learn how to use CSS to add beautiful styling to your web pages and create responsive layouts.",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=500&h=300&auto=format&fit=crop",
      duration: "15:45",
      tracks: []
    }
  ];

  return (
    <div className="container mx-auto py-10 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Video Preview Demonstration</h1>
          <p className="text-muted-foreground">Experience how non-subscribed users interact with course videos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Subscription Mode Toggle</CardTitle>
              <CardDescription>Switch between subscribed and non-subscribed user views</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <Lock className="text-muted-foreground h-4 w-4" />
                <span className="text-sm text-muted-foreground">Non-subscribed</span>
              </div>
              <Switch 
                id="subscription-mode" 
                checked={isSubscribed}
                onCheckedChange={setIsSubscribed}
              />
              <div className="flex items-center gap-2">
                <Unlock className="text-primary h-4 w-4" />
                <span className="text-sm text-primary font-medium">Subscribed</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-md mb-4">
            <p className="font-medium">Current Mode: {isSubscribed ? 'Subscribed User (Full Access)' : 'Non-Subscribed User (Limited Access)'}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isSubscribed 
                ? 'You now have full access to all course videos without restrictions.' 
                : 'In this mode, you can only see video previews with an overlay encouraging subscription.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Featured Course Video</CardTitle>
            <CardDescription>
              {isSubscribed 
                ? 'You have full access to this course content' 
                : 'Preview available - Subscribe to unlock full content'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedVideoPlayer 
              src={sampleVideos[0].videoUrl}
              title={sampleVideos[0].title}
              poster={sampleVideos[0].thumbnailUrl}
              tracks={sampleVideos[0].tracks}
              isSubscribed={isSubscribed}
              requiresSubscription={!isSubscribed}
              className="aspect-video w-full rounded-lg overflow-hidden"
            />
            <div className="mt-4">
              <h3 className="text-xl font-semibold">{sampleVideos[0].title}</h3>
              <p className="text-muted-foreground mt-1">{sampleVideos[0].description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm bg-muted px-2 py-1 rounded-md">Duration: {sampleVideos[0].duration}</span>
                {!isSubscribed && (
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center">
                    <Lock className="h-3 w-3 mr-1" /> Premium Content
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {sampleVideos.slice(1).map(video => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
              <CardDescription>Duration: {video.duration}</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedVideoPlayer 
                src={video.videoUrl}
                title={video.title}
                poster={video.thumbnailUrl}
                tracks={video.tracks}
                isSubscribed={isSubscribed}
                requiresSubscription={!isSubscribed}
                className="aspect-video w-full rounded-lg overflow-hidden"
              />
              <p className="text-sm text-muted-foreground mt-4">{video.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">How Our Video Preview System Works</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-2">For Non-Subscribed Users</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
                  <Lock className="h-3 w-3" />
                </div>
                <span>Semi-transparent overlay on all course videos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
                  <Lock className="h-3 w-3" />
                </div>
                <span>Subscription prompt with clear call-to-action</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
                  <Lock className="h-3 w-3" />
                </div>
                <span>Video controls are disabled to prevent full consumption</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
                  <Lock className="h-3 w-3" />
                </div>
                <span>Preview clearly indicates premium status of content</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">For Subscribed Users</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <Unlock className="h-3 w-3 text-primary" />
                </div>
                <span>Full, unrestricted access to all course videos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <Unlock className="h-3 w-3 text-primary" />
                </div>
                <span>Complete video player controls enabled</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <Unlock className="h-3 w-3 text-primary" />
                </div>
                <span>No overlay or subscription prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <Unlock className="h-3 w-3 text-primary" />
                </div>
                <span>Seamless learning experience throughout courses</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}