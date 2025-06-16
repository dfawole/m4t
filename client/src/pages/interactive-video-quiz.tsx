import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Gauge } from 'lucide-react';

// Define Quiz Question interface
interface QuizQuestion {
  id: string;
  questionText: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  timestamp: number;
  explanation: string;
  points: number;
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: "q1",
    questionText: "Which technology is used to structure web content?",
    options: [
      { id: "q1a", text: "HTML", isCorrect: true },
      { id: "q1b", text: "CSS", isCorrect: false },
      { id: "q1c", text: "JavaScript", isCorrect: false },
      { id: "q1d", text: "PHP", isCorrect: false }
    ],
    timestamp: 8, // Show after 8 seconds
    explanation: "HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications, defining the structure of content.",
    points: 10
  },
  {
    id: "q2",
    questionText: "Which property is used to change the text color in CSS?",
    options: [
      { id: "q2a", text: "font-color", isCorrect: false },
      { id: "q2b", text: "text-style", isCorrect: false },
      { id: "q2c", text: "color", isCorrect: true },
      { id: "q2d", text: "text-color", isCorrect: false }
    ],
    timestamp: 20, // Show after 20 seconds
    explanation: "The 'color' property in CSS is used to set the color of text content in an HTML element.",
    points: 10
  },
  {
    id: "q3",
    questionText: "Which of the following is a JavaScript framework?",
    options: [
      { id: "q3a", text: "Java", isCorrect: false },
      { id: "q3b", text: "React", isCorrect: true },
      { id: "q3c", text: "Python", isCorrect: false },
      { id: "q3d", text: "HTML5", isCorrect: false }
    ],
    timestamp: 30, // Show after 30 seconds
    explanation: "React is a popular front-end JavaScript library developed by Facebook for building user interfaces, particularly single-page applications.",
    points: 10
  }
];

const InteractiveVideoQuiz: React.FC = () => {
  const [_, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<string, boolean>>(new Map());
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();
  
  // Check for quiz questions as the video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const checkForQuizzes = () => {
      if (!video) return;
      
      if (activeQuestion) return; // Don't check for new questions if one is active
      
      const currentTime = video.currentTime;
      
      // Find the first unanswered question that should be shown at the current timestamp
      const questionToShow = sampleQuestions.find(q => 
        Math.abs(q.timestamp - currentTime) < 1 && 
        !answeredQuestions.has(q.id)
      );
      
      if (questionToShow) {
        setActiveQuestion(questionToShow);
        video.pause();
        
        // Show toast notification
        toast({
          title: "Quiz Question",
          description: "Answer this question to continue learning!",
        });
      }
    };
    
    // Check every 500ms
    const intervalId = setInterval(checkForQuizzes, 500);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [activeQuestion, answeredQuestions, toast]);
  
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
    if (!activeQuestion || !videoRef.current) return;
    
    // Mark current question as answered
    setAnsweredQuestions(prev => {
      const newMap = new Map(prev);
      newMap.set(activeQuestion.id, wasCorrect);
      return newMap;
    });
    
    // Reset state
    setActiveQuestion(null);
    setSelectedOption(null);
    setShowExplanation(false);
    
    // Resume video
    videoRef.current.play();
    
    // Check if all questions have been answered
    if (answeredQuestions.size === sampleQuestions.length - 1) {
      setQuizCompleted(true);
      
      toast({
        title: "Quiz Completed!",
        description: `You scored ${score + (wasCorrect ? activeQuestion.points : 0)} out of ${sampleQuestions.reduce((total, q) => total + q.points, 0)} points`,
      });
    }
  };
  
  const calculateProgress = () => {
    if (sampleQuestions.length === 0) return 0;
    return (answeredQuestions.size / sampleQuestions.length) * 100;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          className="gap-2" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Interactive Video Quiz</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Experience our enhanced learning with integrated quiz questions at key moments.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 relative">
            <div className="aspect-video bg-black rounded-md overflow-hidden">
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
                <track 
                  kind="subtitles" 
                  label="Deutsch" 
                  srcLang="de" 
                  src="/captions/sample-german.vtt" 
                />
                <track 
                  kind="subtitles" 
                  label="中文" 
                  srcLang="zh" 
                  src="/captions/sample-chinese.vtt" 
                />
                <track 
                  kind="subtitles" 
                  label="日本語" 
                  srcLang="ja" 
                  src="/captions/sample-japanese.vtt" 
                />
              </video>
            </div>
            
            {/* Quiz Modal Overlay */}
            {activeQuestion && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 rounded-lg">
                <Card className="w-full max-w-md m-4">
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
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
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
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Quiz Progress
              </CardTitle>
              <CardDescription>
                Answer all questions to complete the quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {answeredQuestions.size} of {sampleQuestions.length} questions answered
                  </span>
                  <span className="text-sm font-medium">
                    {score} points earned
                  </span>
                </div>
                
                <Progress value={calculateProgress()} className="h-2" />
                
                <div className="mt-4 space-y-4">
                  {sampleQuestions.map((question, idx) => {
                    const isAnswered = answeredQuestions.has(question.id);
                    const isCorrect = answeredQuestions.get(question.id);
                    
                    return (
                      <div key={question.id} className="flex items-start gap-3">
                        <Badge 
                          className="h-6 w-6 flex items-center justify-center p-0 rounded-full mt-0.5"
                        >
                          {idx + 1}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">
                            {question.questionText}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Appears at {Math.floor(question.timestamp / 60)}:{(question.timestamp % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {quizCompleted && (
                  <div className={`p-4 rounded-md mt-4 ${
                    score === sampleQuestions.reduce((total, q) => total + q.points, 0) 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                      : score > (sampleQuestions.reduce((total, q) => total + q.points, 0) / 2) 
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5" />
                      <h3 className="font-bold">Quiz Results</h3>
                    </div>
                    <p className="text-sm mt-2">
                      You scored {score} out of {sampleQuestions.reduce((total, q) => total + q.points, 0)} points 
                      ({Math.round((score / sampleQuestions.reduce((total, q) => total + q.points, 0)) * 100)}%)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p>Watch the educational video at your own pace</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p>Quiz questions appear at key moments to test your understanding</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <p>Get immediate feedback and explanations for each answer</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <p>Track your progress and see your final score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveVideoQuiz;