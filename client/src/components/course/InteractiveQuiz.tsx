import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, HelpCircle, Award } from 'lucide-react';

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function InteractiveQuiz({ questions, onComplete }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(optionIndex);
    }
  };

  const checkAnswer = () => {
    if (selectedOption !== null) {
      setIsAnswerChecked(true);
      
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore(prev => prev + 1);
      }
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setQuizCompleted(true);
      onComplete?.(score, questions.length);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <Card className="w-full max-w-3xl mx-auto overflow-hidden border-2 border-primary">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <Award className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-2">Your Score: <span className="font-bold">{score}</span> out of {questions.length}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-primary h-4 rounded-full transition-all duration-1000" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          {percentage >= 80 ? (
            <p className="text-green-600 mb-6">Great job! You've mastered this content.</p>
          ) : percentage >= 60 ? (
            <p className="text-yellow-600 mb-6">Good effort! Consider reviewing some concepts.</p>
          ) : (
            <p className="text-red-600 mb-6">You might need to review this module again.</p>
          )}
          
          <Button onClick={restartQuiz} className="mr-2">Retry Quiz</Button>
          <Button variant="outline" onClick={() => window.history.back()}>Continue Learning</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Knowledge Check</h3>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-white/20 h-2 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{currentQuestion.question}</h2>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`p-3 border rounded-md cursor-pointer transition-all ${
                selectedOption === index 
                  ? isAnswerChecked
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-primary bg-primary/5'
                  : 'hover:border-gray-400'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-2">
                  {isAnswerChecked && index === currentQuestion.correctAnswer && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {isAnswerChecked && selectedOption === index && index !== currentQuestion.correctAnswer && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>{option}</div>
              </div>
            </div>
          ))}
        </div>

        {isAnswerChecked && (
          <div className="mb-6 p-4 bg-gray-50 border-l-4 border-primary rounded">
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Explanation:</p>
                <p>{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          {!isAnswerChecked ? (
            <Button onClick={checkAnswer} disabled={selectedOption === null}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={goToNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
          <div className="text-right">
            <p className="text-sm text-gray-500">Score: {score}/{currentQuestionIndex + (isAnswerChecked ? 1 : 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}