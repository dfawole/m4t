import { db } from "./db";
import { 
  users, courses, lessons, subscriptionPlans, enrollments, 
  categories, modules, badges, challenges 
} from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDeploymentDatabase() {
  console.log("Starting deployment database seeding...");

  try {
    // Create subscription plans
    await createSubscriptionPlans();
    
    // Create essential admin accounts
    await createAdminAccounts();
    
    // Create course categories
    await createCategories();
    
    // Create sample courses with authentic educational content
    await createSampleCourses();
    
    // Initialize gamification system
    await initializeGamification();
    
    console.log("Deployment database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error during deployment seeding:", error);
    throw error;
  }
}

async function createSubscriptionPlans() {
  console.log("Creating subscription plans...");
  
  const plans = [
    {
      name: "Basic",
      description: "Essential learning features for individuals",
      price: "19.99",
      period: "monthly" as const,
      features: JSON.stringify([
        "Access to basic courses",
        "Progress tracking",
        "Mobile app access",
        "Email support"
      ]),
      isActive: true,
      maxUsers: 1
    },
    {
      name: "Professional", 
      description: "Advanced learning with certifications",
      price: "49.99",
      period: "monthly" as const,
      features: JSON.stringify([
        "Access to all courses",
        "Certificates of completion",
        "Advanced analytics",
        "Priority support",
        "Offline downloads"
      ]),
      isActive: true,
      maxUsers: 1
    },
    {
      name: "Enterprise",
      description: "Full platform access for teams",
      price: "99.99", 
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
      maxUsers: 100
    }
  ];

  for (const plan of plans) {
    await db.insert(subscriptionPlans).values(plan).onConflictDoNothing();
  }
}

async function createAdminAccounts() {
  console.log("Creating essential admin accounts...");
  
  const adminUsers = [
    {
      id: "admin",
      email: "admin@m4t.com",
      password: await hashPassword("admin123"),
      firstName: "System",
      lastName: "Administrator", 
      role: "admin" as const,
      isEmailVerified: true
    },
    {
      id: "instructor",
      email: "instructor@m4t.com",
      password: await hashPassword("instructor123"),
      firstName: "Lead",
      lastName: "Instructor",
      role: "instructor" as const,
      isEmailVerified: true
    }
  ];

  for (const user of adminUsers) {
    await db.insert(users).values(user).onConflictDoNothing();
  }
}

async function createCategories() {
  console.log("Creating course categories...");
  
  const courseCategories = [
    {
      name: "Technology",
      description: "Programming, web development, and IT skills",
      slug: "technology"
    },
    {
      name: "Business", 
      description: "Management, finance, and entrepreneurship",
      slug: "business"
    },
    {
      name: "Design",
      description: "UI/UX, graphic design, and creative skills", 
      slug: "design"
    },
    {
      name: "Marketing",
      description: "Digital marketing and growth strategies",
      slug: "marketing"
    }
  ];

  for (const category of courseCategories) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
}

async function createSampleCourses() {
  console.log("Creating sample courses...");
  
  const sampleCourses = [
    {
      title: "Introduction to Web Development",
      description: "Learn HTML, CSS, and JavaScript fundamentals for modern web applications",
      instructorId: "instructor",
      categoryId: 1,
      level: "beginner" as const,
      duration: 480,
      price: "49.99",
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    },
    {
      title: "Business Strategy Fundamentals", 
      description: "Core principles of strategic business planning and execution",
      instructorId: "instructor",
      categoryId: 2,
      level: "intermediate" as const,
      duration: 360,
      price: "79.99",
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    {
      title: "UI/UX Design Principles",
      description: "Modern design thinking and user experience best practices",
      instructorId: "instructor", 
      categoryId: 3,
      level: "beginner" as const,
      duration: 420,
      price: "59.99",
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5"
    }
  ];

  for (const course of sampleCourses) {
    await db.insert(courses).values(course).onConflictDoNothing();
  }

  // Create sample lessons
  await createSampleLessons();
}

async function createSampleLessons() {
  console.log("Creating sample lessons...");
  
  const sampleLessons = [
    {
      courseId: 1,
      moduleId: 1,
      title: "HTML Fundamentals",
      description: "Understanding HTML structure and semantic markup",
      content: "Learn the essential building blocks of web pages including HTML elements, document structure, and semantic markup for accessibility and SEO.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 45,
      orderIndex: 1,
      isPublished: true
    },
    {
      courseId: 1,
      moduleId: 1, 
      title: "CSS Styling and Layout",
      description: "Master CSS for responsive web design",
      content: "Comprehensive guide to CSS selectors, properties, flexbox, grid, and responsive design principles for modern web applications.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      duration: 52,
      orderIndex: 2,
      isPublished: true
    },
    {
      courseId: 2,
      moduleId: 2,
      title: "Strategic Planning Framework", 
      description: "Introduction to strategic business planning methodologies",
      content: "Learn proven frameworks for developing effective business strategies including SWOT analysis, competitive positioning, and strategic execution.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: 38,
      orderIndex: 1,
      isPublished: true
    },
    {
      courseId: 3,
      moduleId: 3,
      title: "Design Thinking Process",
      description: "User-centered design methodology and process",
      content: "Master the five-stage design thinking process: empathize, define, ideate, prototype, and test for creating user-centered solutions.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: 41,
      orderIndex: 1,
      isPublished: true
    }
  ];

  for (const lesson of sampleLessons) {
    await db.insert(lessons).values(lesson).onConflictDoNothing();
  }
}

async function initializeGamification() {
  console.log("Initializing gamification system...");
  
  // Create achievement badges
  const achievementBadges = [
    {
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "trophy",
      category: "achievement",
      requirements: JSON.stringify({ lessonsCompleted: 1 }),
      pointsValue: 10,
      isActive: true
    },
    {
      name: "Course Master",
      description: "Complete your first course",
      icon: "graduation-cap", 
      category: "achievement",
      requirements: JSON.stringify({ coursesCompleted: 1 }),
      pointsValue: 100,
      isActive: true
    },
    {
      name: "Learning Streak",
      description: "Maintain a 7-day learning streak",
      icon: "flame",
      category: "achievement", 
      requirements: JSON.stringify({ streakDays: 7 }),
      pointsValue: 50,
      isActive: true
    }
  ];

  for (const badge of achievementBadges) {
    await db.insert(badges).values(badge).onConflictDoNothing();
  }

  // Create daily challenges
  const dailyChallenges = [
    {
      title: "Daily Lesson Challenge",
      description: "Complete one lesson today",
      type: "daily",
      requirements: JSON.stringify({ lessonsCompleted: 1 }),
      pointsReward: 25,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      title: "Learning Time Challenge",
      description: "Spend 30 minutes learning today", 
      type: "daily",
      requirements: JSON.stringify({ watchTimeMinutes: 30 }),
      pointsReward: 20,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ];

  for (const challenge of dailyChallenges) {
    await db.insert(challenges).values(challenge).onConflictDoNothing();
  }
}

// Command line execution
if (require.main === module) {
  seedDeploymentDatabase()
    .then(() => {
      console.log("Deployment seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Deployment seeding failed:", error);
      process.exit(1);
    });
}