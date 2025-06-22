import { Request, Response } from "express";
import { storage } from "./storage";

// Badge endpoints
export async function getAllBadges(req: Request, res: Response) {
  try {
    const badges = await storage.getAllBadges();
    res.json(badges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Failed to fetch badges" });
  }
}

export async function getBadgesByCategory(req: Request, res: Response) {
  try {
    const { category } = req.params;
    const badges = await storage.getBadgesByCategory(category);
    res.json(badges);
  } catch (error) {
    console.error("Error fetching badges by category:", error);
    res.status(500).json({ message: "Failed to fetch badges" });
  }
}

export async function getUserBadges(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userBadges = await storage.getUserBadges(userId);
    res.json(userBadges);
  } catch (error) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({ message: "Failed to fetch user badges" });
  }
}

// Points and Level endpoints
export async function getUserPoints(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userPoints = await storage.getUserPoints(userId);
    
    // If user doesn't have points record yet, create one
    if (!userPoints) {
      const newUserPoints = await storage.createOrUpdateUserPoints(userId, {
        totalPoints: 0,
        level: 1,
        pointsToNextLevel: 100
      });
      
      return res.json(newUserPoints);
    }
    
    res.json(userPoints);
  } catch (error) {
    console.error("Error fetching user points:", error);
    res.status(500).json({ message: "Failed to fetch user points" });
  }
}

export async function getUserPointHistory(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const transactions = await storage.getUserPointTransactions(userId, limit);
    
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching point history:", error);
    res.status(500).json({ message: "Failed to fetch point history" });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const leaderboard = await storage.getUserLeaderboard(limit);
    
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
}

// Challenge endpoints
export async function getActiveChallenges(req: Request, res: Response) {
  try {
    const challenges = await storage.getActiveChallenges();
    res.json(challenges);
  } catch (error) {
    console.error("Error fetching active challenges:", error);
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
}

export async function getUserActiveChallenges(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userChallenges = await storage.getUserActiveChallenges(userId);
    res.json(userChallenges);
  } catch (error) {
    console.error("Error fetching user challenges:", error);
    res.status(500).json({ message: "Failed to fetch user challenges" });
  }
}

export async function getUserCompletedChallenges(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userChallenges = await storage.getUserCompletedChallenges(userId);
    res.json(userChallenges);
  } catch (error) {
    console.error("Error fetching completed challenges:", error);
    res.status(500).json({ message: "Failed to fetch completed challenges" });
  }
}

export async function updateChallengeProgress(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const { challengeId, progress } = req.body;
    
    if (!challengeId || typeof progress !== 'number') {
      return res.status(400).json({ message: "Invalid request data" });
    }
    
    const userChallenge = await storage.updateUserChallengeProgress(
      userId,
      challengeId,
      progress
    );
    
    // If challenge is completed (progress = 100), mark it as completed
    if (progress >= 100) {
      await storage.completeUserChallenge(userId, challengeId);
    }
    
    res.json(userChallenge);
  } catch (error) {
    console.error("Error updating challenge progress:", error);
    res.status(500).json({ message: "Failed to update challenge progress" });
  }
}

// Streak endpoints
export async function getUserStreak(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const streak = await storage.getUserStreakStats(userId);
    
    // If user doesn't have streak record yet, create one
    if (!streak) {
      const newStreak = await storage.getOrCreateUserStreak(userId);
      return res.json(newStreak);
    }
    
    res.json(streak);
  } catch (error) {
    console.error("Error fetching user streak:", error);
    res.status(500).json({ message: "Failed to fetch user streak" });
  }
}

export async function checkInStreak(req: Request, res: Response) {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Get user's current streak
    const currentStreak = await storage.getUserStreakStats(userId);
    
    // Check if user has already checked in today
    if (currentStreak) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActivity = currentStreak.lastActivityDate 
        ? new Date(currentStreak.lastActivityDate) 
        : null;
      
      if (lastActivity && lastActivity.getTime() >= today.getTime()) {
        return res.status(400).json({ 
          message: "Already checked in today",
          streak: currentStreak
        });
      }
    }
    
    // Update streak and award points
    const updatedStreak = await storage.updateUserStreak(userId, true);
    
    // Award points for check-in (more points for longer streaks)
    const streakPoints = Math.min(
      10 + (updatedStreak.currentStreak * 2),  // Base 10 points + 2 per streak day
      50  // Cap at 50 points
    );
    
    const pointsResult = await storage.addPointsToUser(
      userId,
      streakPoints,
      `Daily streak check-in (${updatedStreak.currentStreak} days)`,
      'login_streak'
    );
    
    res.json({ 
      streak: updatedStreak,
      points: pointsResult.userPoints,
      transaction: pointsResult.transaction
    });
  } catch (error) {
    console.error("Error checking in streak:", error);
    res.status(500).json({ message: "Failed to check in streak" });
  }
}

// Gamification hook functions
// These are internal functions that tie into other parts of the app

// Called when a user completes a lesson
export async function handleLessonCompletion(userId: string, lessonId: number, courseId: number, lessonTitle: string) {
  try {
    // Award points for completing a lesson
    const pointsResult = await storage.addPointsToUser(
      userId,
      20, // 20 points per lesson
      `Completed lesson: ${lessonTitle}`,
      'lesson_completion',
      'lesson',
      String(lessonId)
    );
    
    // Update any challenges related to lesson completion
    const activeChallenges = await storage.getUserActiveChallenges(userId);
    
    for (const challenge of activeChallenges) {
      // Check if challenge is related to lessons (simplified example)
      const criteria = challenge.challenge.criteria as any;
      
      if (criteria && criteria.type === 'lesson_completion') {
        // Calculate new progress
        const newProgress = Math.min(challenge.progress + 10, 100);
        
        // Update challenge progress
        await storage.updateUserChallengeProgress(
          userId,
          challenge.challengeId,
          newProgress
        );
        
        // If challenge is now complete, mark it as completed
        if (newProgress >= 100) {
          await storage.completeUserChallenge(userId, challenge.challengeId);
        }
      }
    }
    
    // Check if user has completed all lessons in a course
    const courseProgress = await storage.getUserCourseProgress(userId, courseId);
    
    if (courseProgress.completed === courseProgress.total) {
      // Award course completion badge (assuming badge ID 1 is for course completion)
      // In a real app, you would look up the badge based on course or achievement type
      await storage.awardBadgeToUser(userId, 1);
      
      // Award bonus points for course completion
      await storage.addPointsToUser(
        userId,
        100, // 100 bonus points for completing a course
        `Completed entire course`,
        'course_completion',
        'course',
        String(courseId)
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error handling lesson completion:", error);
    return { success: false, error };
  }
}

// Called when a user completes a quiz
export async function handleQuizCompletion(userId: string, quizId: number, score: number, totalQuestions: number) {
  try {
    // Calculate points based on score
    const percentage = (score / totalQuestions) * 100;
    let points = 0;
    
    if (percentage >= 90) {
      points = 50; // Excellent score
    } else if (percentage >= 75) {
      points = 30; // Good score
    } else if (percentage >= 60) {
      points = 20; // Passing score
    } else {
      points = 10; // Attempted but low score
    }
    
    // Award points
    const pointsResult = await storage.addPointsToUser(
      userId,
      points,
      `Completed quiz with score ${score}/${totalQuestions}`,
      'quiz_completed',
      'quiz',
      String(quizId)
    );
    
    // If score is perfect, award a skill badge (assuming badge ID 2 is for quiz mastery)
    if (score === totalQuestions) {
      await storage.awardBadgeToUser(userId, 2);
    }
    
    // Update any challenges related to quiz completion
    const activeChallenges = await storage.getUserActiveChallenges(userId);
    
    for (const challenge of activeChallenges) {
      // Check if challenge is related to quizzes
      const criteria = challenge.challenge.criteria as any;
      
      if (criteria && criteria.type === 'quiz_completion') {
        // Calculate new progress
        const newProgress = Math.min(challenge.progress + 25, 100);
        
        // Update challenge progress
        await storage.updateUserChallengeProgress(
          userId,
          challenge.challengeId,
          newProgress
        );
        
        // If challenge is now complete, mark it as completed
        if (newProgress >= 100) {
          await storage.completeUserChallenge(userId, challenge.challengeId);
        }
      }
    }
    
    return { success: true, points: pointsResult.userPoints };
  } catch (error) {
    console.error("Error handling quiz completion:", error);
    return { success: false, error };
  }
}

// Register gamification routes
export function registerGamificationRoutes(app: any) {
  // Badge routes
  app.get('/api/gamification/badges', getAllBadges);
  app.get('/api/gamification/badges/category/:category', getBadgesByCategory);
  app.get('/api/gamification/user/badges', getUserBadges);
  
  // Points routes
  app.get('/api/gamification/user/points', getUserPoints);
  app.get('/api/gamification/user/points/history', getUserPointHistory);
  app.get('/api/gamification/leaderboard', getLeaderboard);
  
  // Challenge routes
  app.get('/api/gamification/challenges', getActiveChallenges);
  app.get('/api/gamification/user/challenges/active', getUserActiveChallenges);
  app.get('/api/gamification/user/challenges/completed', getUserCompletedChallenges);
  app.post('/api/gamification/user/challenges/:challengeId/progress', updateChallengeProgress);
  
  // Streak routes
  app.get('/api/gamification/user/streak', getUserStreak);
  app.post('/api/gamification/user/streak/checkin', checkInStreak);
}