import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Star } from 'lucide-react';

interface LevelProgressProps {
  currentLevel: number;
  totalPoints: number;
  pointsToNextLevel: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ 
  currentLevel, 
  totalPoints, 
  pointsToNextLevel 
}) => {
  // Calculate how many points needed for the next level
  const nextLevelThreshold = totalPoints + pointsToNextLevel;
  
  // Calculate current level point range
  const currentLevelThreshold = nextLevelThreshold - pointsToNextLevel;
  
  // Calculate progress percentage to the next level
  const progressPercentage = ((totalPoints - currentLevelThreshold) / pointsToNextLevel) * 100;
  
  // Calculate points earned in current level
  const pointsInCurrentLevel = totalPoints - currentLevelThreshold;
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Your Learning Progress
        </CardTitle>
        <CardDescription>Track your journey to the next level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className="text-lg px-3 py-1 bg-primary text-white">Level {currentLevel}</Badge>
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm text-gray-500">
              {pointsInCurrentLevel} / {pointsToNextLevel} points to next level
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2.5" />
            
            <div className="flex justify-between text-xs text-gray-500">
              <div>Level {currentLevel}</div>
              <div>Level {currentLevel + 1}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="font-medium">Current Level</h3>
              </div>
              <div className="text-3xl font-bold text-primary">{currentLevel}</div>
              <div className="text-sm text-gray-500 mt-1">Keep learning!</div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium">Total Points</h3>
              </div>
              <div className="text-3xl font-bold text-primary">{totalPoints}</div>
              <div className="text-sm text-gray-500 mt-1">Points earned</div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center mb-2">
                <Award className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="font-medium">Next Level</h3>
              </div>
              <div className="text-3xl font-bold text-primary">{pointsToNextLevel}</div>
              <div className="text-sm text-gray-500 mt-1">Points needed</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 border-t pt-4">
            <p className="mb-1"><strong>How to earn more points:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Complete daily challenges (+30 points)</li>
              <li>Maintain your daily streak (+10 points per day)</li>
              <li>Complete lessons and modules (+20-50 points each)</li>
              <li>Participate in quizzes (+15-100 points based on score)</li>
              <li>Earn badges by completing achievements (+25-100 points each)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelProgress;