import React, { useState, useRef, useEffect } from 'react';
import EnhancedVideoPlayer from './enhanced-video-player';
import { QuizQuestion } from './video-quiz-integration';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface InteractiveVideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  tracks?: Array<{
    kind: string;
    label: string;
    language: string;
    src: string;
  }>;
  chapters?: Array<{
    time: number;
    title: string;
  }>;
  questions: QuizQuestion[];
  onQuizComplete?: (score: number, totalPossible: number) => void;
}

const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  src,
  title,
  poster,
  tracks = [],
  chapters = [],
  questions,
  onQuizComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const { toast } = useToast();

  // Sort questions by timestamp
  const sortedQuestions = [...questions].sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleTimeUpdate = () => {
      if (!videoElement) return;
      
      const currentTime = videoElement.currentTime;
      
      // Find the first unanswered question that should be shown at the current timestamp
      const questionToShow = sortedQuestions.find(q => 
        Math.abs(q.timestamp - currentTime) < 0.5 && 
        !answeredQuestions.has(q.id)
      );
      
      if (questionToShow && questionToShow !== activeQuestion) {
        setActiveQuestion(questionToShow);
        videoElement.pause();
        setPaused(true);
        
        // Show toast notification
        toast({
          title: "Quiz Question",
          description: "Answer this question to continue learning!",
          variant: "default",
        });
      }
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [sortedQuestions, answeredQuestions, activeQuestion, toast]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!activeQuestion || !selectedOption) return;
    
    const selectedAnswerObj = activeQuestion.options.find(o => o.id === selectedOption);
    const isCorrect = selectedAnswerObj?.isCorrect || false;
    
    setWasCorrect(isCorrect);
    setShowExplanation(true);
    
    // Update score if answer is correct
    if (isCorrect) {
      setScore(prev => prev + activeQuestion.points);
    }
  };

  const handleContinue = () => {
    if (!activeQuestion) return;
    
    // Mark current question as answered
    setAnsweredQuestions(prev => {
      const newSet = new Set(prev);
      newSet.add(activeQuestion.id);
      return newSet;
    });
    
    // Reset state
    setActiveQuestion(null);
    setSelectedOption(null);
    setShowExplanation(false);
    
    // Resume video
    if (videoRef.current && paused) {
      videoRef.current.play();
      setPaused(false);
    }
    
    // Check if all questions have been answered
    const allAnswered = sortedQuestions.every(q => {
      const newSet = new Set(answeredQuestions);
      if (q.id === activeQuestion.id) {
        newSet.add(q.id);
      }
      return newSet.has(q.id);
    });
    
    if (allAnswered && onQuizComplete) {
      const totalPossible = sortedQuestions.reduce((sum, q) => sum + q.points, 0);
      onQuizComplete(score, totalPossible);
    }
  };

  return (
    <div className="relative">
      <EnhancedVideoPlayer 
        src={src}
        title={title}
        poster={poster}
        tracks={tracks}
        chapters={chapters}
      />
      
      {/* Insert video element ref manually */}
      <div className="absolute inset-0 opacity-0 pointer-events-none">
        <video ref={videoRef} src={src} />
      </div>
      
      {/* Quiz Overlay */}
      {activeQuestion && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Quiz Question</CardTitle>
              <CardDescription>
                Answer correctly to earn {activeQuestion.points} points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-lg font-medium">{activeQuestion.questionText}</div>
              
              {!showExplanation ? (
                <RadioGroup value={selectedOption || ""} onValueChange={handleOptionSelect}>
                  {activeQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 mb-3 p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="cursor-pointer w-full">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="mt-4">
                  <div className={`p-4 mb-4 rounded-md flex items-start gap-3 ${wasCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                    {wasCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">
                        {wasCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                      </div>
                      <div className="mt-1 text-sm">
                        {activeQuestion.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!showExplanation ? (
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={!selectedOption}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button 
                  onClick={handleContinue} 
                  className="w-full"
                >
                  Continue Learning
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InteractiveVideoPlayer;