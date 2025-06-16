import { db } from './db';
import { 
  users, courses, lessons, enrollments, subscriptionPlans, userSubscriptions, companies
} from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function quickSeed() {
  console.log('Running quick seed for development...');
  
  try {
    const hashedPassword = await hashPassword('password123');

    // Create essential test users
    const testUsers = [
      { id: 'student', username: 'student', email: 'student@test.com', firstName: 'Test', lastName: 'Student', role: 'student' },
      { id: 'instructor', username: 'instructor', email: 'instructor@test.com', firstName: 'Test', lastName: 'Instructor', role: 'instructor' },
      { id: 'company', username: 'company', email: 'company@test.com', firstName: 'Test', lastName: 'Admin', role: 'company_admin' },
      { id: 'admin', username: 'admin', email: 'admin@test.com', firstName: 'Test', lastName: 'Admin', role: 'internal_admin' }
    ];

    console.log('Creating test users...');
    for (const user of testUsers) {
      await db.insert(users).values({
        ...user,
        password: hashedPassword,
        profileImageUrl: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
        isEmailVerified: true
      }).onConflictDoNothing();
    }

    // Create a sample company
    console.log('Creating test company...');
    await db.insert(companies).values({
      id: 1,
      name: 'Test Company Inc.',
      email: 'contact@testcompany.com',
      phone: '+1-555-0123'
    }).onConflictDoNothing();

    // Create basic subscription plan
    console.log('Creating subscription plan...');
    const [plan] = await db.insert(subscriptionPlans).values({
      name: 'Basic Plan',
      description: 'Basic access for testing',
      price: 9.99,
      interval: 'month',
      features: ['Basic features'],
      isActive: true
    }).onConflictDoNothing().returning();

    // Create a sample course
    console.log('Creating sample course...');
    const [course] = await db.insert(courses).values({
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      shortDescription: 'Web development fundamentals',
      instructorId: 'instructor',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500',
      price: 49.99,
      currency: 'USD',
      level: 'beginner',
      duration: 20,
      category: 'Web Development',
      tags: ['HTML', 'CSS', 'JavaScript'],
      isPublished: true,
      language: 'English',
      estimatedHours: 20,
      studentsCount: 150,
      rating: 4.5,
      reviewsCount: 45
    }).onConflictDoNothing().returning();

    if (course) {
      // Create sample lessons
      const lessons = [
        { title: 'HTML Basics', content: 'Introduction to HTML structure and elements', duration: 30 },
        { title: 'CSS Styling', content: 'Learn to style web pages with CSS', duration: 45 },
        { title: 'JavaScript Fundamentals', content: 'Programming basics with JavaScript', duration: 60 }
      ];

      console.log('Creating sample lessons...');
      for (let i = 0; i < lessons.length; i++) {
        await db.insert(lessons).values({
          courseId: course.id,
          title: lessons[i].title,
          content: lessons[i].content,
          videoUrl: `https://example.com/video${i + 1}.mp4`,
          duration: lessons[i].duration,
          orderIndex: i + 1,
          isPreview: i === 0
        }).onConflictDoNothing();
      }

      // Enroll student in course
      console.log('Creating sample enrollment...');
      await db.insert(enrollments).values({
        userId: 'student',
        courseId: course.id,
        enrolledAt: new Date(),
        progress: 35,
        lastAccessedAt: new Date()
      }).onConflictDoNothing();
    }

    console.log('Quick seed completed successfully!');
    console.log('Test accounts created:');
    console.log('- student / password123');
    console.log('- instructor / password123');
    console.log('- company / password123');
    console.log('- admin / password123');

  } catch (error) {
    console.error('Quick seed failed:', error);
    throw error;
  }
}

if (require.main === module) {
  quickSeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { quickSeed };