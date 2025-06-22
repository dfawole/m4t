import React from 'react';
import { Calendar, Flame, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Daily Challenge Component
export interface ChallengeProps {
  challenge: {
    id: number;
    title: string;
    description: string;
    pointsReward: number;
    progress: number;
    isCompleted: boolean;
  };
  onViewChallenge: (id: number) => void;
}

export const DailyChallenge: React.FC<ChallengeProps> = ({ challenge, onViewChallenge }) => {
  const progressPercentage = Math.min(100, Math.max(0, challenge.progress * 100));
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Challenge
        </CardTitle>
        <CardDescription>Complete to earn points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{challenge.title}</h3>
            <p className="text-sm text-gray-500">{challenge.description}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{Math.floor(progressPercentage)}%</span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium">{challenge.pointsReward} points</span>
            </div>
            
            {challenge.isCompleted ? (
              <Button variant="outline" className="text-green-600 border-green-200 bg-green-50" disabled>
                Completed
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => onViewChallenge(challenge.id)}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Daily Streak Component
export interface StreakProps {
  currentStreak: number;
  longestStreak: number;
  lastActivity: Date | null;
  onCheckIn: () => void;
  canCheckInToday: boolean;
}

export const DailyStreak: React.FC<StreakProps> = ({ 
  currentStreak, 
  longestStreak, 
  lastActivity,
  onCheckIn,
  canCheckInToday 
}) => {
  // Format date to display
  const formattedLastActivity = lastActivity 
    ? lastActivity.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    : 'Never';
  
  // Calculate days since last activity
  const daysSinceLastActivity = lastActivity 
    ? Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 3600 * 24)) 
    : null;
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          Daily Streak
        </CardTitle>
        <CardDescription>Check in daily to maintain your streak</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-primary">{currentStreak}</div>
              <div className="text-xs text-gray-500">Current streak</div>
            </div>
            <div className="bg-gray-50 rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-primary">{longestStreak}</div>
              <div className="text-xs text-gray-500">Longest streak</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Last activity: {formattedLastActivity}
            {daysSinceLastActivity === 0 && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                Today
              </span>
            )}
          </div>
          
          <Button 
            className="w-full"
            disabled={!canCheckInToday}
            onClick={onCheckIn}
          >
            {canCheckInToday ? "Check in today" : "Already checked in today"}
          </Button>
          
          <div className="text-xs text-gray-500 text-center">
            {canCheckInToday 
              ? "Check in to earn points and maintain your streak!" 
              : "Come back tomorrow to continue your streak!"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};