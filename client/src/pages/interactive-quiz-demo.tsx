import React from 'react';
import InteractiveQuiz, { type QuizQuestion } from '@/components/course/InteractiveQuiz';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

// Sample questions for demonstration
const sampleQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary benefit of using TypeScript over JavaScript?',
    options: [
      'TypeScript runs faster than JavaScript',
      'TypeScript adds static typing to JavaScript',
      'TypeScript has more built-in functions',
      'TypeScript reduces the bundle size'
    ],
    correctAnswer: 1,
    explanation: 'TypeScript adds static typing to JavaScript, which helps catch errors during development rather than at runtime. This improves code quality and developer productivity.'
  },
  {
    id: 'q2',
    question: 'Which hook would you use to perform side effects in a React component?',
    options: [
      'useState',
      'useContext',
      'useEffect',
      'useReducer'
    ],
    correctAnswer: 2,
    explanation: 'useEffect is designed for handling side effects in your components, such as data fetching, subscriptions, or manually changing the DOM.'
  },
  {
    id: 'q3',
    question: 'What does CSS Grid primarily help with?',
    options: [
      'Animation and transitions',
      'Two-dimensional layout systems',
      'Responsive typography',
      'Image optimization'
    ],
    correctAnswer: 1,
    explanation: 'CSS Grid is a two-dimensional layout system that allows for complex layouts with rows and columns, unlike Flexbox which is primarily one-dimensional.'
  },
  {
    id: 'q4',
    question: 'What is a key advantage of using a REST API?',
    options: [
      'It automatically optimizes database queries',
      'It provides real-time updates without polling',
      'It uses a stateless architecture',
      'It guarantees 100% uptime'
    ],
    correctAnswer: 2,
    explanation: 'REST APIs are stateless, meaning each request from client to server must contain all the information needed to understand and process the request. This makes them scalable and reliable.'
  },
  {
    id: 'q5',
    question: 'What does TDD stand for in software development?',
    options: [
      'Technical Design Document',
      'Test-Driven Development',
      'Type Definition Declaration',
      'Total Development Duration'
    ],
    correctAnswer: 1,
    explanation: 'Test-Driven Development (TDD) is a software development approach where tests are written before the code. The cycle includes writing a test, making it pass, and then refactoring.'
  }
];

export default function InteractiveQuizDemo() {
  const handleQuizComplete = (score: number, total: number) => {
    console.log(`Quiz completed with score: ${score}/${total}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <div className="inline-flex items-center text-primary hover:text-primary-dark cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </div>
          </Link>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Interactive Quiz Feature Demo</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              Try out our interactive quiz feature that engages learners during course modules.
              Answer the questions below to see how it works!
            </p>
          </div>
        </div>

        <InteractiveQuiz questions={sampleQuestions} onComplete={handleQuizComplete} />
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Interactive Quizzes?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-brain text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Reinforces Learning</h3>
              <p className="text-neutral-medium">
                Testing knowledge immediately after learning helps with retention and understanding.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-gauge-high text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Increases Engagement</h3>
              <p className="text-neutral-medium">
                Interactive elements keep learners focused and motivated throughout the course.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-clipboard-check text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Provides Feedback</h3>
              <p className="text-neutral-medium">
                Immediate feedback helps learners identify knowledge gaps and misconceptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}