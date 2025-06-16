import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import VideoQuizDemo from '@/components/video/video-quiz-demo';

const VideoQuizDemoPage: React.FC = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => navigate('/video-preview-demo')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Video Preview
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Interactive Quiz Demo</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Experience our enhanced video learning with integrated quiz questions at key moments.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
          <VideoQuizDemo />
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Feature Highlights</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Interactive quizzes appear at key moments in the learning video</li>
            <li>Real-time feedback and explanations for each answer</li>
            <li>Progress tracking with visual indicators</li>
            <li>Points-based reward system to encourage participation</li>
            <li>Comprehensive quiz results summary</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoQuizDemoPage;