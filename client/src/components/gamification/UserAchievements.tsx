import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, ClipboardList, Star, Target, Trophy, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Define interfaces for our data types
export interface UserBadge {
  id: number;
  userId: string;
  badgeId: number;
  awardedAt: Date;
  badge: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    level: string;
  };
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
}

export interface PointTransaction {
  id: number;
  userId: string;
  points: number;
  description: string;
  transactionType: string;
  entityType?: string;
  entityId?: string;
  createdAt: Date;
}

export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
}

export interface UserChallenge {
  id: number;
  userId: string;
  challengeId: number;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  challenge: {
    id: number;
    title: string;
    description: string;
    pointsReward: number;
    type: string;
    startDate?: Date;
    endDate?: Date;
  };
}

interface UserAchievementsProps {
  badges: UserBadge[];
  points: UserPoints;
  pointHistory: PointTransaction[];
  streak: UserStreak;
  activeChallenges: UserChallenge[];
  completedChallenges: UserChallenge[];
}

const UserAchievements: React.FC<UserAchievementsProps> = ({
  badges,
  points,
  pointHistory,
  streak,
  activeChallenges,
  completedChallenges
}) => {
  const [activeTab, setActiveTab] = useState('badges');

  // Group badges by category
  const badgesByCategory = badges.reduce((acc: Record<string, UserBadge[]>, badge) => {
    const category = badge.badge.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(badge);
    return acc;
  }, {});

  const getBadgeColorClass = (level: string) => {
    switch (level) {
      case 'bronze':
        return 'bg-amber-500';
      case 'silver':
        return 'bg-slate-400';
      case 'gold':
        return 'bg-yellow-500';
      case 'platinum':
        return 'bg-cyan-400';
      default:
        return 'bg-blue-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'streak':
        return <Calendar className="h-4 w-4 text-red-500" />;
      case 'badge':
        return <Award className="h-4 w-4 text-purple-500" />;
      case 'lesson':
        return <ClipboardList className="h-4 w-4 text-blue-500" />;
      case 'quiz':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Trophy className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Your Achievements
        </CardTitle>
        <CardDescription>Badges, challenges, and points history</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="badges" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="badges" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
              <span className="inline sm:hidden">🏆</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
              <span className="inline sm:hidden">🎯</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
              <span className="inline sm:hidden">📊</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
              <span className="inline sm:hidden">⭐</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Badges Tab */}
          <TabsContent value="badges">
            {badges.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">You haven't earned any badges yet.</p>
                <p className="text-sm text-gray-400 mt-1">Complete challenges and activities to earn your first badge!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-lg mb-3 capitalize">{category} Badges</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {categoryBadges.map((badge) => (
                        <div 
                          key={badge.id}
                          className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${getBadgeColorClass(badge.badge.level)}`}>
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="font-medium text-center text-sm">{badge.badge.name}</h4>
                          <p className="text-xs text-gray-500 text-center mt-1">{badge.badge.description}</p>
                          <div className="mt-2 text-xs text-gray-400">
                            {formatDate(new Date(badge.awardedAt))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <div className="space-y-6">
              {/* Active Challenges */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Active Challenges</h3>
                {activeChallenges.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Target className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No active challenges.</p>
                    <p className="text-xs text-gray-400 mt-1">Check back later for new challenges!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeChallenges.map((challenge) => {
                      const progressPercentage = Math.min(100, Math.max(0, challenge.progress * 100));
                      
                      return (
                        <div key={challenge.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{challenge.challenge.title}</h4>
                            <Badge variant="outline" className="text-primary border-primary/30">
                              {challenge.challenge.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{challenge.challenge.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.floor(progressPercentage)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center text-sm">
                              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{challenge.challenge.pointsReward} points</span>
                            </div>
                            {challenge.challenge.endDate && (
                              <div className="text-xs text-gray-500">
                                Ends: {formatDate(new Date(challenge.challenge.endDate))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Completed Challenges */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Completed Challenges</h3>
                {completedChallenges.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Trophy className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No completed challenges yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Work on your active challenges to see them here!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedChallenges.map((challenge) => (
                      <div key={challenge.id} className="p-4 border rounded-lg bg-green-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{challenge.challenge.title}</h4>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{challenge.challenge.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{challenge.challenge.pointsReward} points earned</span>
                          </div>
                          {challenge.completedAt && (
                            <div className="text-xs text-gray-500">
                              Completed: {formatDate(new Date(challenge.completedAt))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Points History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Points History</h3>
              {pointHistory.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No point history yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Earn points through activities to see your history here!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {pointHistory.map((transaction) => (
                    <div key={transaction.id} className="p-3 border rounded-lg flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getTransactionTypeIcon(transaction.transactionType)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(new Date(transaction.createdAt))}
                        </div>
                      </div>
                      <div className={`font-bold text-sm ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Learning Stats
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Current Level</div>
                      <div className="font-bold text-lg">{points.level}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Total Points</div>
                      <div className="font-bold text-lg">{points.totalPoints}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Points to Next Level</div>
                      <div className="font-bold text-lg">{points.pointsToNextLevel}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Badges Earned</div>
                      <div className="font-bold text-lg">{badges.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-500" />
                    Activity Stats
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Current Streak</div>
                      <div className="font-bold text-lg">{streak.currentStreak} days</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Longest Streak</div>
                      <div className="font-bold text-lg">{streak.longestStreak} days</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Active Challenges</div>
                      <div className="font-bold text-lg">{activeChallenges.length}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">Completed Challenges</div>
                      <div className="font-bold text-lg">{completedChallenges.length}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Activity Timeline</h3>
                {pointHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No activity recorded yet.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 before:content-[''] before:absolute before:left-2.5 before:top-0 before:w-0.5 before:h-full before:bg-gray-200">
                    {pointHistory.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="relative">
                        <div className="absolute left-[-20px] top-1 w-4 h-4 rounded-full bg-primary"></div>
                        <div className="mb-1 text-sm font-medium">{transaction.description}</div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{formatDate(new Date(transaction.createdAt))}</span>
                          <span className={transaction.points >= 0 ? "text-green-600" : "text-red-600"}>
                            {transaction.points > 0 ? "+" : ""}{transaction.points} points
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserAchievements;