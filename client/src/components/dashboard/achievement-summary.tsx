import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Flame, Zap, Trophy } from 'lucide-react';
import { Link } from 'wouter';
import { AchievementLoading } from '@/components/ui/loading-animation';

interface AchievementSummaryProps {
  badges?: Array<{
    id: number;
    badge: {
      id: number;
      name: string;
      description: string;
      imageUrl: string;
      category: string;
    };
    earnedAt: string;
  }>;
  points?: {
    totalPoints: number;
    level: number;
  };
  streak?: {
    currentStreak: number;
    longestStreak: number;
  };
  challenges?: Array<{
    id: number;
    challenge: {
      id: number;
      title: string;
      description: string;
      pointsReward: number;
    };
    progress: number;
    target: number;
  }>;
  isLoading?: boolean;
}

const AchievementSummary: React.FC<AchievementSummaryProps> = ({
  badges = [],
  points = { totalPoints: 0, level: 0 },
  streak = { currentStreak: 0, longestStreak: 0 },
  challenges = [],
  isLoading = false
}) => {
  // Calculate XP needed for next level
  const currentLevelXp = Math.pow((points?.level || 0) * 10, 2);
  const nextLevelXp = Math.pow(((points?.level || 0) + 1) * 10, 2);
  const xpForNextLevel = nextLevelXp - currentLevelXp;
  const currentLevelProgress = Math.min(100, Math.max(0, 
    (((points?.totalPoints || 0) - currentLevelXp) / xpForNextLevel) * 100
  ));

  // Sort badges by earned date (newest first)
  const recentBadges = Array.isArray(badges) ? [...badges].sort(
    (a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  ).slice(0, 3) : [];
  
  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementLoading type="trophy" text="Loading your achievements..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Your Achievements</CardTitle>
        <Link href="/achievements">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">
            View All
          </Badge>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Level and XP Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-primary mr-1.5" />
                <span className="text-sm font-medium">Level {points?.level || 0}</span>
              </div>
              <span className="text-xs text-gray-500">
                {(points?.totalPoints || 0) - currentLevelXp} / {xpForNextLevel} XP to Level {(points?.level || 0) + 1}
              </span>
            </div>
            <Progress value={currentLevelProgress} className="h-2" />
          </div>

          {/* Recent Badges */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center">
                <Award className="h-4 w-4 text-primary mr-1.5" />
                Recent Badges
              </span>
              <span className="text-xs text-gray-500">{badges?.length || 0} total</span>
            </div>
            
            {badges && badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {recentBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 mb-1 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {badge.badge.imageUrl ? (
                        <img 
                          src={badge.badge.imageUrl} 
                          alt={badge.badge.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Trophy className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <span className="text-xs font-medium line-clamp-1">{badge.badge.name}</span>
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="text-sm text-gray-500">Complete lessons to earn badges</span>
              </div>
            )}
          </div>

          {/* Current Streak */}
          <div className="bg-primary/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Flame className="h-5 w-5 text-primary mr-2" />
                <div>
                  <div className="text-sm font-medium">
                    {streak?.currentStreak || 0} Day Streak
                  </div>
                  <div className="text-xs text-gray-500">
                    Longest: {streak?.longestStreak || 0} days
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(7, streak?.currentStreak || 0))].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-8 bg-primary rounded-sm" 
                    style={{ 
                      opacity: Math.max(0.4, 0.6 + (i * 0.05)),
                      height: `${24 + (i * 3)}px` 
                    }} 
                  />
                ))}
                {[...Array(Math.max(0, 7 - (streak?.currentStreak || 0)))].map((_, i) => (
                  <div key={i + (streak?.currentStreak || 0)} className="w-2 h-8 bg-gray-300 rounded-sm" style={{ 
                    height: `${24 + ((i + (streak?.currentStreak || 0)) * 3)}px` 
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          {challenges.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium flex items-center">
                <Trophy className="h-4 w-4 text-primary mr-1.5" />
                Active Challenges
              </span>
              
              <div className="space-y-2">
                {challenges.slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium line-clamp-1">
                        {challenge.challenge.title}
                      </span>
                      <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                        +{challenge.challenge.pointsReward} XP
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{challenge.progress} / {challenge.target}</span>
                        <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementSummary;