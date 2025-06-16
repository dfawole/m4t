import { db } from './db';
import { 
  users, courses, lessons, enrollments, modules, categories,
  subscriptionPlans, userSubscriptions, companies
} from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function seedSimpleDatabase() {
  console.log('🚀 Starting Simple Database Seeding...');

  try {
    const hashedPassword = await hashPassword('password123');

    // Clear existing data first (in safe order)
    try {
      await db.delete(userSubscriptions);
      await db.delete(enrollments);
      await db.delete(lessons);
      await db.delete(modules);
      await db.delete(courses);
      await db.delete(subscriptionPlans);
      await db.delete(users);
      await db.delete(companies);
      await db.delete(categories);
      console.log('✅ Cleared existing data');
    } catch (error) {
      console.log('⚠️ Some tables may not exist yet, continuing...');
    }

    // 1. Create Categories
    console.log('📂 Creating categories...');
    const [webDev] = await db.insert(categories).values({
      name: 'Web Development',
      description: 'Frontend and backend web development courses'
    }).returning();

    const [dataScience] = await db.insert(categories).values({
      name: 'Data Science', 
      description: 'Data analysis and machine learning courses'
    }).returning();

    // 2. Create Companies
    console.log('🏢 Creating companies...');
    const [techCorp] = await db.insert(companies).values({
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      phone: '+1-555-0123',
      address: '123 Tech Street, Silicon Valley, CA 94000',
    }).returning();

    // 3. Create Users with verified emails
    console.log('👥 Creating test users...');
    
    const testUsers = [
      {
        id: 'student',
        username: 'student',
        email: 'student@test.com',
        password: hashedPassword,
        firstName: 'Alex',
        lastName: 'Johnson',
        role: 'student' as const,
        isEmailVerified: true,
        companyId: null,
        profileImageUrl: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=4f46e5&color=fff',
      },
      {
        id: 'instructor',
        username: 'instructor', 
        email: 'instructor@test.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Martinez',
        role: 'instructor' as const,
        isEmailVerified: true,
        companyId: null,
        profileImageUrl: 'https://ui-avatars.com/api/?name=Sarah+Martinez&background=059669&color=fff',
      },
      {
        id: 'company_admin',
        username: 'company_admin',
        email: 'admin@techcorp.com', 
        password: hashedPassword,
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'company_admin' as const,
        isEmailVerified: true,
        companyId: techCorp.id,
        profileImageUrl: 'https://ui-avatars.com/api/?name=Michael+Chen&background=dc2626&color=fff',
      },
      {
        id: 'admin',
        username: 'admin',
        email: 'admin@m4t.com',
        password: hashedPassword,
        firstName: 'Jordan',
        lastName: 'Smith', 
        role: 'internal_admin' as const,
        isEmailVerified: true,
        companyId: null,
        profileImageUrl: 'https://ui-avatars.com/api/?name=Jordan+Smith&background=7c3aed&color=fff',
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const [user] = await db.insert(users).values(userData).returning();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.username} (${user.email})`);
    }

    // 4. Create Subscription Plans
    console.log('💳 Creating subscription plans...');
    const planData = [
      {
        name: 'Basic',
        description: 'Perfect for individual learners',
        price: '9.99',
        period: 'MONTHLY' as const,
        features: ['Access to 50+ courses', 'Basic progress tracking', 'Email support'],
        isActive: true,
      },
      {
        name: 'Professional', 
        description: 'Advanced features for professionals',
        price: '19.99',
        period: 'MONTHLY' as const,
        features: ['Access to all courses', 'Advanced analytics', 'Priority support', 'Certificates'],
        isActive: true,
      },
      {
        name: 'Team',
        description: 'Collaboration tools for teams',
        price: '49.99', 
        period: 'MONTHLY' as const,
        features: ['All Professional features', 'Team management', 'Usage analytics'],
        isActive: true,
      }
    ];

    const createdPlans = [];
    for (const plan of planData) {
      const [createdPlan] = await db.insert(subscriptionPlans).values(plan).returning();
      createdPlans.push(createdPlan);
    }

    // 5. Create Sample Courses
    console.log('📚 Creating sample courses...');
    const instructor = createdUsers.find(u => u.role === 'instructor');
    
    const courseData = [
      {
        title: 'Complete JavaScript Mastery',
        description: 'Master JavaScript from fundamentals to advanced concepts. Build real-world projects and learn modern ES6+ features.',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
        duration: 1800,
        level: 'beginner' as const,
        categoryId: webDev.id,
        instructorId: instructor?.id,
        rating: '4.8',
        learningStyles: ['visual', 'reading'],
        prerequisites: [],
        learningOutcomes: [
          'Master JavaScript fundamentals',
          'Build interactive web applications', 
          'Understand modern ES6+ features',
          'Apply best practices in coding'
        ],
      },
      {
        title: 'Data Science with Python',
        description: 'Complete data science course covering pandas, NumPy, visualization, and machine learning.',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        duration: 2400,
        level: 'intermediate' as const,
        categoryId: dataScience.id,
        instructorId: instructor?.id,
        rating: '4.9',
        learningStyles: ['visual', 'hands-on'],
        prerequisites: ['Basic Python knowledge'],
        learningOutcomes: [
          'Analyze data with pandas and NumPy',
          'Create compelling visualizations',
          'Build machine learning models',
          'Work with real datasets'
        ],
      }
    ];

    const createdCourses = [];
    for (const course of courseData) {
      const [createdCourse] = await db.insert(courses).values(course).returning();
      createdCourses.push(createdCourse);
      
      // Create a module for each course
      const [module] = await db.insert(modules).values({
        title: 'Getting Started',
        description: 'Introduction and fundamentals',
        courseId: createdCourse.id,
        orderIndex: 1,
      }).returning();

      // Create sample lessons
      const lessonTitles = [
        'Course Introduction',
        'Setting Up Your Environment', 
        'Basic Concepts',
        'Hands-on Practice'
      ];

      for (let i = 0; i < lessonTitles.length; i++) {
        await db.insert(lessons).values({
          title: lessonTitles[i],
          content: `This lesson covers ${lessonTitles[i].toLowerCase()} with practical examples and exercises.`,
          moduleId: module.id,
          videoUrl: `https://example.com/videos/lesson${i + 1}.mp4`,
          duration: 15 + (i * 5), // 15, 20, 25, 30 minutes
          orderIndex: i + 1,
          isPreview: i === 0, // First lesson is preview
        });
      }
    }

    // 6. Create User Subscriptions
    console.log('📝 Creating subscriptions...');
    const student = createdUsers.find(u => u.role === 'student');
    const companyAdmin = createdUsers.find(u => u.role === 'company_admin');
    const [proPlan, teamPlan] = createdPlans;

    if (student && proPlan) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await db.insert(userSubscriptions).values({
        userId: student.id,
        planId: proPlan.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        isActive: true,
        stripeSubscriptionId: 'sub_test_pro_1234',
      });
    }

    if (companyAdmin && teamPlan) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await db.insert(userSubscriptions).values({
        userId: companyAdmin.id,
        planId: teamPlan.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        isActive: true,
        stripeSubscriptionId: 'sub_test_team_5678',
      });
    }

    // 7. Create Sample Enrollments
    console.log('🎓 Creating enrollments...');
    if (student && createdCourses.length > 0) {
      for (const course of createdCourses) {
        await db.insert(enrollments).values({
          userId: student.id,
          courseId: course.id,
          enrolledAt: new Date(),
        });
      }
    }

    console.log('\n🎉 Simple Database Seeding Complete!');
    console.log('\n📊 Created:');
    console.log(`- ${testUsers.length} test users with verified emails`);
    console.log(`- ${createdCourses.length} sample courses with modules and lessons`);
    console.log(`- ${createdPlans.length} subscription plans`);
    console.log('- Sample enrollments and subscriptions');

    console.log('\n🔐 Test Login Credentials (password: password123):');
    console.log('Username/Email: student | student@test.com (Student with Pro subscription)');
    console.log('Username/Email: instructor | instructor@test.com (Course Instructor)');
    console.log('Username/Email: company_admin | admin@techcorp.com (Company Admin)');
    console.log('Username/Email: admin | admin@m4t.com (Internal Admin)');

    console.log('\n✅ Database ready for local and UAT testing!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSimpleDatabase().catch(console.error);
}

export { seedSimpleDatabase };