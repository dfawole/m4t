/**
 * M4T Complete Database Seeding - UAT Testing Data
 *
 * TEST ACCOUNTS (All passwords: password123):
 *
 * STUDENTS:
 * - student@test.com (Alex Johnson)
 * - emily.davis@example.com (Emily Davis)
 * - demo@example.com (Demo User)
 *
 * INSTRUCTORS:
 * - instructor@test.com (Sarah Martinez)
 * - robert.wilson@example.com (Robert Wilson)
 *
 * COMPANY ADMINS:
 * - admin@techcorp.com (Michael Chen - TechCorp)
 * - maria.garcia@innovate.com (Maria Garcia - Innovate Inc)
 *
 * PLATFORM ADMIN:
 * - admin@m4t.com (Jordan Smith)
 */

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
	lessonCompletions,
} from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${buf.toString('hex')}.${salt}`;
}

async function seedCompleteDatabase() {
	console.log('🚀 Starting M4T Complete Database Seeding...');

	try {
		const hashedPassword = await hashPassword('password123');

		// Clear existing data in correct order
		console.log('🧹 Clearing existing data...');
		await db.delete(userSubscriptions);
		await db.delete(lessonCompletions);
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

		// 1. Create Categories
		console.log('📂 Creating course categories...');
		const categoryData = [
			{ name: 'Web Development', description: 'Frontend and backend web development courses' },
			{ name: 'Data Science', description: 'Data analysis, machine learning, and analytics' },
			{ name: 'Digital Marketing', description: 'SEO, social media, and digital advertising' },
			{ name: 'UI/UX Design', description: 'User interface and user experience design' },
			{ name: 'Business', description: 'Management, strategy, and entrepreneurship' },
			{ name: 'Mobile Development', description: 'iOS and Android app development' },
		];

		const createdCategories = [];
		for (const cat of categoryData) {
			const [category] = await db.insert(categories).values(cat).returning();
			createdCategories.push(category);
		}

		// 2. Create Companies
		console.log('🏢 Creating companies...');
		const [techCorp] = await db
			.insert(companies)
			.values({
				name: 'TechCorp Solutions',
				email: 'contact@techcorp.com',
				phone: '+1-555-0123',
				address: '123 Technology Drive, Silicon Valley, CA 94000',
			})
			.returning();

		const [innovateInc] = await db
			.insert(companies)
			.values({
				name: 'Innovate Inc.',
				email: 'hello@innovate.com',
				phone: '+1-555-0456',
				address: '456 Innovation Blvd, Austin, TX 78701',
			})
			.returning();

		// 3. Create Users
		console.log('👥 Creating verified user accounts...');
		const userProfiles = [
			// Primary test accounts
			{
				id: 'student',
				username: 'student',
				email: 'student@test.com',
				firstName: 'Alex',
				lastName: 'Johnson',
				role: 'student' as const,
				companyId: null,
			},
			{
				id: 'instructor',
				username: 'instructor',
				email: 'instructor@test.com',
				firstName: 'Sarah',
				lastName: 'Martinez',
				role: 'instructor' as const,
				companyId: null,
			},
			{
				id: 'admin',
				username: 'admin',
				email: 'admin@m4t.com',
				firstName: 'Jordan',
				lastName: 'Smith',
				role: 'internal_admin' as const,
				companyId: null,
			},
			// Demo user for quick testing
			{
				id: 'demo_user',
				username: 'demo_user',
				email: 'demo@example.com',
				firstName: 'Demo',
				lastName: 'User',
				role: 'student' as const,
				companyId: null,
			},
			// Additional students for testing
			{
				id: 'emily_student',
				username: 'emily_student',
				email: 'emily.davis@example.com',
				firstName: 'Emily',
				lastName: 'Davis',
				role: 'student' as const,
				companyId: null,
			},
			// Additional instructors
			{
				id: 'robert_instructor',
				username: 'robert_instructor',
				email: 'robert.wilson@example.com',
				firstName: 'Robert',
				lastName: 'Wilson',
				role: 'instructor' as const,
				companyId: null,
			},
			// Company admins
			{
				id: 'company_admin_tech',
				username: 'company_admin_tech',
				email: 'admin@techcorp.com',
				firstName: 'Michael',
				lastName: 'Chen',
				role: 'company_admin' as const,
				companyId: techCorp.id,
			},
			{
				id: 'company_admin_innovate',
				username: 'company_admin_innovate',
				email: 'maria.garcia@innovate.com',
				firstName: 'Maria',
				lastName: 'Garcia',
				role: 'company_admin' as const,
				companyId: innovateInc.id,
			},
		];

		const createdUsers = [];
		for (const profile of userProfiles) {
			const [user] = await db
				.insert(users)
				.values({
					...profile,
					password: hashedPassword,
					profileImageUrl: `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random`,
					isEmailVerified: true,
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

		// 4. Create Subscription Plans
		console.log('💳 Creating subscription plans...');
		const planData = [
			{
				name: 'Basic',
				description: 'Perfect for individual learners starting their journey',
				price: 9.99,
				period: 'MONTHLY',
				features: [
					'Access to 50+ courses',
					'Basic progress tracking',
					'Email support',
					'Mobile access',
				],
				isActive: true,
			},
			{
				name: 'Professional',
				description: 'Advanced features for serious learners and professionals',
				price: 19.99,
				period: 'MONTHLY',
				features: [
					'Access to all courses',
					'Advanced analytics',
					'Priority support',
					'Certificates',
					'Offline downloads',
				],
				isActive: true,
			},
			{
				name: 'Team',
				description: 'Collaboration tools for teams and small businesses',
				price: 49.99,
				period: 'MONTHLY',
				features: [
					'All Professional features',
					'Team management',
					'Usage analytics',
					'Custom learning paths',
					'Dedicated support',
				],
				isActive: true,
			},
			{
				name: 'Enterprise',
				description: 'Full-scale solution for large organizations',
				price: 199.99,
				period: 'MONTHLY',
				features: [
					'All Team features',
					'Custom integrations',
					'SSO support',
					'Advanced reporting',
					'Account manager',
				],
				isActive: true,
			},
		];

		const createdPlans = [];
		for (const plan of planData) {
			const [createdPlan] = await db.insert(subscriptionPlans).values(plan).returning();
			createdPlans.push(createdPlan);
		}

		// 5. Create Comprehensive Courses
		console.log('📚 Creating comprehensive courses...');
		const courseTemplates = [
			{
				title: 'Complete JavaScript Mastery',
				description:
					'Master JavaScript from fundamentals to advanced concepts. Build real-world projects and learn modern ES6+ features, async programming, and DOM manipulation.',
				categoryName: 'Web Development',
				level: 'beginner',
				duration: 1800, // 30 hours
				coverImage:
					'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
				modules: [
					{
						title: 'JavaScript Fundamentals',
						description: 'Core JavaScript concepts and syntax',
						lessons: [
							{
								title: 'Variables and Data Types',
								content: 'Understanding JavaScript variables, primitive types, and type conversion',
								duration: 45,
							},
							{
								title: 'Functions and Scope',
								content: 'Function declarations, expressions, arrow functions, and scope chain',
								duration: 60,
							},
							{
								title: 'Control Flow and Loops',
								content: 'Conditional statements, loops, and flow control mechanisms',
								duration: 50,
							},
						],
					},
					{
						title: 'DOM Manipulation',
						description: 'Working with the Document Object Model',
						lessons: [
							{
								title: 'Selecting Elements',
								content: 'DOM selection methods and traversing the DOM tree',
								duration: 40,
							},
							{
								title: 'Event Handling',
								content: 'Adding event listeners and handling user interactions',
								duration: 55,
							},
							{
								title: 'Dynamic Content',
								content: 'Creating, modifying, and removing DOM elements dynamically',
								duration: 65,
							},
						],
					},
					{
						title: 'Asynchronous JavaScript',
						description: 'Handling asynchronous operations',
						lessons: [
							{
								title: 'Promises and Async/Await',
								content: 'Understanding promises, async/await syntax, and error handling',
								duration: 70,
							},
							{
								title: 'Fetch API and AJAX',
								content: 'Making HTTP requests and working with APIs',
								duration: 60,
							},
						],
					},
				],
			},
			{
				title: 'React Development Bootcamp',
				description:
					'Build modern web applications with React. Learn components, hooks, state management, and routing in this comprehensive React course.',
				categoryName: 'Web Development',
				level: 'intermediate',
				duration: 2400, // 40 hours
				coverImage:
					'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
				modules: [
					{
						title: 'React Basics',
						description: 'Foundation concepts of React development',
						lessons: [
							{
								title: 'Components and JSX',
								content: 'Creating React components and understanding JSX syntax',
								duration: 50,
							},
							{
								title: 'Props and State',
								content: 'Component props, state management, and data flow',
								duration: 65,
							},
							{
								title: 'Event Handling in React',
								content: 'Handling events and user interactions in React components',
								duration: 45,
							},
						],
					},
					{
						title: 'React Hooks',
						description: 'Modern React with hooks',
						lessons: [
							{
								title: 'useState and useEffect',
								content: 'Managing state and side effects with hooks',
								duration: 70,
							},
							{
								title: 'Custom Hooks',
								content: 'Creating reusable custom hooks for common functionality',
								duration: 60,
							},
						],
					},
				],
			},
			{
				title: 'Data Science with Python',
				description:
					'Complete data science course covering pandas, NumPy, visualization, and machine learning. Work with real datasets and build predictive models.',
				categoryName: 'Data Science',
				level: 'intermediate',
				duration: 3000, // 50 hours
				coverImage:
					'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
				modules: [
					{
						title: 'Python for Data Science',
						description: 'Python fundamentals for data analysis',
						lessons: [
							{
								title: 'NumPy Arrays',
								content: 'Working with NumPy arrays and mathematical operations',
								duration: 60,
							},
							{
								title: 'Pandas DataFrames',
								content: 'Data manipulation and analysis with pandas',
								duration: 75,
							},
							{
								title: 'Data Cleaning',
								content: 'Handling missing data, duplicates, and data preprocessing',
								duration: 65,
							},
						],
					},
					{
						title: 'Data Visualization',
						description: 'Creating compelling data visualizations',
						lessons: [
							{
								title: 'Matplotlib Basics',
								content: 'Creating plots and charts with matplotlib',
								duration: 55,
							},
							{
								title: 'Seaborn Advanced Plots',
								content: 'Statistical visualizations with seaborn',
								duration: 50,
							},
						],
					},
				],
			},
			{
				title: 'Digital Marketing Strategy',
				description:
					'Master digital marketing from SEO to social media. Learn to create effective campaigns, analyze metrics, and drive business growth.',
				categoryName: 'Digital Marketing',
				level: 'beginner',
				duration: 1500, // 25 hours
				coverImage:
					'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
				modules: [
					{
						title: 'Marketing Fundamentals',
						description: 'Core digital marketing concepts',
						lessons: [
							{
								title: 'Marketing Strategy',
								content: 'Developing comprehensive digital marketing strategies',
								duration: 45,
							},
							{
								title: 'Target Audience Analysis',
								content: 'Identifying and understanding your target market',
								duration: 50,
							},
						],
					},
					{
						title: 'SEO and Content Marketing',
						description: 'Search engine optimization and content strategy',
						lessons: [
							{
								title: 'Keyword Research',
								content: 'Finding and analyzing profitable keywords',
								duration: 60,
							},
							{
								title: 'Content Creation',
								content: 'Creating engaging content that converts',
								duration: 55,
							},
						],
					},
				],
			},
			{
				title: 'UI/UX Design Principles',
				description:
					'Learn user-centered design principles, wireframing, prototyping, and design tools. Create intuitive and beautiful user interfaces.',
				categoryName: 'UI/UX Design',
				level: 'beginner',
				duration: 1800, // 30 hours
				coverImage:
					'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
				modules: [
					{
						title: 'Design Fundamentals',
						description: 'Core principles of good design',
						lessons: [
							{
								title: 'Design Thinking Process',
								content: 'User-centered design methodology and process',
								duration: 50,
							},
							{
								title: 'Color Theory and Typography',
								content: 'Visual design principles and typography rules',
								duration: 65,
							},
						],
					},
					{
						title: 'User Experience Design',
						description: 'Creating great user experiences',
						lessons: [
							{
								title: 'User Research Methods',
								content: 'Conducting user interviews and usability testing',
								duration: 70,
							},
							{
								title: 'Wireframing and Prototyping',
								content: 'Creating wireframes and interactive prototypes',
								duration: 60,
							},
						],
					},
				],
			},
		];

		const createdCourses = [];
		const instructors = createdUsers.filter((u) => u.role === 'instructor');

		for (let i = 0; i < courseTemplates.length; i++) {
			const template = courseTemplates[i];
			const instructor = instructors[i % instructors.length];
			const category = createdCategories.find((c) => c.name === template.categoryName);

			const [course] = await db
				.insert(courses)
				.values({
					title: template.title,
					description: template.description,
					coverImage: template.coverImage,
					duration: template.duration,
					level: template.level,
					categoryId: category?.id,
					instructorId: instructor.id,
					rating: (Math.random() * 1.5 + 3.5).toFixed(1),
					learningStyles: ['visual', 'reading', 'auditory'],
					prerequisites: template.level === 'intermediate' ? ['Basic programming knowledge'] : [],
					learningOutcomes: [
						`Master ${template.categoryName.toLowerCase()} fundamentals`,
						'Build practical projects',
						'Apply industry best practices',
						'Gain hands-on experience',
					],
				})
				.returning();

			createdCourses.push(course);

			// Create modules and lessons
			for (let moduleIndex = 0; moduleIndex < template.modules.length; moduleIndex++) {
				const moduleTemplate = template.modules[moduleIndex];

				const [module] = await db
					.insert(modules)
					.values({
						title: moduleTemplate.title,
						description: moduleTemplate.description,
						courseId: course.id,
						orderIndex: moduleIndex + 1,
					})
					.returning();

				// Create lessons
				for (let lessonIndex = 0; lessonIndex < moduleTemplate.lessons.length; lessonIndex++) {
					const lessonTemplate = moduleTemplate.lessons[lessonIndex];

					// Calculate if this is a free lesson (first 2 lessons of each course)
					const totalLessonsBeforeThis =
						template.modules
							.slice(0, moduleIndex)
							.reduce((sum, mod) => sum + mod.lessons.length, 0) + lessonIndex;
					const isFreeLesson = totalLessonsBeforeThis < 2;

					const [lesson] = await db
						.insert(lessons)
						.values({
							title: lessonTemplate.title,
							content: lessonTemplate.content,
							moduleId: module.id,
							videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
							quizVideoUrl: isFreeLesson
								? 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4'
								: null,
							duration: lessonTemplate.duration,
							orderIndex: lessonIndex + 1,
							isPreview: isFreeLesson, // First two lessons are free preview
						})
						.returning();

					// Add quiz to all free lessons
					if (isFreeLesson) {
						const quizTitle = `${lessonTemplate.title} Quiz`;
						const quizDescription = `Test your understanding of ${lessonTemplate.title.toLowerCase()}`;

						const [quiz] = await db
							.insert(quizzes)
							.values({
								lessonId: lesson.id,
								title: quizTitle,
								description: quizDescription,
								passingScore: 70,
								timeLimit: 10,
								maxAttempts: 3,
								isActive: true,
							})
							.returning();

						// Create quiz questions based on lesson content
						let questions = [];

						if (
							lessonTemplate.title.includes('Variables') ||
							lessonTemplate.title.includes('Data Types')
						) {
							questions = [
								{
									questionText: 'Which of the following is a primitive data type?',
									answers: [
										{ text: 'string', isCorrect: true },
										{ text: 'array', isCorrect: false },
										{ text: 'object', isCorrect: false },
										{ text: 'function', isCorrect: false },
									],
								},
								{
									questionText: 'What keyword is used to declare a constant variable?',
									answers: [
										{ text: 'const', isCorrect: true },
										{ text: 'let', isCorrect: false },
										{ text: 'var', isCorrect: false },
										{ text: 'final', isCorrect: false },
									],
								},
							];
						} else if (lessonTemplate.title.includes('Functions')) {
							questions = [
								{
									questionText:
										'What is the difference between function declaration and function expression?',
									answers: [
										{
											text: 'Function declarations are hoisted, expressions are not',
											isCorrect: true,
										},
										{ text: 'No difference', isCorrect: false },
										{ text: 'Expressions are faster', isCorrect: false },
										{ text: 'Declarations cannot have parameters', isCorrect: false },
									],
								},
								{
									questionText: 'What is lexical scope?',
									answers: [
										{
											text: 'Variables are accessible based on where they are defined',
											isCorrect: true,
										},
										{ text: 'Variables are global by default', isCorrect: false },
										{ text: 'Functions cannot access outer variables', isCorrect: false },
										{ text: 'Scope is determined at runtime', isCorrect: false },
									],
								},
							];
						} else {
							// Generic questions for other free lessons
							questions = [
								{
									questionText: `What is the main focus of "${lessonTemplate.title}"?`,
									answers: [
										{
											text: `Understanding ${lessonTemplate.title.toLowerCase()} concepts`,
											isCorrect: true,
										},
										{ text: 'Advanced programming techniques', isCorrect: false },
										{ text: 'Database management', isCorrect: false },
										{ text: 'Network security', isCorrect: false },
									],
								},
								{
									questionText: 'Which approach is most effective for learning new concepts?',
									answers: [
										{ text: 'Practice with hands-on examples', isCorrect: true },
										{ text: 'Memorizing theory only', isCorrect: false },
										{ text: 'Skipping practical exercises', isCorrect: false },
										{ text: 'Avoiding documentation', isCorrect: false },
									],
								},
							];
						}

						for (let qIndex = 0; qIndex < questions.length; qIndex++) {
							const questionData = questions[qIndex];
							const [question] = await db
								.insert(quizQuestions)
								.values({
									quizId: quiz.id,
									questionText: questionData.questionText,
									questionType: 'multiple_choice',
									points: 1,
									explanation: `This question tests your understanding of key concepts from ${lessonTemplate.title}.`,
									orderIndex: qIndex + 1,
								})
								.returning();

							// Create answers
							for (let aIndex = 0; aIndex < questionData.answers.length; aIndex++) {
								const answerData = questionData.answers[aIndex];
								await db.insert(quizAnswers).values({
									questionId: question.id,
									answerText: answerData.text,
									isCorrect: answerData.isCorrect,
									orderIndex: aIndex + 1,
								});
							}
						}
					}
				}
			}
		}

		// 6. Create User Subscriptions
		console.log('📝 Creating user subscriptions...');
		const students = createdUsers.filter((u) => u.role === 'student');
		const companyAdmins = createdUsers.filter((u) => u.role === 'company_admin');

		// Subscribe students to different plans
		const [basicPlan, proPlan, teamPlan] = createdPlans;
		const startDate = new Date();
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);

		await db.insert(userSubscriptions).values({
			userId: students[0].id,
			planId: proPlan.id,
			startDate: startDate.toISOString().split('T')[0],
			endDate: endDate.toISOString().split('T')[0],
			isActive: true,
			stripeSubscriptionId: 'sub_test_pro_1234',
		});

		if (students[1]) {
			await db.insert(userSubscriptions).values({
				userId: students[1].id,
				planId: basicPlan.id,
				startDate: startDate.toISOString().split('T')[0],
				endDate: endDate.toISOString().split('T')[0],
				isActive: true,
				stripeSubscriptionId: 'sub_test_basic_5678',
			});
		}

		// Subscribe company admins to team plans
		for (const companyAdmin of companyAdmins) {
			await db.insert(userSubscriptions).values({
				userId: companyAdmin.id,
				planId: teamPlan.id,
				startDate: startDate.toISOString().split('T')[0],
				endDate: endDate.toISOString().split('T')[0],
				isActive: true,
				stripeSubscriptionId: `sub_test_team_${Math.random().toString(36).substr(2, 9)}`,
			});
		}

		// 7. Create Enrollments
		console.log('🎓 Creating course enrollments...');

		// Enroll students in courses
		for (const student of students) {
			const coursesToEnroll = createdCourses.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 courses

			for (const course of coursesToEnroll) {
				await db.insert(enrollments).values({
					userId: student.id,
					courseId: course.id,
					enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
				});
			}
		}

		// Enroll company admins in business-related courses
		const businessCourses = createdCourses.filter(
			(c) =>
				c.title.includes('Marketing') ||
				c.title.includes('Business') ||
				c.title.includes('Strategy')
		);

		for (const companyAdmin of companyAdmins) {
			for (const course of businessCourses) {
				await db.insert(enrollments).values({
					userId: companyAdmin.id,
					courseId: course.id,
					enrolledAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date within last 14 days
				});
			}
		}

		console.log('\n🎉 Complete Database Seeding Successful!');
		console.log('\n📊 Summary:');
		console.log(`- ${createdCategories.length} course categories`);
		console.log(`- ${createdUsers.length} verified user accounts`);
		console.log(`- ${createdCourses.length} comprehensive courses`);
		console.log(`- ${createdPlans.length} subscription plans`);
		console.log('- Multiple modules and lessons per course');
		console.log('- Interactive quizzes with explanations');
		console.log('- Sample enrollments and subscriptions');

		console.log('\n🔐 Test Accounts (password: password123):');
		console.log('- student (Student with Pro subscription)');
		console.log('- instructor (Course Instructor)');
		console.log('- company_admin (Company Admin with Team subscription)');
		console.log('- admin (Internal Admin)');
		console.log('- emily_student (Additional Student)');
		console.log('- robert_instructor (Additional Instructor)');
		console.log('- maria_company (Company Admin at Innovate Inc.)');

		console.log('\n✅ Database is ready for development and testing!');
	} catch (error) {
		console.error('❌ Database seeding failed:', error);
		throw error;
	}
}

// ES module check to run seeding when file is executed directly
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
	seedCompleteDatabase().catch(console.error);
}

export { seedCompleteDatabase };
