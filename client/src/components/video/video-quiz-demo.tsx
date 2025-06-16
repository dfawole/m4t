import React, { useRef, useState } from 'react';
import EnhancedVideoPlayer from './enhanced-video-player';
import VideoQuizIntegration, { QuizQuestion } from './video-quiz-integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from 'lucide-react';

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
    timestamp: 10, // Show after 10 seconds
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
    timestamp: 25, // Show after 25 seconds
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
    timestamp: 35, // Show after 35 seconds
    explanation: "React is a popular front-end JavaScript library developed by Facebook for building user interfaces, particularly single-page applications.",
    points: 10
  }
];

const VideoQuizDemo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quizResults, setQuizResults] = useState<{ score: number, total: number, completed: boolean }>({
    score: 0,
    total: 0,
    completed: false
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<string, boolean>>(new Map());
  const { toast } = useToast();

  const handleQuizComplete = (score: number, total: number) => {
    setQuizResults({ 
      score, 
      total, 
      completed: true 
    });
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${total} points`,
      variant: "default",
    });
  };

  const handleQuestionAnswered = (questionId: string, correct: boolean) => {
    setAnsweredQuestions(prev => {
      const updated = new Map(prev);
      updated.set(questionId, correct);
      return updated;
    });
  };

  const calculateProgress = () => {
    if (sampleQuestions.length === 0) return 0;
    return (answeredQuestions.size / sampleQuestions.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <EnhancedVideoPlayer 
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1000&auto=format&fit=crop"
          tracks={[
            { kind: 'subtitles', label: 'English', language: 'en', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/captions_en.vtt' },
            { kind: 'subtitles', label: 'Français', language: 'fr', src: '/captions/sample-french.vtt' },
            { kind: 'subtitles', label: 'Español', language: 'es', src: '/captions/sample-spanish.vtt' },
            { kind: 'subtitles', label: 'Deutsch', language: 'de', src: '/captions/sample-german.vtt' },
            { kind: 'subtitles', label: '中文', language: 'zh', src: '/captions/sample-chinese.vtt' },
            { kind: 'subtitles', label: '日本語', language: 'ja', src: '/captions/sample-japanese.vtt' },
          ]}
          chapters={[
            { time: 0, title: 'Introduction' },
            { time: 10, title: 'HTML Basics' },
            { time: 25, title: 'CSS Styling' },
            { time: 35, title: 'JavaScript Fundamentals' },
          ]}
          ref={videoRef}
        />
        <VideoQuizIntegration 
          videoRef={videoRef} 
          questions={sampleQuestions} 
          onQuizComplete={handleQuizComplete}
          autoStop={true}
          onQuestionAnswered={handleQuestionAnswered}
        />
      </div>

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
                {quizResults.score} points earned
              </span>
            </div>
            
            <Progress value={calculateProgress()} className="h-2" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {sampleQuestions.map((question, idx) => {
                const isAnswered = answeredQuestions.has(question.id);
                const isCorrect = answeredQuestions.get(question.id);
                
                return (
                  <div key={question.id} className="flex items-center gap-2">
                    <Badge 
                      variant={!isAnswered ? "outline" : isCorrect ? "default" : "destructive"}
                      className="h-6 w-6 flex items-center justify-center p-0 rounded-full"
                    >
                      {idx + 1}
                    </Badge>
                    <span className="text-sm truncate">
                      {question.questionText.length > 30 
                        ? question.questionText.substring(0, 30) + '...' 
                        : question.questionText
                      }
                    </span>
                  </div>
                );
              })}
            </div>
            
            {quizResults.completed && (
              <div className={`p-4 rounded-md mt-4 ${
                quizResults.score === quizResults.total 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                  : quizResults.score > quizResults.total / 2 
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
              }`}>
                <h3 className="font-bold">Quiz Results</h3>
                <p className="text-sm">
                  You scored {quizResults.score} out of {quizResults.total} points 
                  ({Math.round((quizResults.score / quizResults.total) * 100)}%)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoQuizDemo;