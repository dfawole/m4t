import { db } from './db';
import { users, courses, lessons, enrollments, completions, badges, userBadges, subscriptionPlans, userSubscriptions, payments } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  console.log('Starting UAT seed data generation...');

  // Clean up existing data (optional - comment out if you want to preserve existing data)
  console.log('Clearing existing data...');
  await db.delete(userBadges);
  await db.delete(badges);
  await db.delete(completions);
  await db.delete(enrollments);
  await db.delete(lessons);
  await db.delete(courses);
  await db.delete(payments);
  await db.delete(userSubscriptions);
  await db.delete(subscriptionPlans);
  await db.delete(users);

  // Create test user accounts
  console.log('Creating test user accounts...');
  const hashedPassword = await hashPassword('password123');

  const [studentUser] = await db.insert(users).values({
    id: 'student1',
    email: 'student@example.com',
    password: hashedPassword,
    firstName: 'Student',
    lastName: 'User',
    role: 'student',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Student+User&background=random',
    isEmailVerified: true,
    verificationSource: 'trusted_provider',
  }).returning();

  const [instructorUser] = await db.insert(users).values({
    id: 'instructor1',
    email: 'instructor@example.com',
    password: hashedPassword,
    firstName: 'Instructor',
    lastName: 'User',
    role: 'instructor',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Instructor+User&background=random',
    isEmailVerified: true,
    verificationSource: 'trusted_provider',
  }).returning();

  const [companyUser] = await db.insert(users).values({
    id: 'company1',
    email: 'company@example.com',
    password: hashedPassword,
    firstName: 'Company',
    lastName: 'Admin',
    role: 'company_admin',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Company+Admin&background=random',
    isEmailVerified: true,
    verificationSource: 'trusted_provider',
    companyName: 'Test Company Inc.',
  }).returning();

  const [adminUser] = await db.insert(users).values({
    id: 'admin1',
    email: 'admin@example.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
    isEmailVerified: true,
    verificationSource: 'trusted_provider',
  }).returning();

  // Create subscription plans
  console.log('Creating subscription plans...');
  const [basicPlan] = await db.insert(subscriptionPlans).values({
    name: 'Basic',
    description: 'Access to basic courses and features',
    price: 9.99,
    interval: 'month',
    features: ['Access to 50+ courses', 'Basic reporting', 'Email support'],
    isActive: true,
  }).returning();

  const [proPlan] = await db.insert(subscriptionPlans).values({
    name: 'Professional',
    description: 'Access to all courses and premium features',
    price: 19.99,
    interval: 'month',
    features: ['Access to all courses', 'Advanced reporting', 'Priority support', 'Offline downloads'],
    isActive: true,
    isPopular: true,
  }).returning();

  const [teamPlan] = await db.insert(subscriptionPlans).values({
    name: 'Team',
    description: 'For teams of 5+ members with admin features',
    price: 49.99,
    interval: 'month',
    features: ['All Professional features', 'Team management', 'Usage analytics', 'Dedicated account manager'],
    isActive: true,
    isTeamPlan: true,
    minSeats: 5,
  }).returning();

  const [enterprisePlan] = await db.insert(subscriptionPlans).values({
    name: 'Enterprise',
    description: 'Custom solution for large organizations',
    price: 299.99,
    interval: 'month',
    features: ['All Team features', 'Custom course creation', 'API access', 'SSO integration'],
    isActive: true,
    isTeamPlan: true,
    minSeats: 20,
  }).returning();

  // Subscribe student to Pro plan
  console.log('Creating user subscriptions...');
  await db.insert(userSubscriptions).values({
    userId: studentUser.id,
    planId: proPlan.id,
    status: 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    cancelAtPeriodEnd: false,
    quantity: 1,
    stripeSubscriptionId: 'sub_mock_1234',
    stripeCustomerId: 'cus_mock_1234',
  });

  // Subscribe company to Team plan
  await db.insert(userSubscriptions).values({
    userId: companyUser.id,
    planId: teamPlan.id,
    status: 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    cancelAtPeriodEnd: false,
    quantity: 10, // 10 seats
    stripeSubscriptionId: 'sub_mock_5678',
    stripeCustomerId: 'cus_mock_5678',
  });

  // Create payment history
  console.log('Creating payment history...');
  await db.insert(payments).values({
    userId: studentUser.id,
    amount: proPlan.price,
    currency: 'usd',
    status: 'succeeded',
    paymentMethod: 'stripe',
    paymentMethodId: 'pm_mock_1234',
    description: `Payment for ${proPlan.name} subscription`,
    metadata: { planId: proPlan.id.toString() },
  });

  await db.insert(payments).values({
    userId: companyUser.id,
    amount: teamPlan.price * 10, // 10 seats
    currency: 'usd',
    status: 'succeeded',
    paymentMethod: 'paypal',
    paymentMethodId: 'paypal_mock_5678',
    description: `Payment for ${teamPlan.name} subscription (10 seats)`,
    metadata: { planId: teamPlan.id.toString(), seats: '10' },
  });

  // Create test courses
  console.log('Creating test courses...');
  const courseCategories = ['Development', 'Business', 'Design', 'Marketing', 'Data Science'];
  const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];
  
  for (let i = 1; i <= 10; i++) {
    const categoryId = (i % 5) + 1; // 1-5
    const level = courseLevels[i % 3]; // cycle through levels
    
    const [course] = await db.insert(courses).values({
      title: `Test Course ${i}`,
      description: `This is a detailed description for test course ${i}. It covers many interesting topics in the ${courseCategories[categoryId - 1]} field.`,
      coverImage: `https://picsum.photos/seed/course${i}/800/600`,
      instructorId: instructorUser.id,
      price: (i % 3 === 0) ? 0 : 19.99 + i, // Some free courses
      durationHours: 5 + i,
      categoryId,
      level,
      isPublished: true,
      tags: [`tag${i}`, `${courseCategories[categoryId - 1].toLowerCase()}`, level.toLowerCase()],
      objectives: [
        `Learn the fundamentals of ${courseCategories[categoryId - 1]}`,
        'Apply concepts to real-world projects',
        'Build a portfolio of work',
      ],
      teaserVideoId: i,
      teaserVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    }).returning();
    
    // Create lessons for each course
    for (let j = 1; j <= 5; j++) {
      await db.insert(lessons).values({
        courseId: course.id,
        title: `Lesson ${j} for Course ${i}`,
        description: `This is lesson ${j} for course ${i}. It covers important concepts and includes practical exercises.`,
        orderIndex: j,
        durationMinutes: 15 + (j * 5),
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        hasQuiz: j % 2 === 0, // Every other lesson has a quiz
        isPreviewable: j === 1, // First lesson is previewable
      });
    }

    // Enroll student in courses 1-5
    if (i <= 5) {
      await db.insert(enrollments).values({
        userId: studentUser.id,
        courseId: course.id,
        enrolledAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000), // Staggered enrollment dates
      });
      
      // Complete some lessons for the student
      if (i <= 3) {
        const lessons = await db.select().from(lessons).where(eq(lessons.courseId, course.id));
        for (const lesson of lessons.slice(0, i + 1)) { // Complete i+1 lessons of each course
          await db.insert(completions).values({
            userId: studentUser.id,
            lessonId: lesson.id,
            completedAt: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000),
            quizScore: lesson.hasQuiz ? (70 + (i * 5)) : null, // Variable quiz scores
          });
        }
      }
    }
  }

  // Create badges and achievements
  console.log('Creating badges and achievements...');
  const badgeTypes = ['achievement', 'skill', 'participation'];
  const badgeLevels = ['bronze', 'silver', 'gold'];
  
  for (let i = 1; i <= 15; i++) {
    const type = badgeTypes[i % 3];
    const level = badgeLevels[Math.floor(i / 5)];
    
    const [badge] = await db.insert(badges).values({
      name: `${type} Badge ${i}`,
      description: `Earned by completing ${type}-related activities`,
      imageUrl: `https://ui-avatars.com/api/?name=${type}+${i}&background=random`,
      type,
      level,
      pointValue: 10 * (badgeLevels.indexOf(level) + 1),
      requirements: `Complete ${5 * (badgeLevels.indexOf(level) + 1)} ${type} activities`,
    }).returning();
    
    // Award some badges to the student
    if (i <= 7) {
      await db.insert(userBadges).values({
        userId: studentUser.id,
        badgeId: badge.id,
        awardedAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
      });
    }
  }

  console.log('UAT seed data generation complete!');
}

main().catch(e => {
  console.error('Error seeding database:', e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});