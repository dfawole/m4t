import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SkillTreeGraph from '@/components/course/SkillTreeGraph';
import { useAuth } from '@/hooks/useAuth';
import { Award, Flame, Star, TrendingUp, Trophy, Zap } from 'lucide-react';
import UserAchievements from '@/components/gamification/UserAchievements';
import Leaderboard from '@/components/gamification/Leaderboard';
import { DailyStreak, DailyChallenge } from '@/components/gamification/DailyChallenge';
import LevelProgress from '@/components/gamification/LevelProgress';

// Sample 3D skill tree data for the demo
const sampleSkillTreeData = {
  nodes: [
    {
      id: 'html',
      name: 'HTML Fundamentals',
      level: 1,
      status: 'completed',
      type: 'skill',
      description: 'Learn the basics of HTML markup language',
      color: '#38a169',
      size: 1.5
    },
    {
      id: 'css',
      name: 'CSS Styling',
      level: 1,
      status: 'completed',
      type: 'skill',
      description: 'Master CSS styling for beautiful websites',
      color: '#38a169',
      size: 1.5
    },
    {
      id: 'js_basics',
      name: 'JavaScript Basics',
      level: 2,
      status: 'completed',
      type: 'skill',
      description: 'Core JavaScript programming concepts',
      color: '#38a169',
      size: 1.5
    },
    {
      id: 'dom',
      name: 'DOM Manipulation',
      level: 2,
      status: 'available',
      type: 'skill',
      description: 'Control web pages with JavaScript',
      color: '#3182ce',
      size: 1.5
    },
    {
      id: 'responsive',
      name: 'Responsive Design',
      level: 2,
      status: 'available',
      type: 'skill',
      description: 'Build sites that work on any device',
      color: '#3182ce',
      size: 1.5
    },
    {
      id: 'react_basics',
      name: 'React Basics',
      level: 3,
      status: 'locked',
      type: 'skill',
      description: 'Introduction to the React framework',
      color: '#718096',
      size: 1.5
    },
    {
      id: 'react_hooks',
      name: 'React Hooks',
      level: 3,
      status: 'locked',
      type: 'skill',
      description: 'State management with React Hooks',
      color: '#718096',
      size: 1.5
    },
    {
      id: 'node_basics',
      name: 'Node.js Basics',
      level: 4,
      status: 'locked',
      type: 'skill',
      description: 'Server-side JavaScript with Node.js',
      color: '#718096',
      size: 1.5
    },
    {
      id: 'api',
      name: 'API Development',
      level: 4,
      status: 'locked',
      type: 'skill',
      description: 'Create RESTful APIs with Express',
      color: '#718096',
      size: 1.5
    },
    {
      id: 'database',
      name: 'Database Integration',
      level: 4,
      status: 'locked',
      type: 'skill',
      description: 'Connecting to databases in your apps',
      color: '#718096',
      size: 1.5
    }
  ],
  links: [
    { source: 'html', target: 'css', color: '#38a169' },
    { source: 'html', target: 'js_basics', color: '#38a169' },
    { source: 'css', target: 'responsive', color: '#3182ce' },
    { source: 'js_basics', target: 'dom', color: '#3182ce' },
    { source: 'js_basics', target: 'react_basics', color: '#718096' },
    { source: 'dom', target: 'react_basics', color: '#718096' },
    { source: 'react_basics', target: 'react_hooks', color: '#718096' },
    { source: 'react_basics', target: 'node_basics', color: '#718096' },
    { source: 'node_basics', target: 'api', color: '#718096' },
    { source: 'api', target: 'database', color: '#718096' }
  ]
};

// Sample gamification data for the demo
const sampleGamificationData = {
  badges: [
    {
      id: 1,
      badge: {
        id: 1,
        name: "First Lesson Completed",
        description: "Completed your first lesson",
        imageUrl: "https://via.placeholder.com/64",
        category: "achievement",
        pointsValue: 10
      },
      earnedAt: "2025-05-15T12:30:00Z"
    },
    {
      id: 2,
      badge: {
        id: 2,
        name: "Coding Streak",
        description: "Maintained a 3-day learning streak",
        imageUrl: "https://via.placeholder.com/64",
        category: "achievement",
        pointsValue: 25
      },
      earnedAt: "2025-05-17T14:20:00Z"
    },
    {
      id: 3,
      badge: {
        id: 3,
        name: "JavaScript Novice",
        description: "Completed the JavaScript basics module",
        imageUrl: "https://via.placeholder.com/64",
        category: "skill",
        pointsValue: 50
      },
      earnedAt: "2025-05-18T09:45:00Z"
    }
  ],
  points: {
    userId: "test-user-1",
    totalPoints: 215,
    level: 3,
    pointsToNextLevel: 85
  },
  pointHistory: [
    {
      id: 1,
      userId: "test-user-1",
      points: 10,
      description: "Completed HTML basics lesson",
      transactionType: "lesson_completion",
      relatedEntityType: "lesson",
      relatedEntityId: "101",
      createdAt: "2025-05-15T10:30:00Z"
    },
    {
      id: 2,
      userId: "test-user-1",
      points: 25,
      description: "Earned Coding Streak badge",
      transactionType: "badge_earned",
      relatedEntityType: "badge",
      relatedEntityId: "2",
      createdAt: "2025-05-17T14:20:00Z"
    },
    {
      id: 3,
      userId: "test-user-1",
      points: 50,
      description: "Completed JavaScript Basics module",
      transactionType: "module_completion",
      relatedEntityType: "module",
      relatedEntityId: "3",
      createdAt: "2025-05-18T09:45:00Z"
    }
  ],
  streak: {
    userId: "test-user-1",
    currentStreak: 5,
    longestStreak: 7,
    lastActivityDate: new Date().toISOString()
  },
  activeChallenges: [
    {
      id: 1,
      userId: "test-user-1", 
      challengeId: 101,
      progress: 50,
      isCompleted: false,
      challenge: {
        id: 101,
        title: "Complete 5 Lessons",
        description: "Complete at least 5 lessons this week to earn bonus points",
        type: "weekly",
        pointsReward: 100
      }
    },
    {
      id: 2,
      userId: "test-user-1",
      challengeId: 102,
      progress: 0,
      isCompleted: false,
      challenge: {
        id: 102,
        title: "Daily Learning",
        description: "Complete at least one lesson today",
        type: "daily",
        pointsReward: 30
      }
    }
  ],
  completedChallenges: [
    {
      id: 3,
      userId: "test-user-1",
      challengeId: 103,
      progress: 100,
      isCompleted: true,
      challenge: {
        id: 103,
        title: "Share Knowledge",
        description: "Answer a question in the community forum",
        type: "weekly",
        pointsReward: 50
      }
    }
  ],
  leaderboard: [
    { userId: "user-5", username: "CodingMaster", totalPoints: 752, level: 8 },
    { userId: "user-2", username: "WebDevPro", totalPoints: 583, level: 6 },
    { userId: "test-user-1", username: "You", totalPoints: 215, level: 3 },
    { userId: "user-3", username: "LearnerOne", totalPoints: 189, level: 2 },
    { userId: "user-4", username: "DevNewbie", totalPoints: 127, level: 2 }
  ]
};

const FeatureShowcase: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('3d-skill-tree');
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    console.log("Node clicked:", node);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Feature Showcase</h1>
          <p className="text-gray-600 mt-2">
            Explore our gamification system and 3D skill tree visualization
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="3d-skill-tree">3D Skill Tree</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
          </TabsList>

          {/* 3D Skill Tree Tab */}
          <TabsContent value="3d-skill-tree" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="h-[500px] overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <SkillTreeGraph
                      courseId={123}
                      initialData={sampleSkillTreeData}
                      onNodeClick={handleNodeClick}
                      userProgress={{
                        completedNodes: ['html', 'css', 'js_basics'],
                        totalProgress: 30,
                        currentNode: 'dom'
                      }}
                      showProgressSummary={true}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Information</CardTitle>
                    <CardDescription>
                      {selectedNode ? 'Explore details about this skill' : 'Click on a node to view details'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedNode ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{selectedNode.name}</h3>
                          <p className="text-gray-600 text-sm">{selectedNode.description}</p>
                        </div>
                        <div className="flex items-center">
                          <div className={`px-2 py-1 rounded text-xs ${
                            selectedNode.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : selectedNode.status === 'available'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedNode.status === 'completed' 
                              ? 'Completed' 
                              : selectedNode.status === 'available'
                                ? 'Available'
                                : 'Locked'}
                          </div>
                          <div className="ml-3 text-sm text-gray-600">
                            Level {selectedNode.level}
                          </div>
                        </div>

                        {selectedNode.status === 'available' && (
                          <Button className="w-full">
                            Start Learning
                          </Button>
                        )}
                        
                        {selectedNode.status === 'completed' && (
                          <Button variant="outline" className="w-full">
                            Review Content
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-12 w-12 mb-2" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" 
                          />
                        </svg>
                        <p className="text-sm text-center">Click on a skill node to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall progress</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: '30%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>3 of 10 skills completed</span>
                        <span>Level 2/4</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>How to Use the 3D Skill Tree</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Navigate</h3>
                      <p className="text-sm text-gray-600">
                        Drag to rotate, scroll to zoom, and right-click to pan around the skill tree. This gives you a complete view of your learning path.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Explore Skills</h3>
                      <p className="text-sm text-gray-600">
                        Click on any node to view details about that skill. Green nodes are completed, blue are available, and gray are locked.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Track Progress</h3>
                      <p className="text-sm text-gray-600">
                        See your current position in the learning path and what skills you need to unlock next to progress further.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification" className="space-y-6">
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
                      <span className="font-bold">{sampleGamificationData.points.level}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                        <span>Total Points</span>
                      </div>
                      <span className="font-bold">{sampleGamificationData.points.totalPoints}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-purple-500 mr-2" />
                        <span>Badges Earned</span>
                      </div>
                      <span className="font-bold">{sampleGamificationData.badges.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Flame className="h-5 w-5 text-red-500 mr-2" />
                        <span>Current Streak</span>
                      </div>
                      <span className="font-bold">{sampleGamificationData.streak.currentStreak} days</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Daily Streak */}
              <div className="md:col-span-1">
                <DailyStreak
                  currentStreak={sampleGamificationData.streak.currentStreak}
                  longestStreak={sampleGamificationData.streak.longestStreak}
                  lastActivity={new Date(sampleGamificationData.streak.lastActivityDate)}
                  onCheckIn={() => alert('Streak check-in registered!')}
                  canCheckInToday={false}
                />
              </div>
              
              {/* Daily Challenge */}
              <div className="md:col-span-1">
                <DailyChallenge
                  challenge={{
                    id: sampleGamificationData.activeChallenges[1].challenge.id,
                    title: sampleGamificationData.activeChallenges[1].challenge.title,
                    description: sampleGamificationData.activeChallenges[1].challenge.description,
                    pointsReward: sampleGamificationData.activeChallenges[1].challenge.pointsReward,
                    progress: sampleGamificationData.activeChallenges[1].progress,
                    isCompleted: sampleGamificationData.activeChallenges[1].isCompleted,
                  }}
                  onViewChallenge={() => alert('Viewing challenge details!')}
                />
              </div>
            </div>
            
            {/* Level Progress and Leaderboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Level Progress */}
              <div className="md:col-span-2">
                <LevelProgress
                  currentLevel={sampleGamificationData.points.level}
                  totalPoints={sampleGamificationData.points.totalPoints}
                  pointsToNextLevel={sampleGamificationData.points.pointsToNextLevel}
                />
              </div>
              
              {/* Leaderboard */}
              <div className="md:col-span-1">
                <Leaderboard 
                  entries={sampleGamificationData.leaderboard}
                  currentUserId="test-user-1"
                  isLoading={false}
                  title="Top Learners"
                  description="This month's leaders"
                />
              </div>
            </div>
            
            {/* User Achievements */}
            <UserAchievements
              badges={sampleGamificationData.badges}
              points={sampleGamificationData.points}
              pointHistory={sampleGamificationData.pointHistory}
              streak={sampleGamificationData.streak}
              activeChallenges={sampleGamificationData.activeChallenges}
              completedChallenges={sampleGamificationData.completedChallenges}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>How Gamification Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Earn Points</h3>
                      <p className="text-sm text-gray-600">
                        Complete lessons, quizzes, and assignments to earn points. Track your progress and advance through levels as you learn.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Unlock Badges</h3>
                      <p className="text-sm text-gray-600">
                        Earn badges by completing achievements, reaching milestones, and demonstrating your skills. Showcase them on your profile.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Complete Challenges</h3>
                      <p className="text-sm text-gray-600">
                        Take on daily and weekly challenges to earn bonus points. Maintain your streak by studying regularly.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeatureShowcase;