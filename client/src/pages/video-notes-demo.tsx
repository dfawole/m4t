import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from 'lucide-react';
import VideoNotes, { VideoNote } from '@/components/video/video-notes';
import { useToast } from '@/hooks/use-toast';

const VideoNotesDemo: React.FC = () => {
  const [_, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [savedNotes, setSavedNotes] = useState<VideoNote[]>([]);
  
  // Load notes from local storage
  useEffect(() => {
    const storedNotes = localStorage.getItem('demo-video-notes');
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined
        }));
        setSavedNotes(parsedNotes);
      } catch (e) {
        console.error('Failed to parse stored notes', e);
      }
    }
  }, []);
  
  // Save note
  const handleSaveNote = async (note: VideoNote) => {
    const updatedNotes = savedNotes.find(n => n.id === note.id)
      ? savedNotes.map(n => n.id === note.id ? note : n)
      : [...savedNotes, note];
    
    setSavedNotes(updatedNotes);
    localStorage.setItem('demo-video-notes', JSON.stringify(updatedNotes));
    
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 300));
  };
  
  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = savedNotes.filter(note => note.id !== noteId);
    setSavedNotes(updatedNotes);
    localStorage.setItem('demo-video-notes', JSON.stringify(updatedNotes));
    
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 300));
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

      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Interactive Video Notes</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Take timestamped notes while watching educational videos
      </p>

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
                <h2 className="text-xl font-semibold mb-4">How to Use Video Notes</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">1</Badge>
                    <div>
                      <h3 className="font-medium">Add Notes While Watching</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Type your thoughts and observations as the video plays. Your notes are automatically saved.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">2</Badge>
                    <div>
                      <h3 className="font-medium">Insert Timestamps</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Click the clock icon to insert the current video timestamp into your note.
                        Example: <span className="inline-block ml-1 px-2 py-0.5 text-xs font-medium rounded-full border">[2:30]</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">3</Badge>
                    <div>
                      <h3 className="font-medium">Jump to Specific Moments</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Click on any timestamp to jump to that exact moment in the video.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">4</Badge>
                    <div>
                      <h3 className="font-medium">Review and Edit Notes</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Switch to the "View Notes" tab to see all your notes organized by timestamp. 
                        You can edit or delete notes as needed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-sm text-gray-500">
                  <p>
                    <strong>Pro Tip:</strong> Use timestamps liberally to create a navigable index of 
                    important concepts and moments in the video.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-1 h-[calc(100vh-220px)]">
          <VideoNotes 
            videoRef={videoRef}
            courseId={123}  // In a real app, this would be the actual course ID
            lessonId={456}  // In a real app, this would be the actual lesson ID
            initialNotes={savedNotes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoNotesDemo;