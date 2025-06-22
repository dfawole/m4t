// import { db } from './db';
// import {
// 	users,
// 	courses,
// 	lessons,
// 	enrollments,
// 	modules,
// 	categories,
// 	subscriptionPlans,
// 	userSubscriptions,
// 	companies,
// 	quizzes,
// 	quizQuestions,
// 	quizAnswers,
// } from '@shared/schema';
// import { scrypt, randomBytes } from 'crypto';
// import { promisify } from 'util';

// const scryptAsync = promisify(scrypt);

// async function hashPassword(password: string) {
// 	const salt = randomBytes(16).toString('hex');
// 	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
// 	return `${buf.toString('hex')}.${salt}`;
// }

// // Real course content data
// const courseData = [
// 	{
// 		title: 'Complete Web Development Bootcamp',
// 		description:
// 			'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack web developer. This comprehensive course covers everything from basic web fundamentals to advanced full-stack development concepts with real project builds.',
// 		category: 'Web Development',
// 		level: 'beginner',
// 		duration: 2400, // 40 hours in minutes
// 		modules: [
// 			{
// 				title: 'Frontend Fundamentals',
// 				lessons: [
// 					{
// 						title: 'HTML Structure and Semantics',
// 						content: 'Learn semantic HTML, document structure, forms, and accessibility basics',
// 						duration: 45,
// 					},
// 					{
// 						title: 'CSS Styling and Layout',
// 						content: 'Master CSS Grid, Flexbox, animations, and responsive design principles',
// 						duration: 60,
// 					},
// 					{
// 						title: 'JavaScript Programming',
// 						content: 'Variables, functions, DOM manipulation, and modern ES6+ features',
// 						duration: 90,
// 					},
// 				],
// 			},
// 			{
// 				title: 'React Development',
// 				lessons: [
// 					{
// 						title: 'React Components',
// 						content: 'Building reusable components, state management, and hooks',
// 						duration: 75,
// 					},
// 					{
// 						title: 'State Management',
// 						content: 'Context API, Redux, and advanced state patterns',
// 						duration: 80,
// 					},
// 				],
// 			},
// 			{
// 				title: 'Backend Development',
// 				lessons: [
// 					{
// 						title: 'Node.js and Express',
// 						content: 'Server-side development, REST APIs, and authentication',
// 						duration: 80,
// 					},
// 					{
// 						title: 'Database Integration',
// 						content: 'MongoDB, Mongoose, and data modeling',
// 						duration: 70,
// 					},
// 					{
// 						title: 'Deployment and DevOps',
// 						content: 'Git workflows, hosting platforms, and production deployment',
// 						duration: 50,
// 					},
// 				],
// 			},
// 		],
// 	},
// 	{
// 		title: 'Data Science with Python',
// 		description:
// 			'Comprehensive data analysis, visualization, and machine learning using Python ecosystem. Learn pandas, NumPy, matplotlib, and scikit-learn through hands-on projects with real datasets.',
// 		category: 'Data Science',
// 		level: 'intermediate',
// 		duration: 2100, // 35 hours
// 		modules: [
// 			{
// 				title: 'Python for Data Science',
// 				lessons: [
// 					{
// 						title: 'Python Setup and Jupyter',
// 						content: 'Jupyter notebooks, virtual environments, and essential libraries',
// 						duration: 40,
// 					},
// 					{
// 						title: 'Data Structures',
// 						content: 'Lists, dictionaries, NumPy arrays, and pandas DataFrames',
// 						duration: 55,
// 					},
// 				],
// 			},
// 			{
// 				title: 'Data Analysis',
// 				lessons: [
// 					{
// 						title: 'Data Manipulation with Pandas',
// 						content: 'DataFrames, data cleaning, merging, and transformation techniques',
// 						duration: 70,
// 					},
// 					{
// 						title: 'Statistical Analysis',
// 						content: 'Descriptive statistics, hypothesis testing, and correlation analysis',
// 						duration: 65,
// 					},
// 				],
// 			},
// 			{
// 				title: 'Machine Learning',
// 				lessons: [
// 					{
// 						title: 'Supervised Learning',
// 						content: 'Regression, classification, and model evaluation techniques',
// 						duration: 85,
// 					},
// 					{
// 						title: 'Unsupervised Learning',
// 						content: 'Clustering, dimensionality reduction, and pattern recognition',
// 						duration: 60,
// 					},
// 				],
// 			},
// 		],
// 	},
// 	{
// 		title: 'Digital Marketing Strategy',
// 		description:
// 			'Complete digital marketing course covering SEO, social media marketing, email campaigns, and paid advertising. Includes real case studies from successful campaigns and hands-on tools training.',
// 		category: 'Marketing',
// 		level: 'beginner',
// 		duration: 1500, // 25 hours
// 		modules: [
// 			{
// 				title: 'Marketing Fundamentals',
// 				lessons: [
// 					{
// 						title: 'Digital Marketing Overview',
// 						content: 'Marketing funnels, customer personas, and channel strategy',
// 						duration: 35,
// 					},
// 					{
// 						title: 'Market Research',
// 						content: 'Competitor analysis, target audience identification, and market sizing',
// 						duration: 40,
// 					},
// 				],
// 			},
// 			{
// 				title: 'Organic Marketing',
// 				lessons: [
// 					{
// 						title: 'Search Engine Optimization',
// 						content: 'Keyword research, on-page SEO, link building, and technical SEO',
// 						duration: 55,
// 					},
// 					{
// 						title: 'Content Marketing',
// 						content: 'Content strategy, blog writing, and content distribution channels',
// 						duration: 45,
// 					},
// 				],
// 			},
// 			{
// 				title: 'Paid Marketing',
// 				lessons: [
// 					{
// 						title: 'Google Ads Mastery',
// 						content: 'Campaign setup, keyword bidding, ad copy optimization',
// 						duration: 50,
// 					},
// 					{
// 						title: 'Social Media Advertising',
// 						content: 'Facebook Ads, Instagram marketing, and social media strategy',
// 						duration: 45,
// 					},
// 				],
// 			},
// 		],
// 	},
// ];

// // Test user profiles with email verification set to true
// const userProfiles = [
// 	{
// 		username: 'student',
// 		email: 'student@test.com',
// 		firstName: 'Alex',
// 		lastName: 'Johnson',
// 		role: 'student',
// 		isEmailVerified: true,
// 	},
// 	{
// 		username: 'instructor',
// 		email: 'instructor@test.com',
// 		firstName: 'Sarah',
// 		lastName: 'Martinez',
// 		role: 'instructor',
// 		isEmailVerified: true,
// 	},
// 	{
// 		username: 'company',
// 		email: 'admin@techcorp.com',
// 		firstName: 'Michael',
// 		lastName: 'Chen',
// 		role: 'company_admin',
// 		isEmailVerified: true,
// 	},
// 	{
// 		username: 'admin',
// 		email: 'admin@m4t.com',
// 		firstName: 'Jordan',
// 		lastName: 'Smith',
// 		role: 'internal_admin',
// 		isEmailVerified: true,
// 	},
// 	{
// 		username: 'emily_student',
// 		email: 'emily.davis@example.com',
// 		firstName: 'Emily',
// 		lastName: 'Davis',
// 		role: 'student',
// 		isEmailVerified: true,
// 	},
// 	{
// 		username: 'robert_student',
// 		email: 'robert.wilson@example.com',
// 		firstName: 'Robert',
// 		lastName: 'Wilson',
// 		role: 'student',
// 		isEmailVerified: true,
// 	},
// 	{
// 		username: 'maria_student',
// 		email: 'maria.garcia@example.com',
// 		firstName: 'Maria',
// 		lastName: 'Garcia',
// 		role: 'student',
// 		isEmailVerified: true,
// 	},
// ];

// async function main() {
// 	console.log('Starting M4T seed data generation...');

// 	try {
// 		const hashedPassword = await hashPassword('password123');

// 		// Clear existing data in correct order (respecting foreign key constraints)
// 		console.log('Clearing existing data...');
// 		await db.delete(userSubscriptions);
// 		await db.delete(enrollments);
// 		await db.delete(quizAnswers);
// 		await db.delete(quizQuestions);
// 		await db.delete(quizzes);
// 		await db.delete(lessons);
// 		await db.delete(modules);
// 		await db.delete(courses);
// 		await db.delete(subscriptionPlans);
// 		await db.delete(users);
// 		await db.delete(companies);
// 		await db.delete(categories);

// 		// Create categories first
// 		console.log('Creating course categories...');
// 		const createdCategories = [];
// 		const categoryNames = [
// 			'Web Development',
// 			'Data Science',
// 			'Marketing',
// 			'Design',
// 			'Business',
// 			'Technology',
// 		];

// 		for (const name of categoryNames) {
// 			const [category] = await db
// 				.insert(categories)
// 				.values({
// 					name,
// 					description: `Courses related to ${name.toLowerCase()}`,
// 				})
// 				.returning();
// 			createdCategories.push(category);
// 		}

// 		// Create companies
// 		console.log('Creating companies...');
// 		const [techCorp] = await db
// 			.insert(companies)
// 			.values({
// 				name: 'TechCorp Solutions',
// 				email: 'contact@techcorp.com',
// 				phone: '+1-555-0123',
// 				address: '123 Technology Drive, Silicon Valley, CA 94000',
// 			})
// 			.returning();

// 		// Create users with email verification TRUE
// 		console.log('Creating verified user accounts...');
// 		const createdUsers = [];

// 		for (const profile of userProfiles) {
// 			const companyId = profile.email.includes('techcorp') ? techCorp.id : null;

// 			const [user] = await db
// 				.insert(users)
// 				.values({
// 					id: profile.username,
// 					username: profile.username,
// 					email: profile.email,
// 					password: hashedPassword,
// 					firstName: profile.firstName,
// 					lastName: profile.lastName,
// 					role: profile.role,
// 					companyId,
// 					profileImageUrl: `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random`,
// 					isEmailVerified: true, // EXPLICITLY SET TO TRUE
// 					learningPreferences: {
// 						style: ['visual', 'auditory', 'reading', 'kinesthetic'][Math.floor(Math.random() * 4)],
// 						pace: ['slow', 'moderate', 'fast'][Math.floor(Math.random() * 3)],
// 					},
// 					interests: ['programming', 'design', 'business', 'marketing'].slice(
// 						0,
// 						Math.floor(Math.random() * 3) + 1
// 					),
// 					skillLevels: {
// 						programming: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
// 						design: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
// 					},
// 				})
// 				.returning();

// 			createdUsers.push(user);
// 		}

// 		// Create subscription plans
// 		console.log('Creating subscription plans...');
// 		const basicPlanData = {
// 			name: 'Basic',
// 			description: 'Perfect for individual learners',
// 			price: '9.99',
// 			period: 'month',
// 			features: ['Access to basic courses', 'Progress tracking', 'Community access'],
// 			isActive: true,
// 		};
// 		const [basicPlan] = await db.insert(subscriptionPlans).values(basicPlanData).returning();

// 		const proPlanData = {
// 			name: 'Professional',
// 			description: 'Advanced features for professionals',
// 			price: '19.99',
// 			period: 'month',
// 			features: ['Access to all courses', 'Advanced analytics', 'Priority support', 'Certificates'],
// 			isActive: true,
// 		};
// 		const [proPlan] = await db.insert(subscriptionPlans).values(proPlanData).returning();

// 		// Create courses with modules and lessons
// 		console.log('Creating courses with realistic content...');
// 		const createdCourses = [];

// 		for (const courseInfo of courseData) {
// 			const instructors = createdUsers.filter((u) => u.role === 'instructor');
// 			const randomInstructor = instructors[0] || createdUsers[1];
// 			const categoryMatch = createdCategories.find((c) => c.name === courseInfo.category);

// 			const [course] = await db
// 				.insert(courses)
// 				.values({
// 					title: courseInfo.title,
// 					description: courseInfo.description,
// 					coverImage: `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop`,
// 					duration: courseInfo.duration,
// 					level: courseInfo.level,
// 					categoryId: categoryMatch?.id,
// 					instructorId: randomInstructor.id,
// 					rating: (Math.random() * 1.5 + 3.5).toFixed(1),
// 					learningStyles: ['visual', 'reading'],
// 					prerequisites: courseInfo.level === 'intermediate' ? ['Basic programming knowledge'] : [],
// 					learningOutcomes: [
// 						`Master ${courseInfo.category.toLowerCase()} fundamentals`,
// 						'Build real-world projects',
// 						'Gain industry-relevant skills',
// 					],
// 				})
// 				.returning();

// 			createdCourses.push(course);

// 			// Create modules and lessons for each course
// 			for (let moduleIndex = 0; moduleIndex < courseInfo.modules.length; moduleIndex++) {
// 				const moduleInfo = courseInfo.modules[moduleIndex];

// 				const [module] = await db
// 					.insert(modules)
// 					.values({
// 						title: moduleInfo.title,
// 						description: `Learn ${moduleInfo.title.toLowerCase()} concepts and practices`,
// 						courseId: course.id,
// 						orderIndex: moduleIndex + 1,
// 					})
// 					.returning();

// 				// Create lessons for each module
// 				for (let lessonIndex = 0; lessonIndex < moduleInfo.lessons.length; lessonIndex++) {
// 					const lessonInfo = moduleInfo.lessons[lessonIndex];

// 					const [lesson] = await db
// 						.insert(lessons)
// 						.values({
// 							title: lessonInfo.title,
// 							content: lessonInfo.content,
// 							moduleId: module.id,
// 							videoUrl: `https://example.com/videos/course${course.id}/module${module.id}/lesson${
// 								lessonIndex + 1
// 							}.mp4`,
// 							duration: lessonInfo.duration,
// 							orderIndex: lessonIndex + 1,
// 							isPreview: moduleIndex === 0 && lessonIndex === 0, // First lesson of first module is preview
// 						})
// 						.returning();

// 					// Add interactive quiz to JavaScript Programming lesson
// 					if (lessonInfo.title === 'JavaScript Programming') {
// 						console.log('Creating interactive quiz for JavaScript Programming lesson...');

// 						const [quiz] = await db
// 							.insert(quizzes)
// 							.values({
// 								lessonId: lesson.id,
// 								title: 'JavaScript Fundamentals Quiz',
// 								description:
// 									'Test your understanding of JavaScript variables, functions, and DOM manipulation',
// 								passingScore: 75,
// 								timeLimit: 15, // 15 minutes
// 								maxAttempts: 3,
// 								isActive: true,
// 							})
// 							.returning();

// 						// Question 1: Variables and Data Types
// 						const [question1] = await db
// 							.insert(quizQuestions)
// 							.values({
// 								quizId: quiz.id,
// 								questionText:
// 									'Which of the following is the correct way to declare a variable in modern JavaScript?',
// 								questionType: 'multiple_choice',
// 								points: 1,
// 								explanation:
// 									'let and const are block-scoped and preferred in modern JavaScript. var is function-scoped and has hoisting issues.',
// 								orderIndex: 1,
// 							})
// 							.returning();

// 						await db.insert(quizAnswers).values([
// 							{
// 								questionId: question1.id,
// 								answerText: "var name = 'John';",
// 								isCorrect: false,
// 								orderIndex: 1,
// 							},
// 							{
// 								questionId: question1.id,
// 								answerText: "let name = 'John';",
// 								isCorrect: true,
// 								orderIndex: 2,
// 							},
// 							{
// 								questionId: question1.id,
// 								answerText: "string name = 'John';",
// 								isCorrect: false,
// 								orderIndex: 3,
// 							},
// 							{
// 								questionId: question1.id,
// 								answerText: "declare name = 'John';",
// 								isCorrect: false,
// 								orderIndex: 4,
// 							},
// 						]);

// 						// Question 2: Functions
// 						const [question2] = await db
// 							.insert(quizQuestions)
// 							.values({
// 								quizId: quiz.id,
// 								questionText:
// 									"What is the output of the following code?\n\nfunction greet(name = 'World') {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet());",
// 								questionType: 'multiple_choice',
// 								points: 2,
// 								explanation:
// 									"The function uses a default parameter 'World' when no argument is passed, and template literals for string interpolation.",
// 								orderIndex: 2,
// 							})
// 							.returning();

// 						await db.insert(quizAnswers).values([
// 							{
// 								questionId: question2.id,
// 								answerText: 'Hello, undefined!',
// 								isCorrect: false,
// 								orderIndex: 1,
// 							},
// 							{
// 								questionId: question2.id,
// 								answerText: 'Hello, World!',
// 								isCorrect: true,
// 								orderIndex: 2,
// 							},
// 							{
// 								questionId: question2.id,
// 								answerText: 'Hello, name!',
// 								isCorrect: false,
// 								orderIndex: 3,
// 							},
// 							{ questionId: question2.id, answerText: 'Error', isCorrect: false, orderIndex: 4 },
// 						]);

// 						// Question 3: DOM Manipulation
// 						const [question3] = await db
// 							.insert(quizQuestions)
// 							.values({
// 								quizId: quiz.id,
// 								questionText: 'Which method is used to select an element by its ID in the DOM?',
// 								questionType: 'multiple_choice',
// 								points: 1,
// 								explanation:
// 									'document.getElementById() is the standard method to select an element by its unique ID attribute.',
// 								orderIndex: 3,
// 							})
// 							.returning();

// 						await db.insert(quizAnswers).values([
// 							{
// 								questionId: question3.id,
// 								answerText: "document.querySelector('#id')",
// 								isCorrect: false,
// 								orderIndex: 1,
// 							},
// 							{
// 								questionId: question3.id,
// 								answerText: "document.getElementById('id')",
// 								isCorrect: true,
// 								orderIndex: 2,
// 							},
// 							{
// 								questionId: question3.id,
// 								answerText: "document.getElement('id')",
// 								isCorrect: false,
// 								orderIndex: 3,
// 							},
// 							{
// 								questionId: question3.id,
// 								answerText: "document.findById('id')",
// 								isCorrect: false,
// 								orderIndex: 4,
// 							},
// 						]);

// 						// Question 4: ES6 Features
// 						const [question4] = await db
// 							.insert(quizQuestions)
// 							.values({
// 								quizId: quiz.id,
// 								questionText: "What is the difference between 'let' and 'const' in JavaScript?",
// 								questionType: 'multiple_choice',
// 								points: 2,
// 								explanation:
// 									'const creates an immutable binding - the variable cannot be reassigned, while let allows reassignment. Both are block-scoped.',
// 								orderIndex: 4,
// 							})
// 							.returning();

// 						await db.insert(quizAnswers).values([
// 							{
// 								questionId: question4.id,
// 								answerText: 'No difference, they are the same',
// 								isCorrect: false,
// 								orderIndex: 1,
// 							},
// 							{
// 								questionId: question4.id,
// 								answerText: 'const creates immutable variables, let allows reassignment',
// 								isCorrect: true,
// 								orderIndex: 2,
// 							},
// 							{
// 								questionId: question4.id,
// 								answerText: 'let is for strings, const is for numbers',
// 								isCorrect: false,
// 								orderIndex: 3,
// 							},
// 							{
// 								questionId: question4.id,
// 								answerText: 'const is faster than let',
// 								isCorrect: false,
// 								orderIndex: 4,
// 							},
// 						]);

// 						// Question 5: Array Methods
// 						const [question5] = await db
// 							.insert(quizQuestions)
// 							.values({
// 								quizId: quiz.id,
// 								questionText:
// 									'Which array method creates a new array with the results of calling a function for every array element?',
// 								questionType: 'multiple_choice',
// 								points: 1,
// 								explanation:
// 									'The map() method creates a new array by calling a function on each element of the original array and collecting the results.',
// 								orderIndex: 5,
// 							})
// 							.returning();

