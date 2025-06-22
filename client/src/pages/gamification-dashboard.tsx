import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import UserAchievements, { 
  UserBadge, 
  UserPoints, 
  PointTransaction, 
  UserStreak, 
  UserChallenge 
} from "@/components/gamification/UserAchievements";
import Leaderboard, { LeaderboardEntry } from "@/components/gamification/Leaderboard";
import { DailyStreak, DailyChallenge } from "@/components/gamification/DailyChallenge";
import LevelProgress from "@/components/gamification/LevelProgress";
import { Button } from "@/components/ui/button";
import { Award, Flame, Star, TrendingUp, Trophy, Users } from "lucide-react";

export default function GamificationDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Fetch user badges
  const { data: badges = [], isLoading: isBadgesLoading } = useQuery<UserBadge[]>({
    queryKey: ["/api/gamification/user/badges"],
    enabled: !!user,
    queryFn: getQueryFn({ on401: "returnNull" }), // Handle 401/302 responses gracefully
  });
  
  // Fetch user points
  const { data: points, isLoading: isPointsLoading } = useQuery<UserPoints>({
    queryKey: ["/api/gamification/user/points"],
    enabled: !!user,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch user point history
  const { data: pointHistory = [], isLoading: isHistoryLoading } = useQuery<PointTransaction[]>({
    queryKey: ["/api/gamification/user/points/history"],
    enabled: !!user,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch user streak
  const { data: streak, isLoading: isStreakLoading } = useQuery<UserStreak>({
    queryKey: ["/api/gamification/user/streak"],
    enabled: !!user,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch user active challenges
  const { data: activeChallenges = [], isLoading: isChallengesLoading } = useQuery<UserChallenge[]>({
    queryKey: ["/api/gamification/user/challenges/active"],
    enabled: !!user,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch user completed challenges
  const { data: completedChallenges = [], isLoading: isCompletedChallengesLoading } = useQuery<UserChallenge[]>({
    queryKey: ["/api/gamification/user/challenges/completed"],
    enabled: !!user,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch leaderboard
  const { data: leaderboard = [], isLoading: isLeaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/gamification/leaderboard"],
  });
  
  // Handle streak check-in
  const handleStreakCheckIn = async () => {
    try {
      const response = await fetch('/api/gamification/user/streak/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check in streak');
      }
      
      // Refetch streak and points data
      window.location.reload();
    } catch (error) {
      console.error('Error checking in streak:', error);
      alert(error instanceof Error ? error.message : 'Failed to check in streak');
    }
  };
  
  // Handle view challenge
  const handleViewChallenge = (challengeId: number) => {
    // In a real app, this might open a modal with challenge details
    // or navigate to a challenge details page
    alert(`Viewing challenge details for challenge ${challengeId}`);
  };
  
  const isLoading = 
    isAuthLoading || 
    isBadgesLoading || 
    isPointsLoading || 
    isHistoryLoading || 
    isStreakLoading || 
    isChallengesLoading ||
    isCompletedChallengesLoading;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Gamification Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6">
            Track your progress, earn badges, and compete with other learners.
          </p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-primary hover:bg-primary-dark text-white"
            size="lg"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }
  
  // Get the active daily challenge (if any)
  const dailyChallenge = (Array.isArray(activeChallenges) 
    ? activeChallenges.find((c: UserChallenge) => c.challenge.type === 'daily') 
    : null) || {
    id: 0,
    userId: user?.id || '',
    challengeId: 0,
    progress: 0,
    isCompleted: false,
    challenge: {
      id: 0,
      title: "Complete a Lesson",
      description: "Complete at least one lesson today",
      pointsReward: 30,
      type: "daily",
    }
  };
  
  // Check if user can check in today (not already checked in)
  const canCheckInToday = !streak?.lastActivityDate || 
    (streak.lastActivityDate && new Date(streak.lastActivityDate).getDate() !== new Date().getDate());
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-primary" /> 
            Your Learning Journey
          </h1>
          <p className="text-gray-600 mt-2">
            Track your progress, earn rewards, and compete with other learners
          </p>
        </div>
        
        {/* Stats and daily features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Your Stats
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <span>Level</span>
                  </div>
                  <span className="font-bold">{points?.level || 1}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Total Points</span>
                  </div>
                  <span className="font-bold">{points?.totalPoints || 0}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-purple-500 mr-2" />
                    <span>Badges Earned</span>
                  </div>
                  <span className="font-bold">{badges.length}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-red-500 mr-2" />
                    <span>Current Streak</span>
                  </div>
                  <span className="font-bold">{streak?.currentStreak || 0} days</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Daily Streak */}
          <div className="md:col-span-1">
            <DailyStreak
              currentStreak={streak?.currentStreak || 0}
              longestStreak={streak?.longestStreak || 0}
              lastActivity={streak?.lastActivityDate ? new Date(streak.lastActivityDate) : null}
              onCheckIn={handleStreakCheckIn}
              canCheckInToday={canCheckInToday}
            />
          </div>
          
          {/* Daily Challenge */}
          <div className="md:col-span-1">
            <DailyChallenge
              challenge={{
                id: dailyChallenge.challenge.id,
                title: dailyChallenge.challenge.title,
                description: dailyChallenge.challenge.description,
                pointsReward: dailyChallenge.challenge.pointsReward,
                progress: dailyChallenge.progress || 0,
                isCompleted: dailyChallenge.isCompleted,
              }}
              onViewChallenge={handleViewChallenge}
            />
          </div>
        </div>
        
        {/* Level Progress and Leaderboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level Progress */}
          <div className="md:col-span-2">
            <LevelProgress
              currentLevel={points?.level || 1}
              totalPoints={points?.totalPoints || 0}
              pointsToNextLevel={points?.pointsToNextLevel || 100}
            />
          </div>
          
          {/* Leaderboard */}
          <div className="md:col-span-1">
            <Leaderboard 
              entries={leaderboard}
              currentUserId={user.id}
              isLoading={isLeaderboardLoading}
              title="Top Learners"
              description="This month's leaders"
            />
          </div>
        </div>
        
        {/* User Achievements */}
        <UserAchievements
          badges={badges}
          points={points ? points : { 
            userId: user.id,
            totalPoints: 0, 
            level: 1, 
            pointsToNextLevel: 100 
          }}
          pointHistory={pointHistory}
          streak={streak ? streak : { 
            userId: user.id,
            currentStreak: 0, 
            longestStreak: 0, 
            lastActivityDate: null 
          }}
          activeChallenges={activeChallenges}
          completedChallenges={completedChallenges}
        />
      </div>
    </div>
  );
}