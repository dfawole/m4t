import { storage } from "./storage";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { badges, challenges } from "@shared/schema";

// Function to initialize the gamification system with starter data
export async function initializeGamification() {
  console.log("Initializing gamification system...");
  
  // Check if badges already exist
  const existingBadges = await db.select().from(badges);
  
  if (existingBadges.length === 0) {
    console.log("Creating starter badges...");
    
    // Create achievement badges
    await createAchievementBadges();
    
    // Create skill badges
    await createSkillBadges();
    
    // Create participation badges
    await createParticipationBadges();
    
    console.log("Badges created successfully.");
  } else {
    console.log(`Found ${existingBadges.length} existing badges, skipping badge creation.`);
  }
  
  // Check if challenges already exist
  const existingChallenges = await db.select().from(challenges);
  
  if (existingChallenges.length === 0) {
    console.log("Creating starter challenges...");
    
    // Create daily challenges
    await createDailyChallenges();
    
    // Create weekly challenges
    await createWeeklyChallenges();
    
    // Create course-specific challenges
    await createCourseSpecificChallenges();
    
    console.log("Challenges created successfully.");
  } else {
    console.log(`Found ${existingChallenges.length} existing challenges, skipping challenge creation.`);
  }
  
  console.log("Gamification system initialization complete.");
}

// Helper function to create achievement badges
async function createAchievementBadges() {
  const achievementBadges = [
    {
      name: "Course Completer",
      description: "Complete your first course",
      imageUrl: "/assets/badges/course-completer.svg",
      category: "achievement",
      pointsValue: 100,
      criteria: { type: "course_completion", count: 1 }
    },
    {
      name: "Learning Enthusiast",
      description: "Complete 5 courses",
      imageUrl: "/assets/badges/learning-enthusiast.svg", 
      category: "achievement",
      pointsValue: 250,
      criteria: { type: "course_completion", count: 5 }
    },
    {
      name: "Knowledge Master",
      description: "Complete 10 courses",
      imageUrl: "/assets/badges/knowledge-master.svg",
      category: "achievement",
      pointsValue: 500,
      criteria: { type: "course_completion", count: 10 }
    },
    {
      name: "Perfect Quiz",
      description: "Get a perfect score on a quiz",
      imageUrl: "/assets/badges/perfect-quiz.svg",
      category: "achievement",
      pointsValue: 50,
      criteria: { type: "quiz_perfect_score", count: 1 }
    },
    {
      name: "Quiz Master",
      description: "Get a perfect score on 10 quizzes",
      imageUrl: "/assets/badges/quiz-master.svg",
      category: "achievement",
      pointsValue: 200,
      criteria: { type: "quiz_perfect_score", count: 10 }
    }
  ];
  
  for (const badge of achievementBadges) {
    await storage.createBadge(badge);
  }
}

// Helper function to create skill badges
async function createSkillBadges() {
  const skillBadges = [
    {
      name: "JavaScript Basics",
      description: "Demonstrate fundamental JavaScript skills",
      imageUrl: "/assets/badges/javascript-basics.svg",
      category: "skill",
      pointsValue: 75,
      criteria: { type: "skill_assessment", skill: "javascript", level: "basic" }
    },
    {
      name: "React Developer",
      description: "Demonstrate React development skills",
      imageUrl: "/assets/badges/react-developer.svg",
      category: "skill",
      pointsValue: 100,
      criteria: { type: "skill_assessment", skill: "react", level: "intermediate" }
    },
    {
      name: "Data Analysis",
      description: "Demonstrate data analysis skills",
      imageUrl: "/assets/badges/data-analysis.svg",
      category: "skill",
      pointsValue: 100,
      criteria: { type: "skill_assessment", skill: "data_analysis", level: "intermediate" }
    },
    {
      name: "Leadership Skills",
      description: "Demonstrate strong leadership capabilities",
      imageUrl: "/assets/badges/leadership.svg",
      category: "skill",
      pointsValue: 150,
      criteria: { type: "skill_assessment", skill: "leadership", level: "advanced" }
    },
    {
      name: "Full-Stack Developer",
      description: "Demonstrate full-stack development expertise",
      imageUrl: "/assets/badges/fullstack-developer.svg",
      category: "skill",
      pointsValue: 200,
      criteria: { type: "skill_assessment", skill: "fullstack", level: "advanced" }
    }
  ];
  
  for (const badge of skillBadges) {
    await storage.createBadge(badge);
  }
}