// 						await db.insert(quizAnswers).values([
// 							{
// 								questionId: question5.id,
// 								answerText: 'forEach()',
// 								isCorrect: false,
// 								orderIndex: 1,
// 							},
// 							{ questionId: question5.id, answerText: 'map()', isCorrect: true, orderIndex: 2 },
// 							{ questionId: question5.id, answerText: 'filter()', isCorrect: false, orderIndex: 3 },
// 							{ questionId: question5.id, answerText: 'reduce()', isCorrect: false, orderIndex: 4 },
// 						]);
// 					}
// 				}
// 			}
// 		}

// 		// Create enrollments with progress
// 		console.log('Creating enrollments and progress...');
// 		const students = createdUsers.filter((u) => u.role === 'student');

// 		for (const student of students) {
// 			// Enroll each student in 1-3 courses
// 			const enrollmentCount = Math.floor(Math.random() * 3) + 1;
// 			const randomCourses = [...createdCourses]
// 				.sort(() => 0.5 - Math.random())
// 				.slice(0, enrollmentCount);

// 			for (const course of randomCourses) {
// 				await db.insert(enrollments).values({
// 					userId: student.id,
// 					courseId: course.id,
// 					enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
// 				});
// 			}
// 		}

// 		// Create some user subscriptions
// 		console.log('Creating user subscriptions...');
// 		for (let i = 0; i < students.length; i++) {
// 			const student = students[i];
// 			if (Math.random() > 0.4) {
// 				// 60% have subscriptions
// 				const plan = Math.random() > 0.5 ? basicPlan : proPlan;
// 				const subscriptionData = {
// 					userId: student.id,
// 					planId: plan.id,
// 					startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
// 						.toISOString()
// 						.split('T')[0],
// 					endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
// 					isActive: true,
// 				};
// 				await db.insert(userSubscriptions).values(subscriptionData);
// 			}
// 		}

// 		console.log('Seed data generation completed successfully!');
// 		console.log(`Created ${createdUsers.length} users (ALL with email verification = TRUE)`);
// 		console.log(`Created ${createdCourses.length} courses with realistic content`);
// 		console.log(`Created ${createdCategories.length} course categories`);
// 		console.log('Generated enrollments and subscription data');
// 		console.log('✓ Interactive quiz added to JavaScript Programming lesson with 5 questions');
// 		console.log('\nTest Login Credentials (all emails verified):');
// 		console.log('Student: student / password123');
// 		console.log('Instructor: instructor / password123');
// 		console.log('Company Admin: company / password123');
// 		console.log('Internal Admin: admin / password123');
// 	} catch (error) {
// 		console.error('Error during seed data generation:', error);
// 		throw error;
// 	}
// }

// // if (require.main === module) {
// // 	main()
// // 		.then(() => {
// // 			console.log('Seeding completed successfully!');
// // 			process.exit(0);
// // 		})
// // 		.catch((error) => {
// // 			console.error('Seeding failed:', error);
// // 			process.exit(1);
// // 		});
// // }

// // ES module check to run seeding when file is executed directly
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);

// if (process.argv[1] === __filename) {
// 	main().catch(console.error);
// }

// export { main as seedDatabase };

//// new fix fo stnytext errors:
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
	quizzes,
	quizQuestions,
	quizAnswers,
} from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${buf.toString('hex')}.${salt}`;
}

// Real course content data
const courseData = [
	{
		title: 'Complete Web Development Bootcamp',
		description:
			'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack web developer. This comprehensive course covers everything from basic web fundamentals to advanced full-stack development concepts with real project builds.',
		category: 'Web Development',
		level: 'beginner',
		duration: 2400, // 40 hours in minutes
		modules: [
			{
				title: 'Frontend Fundamentals',
				lessons: [
					{
						title: 'HTML Structure and Semantics',
						content: 'Learn semantic HTML, document structure, forms, and accessibility basics',
						duration: 45,
					},
					{
						title: 'CSS Styling and Layout',
						content: 'Master CSS Grid, Flexbox, animations, and responsive design principles',
						duration: 60,
					},
					{
						title: 'JavaScript Programming',
						content: 'Variables, functions, DOM manipulation, and modern ES6+ features',
						duration: 90,
					},
				],
			},
			{
				title: 'React Development',
				lessons: [
					{
						title: 'React Components',
						content: 'Building reusable components, state management, and hooks',
						duration: 75,
					},
					{
						title: 'State Management',
						content: 'Context API, Redux, and advanced state patterns',
						duration: 80,
					},
				],
			},
			{
				title: 'Backend Development',
				lessons: [
					{
						title: 'Node.js and Express',
						content: 'Server-side development, REST APIs, and authentication',
						duration: 80,
					},
					{
						title: 'Database Integration',
						content: 'MongoDB, Mongoose, and data modeling',
						duration: 70,
					},
					{
						title: 'Deployment and DevOps',
						content: 'Git workflows, hosting platforms, and production deployment',
						duration: 50,
					},
				],
			},
		],
	},
	{
		title: 'Data Science with Python',
		description:
			'Comprehensive data analysis, visualization, and machine learning using Python ecosystem. Learn pandas, NumPy, matplotlib, and scikit-learn through hands-on projects with real datasets.',
		category: 'Data Science',
		level: 'intermediate',
		duration: 2100, // 35 hours
		modules: [
			{
				title: 'Python for Data Science',
				lessons: [
					{
						title: 'Python Setup and Jupyter',
						content: 'Jupyter notebooks, virtual environments, and essential libraries',
						duration: 40,
					},
					{
						title: 'Data Structures',
						content: 'Lists, dictionaries, NumPy arrays, and pandas DataFrames',
						duration: 55,
					},
				],
			},
			{
				title: 'Data Analysis',
				lessons: [
					{
						title: 'Data Manipulation with Pandas',
						content: 'DataFrames, data cleaning, merging, and transformation techniques',
						duration: 70,
					},
					{
						title: 'Statistical Analysis',
						content: 'Descriptive statistics, hypothesis testing, and correlation analysis',
						duration: 65,
					},
				],
			},
			{
				title: 'Machine Learning',
				lessons: [
					{
						title: 'Supervised Learning',
						content: 'Regression, classification, and model evaluation techniques',
						duration: 85,
					},
					{
						title: 'Unsupervised Learning',
						content: 'Clustering, dimensionality reduction, and pattern recognition',
						duration: 60,
					},
				],
			},
		],
	},
	{
		title: 'Digital Marketing Strategy',
		description:
			'Complete digital marketing course covering SEO, social media marketing, email campaigns, and paid advertising. Includes real case studies from successful campaigns and hands-on tools training.',
		category: 'Marketing',
		level: 'beginner',
		duration: 1500, // 25 hours
		modules: [
			{
				title: 'Marketing Fundamentals',
				lessons: [
					{
						title: 'Digital Marketing Overview',
						content: 'Marketing funnels, customer personas, and channel strategy',
						duration: 35,
					},
					{
						title: 'Market Research',
						content: 'Competitor analysis, target audience identification, and market sizing',
						duration: 40,
					},
				],
			},
			{
				title: 'Organic Marketing',
				lessons: [
					{
						title: 'Search Engine Optimization',
						content: 'Keyword research, on-page SEO, link building, and technical SEO',
						duration: 55,
					},
					{
						title: 'Content Marketing',
						content: 'Content strategy, blog writing, and content distribution channels',
						duration: 45,
					},
				],
			},
			{
				title: 'Paid Marketing',
				lessons: [
					{
						title: 'Google Ads Mastery',
						content: 'Campaign setup, keyword bidding, ad copy optimization',
						duration: 50,
					},
					{
						title: 'Social Media Advertising',
						content: 'Facebook Ads, Instagram marketing, and social media strategy',
						duration: 45,
					},
				],
			},
		],
	},
];

// Test user profiles with email verification set to true
const userProfiles = [
	{
		username: 'student',
		email: 'student@test.com',
		firstName: 'Alex',
		lastName: 'Johnson',
		role: 'student' as const,
		isEmailVerified: true,
	},
	{
		username: 'instructor',
		email: 'instructor@test.com',
		firstName: 'Sarah',
		lastName: 'Martinez',
		role: 'instructor' as const,
		isEmailVerified: true,
	},
	{
		username: 'company',
		email: 'admin@techcorp.com',
		firstName: 'Michael',
		lastName: 'Chen',
		role: 'company_admin' as const,
		isEmailVerified: true,
	},
	{
		username: 'admin',
		email: 'admin@m4t.com',
		firstName: 'Jordan',
		lastName: 'Smith',
		role: 'internal_admin' as const,
		isEmailVerified: true,
	},
	{
		username: 'emily_student',
		email: 'emily.davis@example.com',
		firstName: 'Emily',
		lastName: 'Davis',
		role: 'student' as const,
		isEmailVerified: true,
	},
	{
		username: 'robert_student',
		email: 'robert.wilson@example.com',
		firstName: 'Robert',
		lastName: 'Wilson',
		role: 'student' as const,
		isEmailVerified: true,
	},
	{
		username: 'maria_student',
		email: 'maria.garcia@example.com',
		firstName: 'Maria',
		lastName: 'Garcia',
		role: 'student' as const,
		isEmailVerified: true,
	},
];

async function seedDatabase() {
	console.log('Starting M4T seed data generation...');

	try {
		const hashedPassword = await hashPassword('password123');

		// Clear existing data in correct order (respecting foreign key constraints)
		console.log('Clearing existing data...');
		await db.delete(userSubscriptions);
		await db.delete(enrollments);
		await db.delete(quizAnswers);
		await db.delete(quizQuestions);
		await db.delete(quizzes);
		await db.delete(lessons);
		await db.delete(modules);
		await db.delete(courses);
		await db.delete(subscriptionPlans);
		await db.delete(users);
		await db.delete(companies);
		await db.delete(categories);

		// Create categories first
		console.log('Creating course categories...');
		const createdCategories = [];
		const categoryNames = [
			'Web Development',
			'Data Science',
			'Marketing',
			'Design',
			'Business',
			'Technology',
		];

		for (const name of categoryNames) {
			const [category] = await db
				.insert(categories)
				.values({
					name,
					description: `Courses related to ${name.toLowerCase()}`,
				})
				.returning();
			createdCategories.push(category);
		}

		// Create companies
		console.log('Creating companies...');
		const [techCorp] = await db
			.insert(companies)
			.values({
				name: 'TechCorp Solutions',
				email: 'contact@techcorp.com',
				phone: '+1-555-0123',
				address: '123 Technology Drive, Silicon Valley, CA 94000',
			})
			.returning();

		// Create users with email verification TRUE
		console.log('Creating verified user accounts...');
		const createdUsers = [];

		for (const profile of userProfiles) {
			const companyId = profile.email.includes('techcorp') ? techCorp.id : null;

			const [user] = await db
				.insert(users)
				.values({
					id: profile.username,
					username: profile.username,
					email: profile.email,
					password: hashedPassword,
					firstName: profile.firstName,
					lastName: profile.lastName,
					role: profile.role,
					companyId,
					profileImageUrl: `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random`,
					isEmailVerified: true, // EXPLICITLY SET TO TRUE
					learningPreferences: {
						style: ['visual', 'auditory', 'reading', 'kinesthetic'][Math.floor(Math.random() * 4)],
						pace: ['slow', 'moderate', 'fast'][Math.floor(Math.random() * 3)],
					},
					interests: ['programming', 'design', 'business', 'marketing'].slice(
						0,
						Math.floor(Math.random() * 3) + 1
					),
					skillLevels: {
						programming: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
						design: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
					},
				})
				.returning();

			createdUsers.push(user);
		}

		// Create subscription plans
		console.log('Creating subscription plans...');
		const basicPlanData = {
			name: 'Basic',
			description: 'Perfect for individual learners',
			price: '9.99',
			period: 'MONTHLY',
			features: ['Access to basic courses', 'Progress tracking', 'Community access'],
			isActive: true,
		};
		const [basicPlan] = await db.insert(subscriptionPlans).values(basicPlanData).returning();

		const proPlanData = {
			name: 'Professional',
			description: 'Advanced features for professionals',
			price: '19.99',
			period: 'MONTHLY',
			features: ['Access to all courses', 'Advanced analytics', 'Priority support', 'Certificates'],
			isActive: true,
		};
		const [proPlan] = await db.insert(subscriptionPlans).values(proPlanData).returning();

		// Create courses with modules and lessons
		console.log('Creating courses with realistic content...');
		const createdCourses = [];

		for (const courseInfo of courseData) {
			const instructors = createdUsers.filter((u) => u.role === 'instructor');
			const randomInstructor = instructors[0] || createdUsers[1];
			const categoryMatch = createdCategories.find((c) => c.name === courseInfo.category);

			const [course] = await db
				.insert(courses)
				.values({
					title: courseInfo.title,
					description: courseInfo.description,
					coverImage: `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop`,
					duration: courseInfo.duration,
					level: courseInfo.level,
					categoryId: categoryMatch?.id,
					instructorId: randomInstructor.id,
					rating: (Math.random() * 1.5 + 3.5).toFixed(1),
					learningStyles: ['visual', 'reading'],
					prerequisites: courseInfo.level === 'intermediate' ? ['Basic programming knowledge'] : [],
					learningOutcomes: [
						`Master ${courseInfo.category.toLowerCase()} fundamentals`,
						'Build real-world projects',
						'Gain industry-relevant skills',
					],
				})
				.returning();

			createdCourses.push(course);

			// Create modules and lessons for each course
			for (let moduleIndex = 0; moduleIndex < courseInfo.modules.length; moduleIndex++) {
				const moduleInfo = courseInfo.modules[moduleIndex];

				const [module] = await db
					.insert(modules)
					.values({
						title: moduleInfo.title,
						description: `Learn ${moduleInfo.title.toLowerCase()} concepts and practices`,
						courseId: course.id,
						orderIndex: moduleIndex + 1,
					})
					.returning();

				// Create lessons for each module
				for (let lessonIndex = 0; lessonIndex < moduleInfo.lessons.length; lessonIndex++) {
					const lessonInfo = moduleInfo.lessons[lessonIndex];

					const [lesson] = await db
						.insert(lessons)
						.values({
							title: lessonInfo.title,
							content: lessonInfo.content,
							moduleId: module.id,
							videoUrl: `https://example.com/videos/course${course.id}/module${module.id}/lesson${
								lessonIndex + 1
							}.mp4`,
							duration: lessonInfo.duration,
							orderIndex: lessonIndex + 1,
							isPreview: moduleIndex === 0 && lessonIndex === 0, // First lesson of first module is preview
						})
						.returning();

					// Add interactive quiz to JavaScript Programming lesson
					if (lessonInfo.title === 'JavaScript Programming') {
						console.log('Creating interactive quiz for JavaScript Programming lesson...');

						const [quiz] = await db
							.insert(quizzes)
							.values({
								lessonId: lesson.id,
								title: 'JavaScript Fundamentals Quiz',
								description: 'Test your understanding of JavaScript basics',
								passingScore: 70,
								timeLimit: 15, // 15 minutes
								maxAttempts: 3,
								isActive: true,
							})
							.returning();

						// Create quiz questions
						const quizQuestionsData = [
							{
								questionText: 'What is the correct way to declare a variable in JavaScript?',
								questionType: 'multiple_choice',
								points: 1,
								explanation:
									'let is the modern way to declare block-scoped variables in JavaScript.',
								orderIndex: 1,
								answers: [
									{ answerText: 'let myVariable = "value";', isCorrect: true, orderIndex: 1 },
									{ answerText: 'variable myVariable = "value";', isCorrect: false, orderIndex: 2 },
									{ answerText: 'declare myVariable = "value";', isCorrect: false, orderIndex: 3 },
									{ answerText: 'set myVariable = "value";', isCorrect: false, orderIndex: 4 },
								],
							},
							{
								questionText: 'Which method is used to add an element to the end of an array?',
								questionType: 'multiple_choice',
								points: 1,
								explanation: 'The push() method adds one or more elements to the end of an array.',
								orderIndex: 2,
								answers: [
									{ answerText: 'push()', isCorrect: true, orderIndex: 1 },
									{ answerText: 'add()', isCorrect: false, orderIndex: 2 },
									{ answerText: 'append()', isCorrect: false, orderIndex: 3 },
									{ answerText: 'insert()', isCorrect: false, orderIndex: 4 },
								],
							},
							{
								questionText: 'What does DOM stand for?',
								questionType: 'multiple_choice',
								points: 1,
								explanation:
									'DOM stands for Document Object Model, which represents the structure of HTML documents.',
								orderIndex: 3,
								answers: [
									{ answerText: 'Document Object Model', isCorrect: true, orderIndex: 1 },
									{ answerText: 'Data Object Management', isCorrect: false, orderIndex: 2 },
									{ answerText: 'Dynamic Object Mapping', isCorrect: false, orderIndex: 3 },
									{ answerText: 'Document Oriented Markup', isCorrect: false, orderIndex: 4 },
								],
							},
						];

						for (const questionData of quizQuestionsData) {
							const [question] = await db
								.insert(quizQuestions)
								.values({
									quizId: quiz.id,
									questionText: questionData.questionText,
									questionType: questionData.questionType,
									points: questionData.points,
									explanation: questionData.explanation,
									orderIndex: questionData.orderIndex,
								})
								.returning();

							// Create answers for this question
							for (const answerData of questionData.answers) {
								await db.insert(quizAnswers).values({
									questionId: question.id,
									answerText: answerData.answerText,
									isCorrect: answerData.isCorrect,
									orderIndex: answerData.orderIndex,
								});
							}
						}
					}
				}
			}
		}

		// Create enrollments for students
		console.log('Creating sample enrollments...');
		const students = createdUsers.filter((u) => u.role === 'student');

		for (const student of students) {
			// Enroll each student in 1-2 random courses
			const coursesToEnroll = createdCourses.slice(0, Math.floor(Math.random() * 2) + 1);

			for (const course of coursesToEnroll) {
				await db.insert(enrollments).values({
					userId: student.id,
					courseId: course.id,
					enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
				});
			}
		}

		// Create user subscriptions
		console.log('Creating user subscriptions...');
		const subscribingUsers = students.slice(0, 3); // First 3 students get subscriptions

		for (const user of subscribingUsers) {
			const plan = Math.random() > 0.5 ? basicPlan : proPlan;
			const startDate = new Date();
			const endDate = new Date();
			endDate.setMonth(endDate.getMonth() + (plan.period === 'MONTHLY' ? 1 : 12));

			await db.insert(userSubscriptions).values({
				userId: user.id,
				planId: plan.id,
				startDate: startDate.toISOString().split('T')[0],
				endDate: endDate.toISOString().split('T')[0],
				isActive: true,
			});
		}

		console.log('\n🎉 Database seeding completed successfully!');
		console.log('\n📚 Created:');
		console.log(`- ${createdCategories.length} course categories`);
		console.log(`- ${createdUsers.length} verified user accounts`);
		console.log(`- ${createdCourses.length} comprehensive courses`);
		console.log(`- Multiple modules and lessons per course`);
		console.log(`- Interactive quiz for JavaScript Programming lesson`);
		console.log(`- Sample enrollments and subscriptions`);

		console.log('\n🔐 Test Accounts (all verified):');
		console.log('- student / password123 (Student role)');
		console.log('- instructor / password123 (Instructor role)');
		console.log('- company / password123 (Company Admin role)');
		console.log('- admin / password123 (Internal Admin role)');
		console.log('- emily_student / password123 (Student role)');
		console.log('- robert_student / password123 (Student role)');
		console.log('- maria_student / password123 (Student role)');
	} catch (error) {
		console.error('❌ Database seeding failed:', error);
		throw error;
	}
}

// ES module check to run seeding when file is executed directly
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
	seedDatabase().catch(console.error);
}

export { seedDatabase };
