import { db } from "./db";
import { 
  users, courses, lessons, subscriptionPlans, enrollments, 
  userProgress, categories, modules, badges, challenges 
} from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedProductionDatabase() {
  console.log("Starting production database seeding...");

  try {
    // 1. Create subscription plans
    await seedSubscriptionPlans();
    
    // 2. Create essential admin accounts
    await seedAdminAccounts();
    
    // 3. Create course categories
    await seedCategories();
    
    // 4. Create sample courses with real educational content
    await seedSampleCourses();
    
    // 5. Initialize gamification system
    await seedGamificationSystem();
    
    console.log("Production database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error during production seeding:", error);
    throw error;
  }
}

async function seedSubscriptionPlans() {
  console.log("Creating subscription plans...");
  
  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential learning features",
      price: 19.99,
      period: "monthly" as const,
      features: JSON.stringify([
        "Access to basic courses",
        "Progress tracking",
        "Mobile app access",
        "Email support"
      ]),
      isActive: true,
      maxUsers: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "professional",
      name: "Professional",
      description: "Advanced learning with certifications",
      price: 49.99,
      period: "monthly" as const,
      features: JSON.stringify([
        "Access to all courses",
        "Certificates of completion",
        "Advanced analytics",
        "Priority support",
        "Offline downloads"
      ]),
      isActive: true,
      maxUsers: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Full platform access for teams",
      price: 99.99,
      period: "monthly" as const,
      features: JSON.stringify([
        "Unlimited course access",
        "Team management",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Advanced reporting"
      ]),
      isActive: true,
      maxUsers: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const plan of plans) {
    await db.insert(subscriptionPlans).values(plan).onConflictDoNothing();
  }
}

async function seedAdminAccounts() {
  console.log("Creating essential admin accounts...");
  
  const adminUsers = [
    {
      id: "admin",
      email: "admin@m4t.com",
      password: await hashPassword("admin123"),
      firstName: "System",
      lastName: "Administrator",
      role: "admin" as const,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "instructor",
      email: "instructor@m4t.com", 
      password: await hashPassword("instructor123"),
      firstName: "Lead",
      lastName: "Instructor",
      role: "instructor" as const,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const user of adminUsers) {
    await db.insert(users).values(user).onConflictDoNothing();
  }
}

async function seedCategories() {
  console.log("Creating course categories...");
  
  const courseCategories = [
    {
      id: 1,
      name: "Technology",
      description: "Programming, web development, and IT skills",
      slug: "technology",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "Business",
      description: "Management, finance, and entrepreneurship",
      slug: "business", 
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: "Design",
      description: "UI/UX, graphic design, and creative skills",
      slug: "design",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: "Marketing",
      description: "Digital marketing and growth strategies",
      slug: "marketing",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const category of courseCategories) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
}

async function seedSampleCourses() {
  console.log("Creating sample courses...");
  
  const sampleCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      description: "Learn HTML, CSS, and JavaScript fundamentals",
      instructorId: "instructor",
      categoryId: 1,
      level: "beginner" as const,
      duration: 480, // 8 hours
      price: 49.99,
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "Business Strategy Fundamentals",
      description: "Core principles of strategic business planning",
      instructorId: "instructor",
      categoryId: 2,
      level: "intermediate" as const,
      duration: 360, // 6 hours
      price: 79.99,
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      description: "Modern design thinking and user experience",
      instructorId: "instructor",
      categoryId: 3,
      level: "beginner" as const,
      duration: 420, // 7 hours
      price: 59.99,
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const course of sampleCourses) {
    await db.insert(courses).values(course).onConflictDoNothing();
  }

  // Create sample lessons for each course
  await seedSampleLessons();
}

async function seedSampleLessons() {
  console.log("Creating sample lessons...");
  
  const sampleLessons = [
    // Web Development Course Lessons
    {
      id: 1,
      courseId: 1,
      moduleId: 1,
      title: "HTML Fundamentals",
      description: "Understanding HTML structure and syntax",
      content: "Learn the basic building blocks of web pages with HTML elements, tags, and document structure.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 45,
      orderIndex: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      courseId: 1,
      moduleId: 1,
      title: "CSS Styling Basics",
      description: "Introduction to CSS for styling web pages",
      content: "Master CSS selectors, properties, and responsive design principles.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      duration: 52,
      orderIndex: 2,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Business Strategy Course Lessons
    {
      id: 3,
      courseId: 2,
      moduleId: 2,
      title: "Strategic Planning Overview",
      description: "Introduction to strategic business planning",
      content: "Understand the fundamentals of creating effective business strategies.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: 38,
      orderIndex: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Design Course Lessons
    {
      id: 4,
      courseId: 3,
      moduleId: 3,
      title: "Design Thinking Process",
      description: "Understanding user-centered design approach",
      content: "Learn the five stages of design thinking and how to apply them.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: 41,
      orderIndex: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const lesson of sampleLessons) {
    await db.insert(lessons).values(lesson).onConflictDoNothing();
  }
}

async function seedGamificationSystem() {
  console.log("Initializing gamification system...");
  
  // Create achievement badges
  const achievementBadges = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "trophy",
      category: "achievement",
      requirements: JSON.stringify({ lessonsCompleted: 1 }),
      points: 10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "Course Completion",
      description: "Complete your first course",
      icon: "graduation-cap",
      category: "achievement",
      requirements: JSON.stringify({ coursesCompleted: 1 }),
      points: 100,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: "flame",
      category: "achievement",
      requirements: JSON.stringify({ streakDays: 7 }),
      points: 50,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const badge of achievementBadges) {
    await db.insert(badges).values(badge).onConflictDoNothing();
  }

  // Create daily challenges
  const dailyChallenges = [
    {
      id: 1,
      title: "Complete a Lesson",
      description: "Finish any lesson today",
      type: "daily",
      requirements: JSON.stringify({ lessonsCompleted: 1 }),
      points: 25,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "Watch 30 Minutes",
      description: "Spend at least 30 minutes learning today",
      type: "daily",
      requirements: JSON.stringify({ watchTimeMinutes: 30 }),
      points: 20,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const challenge of dailyChallenges) {
    await db.insert(challenges).values(challenge).onConflictDoNothing();
  }
}

// Export for use in deployment scripts
export { seedProductionDatabase };

// Command line execution
if (require.main === module) {
  seedProductionDatabase()
    .then(() => {
      console.log("Production seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Production seeding failed:", error);
      process.exit(1);
    });
}