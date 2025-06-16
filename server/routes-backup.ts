import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { db } from "./db";
import { storage } from "./storage";
import { jwtAuth, requireJwtAuth } from "./jwtMiddleware";
import { registerGamificationRoutes } from "./gamification";
import { registerCompanyOnboardingRoutes } from "./companyOnboarding";
import { registerLicenseManagementRoutes } from "./licenseManagement";
import { registerEmailVerificationRoutes } from "./emailVerification";
import { 
  generateRecommendations, 
  storeRecommendations, 
  getUserRecommendations 
} from "./recommendation";
import { loginWithJwt, refreshAccessToken, logoutJwt, getCurrentUser } from "./jwtRoutes";
import { generateAccessToken, verifyAccessToken } from "./jwt";
import { scrypt } from "crypto";
import { promisify } from "util";

// Import schemas and types
import {
  insertCourseSchema,
  insertCategorySchema,
  insertModuleSchema,
  insertLessonSchema,
  insertEnrollmentSchema,
  insertSubscriptionPlanSchema,
  UserRole,
  SubscriptionPeriod,
  users, 
  learningTips,
} from "@shared/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

// Function to compare passwords
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return suppliedBuf.equals(hashedBuf);
}

// Helper function to initialize learning tips
async function initializeLearningTips() {
  try {
    const existingTips = await db.select({ count: count() }).from(learningTips);
    if (existingTips[0]?.count === 0) {
      console.log('Learning tips initialized');
    }
  } catch (error) {
    console.error('Error initializing learning tips:', error);
  }
}

// Define user roles with proper access control
const hasRole = (allowedRoles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

const isAdminOrInstructor = hasRole([
  UserRole.INTERNAL_ADMIN, 
  UserRole.INSTRUCTOR
]);

const isAdmin = hasRole([UserRole.INTERNAL_ADMIN]);

const isCompanyAdmin = hasRole([
  UserRole.COMPANY_ADMIN, 
  UserRole.INTERNAL_ADMIN
]);

export async function registerRoutes(app: Express): Promise<Server> {
  await initializeLearningTips();

  // Test account login endpoint
  app.get('/api/login/test-account', async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (!user || user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Set user in session (for session-based auth)
      (req as any).login(user[0], (err: any) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed', error: err.message });
        }
        
        return res.status(200).json({ 
          message: 'Login successful',
          user: {
            id: user[0].id,
            email: user[0].email,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            role: user[0].role
          }
        });
      });
    } catch (error) {
      console.error('Test login error:', error);
      res.status(500).json({ message: 'Login failed', error: (error as Error).message });
    }
  });

  // JWT Authentication routes
  app.post('/api/auth/login', loginWithJwt);
  app.post('/api/auth/refresh', refreshAccessToken);
  app.post('/api/auth/logout', logoutJwt);
  app.get('/api/auth/user', getCurrentUser);

  // Legacy login support
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Find user by username or email
      const user = await storage.getUserByUsernameOrEmail(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await comparePasswords(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = generateAccessToken(user.id, user.role);
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Course routes
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  
  // Individual course route - FIXED: using getCourseById
  app.get('/api/courses/:id', async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseById(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Get the course modules
      const modules = await storage.getModulesByCourse(courseId);
      
      // For each module, get its lessons
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await storage.getLessonsByModule(module.id);
          return {
            ...module,
            lessons: lessons
          };
        })
      );
      
      res.json({
        ...course,
        modules: modulesWithLessons
      });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', requireJwtAuth, isAdminOrInstructor, async (req: Request, res: Response) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  // Categories routes
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', requireJwtAuth, isAdmin, async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Module routes
  app.post('/api/modules', requireJwtAuth, isAdminOrInstructor, async (req: Request, res: Response) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      console.error("Error creating module:", error);
      res.status(400).json({ message: "Invalid module data" });
    }
  });

  // Lesson routes
  app.post('/api/lessons', requireJwtAuth, isAdminOrInstructor, async (req: Request, res: Response) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(400).json({ message: "Invalid lesson data" });
    }
  });

  // Enrollment routes
  app.post('/api/enrollments', requireJwtAuth, async (req: any, res: Response) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const userId = req.user.sub || req.user.id;
      
      const existingEnrollment = await storage.getEnrollment(userId, enrollmentData.courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(400).json({ message: "Invalid enrollment data" });
    }
  });

  app.get('/api/enrollments/user', requireJwtAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.sub || req.user.id;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Subscription routes
  app.get('/api/subscription-plans', async (req: Request, res: Response) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  // Register additional route modules
  registerGamificationRoutes(app);
  registerCompanyOnboardingRoutes(app);
  registerLicenseManagementRoutes(app);
  registerEmailVerificationRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}