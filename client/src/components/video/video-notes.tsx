import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockIcon, Edit, MessageSquare, Plus, Save, Search, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface VideoNote {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface VideoNotesProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  courseId?: number;
  lessonId?: number;
  initialNotes?: VideoNote[];
  onSaveNote?: (note: VideoNote) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
}

export default function VideoNotes({
  videoRef,
  courseId,
  lessonId,
  initialNotes = [],
  onSaveNote,
  onDeleteNote
}: VideoNotesProps) {
  const [notes, setNotes] = useState<VideoNote[]>(initialNotes);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const { toast } = useToast();

  // For automatic saving of drafts
  const saveDraftTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (saveDraftTimeoutRef.current) {
        clearTimeout(saveDraftTimeoutRef.current);
      }
    };
  }, []);

  // Get formatted timestamp
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Parse timestamp string back to seconds
  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  // Get current timestamp from video
  const getCurrentTimestamp = (): number => {
    if (!videoRef.current) return 0;
    return videoRef.current.currentTime;
  };

  // Insert timestamp into note
  const insertTimestamp = () => {
    const timestamp = getCurrentTimestamp();
    const formattedTime = formatTimestamp(timestamp);
    
    setCurrentNote(prev => {
      const cursorPosition = (document.getElementById('note-textarea') as HTMLTextAreaElement)?.selectionStart || prev.length;
      const beforeCursor = prev.substring(0, cursorPosition);
      const afterCursor = prev.substring(cursorPosition);
      return `${beforeCursor}[${formattedTime}] ${afterCursor}`;
    });
  };

  // Jump to timestamp in video
  const jumpToTimestamp = (timestamp: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timestamp;
    videoRef.current.play().catch(() => {
      console.log('Video playback prevented by browser');
    });
  };

  // Add a new note
  const addNote = () => {
    if (!currentNote.trim()) return;
    
    const newNote: VideoNote = {
      id: Date.now().toString(),
      timestamp: getCurrentTimestamp(),
      content: currentNote,
      createdAt: new Date()
    };
    
    setNotes(prev => [...prev, newNote]);
    setCurrentNote('');
    
    if (onSaveNote) {
      onSaveNote(newNote).catch(error => {
        toast({
          title: "Failed to save note",
          description: error.message,
          variant: "destructive"
        });
      });
    }
    
    toast({
      title: "Note added",
      description: "Your note has been saved successfully."
    });
  };

  // Update an existing note
  const updateNote = (noteId: string) => {
    if (!editingContent.trim()) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        const updatedNote = {
          ...note,
          content: editingContent,
          updatedAt: new Date()
        };
        
        if (onSaveNote) {
          onSaveNote(updatedNote).catch(error => {
            toast({
              title: "Failed to update note",
              description: error.message,
              variant: "destructive"
            });
          });
        }
        
        return updatedNote;
      }
      return note;
    });
    
    setNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingContent('');
    
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully."
    });
  };

  // Delete a note
  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    
    if (onDeleteNote) {
      onDeleteNote(noteId).catch(error => {
        toast({
          title: "Failed to delete note",
          description: error.message,
          variant: "destructive"
        });
      });
    }
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully."
    });
  };

  // Find all timestamps in note content
  const findTimestamps = (content: string): { text: string, time: number }[] => {
    const regex = /\[(\d+:\d+)\]/g;
    const matches = [...content.matchAll(regex)];
    
    return matches.map(match => ({
      text: match[0],
      time: parseTimestamp(match[1])
    }));
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.timestamp - b.timestamp);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Video Notes
        </CardTitle>
        <CardDescription>
          Add notes at specific timestamps in the video
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="add" className="flex-1 flex flex-col">
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Note</TabsTrigger>
            <TabsTrigger value="view">View Notes {notes.length > 0 && `(${notes.length})`}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="add" className="flex-1 flex flex-col px-4 pt-2 pb-4">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="relative">
              <Textarea 
                id="note-textarea"
                placeholder="Add your notes here..."
                className="min-h-[120px] resize-none"
                value={currentNote}
                onChange={(e) => {
                  setCurrentNote(e.target.value);
                  
                  // Auto-save draft
                  if (saveDraftTimeoutRef.current) {
                    clearTimeout(saveDraftTimeoutRef.current);
                  }
                  
                  saveDraftTimeoutRef.current = setTimeout(() => {
                    localStorage.setItem(
                      `note-draft-${courseId || 'default'}-${lessonId || 'default'}`, 
                      e.target.value
                    );
                  }, 1000);
                }}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-7 w-7"
                onClick={insertTimestamp}
                title="Insert current timestamp"
              >
                <ClockIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {currentNote && (
              <div className="border rounded-md p-2 bg-muted/30 flex-1 overflow-auto">
                <p className="text-sm">Preview:</p>
                <div className="mt-1 text-sm whitespace-pre-wrap">
                  {currentNote.split(/(\[\d+:\d+\])/).map((part, i) => {
                    if (part.match(/\[\d+:\d+\]/)) {
                      const time = parseTimestamp(part.substring(1, part.length - 1));
                      return (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => jumpToTimestamp(time)}
                        >
                          {part}
                        </Badge>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentNote('')}
              disabled={!currentNote}
            >
              Clear
            </Button>
            <Button 
              size="sm"
              onClick={addNote}
              disabled={!currentNote.trim()}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="view" className="flex-1 flex flex-col px-4 pt-2 pb-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex-1 overflow-auto">
            {filteredNotes.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                {notes.length === 0 
                  ? "No notes added yet. Add your first note!" 
                  : "No notes match your search query."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map(note => (
                  <Card key={note.id} className="p-3">
                    {editingNoteId === note.id ? (
                      <div className="space-y-3">
                        <Textarea 
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingContent('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => updateNote(note.id)}
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between mb-1">
                          <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground flex items-center gap-1"
                            onClick={() => jumpToTimestamp(note.timestamp)}
                          >
                            <ClockIcon className="h-3 w-3" />
                            {formatTimestamp(note.timestamp)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditingContent(note.content);
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => deleteNote(note.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {note.content.split(/(\[\d+:\d+\])/).map((part, i) => {
                            if (part.match(/\[\d+:\d+\]/)) {
                              const time = parseTimestamp(part.substring(1, part.length - 1));
                              return (
                                <Badge 
                                  key={i} 
                                  variant="outline" 
                                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                  onClick={() => jumpToTimestamp(time)}
                                >
                                  {part}
                                </Badge>
                              );
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </div>
                        {note.updatedAt && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Edited {note.updatedAt.toLocaleDateString()} at {note.updatedAt.toLocaleTimeString()}
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}