// Helper function to create participation badges
async function createParticipationBadges() {
  const participationBadges = [
    {
      name: "Week Streak",
      description: "Maintained a 7-day learning streak",
      imageUrl: "/assets/badges/week-streak.svg",
      category: "participation",
      pointsValue: 50,
      criteria: { type: "login_streak", days: 7 }
    },
    {
      name: "Month Streak",
      description: "Maintained a 30-day learning streak",
      imageUrl: "/assets/badges/month-streak.svg",
      category: "participation",
      pointsValue: 200,
      criteria: { type: "login_streak", days: 30 }
    },
    {
      name: "Discussion Starter",
      description: "Started a discussion in the course forum",
      imageUrl: "/assets/badges/discussion-starter.svg",
      category: "participation",
      pointsValue: 25,
      criteria: { type: "forum_post", count: 1 }
    },
    {
      name: "Helpful Peer",
      description: "Received 10 upvotes on your forum responses",
      imageUrl: "/assets/badges/helpful-peer.svg",
      category: "participation",
      pointsValue: 100,
      criteria: { type: "forum_upvotes", count: 10 }
    },
    {
      name: "Challenge Champion",
      description: "Completed 10 daily challenges",
      imageUrl: "/assets/badges/challenge-champion.svg",
      category: "participation",
      pointsValue: 150,
      criteria: { type: "challenge_completion", count: 10 }
    }
  ];
  
  for (const badge of participationBadges) {
    await storage.createBadge(badge);
  }
}

// Helper function to create daily challenges
async function createDailyChallenges() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const dailyChallenges = [
    {
      title: "Complete a Lesson",
      description: "Complete at least one lesson today",
      type: "daily",
      pointsReward: 30,
      startDate: today,
      endDate: tomorrow,
      isActive: true,
      criteria: { type: "lesson_completion", count: 1 }
    },
    {
      title: "Take a Quiz",
      description: "Complete at least one quiz today",
      type: "daily",
      pointsReward: 40,
      startDate: today,
      endDate: tomorrow,
      isActive: true,
      criteria: { type: "quiz_completion", count: 1 }
    },
    {
      title: "Study Session",
      description: "Spend at least 20 minutes learning today",
      type: "daily",
      pointsReward: 25,
      startDate: today,
      endDate: tomorrow,
      isActive: true,
      criteria: { type: "time_spent", minutes: 20 }
    },
    {
      title: "Forum Participation",
      description: "Post a comment or question in the course forum",
      type: "daily",
      pointsReward: 20,
      startDate: today,
      endDate: tomorrow,
      isActive: true,
      criteria: { type: "forum_post", count: 1 }
    }
  ];
  
  for (const challenge of dailyChallenges) {
    await storage.createChallenge(challenge);
  }
}

// Helper function to create weekly challenges
async function createWeeklyChallenges() {
  const today = new Date();
  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);
  
  const weeklyChallenges = [
    {
      title: "Course Explorer",
      description: "Start at least 2 new courses this week",
      type: "weekly",
      pointsReward: 100,
      startDate: today,
      endDate: weekLater,
      isActive: true,
      criteria: { type: "course_start", count: 2 }
    },
    {
      title: "Knowledge Builder",
      description: "Complete at least 10 lessons this week",
      type: "weekly",
      pointsReward: 150,
      startDate: today,
      endDate: weekLater,
      isActive: true,
      criteria: { type: "lesson_completion", count: 10 }
    },
    {
      title: "Perfect Score Challenge",
      description: "Get a perfect score on at least 3 quizzes this week",
      type: "weekly",
      pointsReward: 200,
      startDate: today,
      endDate: weekLater,
      isActive: true,
      criteria: { type: "quiz_perfect_score", count: 3 }
    },
    {
      title: "5-Day Streak",
      description: "Maintain a learning streak for 5 days this week",
      type: "weekly",
      pointsReward: 125,
      startDate: today,
      endDate: weekLater,
      isActive: true,
      criteria: { type: "login_streak", days: 5 }
    }
  ];
  
  for (const challenge of weeklyChallenges) {
    await storage.createChallenge(challenge);
  }
}

// Helper function to create course-specific challenges
async function createCourseSpecificChallenges() {
  // Get a few course IDs to create challenges for
  const courses = await db.query.courses.findMany({
    limit: 5,
  });
  
  if (courses.length === 0) {
    console.log("No courses found. Skipping course-specific challenges.");
    return;
  }
  
  for (const course of courses) {
    const courseChallenge = {
      title: `${course.title} Mastery`,
      description: `Complete all lessons in the ${course.title} course`,
      type: "course-specific",
      pointsReward: 300,
      isActive: true,
      criteria: { type: "course_completion", courseId: course.id }
    };
    
    await storage.createChallenge(courseChallenge);
  }
}