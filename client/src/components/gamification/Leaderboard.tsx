import React from 'react';
import { Users, Trophy, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  level: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  entries = [], 
  currentUserId, 
  isLoading = false,
  title = "Leaderboard",
  description = "Top learners this month"
}) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="animate-pulse flex items-center p-3 rounded-md bg-gray-100"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No data available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort entries by points (highest first)
  const sortedEntries = [...entries].sort((a, b) => b.totalPoints - a.totalPoints);

  // Find the current user's rank
  const currentUserRank = sortedEntries.findIndex(entry => entry.userId === currentUserId) + 1;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
          {sortedEntries.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            
            // Determine badge icon and color for top 3
            let medalIcon = null;
            if (index === 0) {
              medalIcon = <Medal className="h-5 w-5 text-yellow-500" />;
            } else if (index === 1) {
              medalIcon = <Medal className="h-5 w-5 text-gray-400" />;
            } else if (index === 2) {
              medalIcon = <Medal className="h-5 w-5 text-amber-700" />;
            }
            
            return (
              <div 
                key={entry.userId}
                className={`flex items-center p-3 rounded-md ${
                  isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50'
                }`}
              >
                <div className="w-8 flex justify-center">
                  {medalIcon || <span className="font-semibold text-gray-500">{index + 1}</span>}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">
                    {entry.username}
                    {isCurrentUser && <span className="ml-2 text-xs text-primary">(You)</span>}
                  </div>
                  <div className="text-xs text-gray-500">Level {entry.level}</div>
                </div>
                <div className="font-bold text-primary">{entry.totalPoints} pts</div>
              </div>
            );
          })}
        </div>
        
        {/* Show the user's rank if not in top 10 */}
        {currentUserRank > 10 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-sm text-gray-500 mb-2">Your position</div>
            <div className="flex items-center p-3 rounded-md bg-primary/10 border border-primary/20">
              <div className="w-8 flex justify-center">
                <span className="font-semibold text-gray-500">{currentUserRank}</span>
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium">
                  {sortedEntries.find(e => e.userId === currentUserId)?.username}
                  <span className="ml-2 text-xs text-primary">(You)</span>
                </div>
                <div className="text-xs text-gray-500">
                  Level {sortedEntries.find(e => e.userId === currentUserId)?.level}
                </div>
              </div>
              <div className="font-bold text-primary">
                {sortedEntries.find(e => e.userId === currentUserId)?.totalPoints} pts
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;