import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  time: number; // Time in video when quiz should appear (in seconds)
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface InteractiveQuizOverlayProps {
  questions: QuizQuestion[];
  currentTime: number;
  isPlaying: boolean;
  onPause: () => void;
  onResume: () => void;
  onQuizComplete: (questionId: string, isCorrect: boolean, timeTaken: number) => void;
}

export default function InteractiveQuizOverlay({
  questions,
  currentTime,
  isPlaying,
  onPause,
  onResume,
  onQuizComplete
}: InteractiveQuizOverlayProps) {
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  // Check if a quiz should be triggered
  useEffect(() => {
    if (!isPlaying) return;

    const currentQuestion = questions.find(q => 
      Math.abs(currentTime - q.time) < 0.5 && 
      !completedQuestions.has(q.id)
    );

    if (currentQuestion && !activeQuestion) {
      setActiveQuestion(currentQuestion);
      setQuizStartTime(Date.now());
      onPause();
    }
  }, [currentTime, questions, completedQuestions, activeQuestion, isPlaying, onPause]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !activeQuestion) return;

    const correct = selectedAnswer === activeQuestion.correctAnswer;
    const timeTaken = (Date.now() - quizStartTime) / 1000;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    // Track quiz completion
    onQuizComplete(activeQuestion.id, correct, timeTaken);
  };

  const handleContinue = () => {
    if (!activeQuestion) return;

    setCompletedQuestions(prev => new Set([...prev, activeQuestion.id]));
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    onResume();
  };

  if (!activeQuestion) return null;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 bg-white shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Quiz Question
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {activeQuestion.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showResult ? (
            <>
              {/* Answer Options */}
              <div className="space-y-3">
                {activeQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={cn(
                      "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
                      "hover:border-blue-300 hover:bg-blue-50",
                      selectedAnswer === index
                        ? "border-blue-500 bg-blue-100 shadow-md"
                        : "border-gray-200 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      )}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-800 font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Result Display */}
              <div className="text-center space-y-4">
                <div className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-full",
                  isCorrect ? "bg-green-100" : "bg-red-100"
                )}>
                  {isCorrect ? (
                    <Check className="w-8 h-8 text-green-600" />
                  ) : (
                    <X className="w-8 h-8 text-red-600" />
                  )}
                </div>
                
                <div>
                  <h3 className={cn(
                    "text-xl font-bold mb-2",
                    isCorrect ? "text-green-600" : "text-red-600"
                  )}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </h3>
                  
                  {!isCorrect && (
                    <p className="text-gray-600 mb-2">
                      The correct answer was: <strong>{activeQuestion.options[activeQuestion.correctAnswer]}</strong>
                    </p>
                  )}
                  
                  {activeQuestion.explanation && (
                    <div className="bg-gray-50 p-4 rounded-lg text-left">
                      <p className="text-gray-700">{activeQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleContinue}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Continue Video
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}