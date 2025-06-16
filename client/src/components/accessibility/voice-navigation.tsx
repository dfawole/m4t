import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useRoute } from 'wouter';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Info,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Command mapping for voice navigation
const COMMANDS = {
  'go to home': '/',
  'go to dashboard': '/dashboard',
  'go to courses': '/courses',
  'go to my courses': '/my-courses',
  'go to profile': '/profile',
  'go to settings': '/settings',
  'go to learning path': '/learning-path',
  'search': '/courses', // Will also activate search mode
  'help': null, // Show help dialog
  'filter courses': null, // Activate filter popover
  'clear filters': null, // Clear active filters
  'scroll down': null, // Scroll action
  'scroll up': null, // Scroll action
  'play video': null, // Video control
  'pause video': null, // Video control
  'next lesson': null, // Navigation within course
  'previous lesson': null, // Navigation within course
  'complete lesson': null, // Mark lesson as complete
  'navigate back': null, // Browser back
};

// Helper function to convert text to speech
const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser');
    return;
  }
  
  // Stop any current speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
};

interface VoiceNavigationProps {
  onCommand?: (command: string) => void;
}

export function VoiceNavigation({ onCommand }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, type: 'info' | 'success' | 'error'} | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const [, navigate] = useLocation();
  
  // Check if speech recognition is available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
      setFeedback({
        message: 'Speech recognition is not supported in your browser.',
        type: 'error'
      });
    }
  }, []);
  
  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (!isAvailable) return;
    
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setFeedback({
        message: 'Listening for voice commands...',
        type: 'info'
      });
      if (speechEnabled) {
        speak('Voice navigation activated. Listening for commands.');
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setFeedback(null);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setFeedback({
        message: `Error: ${event.error}. Please try again.`,
        type: 'error'
      });
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript.toLowerCase().trim();
      setTranscript(transcriptText);
      
      // Check if this is a final result
      if (event.results[current].isFinal) {
        handleCommand(transcriptText);
      }
    };
    
    recognitionRef.current = recognition;
  }, [isAvailable, speechEnabled]);
  
  // Handle received voice command
  const handleCommand = useCallback((command: string) => {
    // Convert to lowercase and trim
    const normalizedCommand = command.toLowerCase().trim();
    setLastCommand(normalizedCommand);
    
    // Check if command is in our commands list
    let foundCommand = false;
    
    // Check for exact command matches
    Object.entries(COMMANDS).forEach(([cmdKey, cmdValue]) => {
      if (normalizedCommand.includes(cmdKey)) {
        foundCommand = true;
        
        // Handle navigation commands
        if (cmdValue && cmdValue.startsWith('/')) {
          navigate(cmdValue);
          if (speechEnabled) {
            speak(`Navigating to ${cmdKey.replace('go to ', '')}`);
          }
          setFeedback({
            message: `Navigating to ${cmdKey.replace('go to ', '')}`,
            type: 'success'
          });
        } 
        // Handle scroll commands
        else if (cmdKey.includes('scroll')) {
          const scrollAmount = cmdKey.includes('down') ? 500 : -500;
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
          });
          if (speechEnabled) {
            speak(`Scrolling ${cmdKey.includes('down') ? 'down' : 'up'}`);
          }
          setFeedback({
            message: `Scrolling ${cmdKey.includes('down') ? 'down' : 'up'}`,
            type: 'success'
          });
        }
        // Handle help command
        else if (cmdKey === 'help') {
          setShowHelp(true);
          if (speechEnabled) {
            speak('Showing voice command help');
          }
          setFeedback({
            message: 'Showing voice command help',
            type: 'info'
          });
        }
        // Handle filter commands for courses page
        else if (cmdKey === 'filter courses' && window.location.pathname.includes('courses')) {
          // This needs to be handled by the parent component
          onCommand && onCommand('filter');
          if (speechEnabled) {
            speak('Opening filter options');
          }
          setFeedback({
            message: 'Opening filter options',
            type: 'info'
          });
        }
        // Handle clear filters command
        else if (cmdKey === 'clear filters' && window.location.pathname.includes('courses')) {
          // This needs to be handled by the parent component
          onCommand && onCommand('clear-filters');
          if (speechEnabled) {
            speak('Clearing all filters');
          }
          setFeedback({
            message: 'Clearing all filters',
            type: 'success'
          });
        }
        // Handle media controls for course pages
        else if ((cmdKey === 'play video' || cmdKey === 'pause video') && window.location.pathname.includes('course')) {
          const action = cmdKey.split(' ')[0]; // "play" or "pause"
          onCommand && onCommand(action);
          if (speechEnabled) {
            speak(`${action} video`);
          }
          setFeedback({
            message: `${action.charAt(0).toUpperCase() + action.slice(1)} video`,
            type: 'success'
          });
        }
        // Handle lesson navigation
        else if ((cmdKey === 'next lesson' || cmdKey === 'previous lesson') && window.location.pathname.includes('course')) {
          const direction = cmdKey.split(' ')[0]; // "next" or "previous"
          onCommand && onCommand(direction);
          if (speechEnabled) {
            speak(`Going to ${direction} lesson`);
          }
          setFeedback({
            message: `Going to ${direction} lesson`,
            type: 'info'
          });
        }
        // Handle lesson completion
        else if (cmdKey === 'complete lesson' && window.location.pathname.includes('course')) {
          onCommand && onCommand('complete');
          if (speechEnabled) {
            speak('Marking lesson as complete');
          }
          setFeedback({
            message: 'Marking lesson as complete',
            type: 'success'
          });
        }
        // Handle back navigation
        else if (cmdKey === 'navigate back') {
          window.history.back();
          if (speechEnabled) {
            speak('Going back');
          }
          setFeedback({
            message: 'Going back to previous page',
            type: 'info'
          });
        }
      }
    });
    
    // Only show error if user actually spoke something meaningful (not just noise or silence)
    if (!foundCommand && speechEnabled && transcript.trim().length > 2) {
      speak('Sorry, I did not understand that command');
      setFeedback({
        message: 'Command not recognized. Try saying "help" for available commands.',
        type: 'error'
      });
    }
  }, [navigate, onCommand, speechEnabled]);
  
  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (speechEnabled) {
        speak('Voice navigation deactivated');
      }
    } else {
      initSpeechRecognition();
      recognitionRef.current?.start();
    }
  }, [isListening, initSpeechRecognition, speechEnabled]);
  
  // Toggle speech feedback
  const toggleSpeech = useCallback(() => {
    setSpeechEnabled(!speechEnabled);
    
    // Announce the change
    if (!speechEnabled) { // Currently off, turning on
      speak('Voice feedback enabled');
    }
  }, [speechEnabled]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  if (!isAvailable) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <Alert className="w-auto max-w-xs bg-white shadow-lg">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertTitle>Not supported</AlertTitle>
          <AlertDescription>
            Voice navigation is not supported in your browser. Please try Chrome.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {feedback && (
        <Alert className={`
          w-auto max-w-xs bg-white shadow-lg
          ${feedback.type === 'success' ? 'border-green-500' : ''}
          ${feedback.type === 'error' ? 'border-destructive' : ''}
          ${feedback.type === 'info' ? 'border-blue-500' : ''}
        `}>
          <AlertDescription>
            {feedback.message}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full ${speechEnabled ? 'bg-blue-50 text-blue-500' : 'bg-neutral-100'}`}
                onClick={toggleSpeech}
              >
                {speechEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{speechEnabled ? 'Disable' : 'Enable'} voice feedback</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Sheet open={showHelp} onOpenChange={setShowHelp}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-neutral-100"
            >
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Voice Navigation Commands</SheetTitle>
              <SheetDescription>
                Here are the voice commands you can use to navigate the platform.
              </SheetDescription>
            </SheetHeader>
            
            <ScrollArea className="h-[calc(100vh-200px)] mt-6 pr-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Navigation Commands</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(COMMANDS)
                      .filter(([cmd]) => cmd.startsWith('go to'))
                      .map(([cmd]) => (
                        <div key={cmd} className="flex items-center justify-between border-b pb-2">
                          <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                            {cmd}
                          </code>
                          <Badge variant="outline">{cmd.replace('go to ', '')}</Badge>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Course Navigation</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(COMMANDS)
                      .filter(([cmd]) => 
                        cmd === 'next lesson' || 
                        cmd === 'previous lesson' || 
                        cmd === 'complete lesson' ||
                        cmd === 'play video' ||
                        cmd === 'pause video'
                      )
                      .map(([cmd]) => (
                        <div key={cmd} className="flex items-center justify-between border-b pb-2">
                          <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                            {cmd}
                          </code>
                          <Badge variant="outline">Course Page</Badge>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Course Filtering</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(COMMANDS)
                      .filter(([cmd]) => 
                        cmd === 'filter courses' || 
                        cmd === 'clear filters' ||
                        cmd === 'search'
                      )
                      .map(([cmd]) => (
                        <div key={cmd} className="flex items-center justify-between border-b pb-2">
                          <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                            {cmd}
                          </code>
                          <Badge variant="outline">Courses Page</Badge>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">General Commands</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(COMMANDS)
                      .filter(([cmd]) => 
                        cmd === 'scroll up' || 
                        cmd === 'scroll down' ||
                        cmd === 'help' ||
                        cmd === 'navigate back'
                      )
                      .map(([cmd]) => (
                        <div key={cmd} className="flex items-center justify-between border-b pb-2">
                          <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                            {cmd}
                          </code>
                          <Badge variant="outline">All Pages</Badge>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <SheetFooter className="mt-4">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-feedback" className="text-sm">Voice Feedback</Label>
                  <Switch 
                    id="voice-feedback" 
                    checked={speechEnabled}
                    onCheckedChange={toggleSpeech}
                  />
                </div>
                <SheetClose asChild>
                  <Button className="w-full">Close Help</Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <Button 
          variant={isListening ? "destructive" : "default"}
          className="rounded-full shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
          onClick={toggleListening}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span>Voice Navigation</span>
            </>
          )}
        </Button>
      </div>
      
      {isListening && transcript && (
        <div className="bg-white rounded-lg shadow-md p-3 mt-2 text-sm max-w-xs">
          <p className="font-medium text-neutral-700">I heard:</p>
          <p className="text-neutral-600 italic mt-1">{transcript}</p>
        </div>
      )}
    </div>
  );
}