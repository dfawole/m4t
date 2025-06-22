import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Play, Pause, Maximize, Maximize2, Minimize2, Volume1, Volume2, VolumeX, Subtitles, Loader2, Check, X, ListOrdered, Bookmark, Gauge, PictureInPicture } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import InteractiveQuizOverlay from './interactive-quiz-overlay';

interface VideoTrack {
  kind: string;
  label: string;
  language: string;
  src: string;
}

interface VideoChapter {
  time: number;
  title: string;
}

interface VideoBookmark {
  id: string;
  time: number;
  label: string;
  createdAt: Date;
}

interface QuizQuestion {
  id: string;
  time: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface EnhancedVideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  poster?: string;
  isTeaser?: boolean;
  tracks?: VideoTrack[];
  chapters?: VideoChapter[];
  initialBookmarks?: VideoBookmark[];
  quizQuestions?: QuizQuestion[];
  onComplete?: () => void;
  requiresSubscription?: boolean;
  isSubscribed?: boolean;
  onAddBookmark?: (bookmark: VideoBookmark) => void;
  onRemoveBookmark?: (bookmarkId: string) => void;
  onQuizComplete?: (questionId: string, isCorrect: boolean, timeTaken: number) => void;
}

export default function EnhancedVideoPlayer({
  src,
  title = "Video Content",
  className,
  autoPlay = false,
  poster,
  isTeaser = false,
  tracks = [],
  chapters = [],
  initialBookmarks = [],
  quizQuestions = [],
  onComplete,
  requiresSubscription = false,
  isSubscribed = true,
  onAddBookmark,
  onRemoveBookmark,
  onQuizComplete
}: EnhancedVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(tracks.length > 0 ? tracks[0].language : 'en');
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<VideoBookmark[]>(initialBookmarks || []);
  const [showChapters, setShowChapters] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkInput, setBookmarkInput] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [volume, setVolume] = useState(1);
  const [previewTime, setPreviewTime] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [captionsVisible, setCaptionsVisible] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout>();
  
  // Error handling for video
  const handleVideoError = () => {
    if (videoRef.current) {
      const errorCode = videoRef.current.error?.code;
      
      let errorMessage = "An error occurred while loading the video.";
      
      if (errorCode === 2) {
        errorMessage = "The video network connection failed.";
      } else if (errorCode === 3) {
        errorMessage = "The video is corrupt or in an unsupported format.";
      } else if (errorCode === 4) {
        errorMessage = "The video format is not supported.";
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };
  
  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Set up event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };
    
    const handleEnded = () => {
      setPlaying(false);
      if (onComplete) onComplete();
    };
    
    const handleCanPlay = () => {
      setLoading(false);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleVideoError);
    
    // Configure autoplay if enabled
    if (autoPlay && isSubscribed) {
      video.muted = true; // Browsers often require muted for autoplay
      setMuted(true);
      playVideo();
    }
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleVideoError);
    };
  }, [autoPlay, onComplete, isSubscribed]);
  
  // Handle auto-hide controls
  useEffect(() => {
    if (playing) {
      resetControlsTimer();
    } else {
      setControlsVisible(true);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    }
    
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [playing]);
  
  // Toggle captions and handle language selection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const textTracks = video.textTracks;
    
    for (let i = 0; i < textTracks.length; i++) {
      if (captionsEnabled && textTracks[i].language === selectedLanguage) {
        textTracks[i].mode = 'showing';
      } else {
        textTracks[i].mode = 'disabled';
      }
    }
  }, [captionsEnabled, selectedLanguage]);
  
  // Ensure captions are enabled when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      if (tracks.length > 0 && captionsEnabled) {
        const textTracks = video.textTracks;
        for (let i = 0; i < textTracks.length; i++) {
          if (textTracks[i].language === selectedLanguage) {
            textTracks[i].mode = 'showing';
            break;
          }
        }
      }
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [tracks.length, captionsEnabled, selectedLanguage]);
  
  // Handle chapter navigation
  const jumpToChapter = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setShowChapters(false);
    }
  };

  // Picture-in-picture functionality
  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPictureInPicture(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPictureInPicture(true);
      }
    } catch (error) {
      console.error('Picture-in-picture error:', error);
    }
  };

  // Playback speed controls
  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
      setShowSpeedControls(false);
    }
  };

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  
  // Handle bookmarks
  const addBookmark = () => {
    if (!isSubscribed) return;
    
    const newBookmark: VideoBookmark = {
      id: `bookmark-${Date.now()}`,
      time: currentTime,
      label: bookmarkInput || `Bookmark at ${formatTime(currentTime)}`,
      createdAt: new Date()
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    setBookmarkInput('');
    
    if (onAddBookmark) {
      onAddBookmark(newBookmark);
    }
  };
  
  const removeBookmark = (id: string) => {
    if (!isSubscribed) return;
    
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    
    if (onRemoveBookmark) {
      onRemoveBookmark(id);
    }
  };
  
  const jumpToBookmark = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setShowBookmarks(false);
    }
  };
  
  const resetControlsTimer = () => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    
    setControlsVisible(true);
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };
  
  const playVideo = () => {
    if (videoRef.current && isSubscribed) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
        setError("Unable to play video. Please try again.");
      });
      setPlaying(true);
    }
  };
  
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
    }
  };
  
  const togglePlay = () => {
    if (!isSubscribed && requiresSubscription) {
      return;
    }
    
    if (playing) {
      pauseVideo();
    } else {
      playVideo();
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  
  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
  };
  
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Volume controls
  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setMuted(newVolume === 0);
    }
  };

  // Thumbnail preview on hover
  const handleSeekBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSubscribed || (requiresSubscription && !isSubscribed)) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const time = percentage * duration;
    
    setPreviewTime(time);
    setShowPreview(true);
    
    // Generate thumbnail URL (in a real app, this would be pre-generated)
    const thumbnailTime = Math.floor(time);
    setThumbnailUrl(`/api/video/thumbnail?src=${encodeURIComponent(src)}&time=${thumbnailTime}`);
  };

  const handleSeekBarLeave = () => {
    setShowPreview(false);
    setPreviewTime(null);
    setThumbnailUrl(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current || (requiresSubscription && !isSubscribed)) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (videoRef.current.paused) {
            videoRef.current.play();
            setPlaying(true);
          } else {
            videoRef.current.pause();
            setPlaying(false);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(0, currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(duration, currentTime + 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const newVolumeUp = Math.min(1, volume + 0.1);
          handleVolumeChange([newVolumeUp]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const newVolumeDown = Math.max(0, volume - 0.1);
          handleVolumeChange([newVolumeDown]);
          break;
        case 'KeyM':
          e.preventDefault();
          if (videoRef.current) {
            const newMuted = !muted;
            videoRef.current.muted = newMuted;
            setMuted(newMuted);
          }
          break;
        case 'KeyF':
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
          } else {
            videoRef.current?.requestFullscreen();
            setIsFullscreen(true);
          }
          break;
        case 'KeyC':
          e.preventDefault();
          if (tracks.length > 0) {
            toggleCaptions();
          }
          break;
        case 'KeyB':
          e.preventDefault();
          if (isSubscribed) {
            const newBookmark = {
              id: Date.now().toString(),
              time: currentTime,
              label: `Bookmark at ${formatTime(currentTime)}`,
              createdAt: new Date()
            };
            setBookmarks(prev => [...prev, newBookmark]);
            onAddBookmark?.(newBookmark);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [playing, currentTime, duration, volume, muted, captionsVisible, tracks.length, isSubscribed]);
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg bg-black group", 
        className
      )}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => playing && setControlsVisible(false)}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-4">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Video Error</h3>
          <p className="text-white/80 text-center">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 text-white border-white hover:bg-white/10"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
      
      {/* Subscription required overlay */}
      {requiresSubscription && !isSubscribed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 p-6">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-bold text-white mb-2 animate-slide-up">
              Preview Mode
            </h3>
            <p className="text-white/80 mb-4 animate-slide-up animation-delay-150">
              Subscribe to access the full video content and all course materials.
            </p>
            <Button
              variant="default"
              className="animate-slide-up animation-delay-300 bg-primary hover:bg-primary/90"
              onClick={() => window.location.href = '/subscriptions'}
            >
              View Subscription Options
            </Button>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={src}
        className={cn(
          "w-full h-full object-contain",
          (requiresSubscription && !isSubscribed) && "opacity-70"
        )}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        playsInline
        poster={poster}
      >
        {/* Add subtitle tracks if available */}
        {tracks.map((track, index) => (
          <track 
            key={index}
            kind={track.kind}
            label={track.label}
            srcLang={track.language}
            src={track.src}
            default={index === 0}
          />
        ))}
      </video>
      
      {/* Video Title Overlay */}
      <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/70 to-transparent z-[5]">
        <h3 className="text-white text-sm font-medium truncate">{title}</h3>
      </div>
      
      {/* Play/Pause Overlay Button */}
      {!playing && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-[5]">
          <Button
            size="icon"
            variant="secondary"
            className="h-16 w-16 rounded-full opacity-90 hover:opacity-100 bg-primary/80 hover:bg-primary"
            onClick={playVideo}
            disabled={requiresSubscription && !isSubscribed}
          >
            <Play className="h-8 w-8 text-white" />
          </Button>
        </div>
      )}
      
      {/* Video Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity duration-300 z-[5]",
          controlsVisible || !playing ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col gap-2">
          {/* Seek bar with thumbnail preview */}
          <div className="flex items-center gap-2">
            <span className="text-white text-xs">{formatTime(currentTime)}</span>
            <div 
              className="flex-1 relative"
              onMouseMove={handleSeekBarHover}
              onMouseLeave={handleSeekBarLeave}
            >
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
                disabled={requiresSubscription && !isSubscribed}
              />
              
              {/* Thumbnail preview */}
              {showPreview && previewTime !== null && isSubscribed && (
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-black/80 rounded-lg p-2 min-w-[120px]">
                    <div className="w-24 h-14 bg-gray-700 rounded mb-1 flex items-center justify-center">
                      {thumbnailUrl ? (
                        <img 
                          src={thumbnailUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded"
                          onError={() => setThumbnailUrl(null)}
                        />
                      ) : (
                        <span className="text-white text-xs">Preview</span>
                      )}
                    </div>
                    <div className="text-white text-xs text-center">
                      {formatTime(previewTime)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className="text-white text-xs">{formatTime(duration)}</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={togglePlay}
                      disabled={requiresSubscription && !isSubscribed}
                    >
                      {playing ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{playing ? 'Pause' : 'Play'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={toggleMute}
                        disabled={requiresSubscription && !isSubscribed}
                      >
                        {muted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : volume > 0.5 ? (
                          <Volume2 className="h-4 w-4" />
                        ) : (
                          <Volume1 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{muted ? 'Unmute' : 'Mute'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Volume slider */}
                <div className="w-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Slider
                    value={[muted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={handleVolumeChange}
                    className="volume-slider"
                    disabled={requiresSubscription && !isSubscribed}
                  />
                </div>
              </div>
              
              {tracks.length > 0 && (
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={cn(
                            "h-8 w-8 text-white hover:bg-white/20",
                            captionsEnabled && "bg-white/20"
                          )}
                          onClick={toggleCaptions}
                          disabled={requiresSubscription && !isSubscribed}
                        >
                          <Subtitles className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{captionsEnabled ? 'Disable Captions' : 'Enable Captions'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Caption language selector dropdown */}
                  {captionsEnabled && tracks.length > 1 && (
                    <div className="absolute bottom-full left-0 mb-2 bg-background/95 backdrop-blur-sm rounded-md shadow-lg p-2 w-48 z-50">
                      <div className="text-xs font-medium mb-1 text-muted-foreground">Select language</div>
                      {tracks.map((track) => (
                        <button
                          key={track.language}
                          onClick={() => setSelectedLanguage(track.language)}
                          className={cn(
                            "w-full text-left text-sm px-2 py-1 rounded hover:bg-muted/50 transition-colors flex items-center gap-2",
                            selectedLanguage === track.language && "bg-primary/20 text-primary"
                          )}
                        >
                          {selectedLanguage === track.language && <Check className="h-3 w-3" />}
                          {track.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* Playback Speed Controls */}
              <div className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "h-8 w-8 text-white hover:bg-white/20",
                          showSpeedControls && "bg-white/20"
                        )}
                        onClick={() => setShowSpeedControls(!showSpeedControls)}
                        disabled={requiresSubscription && !isSubscribed}
                      >
                        <Gauge className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Playback Speed ({playbackRate}x)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Speed Selection Dropdown */}
                {showSpeedControls && (
                  <div className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm rounded-md shadow-lg p-2 w-28">
                    <div className="text-xs font-medium mb-1 text-muted-foreground">Speed</div>
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        className={cn(
                          "w-full text-left text-sm px-2 py-1 rounded hover:bg-muted/50 transition-colors flex items-center gap-2",
                          playbackRate === speed && "bg-primary/20 text-primary"
                        )}
                        onClick={() => changePlaybackSpeed(speed)}
                      >
                        {playbackRate === speed && <Check className="h-3 w-3" />}
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Picture-in-Picture Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "h-8 w-8 text-white hover:bg-white/20",
                        isPictureInPicture && "bg-white/20"
                      )}
                      onClick={togglePictureInPicture}
                      disabled={requiresSubscription && !isSubscribed}
                    >
                      <PictureInPicture className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isPictureInPicture ? 'Exit' : 'Enter'} Picture-in-Picture</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={handleFullscreen}
                    disabled={requiresSubscription && !isSubscribed}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fullscreen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Add chapter navigation */}
            {chapters && chapters.length > 0 && (
              <div className="relative ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "h-8 w-8 text-white hover:bg-white/20",
                          showChapters && "bg-white/20"
                        )}
                        onClick={() => setShowChapters(!showChapters)}
                        disabled={requiresSubscription && !isSubscribed}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chapters</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Chapters dropdown */}
                {showChapters && (
                  <div className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm rounded-md shadow-lg p-2 w-64 max-h-[40vh] overflow-y-auto z-50">
                    <div className="text-xs font-medium mb-1 text-muted-foreground">Chapters</div>
                    {chapters.map((chapter, index) => (
                      <button
                        key={index}
                        onClick={() => jumpToChapter(chapter.time)}
                        className={cn(
                          "w-full text-left text-sm px-2 py-1 rounded hover:bg-muted/50 transition-colors flex items-center justify-between",
                          currentTime >= chapter.time && (index === chapters.length - 1 || currentTime < chapters[index + 1].time) && "bg-primary/20 text-primary font-medium"
                        )}
                      >
                        <span>{chapter.title}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(chapter.time)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Add bookmarks */}
            {isSubscribed && (
              <div className="relative ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "h-8 w-8 text-white hover:bg-white/20",
                          showBookmarks && "bg-white/20"
                        )}
                        onClick={() => setShowBookmarks(!showBookmarks)}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bookmarks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Bookmarks dropdown */}
                {showBookmarks && (
                  <div className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm rounded-md shadow-lg p-2 w-64 max-h-[40vh] overflow-y-auto z-50">
                    <div className="text-xs font-medium mb-1 text-muted-foreground">Bookmarks</div>
                    
                    {/* Add bookmark form */}
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={bookmarkInput}
                        onChange={(e) => setBookmarkInput(e.target.value)}
                        placeholder="Bookmark label"
                        className="text-xs px-2 py-1 bg-muted/30 rounded-l border border-muted-foreground/20 flex-1"
                      />
                      <button 
                        onClick={addBookmark}
                        className="bg-primary/90 hover:bg-primary text-primary-foreground text-xs px-2 py-1 rounded-r"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Bookmark list */}
                    {bookmarks.length === 0 ? (
                      <div className="text-xs text-muted-foreground p-2">No bookmarks yet</div>
                    ) : (
                      bookmarks.map((bookmark) => (
                        <div 
                          key={bookmark.id}
                          className="flex items-center justify-between hover:bg-muted/50 rounded p-1"
                        >
                          <button
                            onClick={() => jumpToBookmark(bookmark.time)}
                            className="text-sm flex-1 text-left"
                          >
                            <div>{bookmark.label}</div>
                            <div className="text-xs text-muted-foreground">{formatTime(bookmark.time)}</div>
                          </button>
                          <button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Teaser Badge */}
      {isTeaser && (
        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded z-[5]">
          Teaser
        </div>
      )}

      {/* Interactive Quiz Overlay */}
      {quizQuestions && quizQuestions.length > 0 && (
        <InteractiveQuizOverlay
          questions={quizQuestions}
          currentTime={currentTime}
          isPlaying={playing}
          onPause={() => setPlaying(false)}
          onResume={() => setPlaying(true)}
          onQuizComplete={(questionId, isCorrect, timeTaken) => {
            console.log('Quiz completed:', { questionId, isCorrect, timeTaken });
            if (onQuizComplete) {
              onQuizComplete(questionId, isCorrect, timeTaken);
            }
          }}
        />
      )}
    </div>
  );
}