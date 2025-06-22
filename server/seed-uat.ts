// import { db } from './db';
// import { users, courses, lessons, enrollments, completions, badges, userBadges, subscriptionPlans, userSubscriptions, payments } from '@shared/schema';
// import { eq } from 'drizzle-orm';
// import { scrypt, randomBytes } from 'crypto';
// import { promisify } from 'util';

// const scryptAsync = promisify(scrypt);

// async function hashPassword(password: string) {
//   const salt = randomBytes(16).toString('hex');
//   const buf = (await scryptAsync(password, salt, 64)) as Buffer;
//   return `${buf.toString('hex')}.${salt}`;
// }

// async function main() {
//   console.log('Starting UAT seed data generation...');

//   // Clean up existing data (optional - comment out if you want to preserve existing data)
//   console.log('Clearing existing data...');
//   await db.delete(userBadges);
//   await db.delete(badges);
//   await db.delete(completions);
//   await db.delete(enrollments);
//   await db.delete(lessons);
//   await db.delete(courses);
//   await db.delete(payments);
//   await db.delete(userSubscriptions);
//   await db.delete(subscriptionPlans);
//   await db.delete(users);

//   // Create test user accounts
//   console.log('Creating test user accounts...');
//   const hashedPassword = await hashPassword('password123');

//   const [studentUser] = await db.insert(users).values({
//     id: 'student1',
//     email: 'student@example.com',
//     password: hashedPassword,
//     firstName: 'Student',
//     lastName: 'User',
//     role: 'student',
//     profileImageUrl: 'https://ui-avatars.com/api/?name=Student+User&background=random',
//     isEmailVerified: true,
//     verificationSource: 'trusted_provider',
//   }).returning();

//   const [instructorUser] = await db.insert(users).values({
//     id: 'instructor1',
//     email: 'instructor@example.com',
//     password: hashedPassword,
//     firstName: 'Instructor',
//     lastName: 'User',
//     role: 'instructor',
//     profileImageUrl: 'https://ui-avatars.com/api/?name=Instructor+User&background=random',
//     isEmailVerified: true,
//     verificationSource: 'trusted_provider',
//   }).returning();

//   const [companyUser] = await db.insert(users).values({
//     id: 'company1',
//     email: 'company@example.com',
//     password: hashedPassword,
//     firstName: 'Company',
//     lastName: 'Admin',
//     role: 'company_admin',
//     profileImageUrl: 'https://ui-avatars.com/api/?name=Company+Admin&background=random',
//     isEmailVerified: true,
//     verificationSource: 'trusted_provider',
//     companyName: 'Test Company Inc.',
//   }).returning();

//   const [adminUser] = await db.insert(users).values({
//     id: 'admin1',
//     email: 'admin@example.com',
//     password: hashedPassword,
//     firstName: 'Admin',
//     lastName: 'User',
//     role: 'admin',
//     profileImageUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
//     isEmailVerified: true,
//     verificationSource: 'trusted_provider',
//   }).returning();

//   // Create subscription plans
//   console.log('Creating subscription plans...');
//   const [basicPlan] = await db.insert(subscriptionPlans).values({
//     name: 'Basic',
//     description: 'Access to basic courses and features',
//     price: 9.99,
//     interval: 'month',
//     features: ['Access to 50+ courses', 'Basic reporting', 'Email support'],
//     isActive: true,
//   }).returning();

//   const [proPlan] = await db.insert(subscriptionPlans).values({
//     name: 'Professional',
//     description: 'Access to all courses and premium features',
//     price: 19.99,
//     interval: 'month',
//     features: ['Access to all courses', 'Advanced reporting', 'Priority support', 'Offline downloads'],
//     isActive: true,
//     isPopular: true,
//   }).returning();

//   const [teamPlan] = await db.insert(subscriptionPlans).values({
//     name: 'Team',
//     description: 'For teams of 5+ members with admin features',
//     price: 49.99,
//     interval: 'month',
//     features: ['All Professional features', 'Team management', 'Usage analytics', 'Dedicated account manager'],
//     isActive: true,
//     isTeamPlan: true,
//     minSeats: 5,
//   }).returning();

//   const [enterprisePlan] = await db.insert(subscriptionPlans).values({
//     name: 'Enterprise',
//     description: 'Custom solution for large organizations',
//     price: 299.99,
//     interval: 'month',
//     features: ['All Team features', 'Custom course creation', 'API access', 'SSO integration'],
//     isActive: true,
//     isTeamPlan: true,
//     minSeats: 20,
//   }).returning();

//   // Subscribe student to Pro plan
//   console.log('Creating user subscriptions...');
//   await db.insert(userSubscriptions).values({
//     userId: studentUser.id,
//     planId: proPlan.id,
//     status: 'active',
//     currentPeriodStart: new Date(),
//     currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//     cancelAtPeriodEnd: false,
//     quantity: 1,
//     stripeSubscriptionId: 'sub_mock_1234',
//     stripeCustomerId: 'cus_mock_1234',
//   });

//   // Subscribe company to Team plan
//   await db.insert(userSubscriptions).values({
//     userId: companyUser.id,
//     planId: teamPlan.id,
//     status: 'active',
//     currentPeriodStart: new Date(),
//     currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//     cancelAtPeriodEnd: false,
//     quantity: 10, // 10 seats
//     stripeSubscriptionId: 'sub_mock_5678',
//     stripeCustomerId: 'cus_mock_5678',
//   });

//   // Create payment history
//   console.log('Creating payment history...');
//   await db.insert(payments).values({
//     userId: studentUser.id,
//     amount: proPlan.price,
//     currency: 'usd',
//     status: 'succeeded',
//     paymentMethod: 'stripe',
//     paymentMethodId: 'pm_mock_1234',
//     description: `Payment for ${proPlan.name} subscription`,
//     metadata: { planId: proPlan.id.toString() },
//   });

//   await db.insert(payments).values({
//     userId: companyUser.id,
//     amount: teamPlan.price * 10, // 10 seats
//     currency: 'usd',
//     status: 'succeeded',
//     paymentMethod: 'paypal',
//     paymentMethodId: 'paypal_mock_5678',
//     description: `Payment for ${teamPlan.name} subscription (10 seats)`,
//     metadata: { planId: teamPlan.id.toString(), seats: '10' },
//   });

//   // Create test courses
//   console.log('Creating test courses...');
//   const courseCategories = ['Development', 'Business', 'Design', 'Marketing', 'Data Science'];
//   const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];

//   for (let i = 1; i <= 10; i++) {
//     const categoryId = (i % 5) + 1; // 1-5
//     const level = courseLevels[i % 3]; // cycle through levels

//     const [course] = await db.insert(courses).values({
//       title: `Test Course ${i}`,
//       description: `This is a detailed description for test course ${i}. It covers many interesting topics in the ${courseCategories[categoryId - 1]} field.`,
//       coverImage: `https://picsum.photos/seed/course${i}/800/600`,
//       instructorId: instructorUser.id,
//       price: (i % 3 === 0) ? 0 : 19.99 + i, // Some free courses
//       durationHours: 5 + i,
//       categoryId,
//       level,
//       isPublished: true,
//       tags: [`tag${i}`, `${courseCategories[categoryId - 1].toLowerCase()}`, level.toLowerCase()],
//       objectives: [
//         `Learn the fundamentals of ${courseCategories[categoryId - 1]}`,
//         'Apply concepts to real-world projects',
//         'Build a portfolio of work',
//       ],
//       teaserVideoId: i,
//       teaserVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     }).returning();

//     // Create lessons for each course
//     for (let j = 1; j <= 5; j++) {
//       await db.insert(lessons).values({
//         courseId: course.id,
//         title: `Lesson ${j} for Course ${i}`,
//         description: `This is lesson ${j} for course ${i}. It covers important concepts and includes practical exercises.`,
//         orderIndex: j,
//         durationMinutes: 15 + (j * 5),
//         videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//         hasQuiz: j % 2 === 0, // Every other lesson has a quiz
//         isPreviewable: j === 1, // First lesson is previewable
//       });
//     }

//     // Enroll student in courses 1-5
//     if (i <= 5) {
//       await db.insert(enrollments).values({
//         userId: studentUser.id,
//         courseId: course.id,
//         enrolledAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000), // Staggered enrollment dates
//       });

//       // Complete some lessons for the student
//       if (i <= 3) {
//         const lessons = await db.select().from(lessons).where(eq(lessons.courseId, course.id));
//         for (const lesson of lessons.slice(0, i + 1)) { // Complete i+1 lessons of each course
//           await db.insert(completions).values({
//             userId: studentUser.id,
//             lessonId: lesson.id,
//             completedAt: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000),
//             quizScore: lesson.hasQuiz ? (70 + (i * 5)) : null, // Variable quiz scores
//           });
//         }
//       }
//     }
//   }

//   // Create badges and achievements
//   console.log('Creating badges and achievements...');
//   const badgeTypes = ['achievement', 'skill', 'participation'];
//   const badgeLevels = ['bronze', 'silver', 'gold'];

//   for (let i = 1; i <= 15; i++) {
//     const type = badgeTypes[i % 3];
//     const level = badgeLevels[Math.floor(i / 5)];

//     const [badge] = await db.insert(badges).values({
//       name: `${type} Badge ${i}`,
//       description: `Earned by completing ${type}-related activities`,
//       imageUrl: `https://ui-avatars.com/api/?name=${type}+${i}&background=random`,
//       type,
//       level,
//       pointValue: 10 * (badgeLevels.indexOf(level) + 1),
//       requirements: `Complete ${5 * (badgeLevels.indexOf(level) + 1)} ${type} activities`,
//     }).returning();

//     // Award some badges to the student
//     if (i <= 7) {
//       await db.insert(userBadges).values({
//         userId: studentUser.id,
//         badgeId: badge.id,
//         awardedAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
//       });
//     }
//   }

//   console.log('UAT seed data generation complete!');
// }

// main().catch(e => {
//   console.error('Error seeding database:', e);
//   process.exit(1);
// }).finally(() => {
//   process.exit(0);
// });

/// new with error fix

import { db } from './db';
import {
	users,
	courses,
	lessons,
	enrollments,
	modules,
	categories,
	subscriptionPlans,
	userSubscriptions,
	companies,
} from '@shared/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${buf.toString('hex')}.${salt}`;
}

async function uatSeedDatabase() {
	console.log('Starting UAT seed data generation...');

	try {
		// Clean up existing data (optional - comment out if you want to preserve existing data)
		console.log('Clearing existing data...');
		await db.delete(userSubscriptions);
		await db.delete(enrollments);
		await db.delete(lessons);
		await db.delete(modules);
		await db.delete(courses);
		await db.delete(subscriptionPlans);
		await db.delete(users);
		await db.delete(companies);
		await db.delete(categories);

		// Create test user accounts
		console.log('Creating test user accounts...');
		const hashedPassword = await hashPassword('password123');

		// Create company first
		const [testCompany] = await db
			.insert(companies)
			.values({
				name: 'Test Company Inc.',
				email: 'company@example.com',
				phone: '+1-555-0123',
				address: '123 Test Street, Test City, TC 12345',
			})
			.returning();

		const [studentUser] = await db
			.insert(users)
			.values({
				id: 'student1',
				username: 'student1',
				email: 'student@example.com',
				password: hashedPassword,
				firstName: 'Student',
				lastName: 'User',
				role: 'student',
				profileImageUrl: 'https://ui-avatars.com/api/?name=Student+User&background=random',
				isEmailVerified: true,
			})
			.returning();

		const [instructorUser] = await db
			.insert(users)
			.values({
				id: 'instructor1',
				username: 'instructor1',
				email: 'instructor@example.com',
				password: hashedPassword,
				firstName: 'Instructor',
				lastName: 'User',
				role: 'instructor',
				profileImageUrl: 'https://ui-avatars.com/api/?name=Instructor+User&background=random',
				isEmailVerified: true,
			})
			.returning();

		const [companyUser] = await db
			.insert(users)
			.values({
				id: 'company1',
				username: 'company1',
				email: 'company@example.com',
				password: hashedPassword,
				firstName: 'Company',
				lastName: 'Admin',
				role: 'company_admin',
				profileImageUrl: 'https://ui-avatars.com/api/?name=Company+Admin&background=random',
				isEmailVerified: true,
				companyId: testCompany.id,
			})
			.returning();

		const [adminUser] = await db
			.insert(users)
			.values({
				id: 'admin1',
				username: 'admin1',
				email: 'admin@example.com',
				password: hashedPassword,
				firstName: 'Admin',
				lastName: 'User',
				role: 'internal_admin',
				profileImageUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
				isEmailVerified: true,
			})
			.returning();

		// Create categories
		console.log('Creating course categories...');
		const categoryData = [
			{ name: 'Development', description: 'Programming and software development courses' },
			{ name: 'Business', description: 'Business strategy and management courses' },
			{ name: 'Design', description: 'UI/UX and graphic design courses' },
			{ name: 'Marketing', description: 'Digital marketing and advertising courses' },
			{ name: 'Data Science', description: 'Data analysis and machine learning courses' },
		];

		const createdCategories = [];
		for (const cat of categoryData) {
			const [category] = await db.insert(categories).values(cat).returning();
			createdCategories.push(category);
		}

		// Create subscription plans
		console.log('Creating subscription plans...');
		const [basicPlan] = await db
			.insert(subscriptionPlans)
			.values({
				name: 'Basic',
				description: 'Access to basic courses and features',
				price: '9.99',
				period: 'MONTHLY',
				features: ['Access to 50+ courses', 'Basic reporting', 'Email support'],
				isActive: true,
			})
			.returning();

		const [proPlan] = await db
			.insert(subscriptionPlans)
			.values({
				name: 'Professional',
				description: 'Access to all courses and premium features',
				price: '19.99',
				period: 'MONTHLY',
				features: [
					'Access to all courses',
					'Advanced reporting',
					'Priority support',
					'Offline downloads',
				],
				isActive: true,
			})
			.returning();

		const [teamPlan] = await db
			.insert(subscriptionPlans)
			.values({
				name: 'Team',
				description: 'For teams of 5+ members with admin features',
				price: '49.99',
				period: 'MONTHLY',
				features: [
					'All Professional features',
					'Team management',
					'Usage analytics',
					'Dedicated account manager',
				],
				isActive: true,
			})
			.returning();

		const [enterprisePlan] = await db
			.insert(subscriptionPlans)
			.values({
				name: 'Enterprise',
				description: 'Custom solution for large organizations',
				price: '299.99',
				period: 'MONTHLY',
				features: ['All Team features', 'Custom course creation', 'API access', 'SSO integration'],
				isActive: true,
			})
			.returning();

		// Subscribe student to Pro plan
		console.log('Creating user subscriptions...');
		const startDate = new Date();
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);

		await db.insert(userSubscriptions).values({
			userId: studentUser.id,
			planId: proPlan.id,
			startDate: startDate.toISOString().split('T')[0],
			endDate: endDate.toISOString().split('T')[0],
			isActive: true,
			stripeSubscriptionId: 'sub_mock_1234',
		});

		// Subscribe company to Team plan
		await db.insert(userSubscriptions).values({
			userId: companyUser.id,
			planId: teamPlan.id,
			startDate: startDate.toISOString().split('T')[0],
			endDate: endDate.toISOString().split('T')[0],
			isActive: true,
			stripeSubscriptionId: 'sub_mock_5678',
		});

		// Create test courses
		console.log('Creating test courses...');
		const courseTemplates = [
			{
				title: 'JavaScript Fundamentals',
				description:
					'Learn the core concepts of JavaScript programming from variables to advanced functions.',
				level: 'beginner',
				categoryName: 'Development',
				duration: 480, // 8 hours
				modules: [
					{
						title: 'Getting Started',
						lessons: [
							{
								title: 'Introduction to JavaScript',
								content: 'Overview of JavaScript and its role in web development',
								duration: 30,
							},
							{
								title: 'Setting Up Development Environment',
								content: 'Installing and configuring development tools',
								duration: 45,
							},
						],
					},
					{
						title: 'Core Concepts',
						lessons: [
							{
								title: 'Variables and Data Types',
								content: 'Understanding different data types and variable declarations',
								duration: 60,
							},
							{
								title: 'Functions and Scope',
								content: 'Creating and using functions, understanding scope',
								duration: 75,
							},
						],
					},
				],
			},
			{
				title: 'React for Beginners',
				description:
					'Build modern web applications with React. Learn components, state management, and hooks.',
				level: 'intermediate',
				categoryName: 'Development',
				duration: 600, // 10 hours
				modules: [
					{
						title: 'React Basics',
						lessons: [
							{
								title: 'What is React?',
								content: 'Introduction to React and component-based architecture',
								duration: 40,
							},
							{
								title: 'Creating Your First Component',
								content: 'Building and rendering React components',
								duration: 50,
							},
						],
					},
				],
			},
			{
				title: 'UI/UX Design Principles',
				description: 'Master the fundamentals of user interface and user experience design.',
				level: 'beginner',
				categoryName: 'Design',
				duration: 360, // 6 hours
				modules: [
					{
						title: 'Design Fundamentals',
						lessons: [
							{
								title: 'Design Thinking Process',
								content: 'Understanding user-centered design methodology',
								duration: 45,
							},
							{
								title: 'Color Theory and Typography',
								content: 'Principles of visual design and typography',
								duration: 60,
							},
						],
					},
				],
			},
			{
				title: 'Digital Marketing Strategy',
				description: 'Learn effective digital marketing strategies for modern businesses.',
				level: 'intermediate',
				categoryName: 'Marketing',
				duration: 420, // 7 hours
				modules: [
					{
						title: 'Marketing Fundamentals',
						lessons: [
							{
								title: 'Understanding Your Audience',
								content: 'Market research and customer persona development',
								duration: 50,
							},
							{
								title: 'Content Marketing Strategy',
								content: 'Creating compelling content that converts',
								duration: 65,
							},
						],
					},
				],
			},
			{
				title: 'Data Analysis with Python',
				description:
					'Analyze data and create insights using Python and popular data science libraries.',
				level: 'advanced',
				categoryName: 'Data Science',
				duration: 720, // 12 hours
				modules: [
					{
						title: 'Python for Data Analysis',
						lessons: [
							{
								title: 'Introduction to Pandas',
								content: 'Data manipulation and analysis with Pandas library',
								duration: 80,
							},
							{
								title: 'Data Visualization',
								content: 'Creating charts and graphs with Matplotlib and Seaborn',
								duration: 90,
							},
						],
					},
				],
			},
		];

		const createdCourses = [];
		for (const template of courseTemplates) {
			const category = createdCategories.find((c) => c.name === template.categoryName);

			const [course] = await db
				.insert(courses)
				.values({
					title: template.title,
					description: template.description,
					coverImage: `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop`,
					instructorId: instructorUser.id,
					duration: template.duration,
					categoryId: category?.id,
					level: template.level,
					rating: (Math.random() * 1.5 + 3.5).toFixed(1),
					learningStyles: ['visual', 'reading'],
					prerequisites:
						template.level === 'advanced' ? ['Intermediate programming knowledge'] : [],
					learningOutcomes: [
						`Master ${template.categoryName.toLowerCase()} concepts`,
						'Build practical projects',
						'Apply industry best practices',
					],
				})
				.returning();

			createdCourses.push(course);

			// Create modules and lessons for each course
			for (let moduleIndex = 0; moduleIndex < template.modules.length; moduleIndex++) {
				const moduleTemplate = template.modules[moduleIndex];

				const [module] = await db
					.insert(modules)
					.values({
						title: moduleTemplate.title,
						description: `Learn ${moduleTemplate.title.toLowerCase()} concepts and applications`,
						courseId: course.id,
						orderIndex: moduleIndex + 1,
					})
					.returning();

				// Create lessons for each module
				for (let lessonIndex = 0; lessonIndex < moduleTemplate.lessons.length; lessonIndex++) {
					const lessonTemplate = moduleTemplate.lessons[lessonIndex];

					await db.insert(lessons).values({
						title: lessonTemplate.title,
						content: lessonTemplate.content,
						moduleId: module.id,
						videoUrl: `https://example.com/videos/course${course.id}/module${module.id}/lesson${
							lessonIndex + 1
						}.mp4`,
						duration: lessonTemplate.duration,
						orderIndex: lessonIndex + 1,
						isPreview: moduleIndex === 0 && lessonIndex === 0, // First lesson is preview
					});
				}
			}
		}

		// Create enrollments
		console.log('Creating sample enrollments...');

		// Enroll student in first 3 courses
		for (let i = 0; i < Math.min(3, createdCourses.length); i++) {
			await db.insert(enrollments).values({
				userId: studentUser.id,
				courseId: createdCourses[i].id,
				enrolledAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date within last 14 days
			});
		}

		// Company user enrolled in business-related courses
		const businessCourse = createdCourses.find((c) => c.title.includes('Marketing'));
		if (businessCourse) {
			await db.insert(enrollments).values({
				userId: companyUser.id,
				courseId: businessCourse.id,
				enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
			});
		}

		console.log('\n🎉 UAT Database seeding completed successfully!');
		console.log('\n📚 Created:');
		console.log(`- ${createdCategories.length} course categories`);
		console.log('- 4 verified user accounts (all roles)');
		console.log(`- ${createdCourses.length} comprehensive courses with modules and lessons`);
		console.log('- 4 subscription plans (Basic, Professional, Team, Enterprise)');
		console.log('- Sample enrollments and active subscriptions');

		console.log('\n🔐 UAT Test Accounts (all verified):');
		console.log('- student1 / password123 (Student role with Pro subscription)');
		console.log('- instructor1 / password123 (Instructor role)');
		console.log('- company1 / password123 (Company Admin role with Team subscription)');
		console.log('- admin1 / password123 (Internal Admin role)');

		console.log('\n📋 Test Data Summary:');
		console.log('- Student has active Pro subscription and enrolled in 3 courses');
		console.log('- Company admin has active Team subscription');
		console.log('- All courses have realistic modules and lessons');
		console.log('- Categories: Development, Business, Design, Marketing, Data Science');
	} catch (error) {
		console.error('❌ UAT Database seeding failed:', error);
		throw error;
	}
}

// ES module check to run seeding when file is executed directly
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
	uatSeedDatabase().catch(console.error);
}

export { uatSeedDatabase };
