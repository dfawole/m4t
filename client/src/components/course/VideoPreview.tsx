import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { CheckCircle2, Lock } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string;
  title: string;
  isSubscribed: boolean;
}

export default function VideoPreview({ videoUrl, title, isSubscribed }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [_, setLocation] = useLocation();
  const { user } = useAuth();

  // Determine if we should show the full video or preview
  const showPreview = !isSubscribed;

  // Handle subscription button click
  const handleSubscribe = () => {
    if (user) {
      setLocation('/subscriptions');
    } else {
      setLocation('/login?redirect=/subscriptions');
    }
  };

  return (
    <div className="relative rounded-md overflow-hidden bg-black">
      {/* Video element */}
      <video
        className="w-full aspect-video"
        src={videoUrl}
        title={title}
        controls={isSubscribed}
        controlsList="nodownload"
        poster="/assets/video-poster.svg"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        {/* Closed Captions Support */}
        <track 
          kind="subtitles" 
          src="/assets/captions/en.vtt" 
          srcLang="en" 
          label="English"
          default={isSubscribed} // Automatically enable captions for subscribed users
        />
        <track 
          kind="subtitles" 
          src="/assets/captions/es.vtt" 
          srcLang="es" 
          label="Spanish"
        />
        <track 
          kind="subtitles" 
          src="/assets/captions/fr.vtt" 
          srcLang="fr" 
          label="French"
        />
        <p className="text-center p-4 bg-black text-white">
          Your browser does not support HTML5 video. Please upgrade your browser.
        </p>
      </video>

      {/* Preview overlay for non-subscribers */}
      {showPreview && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
          <div className="animate-pulse mb-4">
            <Lock className="h-12 w-12 text-white/80 mx-auto mb-2" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Preview Mode</h3>
          <p className="text-white/80 mb-4 max-w-md">
            This is a preview of the course content. Subscribe to access the full video and all course materials.
          </p>
          <Button 
            onClick={handleSubscribe}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Subscribe Now
          </Button>
        </div>
      )}
    </div>
  );
}