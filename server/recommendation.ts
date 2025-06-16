import { db } from "./db";
import { 
  users, 
  courses, 
  tags, 
  courseTags, 
  enrollments, 
  userSkills,
  courseRecommendations,
  lessonCompletions,
  lessons,
  type User,
  type Tag,
  type Course,
  type InsertCourseRecommendation
} from "@shared/schema";
import { eq, inArray, ne, sql, and, desc, gte, not, gt, count } from "drizzle-orm";

interface RecommendationOptions {
  limit?: number;
  includeCompleted?: boolean;
  difficultyMaxDelta?: number;
  considerLearningStyle?: boolean;
}

interface WeightedCourse {
  course: Course;
  score: number;
  reason: string;
}

/**
 * Generate personalized course recommendations for a user
 */
export async function generateRecommendations(
  userId: string, 
  options: RecommendationOptions = {}
): Promise<InsertCourseRecommendation[]> {
  const {
    limit = 5,
    includeCompleted = false,
    difficultyMaxDelta = 2,
    considerLearningStyle = true,
  } = options;

  try {
    // 1. Get the user and their data
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // 2. Get user's completed courses
    const completedCourseIds = await getCompletedCourses(userId);
    
    // 3. Get user's skills and proficiency levels
    const userSkillsData = await db
      .select({
        tag: tags,
        proficiencyLevel: userSkills.proficiencyLevel,
      })
      .from(userSkills)
      .innerJoin(tags, eq(userSkills.tagId, tags.id))
      .where(eq(userSkills.userId, userId));
      
    // 4. Get user's interests from profile
    const userInterests = user.interests as number[] || [];
    
    // 5. Get all eligible courses (not completed if includeCompleted=false)
    const coursesQuery = db
      .select({
        course: courses,
        tags: sql<Tag[]>`array_agg(${tags})`,
      })
      .from(courses)
      .leftJoin(courseTags, eq(courses.id, courseTags.courseId))
      .leftJoin(tags, eq(courseTags.tagId, tags.id))
      .groupBy(courses.id);
      
    if (!includeCompleted && completedCourseIds.length > 0) {
      coursesQuery.where(not(inArray(courses.id, completedCourseIds)));
    }
    
    const allCourses = await coursesQuery;
    
    // 6. Apply the recommendation algorithm
    const weightedCourses: WeightedCourse[] = [];
    
    for (const { course, tags } of allCourses) {
      let score = 0;
      let reasons: string[] = [];
      
      // a. Course difficulty match (user skill level vs course difficulty)
      const userAvgSkillLevel = getUserAverageSkillLevel(userSkillsData);
      const difficultyScore = calculateDifficultyScore(course.difficulty, userAvgSkillLevel, difficultyMaxDelta);
      score += difficultyScore * 2; // Higher weight for appropriate difficulty
      
      if (difficultyScore > 0.7) {
        reasons.push("Difficulty level matches your skill level");
      }
      
      // b. Tag/interest match
      if (tags && tags.length > 0) {
        let tagMatchScore = 0;
        
        // Check for direct skill matches
        for (const { tag, proficiencyLevel } of userSkillsData) {
          const matchingTag = tags.find(t => t.id === tag.id);
          if (matchingTag) {
            // Higher match score for skills user knows but wants to improve
            tagMatchScore += 0.5 + (proficiencyLevel < 7 ? 0.3 : 0);
            reasons.push(`Builds on your ${tag.name} skills`);
          }
        }
        
        // Check for interest matches
        for (const interestId of userInterests) {
          const matchingTag = tags.find(t => t.id === interestId);
          if (matchingTag) {
            tagMatchScore += 0.8;
            reasons.push(`Matches your interest in ${matchingTag.name}`);
          }
        }
        
        score += tagMatchScore * 3; // Higher weight for interest match
      }
      
      // c. Popularity factor (small bonus for popular courses)
      const popularity = course.popularity || 0;
      score += Math.min(1, popularity / 100) * 0.5;
      if (popularity > 50) {
        reasons.push("Popular among learners");
      }
      
      // d. Learning style match (if enabled)
      if (considerLearningStyle && user.learningPreferences) {
        const preferences = user.learningPreferences as any;
        if (preferences.style) {
          // This requires tagging courses with learning style metadata
          // For simplicity, we'll assume course has a learningStyles property
          const learningStyles = course.prerequisites as any || {};
          if (learningStyles && learningStyles.styles && 
              learningStyles.styles.includes(preferences.style)) {
            score += 1.5;
            reasons.push(`Matches your ${preferences.style} learning style`);
          }
        }
      }
      
      weightedCourses.push({
        course,
        score,
        reason: reasons.length > 0 ? reasons[0] : "Based on your learning history"
      });
    }
    
    // 7. Sort by score (descending) and take top N
    const recommendations = weightedCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
      
    // 8. Format the recommendations for storage
    return recommendations.map(rec => ({
      userId,
      courseId: rec.course.id,
      score: String(rec.score), // Convert to string for compatibility with schema
      reason: rec.reason,
      source: "algorithm",
      isViewed: false,
    }));
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
}

/**
 * Calculate how well a course difficulty matches user skill level
 */
function calculateDifficultyScore(
  courseDifficulty: number | null, 
  userSkillLevel: number, 
  maxDelta: number
): number {
  // Neutral score for unknown difficulty
  if (courseDifficulty === null) return 0.5; 
  
  // Ensure course difficulty is a number
  const difficulty = typeof courseDifficulty === 'number' ? courseDifficulty : 5;
  
  const diff = Math.abs(difficulty - userSkillLevel);
  if (diff > maxDelta) return 0; // Too easy or too hard
  
  // Perfect match = 1, decreasing as difference increases
  return Math.max(0, 1 - (diff / maxDelta));
}

/**
 * Get average skill level across all user's skills
 */
function getUserAverageSkillLevel(
  userSkillsData: { tag: Tag, proficiencyLevel: number }[]
): number {
  if (userSkillsData.length === 0) return 5; // Default mid-level
  
  const sum = userSkillsData.reduce((acc, { proficiencyLevel }) => acc + proficiencyLevel, 0);
  return sum / userSkillsData.length;
}

/**
 * Get list of courses the user has completed
 */
async function getCompletedCourses(userId: string): Promise<number[]> {
  // Get enrollments that have a completedAt date (not null)
  const completedEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(
      eq(enrollments.userId, userId)
    )
    .where(
      sql`${enrollments.completedAt} IS NOT NULL`
    );
    
  return completedEnrollments.map(e => e.courseId);
}

/**
 * Store recommendations for a user
 */
export async function storeRecommendations(
  recommendations: InsertCourseRecommendation[]
): Promise<void> {
  if (recommendations.length === 0) return;
  
  const userId = recommendations[0].userId;
  
  // Delete existing recommendations for this user
  await db
    .delete(courseRecommendations)
    .where(eq(courseRecommendations.userId, userId));
    
  // Insert new recommendations
  await db.insert(courseRecommendations).values(recommendations);
}

/**
 * Get stored recommendations for a user
 */
export async function getUserRecommendations(
  userId: string,
  limit = 10
): Promise<any[]> {
  const recommendations = await db
    .select({
      rec: courseRecommendations,
      course: courses,
    })
    .from(courseRecommendations)
    .innerJoin(courses, eq(courseRecommendations.courseId, courses.id))
    .where(eq(courseRecommendations.userId, userId))
    .orderBy(desc(courseRecommendations.score))
    .limit(limit);
    
  return recommendations.map(({ rec, course }) => ({
    ...rec,
    course,
  }));
}

/**
 * Run the recommendation generation for all active users
 */
export async function generateRecommendationsForAllUsers(): Promise<void> {
  // Find active users (had activity in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const activeUsers = await db
    .select({ id: users.id })
    .from(users)
    .innerJoin(lessonCompletions, eq(users.id, lessonCompletions.userId))
    .where(gte(lessonCompletions.completedAt, thirtyDaysAgo))
    .groupBy(users.id);
    
  console.log(`Generating recommendations for ${activeUsers.length} active users`);
  
  // Generate recommendations for each user
  for (const user of activeUsers) {
    try {
      const recommendations = await generateRecommendations(user.id);
      await storeRecommendations(recommendations);
    } catch (error) {
      console.error(`Failed to generate recommendations for user ${user.id}:`, error);
    }
  }
}