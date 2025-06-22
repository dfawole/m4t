import React from 'react';
import { useQuery } from '@tanstack/react-query';
import EnhancedVideoPlayer from '@/components/video/enhanced-video-player';
import { useToast } from '@/hooks/use-toast';

interface TeaserVideoProps {
  videoId?: number;
  fallbackUrl?: string;
  courseTitle: string;
  thumbnailUrl?: string;
}

export default function TeaserVideo({ videoId, fallbackUrl, courseTitle, thumbnailUrl }: TeaserVideoProps) {
  const { toast } = useToast();
  const { data: video } = useQuery({
    queryKey: videoId ? [`/api/videos/${videoId}`] : null,
    enabled: !!videoId,
  });

  const { data: captionTracks } = useQuery({
    queryKey: videoId ? [`/api/videos/${videoId}/captions`] : null,
    enabled: !!videoId,
  });

  // If video ID provided but failed to load, show toast error
  React.useEffect(() => {
    if (videoId && !video && !fallbackUrl) {
      toast({
        title: "Video Error",
        description: "Unable to load the course teaser video.",
        variant: "destructive",
      });
    }
  }, [videoId, video, fallbackUrl, toast]);

  // Use either the video from API or fallback URL
  const videoUrl = video?.url || fallbackUrl;

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      {videoUrl ? (
        <EnhancedVideoPlayer
          src={videoUrl}
          title={courseTitle}
          poster={thumbnailUrl}
          isTeaser={true}
          tracks={captionTracks || []}
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black/50 text-white text-center p-4">
          <p>No preview available</p>
        </div>
      )}
    </div>
  );
}