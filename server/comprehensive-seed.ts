import { db } from './db';
import {
	users,
	courses,
	lessons,
	enrollments,
	badges,
	userBadges,
	subscriptionPlans,
	userSubscriptions,
	companies,
} from '@shared/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

import { pgTable, integer, varchar, text, numeric, boolean, jsonb } from 'drizzle-orm/pg-core';

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
		duration: 40,
		price: 89.99,
		instructor: 'Sarah Johnson',
		thumbnailUrl:
			'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&h=300&fit=crop',
		tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
		lessons: [
			{
				title: 'HTML Fundamentals and Structure',
				content: 'Learn semantic HTML, document structure, forms, and accessibility basics',
				duration: 45,
			},
			{
				title: 'CSS Styling and Responsive Design',
				content: 'Master CSS Grid, Flexbox, animations, and mobile-first design principles',
				duration: 60,
			},
			{
				title: 'JavaScript Programming Fundamentals',
				content: 'Variables, functions, DOM manipulation, and modern ES6+ features',
				duration: 90,
			},
			{
				title: 'React Component Development',
				content: 'Building reusable components, state management, and hooks',
				duration: 75,
			},
			{
				title: 'Backend Development with Node.js',
				content: 'Express.js, REST APIs, authentication, and database integration',
				duration: 80,
			},
			{
				title: 'Full-Stack Project Deployment',
				content: 'Git workflows, hosting platforms, and production deployment strategies',
				duration: 50,
			},
		],
	},
	{
		title: 'Data Science with Python',
		description:
			'Comprehensive data analysis, visualization, and machine learning using Python ecosystem. Learn pandas, NumPy, matplotlib, and scikit-learn through hands-on projects with real datasets.',
		category: 'Data Science',
		level: 'intermediate',
		duration: 35,
		price: 79.99,
		instructor: 'Dr. Michael Chen',
		thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
		tags: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
		lessons: [
			{
				title: 'Python for Data Science Setup',
				content: 'Jupyter notebooks, virtual environments, and essential libraries',
				duration: 40,
			},
			{
				title: 'Data Manipulation with Pandas',
				content: 'DataFrames, data cleaning, merging, and transformation techniques',
				duration: 70,
			},
			{
				title: 'Statistical Analysis and Visualization',
				content: 'Matplotlib, Seaborn, and statistical hypothesis testing',
				duration: 65,
			},
			{
				title: 'Machine Learning Fundamentals',
				content: 'Supervised learning, regression, classification, and model evaluation',
				duration: 85,
			},
			{
				title: 'Advanced ML and Neural Networks',
				content: 'Deep learning basics, TensorFlow, and practical applications',
				duration: 55,
			},
		],
	},
	{
		title: 'Digital Marketing Strategy',
		description:
			'Complete digital marketing course covering SEO, social media marketing, email campaigns, and paid advertising. Includes real case studies from successful campaigns and hands-on tools training.',
		category: 'Marketing',
		level: 'beginner',
		duration: 25,
		price: 59.99,
		instructor: 'Emma Rodriguez',
		thumbnailUrl:
			'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
		tags: ['SEO', 'Social Media', 'Email Marketing', 'Google Ads', 'Analytics'],
		lessons: [
			{
				title: 'Digital Marketing Fundamentals',
				content: 'Marketing funnels, customer personas, and channel strategy',
				duration: 35,
			},
			{
				title: 'Search Engine Optimization',
				content: 'Keyword research, on-page SEO, link building, and technical SEO',
				duration: 55,
			},
			{
				title: 'Social Media Marketing',
				content: 'Platform strategies, content creation, community management',
				duration: 45,
			},
			{
				title: 'Email Marketing and Automation',
				content: 'List building, segmentation, automation workflows, and A/B testing',
				duration: 40,
			},
			{
				title: 'Paid Advertising and Analytics',
				content: 'Google Ads, Facebook Ads, campaign optimization, and ROI measurement',
				duration: 50,
			},
		],
	},
	{
		title: 'UI/UX Design Mastery',
		description:
			'Professional user interface and user experience design using industry-standard tools. Learn design thinking, prototyping, user research, and create a portfolio of real projects.',
		category: 'Design',
		level: 'intermediate',
		duration: 30,
		price: 69.99,
		instructor: 'Alex Thompson',
		thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&h=300&fit=crop',
		tags: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'User Testing'],
		lessons: [
			{
				title: 'Design Thinking and User Research',
				content: 'User interviews, personas, journey mapping, and problem definition',
				duration: 45,
			},
			{
				title: 'Information Architecture',
				content: 'Site mapping, user flows, wireframing, and content strategy',
				duration: 50,
			},
			{
				title: 'Visual Design Principles',
				content: 'Typography, color theory, layout, and design systems',
				duration: 55,
			},
			{
				title: 'Prototyping and Interaction Design',
				content: 'High-fidelity prototypes, micro-interactions, and animation principles',
				duration: 40,
			},
			{
				title: 'User Testing and Iteration',
				content: 'Usability testing, feedback analysis, and design iteration cycles',
				duration: 35,
			},
		],
	},
	{
		title: 'Mobile App Development with React Native',
		description:
			'Build production-ready mobile applications for iOS and Android using React Native. Learn navigation, state management, native modules, and app store deployment processes.',
		category: 'Mobile Development',
		level: 'intermediate',
		duration: 45,
		price: 99.99,
		instructor: 'David Kim',
		thumbnailUrl:
			'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop',
		tags: ['React Native', 'Mobile Development', 'iOS', 'Android', 'App Store'],
		lessons: [
			{
				title: 'React Native Environment Setup',
				content: 'Development environment, simulators, and debugging tools',
				duration: 35,
			},
			{
				title: 'Core Components and Styling',
				content: 'Native components, responsive design, and platform-specific styling',
				duration: 60,
			},
			{
				title: 'Navigation and State Management',
				content: 'React Navigation, Redux, Context API, and data persistence',
				duration: 70,
			},
			{
				title: 'Native Device Features',
				content: 'Camera, GPS, push notifications, and native module integration',
				duration: 65,
			},
			{
				title: 'Testing and App Store Deployment',
				content: 'Unit testing, integration testing, and publishing to app stores',
				duration: 55,
			},
		],
	},
	{
		title: 'Cloud Computing with AWS',
		description:
			'Master Amazon Web Services including compute, storage, networking, and serverless technologies. Prepare for AWS certification while building scalable cloud applications.',
		category: 'Cloud Computing',
		level: 'advanced',
		duration: 50,
		price: 119.99,
		instructor: 'Jennifer Liu',
		thumbnailUrl:
			'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
		tags: ['AWS', 'Cloud Architecture', 'DevOps', 'Serverless', 'Security'],
		lessons: [
			{
				title: 'AWS Core Services Overview',
				content: 'IAM, VPC, EC2, S3, and fundamental cloud concepts',
				duration: 50,
			},
			{
				title: 'Compute and Auto Scaling',
				content: 'EC2 instances, load balancers, auto scaling groups, and optimization',
				duration: 65,
			},
			{
				title: 'Storage and Database Services',
				content: 'S3, EBS, RDS, DynamoDB, and data migration strategies',
				duration: 70,
			},
			{
				title: 'Serverless Architecture',
				content: 'Lambda functions, API Gateway, CloudFront, and event-driven design',
				duration: 60,
			},
			{
				title: 'Security and Monitoring',
				content: 'CloudWatch, CloudTrail, security best practices, and compliance',
				duration: 55,
			},
		],
	},
	{
		title: 'Cybersecurity Fundamentals',
		description:
			'Essential cybersecurity concepts, threat analysis, network security, and incident response. Learn ethical hacking techniques and security tools used by professionals.',
		category: 'Cybersecurity',
		level: 'beginner',
		duration: 35,
		price: 89.99,
		instructor: 'Robert Singh',
		thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop',
		tags: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance'],
		lessons: [
			{
				title: 'Security Fundamentals',
				content: 'CIA triad, threat landscape, and security frameworks',
				duration: 40,
			},
			{
				title: 'Network Security',
				content: 'Firewalls, VPNs, intrusion detection, and network monitoring',
				duration: 55,
			},
			{
				title: 'Ethical Hacking and Penetration Testing',
				content: 'Vulnerability assessment, penetration testing methodologies',
				duration: 70,
			},
			{
				title: 'Incident Response and Recovery',
				content: 'Incident handling procedures, forensics, and business continuity',
				duration: 45,
			},
			{
				title: 'Compliance and Governance',
				content: 'GDPR, HIPAA, SOX compliance, and security policies',
				duration: 50,
			},
		],
	},
	{
		title: 'Project Management Professional',
		description:
			'Comprehensive project management training covering Agile, Scrum, Waterfall methodologies. Prepare for PMP certification with real-world project scenarios and tools.',
		category: 'Business',
		level: 'intermediate',
		duration: 40,
		price: 74.99,
		instructor: 'Linda Foster',
		thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
		tags: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Risk Management'],
		lessons: [
			{
				title: 'Project Management Foundations',
				content: 'Project lifecycle, stakeholder management, and success criteria',
				duration: 45,
			},
			{
				title: 'Agile and Scrum Methodologies',
				content: 'Sprints, user stories, retrospectives, and team dynamics',
				duration: 60,
			},
			{
				title: 'Risk Management and Quality',
				content: 'Risk identification, mitigation strategies, and quality assurance',
				duration: 50,
			},
			{
				title: 'Resource and Budget Management',
				content: 'Resource allocation, cost estimation, and budget tracking',
				duration: 55,
			},
			{
				title: 'Leadership and Communication',
				content: 'Team leadership, stakeholder communication, and conflict resolution',
				duration: 40,
			},
		],
	},
];

// Diverse user profiles with realistic data
const userProfiles = [
	{
		username: 'student',
		email: 'student@test.com',
		firstName: 'Alex',
		lastName: 'Johnson',
		role: 'student',
	},
	{
		username: 'instructor',
		email: 'instructor@test.com',
		firstName: 'Sarah',
		lastName: 'Martinez',
		role: 'instructor',
	},
	{
		username: 'company',
		email: 'admin@techcorp.com',
		firstName: 'Michael',
		lastName: 'Chen',
		role: 'company_admin',
	},
	{
		username: 'admin',
		email: 'admin@m4t.com',
		firstName: 'Jordan',
		lastName: 'Smith',
		role: 'internal_admin',
	},
	{
		username: 'emily_dev',
		email: 'emily.davis@example.com',
		firstName: 'Emily',
		lastName: 'Davis',
		role: 'student',
	},
	{
		username: 'robert_designer',
		email: 'robert.wilson@example.com',
		firstName: 'Robert',
		lastName: 'Wilson',
		role: 'student',
	},
	{
		username: 'maria_analyst',
		email: 'maria.garcia@example.com',
		firstName: 'Maria',
		lastName: 'Garcia',
		role: 'student',
	},
	{
		username: 'john_instructor',
		email: 'john.anderson@example.com',
		firstName: 'John',
		lastName: 'Anderson',
		role: 'instructor',
	},
	{
		username: 'lisa_corp',
		email: 'lisa.thompson@innovate.com',
		firstName: 'Lisa',
		lastName: 'Thompson',
		role: 'company_admin',
	},
	{
		username: 'tom_student',
		email: 'tom.brown@example.com',
		firstName: 'Tom',
		lastName: 'Brown',
		role: 'student',
	},
	{
		username: 'anna_pm',
		email: 'anna.white@example.com',
		firstName: 'Anna',
		lastName: 'White',
		role: 'student',
	},
	{
		username: 'carlos_dev',
		email: 'carlos.rodriguez@example.com',
		firstName: 'Carlos',
		lastName: 'Rodriguez',
		role: 'student',
	},
];

async function main() {
	console.log('Starting comprehensive M4T seed data generation...');

	try {
		const hashedPassword = await hashPassword('password123');

		// Clear existing data
		console.log('Clearing existing data...');
		await db.delete(userBadges);
		await db.delete(badges);

		await db.delete(enrollments);
		await db.delete(lessons);
		await db.delete(courses);

		await db.delete(userSubscriptions);
		await db.delete(subscriptionPlans);
		await db.delete(companies);
		await db.delete(users);

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

		const [innovateInc] = await db
			.insert(companies)
			.values({
				name: 'Innovate Inc',
				email: 'hello@innovate.com',
				phone: '+1-555-0456',
				address: '456 Innovation Avenue, Austin, TX 78701',
			})
			.returning();

		// Create users
		console.log('Creating user accounts...');
		const createdUsers = [];

		for (const profile of userProfiles) {
			const companyId = profile.email.includes('techcorp')
				? techCorp.id
				: profile.email.includes('innovate')
				? innovateInc.id
				: null;

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
					isEmailVerified: true,
					learningPreferences: {
						style: ['visual', 'auditory', 'reading', 'kinesthetic'][Math.floor(Math.random() * 4)],
						pace: ['slow', 'moderate', 'fast'][Math.floor(Math.random() * 3)],
						sessionDuration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
					},
					interests: ['programming', 'design', 'business', 'marketing', 'data science'].slice(
						0,
						Math.floor(Math.random() * 3) + 1
					),
					skillLevels: {
						programming: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
						design: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
						business: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
					},
				})
				.returning();

			createdUsers.push(user);
		}

		// Create subscription plans
		console.log('Creating subscription plans...');
		const [basicPlan] = await db
			.insert(subscriptionPlans)
			.values({
				name: 'Basic',
				description: 'Perfect for individual learners starting their educational journey',
				price: 9.99,
				interval: 'month',
				features: [
					'Access to 50+ courses',
					'Basic progress tracking',
					'Community forums',
					'Email support',
				],
				isActive: true,
				maxUsers: 1,
				trialDays: 7,
			})
			.returning();

		const [proPlan] = await db
			.insert(subscriptionPlans)
			.values({
				name: 'Professional',
				description: 'Advanced features for serious learners and working professionals',
				price: 19.99,
				interval: 'month',
				features: [
					'Access to all courses',
					'Advanced analytics',
					'Downloadable content',
					'Priority support',
					'Digital certificates',
				],
				isActive: true,
				maxUsers: 1,
				trialDays: 14,
			})
			.returning();

		const [teamPlan] = await db
			.insert(subscriptionPlans)
			.values({
				name: 'Enterprise',
				description: 'Comprehensive learning solution for teams and organizations',
				price: 99.99,
				interval: 'month',
				features: [
					'Everything in Professional',
					'Team management dashboard',
					'Custom learning paths',
					'Advanced reporting',
					'API access',
					'Dedicated support',
				],
				isActive: true,
				maxUsers: 50,
				trialDays: 30,
			})
			.returning();

		// Create courses and lessons
		console.log('Creating course catalog...');
		const createdCourses = [];

		for (const courseInfo of courseData) {
			const instructors = createdUsers.filter((u) => u.role === 'instructor');
			const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)];

			const [course] = await db
				.insert(courses)
				.values({
					title: courseInfo.title,
					description: courseInfo.description,
					shortDescription: courseInfo.description.substring(0, 120) + '...',
					instructorId: randomInstructor?.id || 'instructor',
					thumbnailUrl: courseInfo.thumbnailUrl,
					price: courseInfo.price,
					currency: 'USD',
					level: courseInfo.level,
					duration: courseInfo.duration,
					category: courseInfo.category,
					tags: courseInfo.tags,
					prerequisites:
						courseInfo.level === 'advanced'
							? ['Previous experience required']
							: courseInfo.level === 'intermediate'
							? ['Basic knowledge helpful']
							: [],
					learningObjectives: [
						`Master ${courseInfo.category.toLowerCase()} fundamentals`,
						'Apply knowledge through hands-on projects',
						'Build portfolio-worthy applications',
						'Advance your career with in-demand skills',
					],
					isPublished: true,
					language: 'English',
					hasClosedCaptions: true,
					estimatedHours: courseInfo.duration,
					studentsCount: Math.floor(Math.random() * 2000) + 500,
					rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
					reviewsCount: Math.floor(Math.random() * 300) + 100,
				})
				.returning();

			createdCourses.push(course);

			// Create lessons for each course
			for (let i = 0; i < courseInfo.lessons.length; i++) {
				const lessonInfo = courseInfo.lessons[i];
				await db.insert(lessons).values({
					courseId: course.id,
					title: lessonInfo.title,
					content: lessonInfo.content,
					videoUrl: `https://example.com/videos/course${course.id}/lesson${i + 1}.mp4`,
					duration: lessonInfo.duration,
					orderIndex: i + 1,
					isPreview: i === 0,
					hasQuiz: Math.random() > 0.4,
					resources: [
						{ type: 'pdf', name: 'Lesson Notes', url: `#lesson-${i + 1}-notes` },
						{ type: 'download', name: 'Exercise Files', url: `#lesson-${i + 1}-files` },
					],
				});
			}
		}

		// Create achievement badges
		console.log('Creating achievement system...');
		const badgeTypes = [
			{
				name: 'First Steps',
				description: 'Completed your first course',
				iconUrl: '🎓',
				category: 'milestone',
				points: 50,
			},
			{
				name: 'Speed Learner',
				description: 'Completed a course in under a week',
				iconUrl: '⚡',
				category: 'achievement',
				points: 75,
			},
			{
				name: 'Consistent Learner',
				description: 'Studied for 7 consecutive days',
				iconUrl: '📚',
				category: 'habit',
				points: 100,
			},
			{
				name: 'Code Warrior',
				description: 'Completed 3 programming courses',
				iconUrl: '💻',
				category: 'skill',
				points: 150,
			},
			{
				name: 'Design Master',
				description: 'Mastered design fundamentals',
				iconUrl: '🎨',
				category: 'skill',
				points: 125,
			},
			{
				name: 'Community Helper',
				description: 'Active participant in discussions',
				iconUrl: '🤝',
				category: 'social',
				points: 80,
			},
			{
				name: 'Knowledge Seeker',
				description: 'Enrolled in 5 different courses',
				iconUrl: '🔍',
				category: 'exploration',
				points: 90,
			},
			{
				name: 'Perfect Score',
				description: 'Achieved 100% on a course quiz',
				iconUrl: '⭐',
				category: 'excellence',
				points: 120,
			},
		];

		const createdBadges = [];
		for (const badge of badgeTypes) {
			const [createdBadge] = await db
				.insert(badges)
				.values({
					name: badge.name,
					description: badge.description,
					iconUrl: badge.iconUrl,
					category: badge.category,
					criteria: {
						type: badge.category,
						threshold: badge.category === 'skill' ? 3 : 1,
						description: badge.description,
					},
					points: badge.points,
				})
				.returning();
			createdBadges.push(createdBadge);
		}

		// Create enrollments and progress data
		console.log('Creating enrollments and progress data...');
		const students = createdUsers.filter((u) => u.role === 'student');

		for (const student of students) {
			const enrollmentCount = Math.floor(Math.random() * 4) + 2; // 2-5 courses per student
			const randomCourses = [...createdCourses]
				.sort(() => 0.5 - Math.random())
				.slice(0, enrollmentCount);

			for (const course of randomCourses) {
				const enrollmentDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
				const progress = Math.floor(Math.random() * 100);

				await db.insert(enrollments).values({
					userId: student.id,
					courseId: course.id,
					enrolledAt: enrollmentDate,
					progress: progress,
					lastAccessedAt: new Date(
						enrollmentDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
					),
					timeSpent: Math.floor(Math.random() * 1200) + 300, // 5-25 hours
				});

				// Create completion for high progress enrollments
				if (progress > 85) {
					await db.insert(completions).values({
						userId: student.id,
						courseId: course.id,
						completedAt: new Date(),
						certificateUrl: `https://certificates.m4t.com/${student.id}/${course.id}`,
						finalGrade: Math.floor(Math.random() * 25) + 75, // 75-100
						feedback: 'Excellent course with practical examples and clear explanations.',
					});

					// Award badges for completions
					if (Math.random() > 0.5) {
						const availableBadges = createdBadges.filter((b) => Math.random() > 0.6);
						for (const badge of availableBadges.slice(0, 2)) {
							await db.insert(userBadges).values({
								userId: student.id,
								badgeId: badge.id,
								earnedAt: new Date(),
								notificationSent: true,
							});
						}
					}
				}
			}
		}

		// Create subscription assignments
		console.log('Creating subscription data...');
		const plans = [basicPlan, proPlan, teamPlan];

		for (const student of students) {
			if (Math.random() > 0.3) {
				// 70% of students have active subscriptions
				const randomPlan = plans[Math.floor(Math.random() * plans.length)];
				const startDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

				await db.insert(userSubscriptions).values({
					userId: student.id,
					planId: randomPlan.id,
					startDate: startDate,
					endDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
					isActive: true,
					autoRenew: Math.random() > 0.2,
					stripeSubscriptionId: `sub_${Math.random().toString(36).substr(2, 9)}`,
				});

				// Create payment record
				await db.insert(payments).values({
					userId: student.id,
					planId: randomPlan.id,
					amount: randomPlan.price,
					currency: 'USD',
					status: 'succeeded',
					paymentMethod: 'stripe',
					stripePaymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
					paidAt: startDate,
				});
			}
		}

		console.log('Comprehensive seed data generation completed successfully!');
		console.log(`Created ${createdUsers.length} diverse user accounts`);
		console.log(`Created ${createdCourses.length} courses with authentic content`);
		console.log(`Created ${badgeTypes.length} achievement badges`);
		console.log('Generated realistic enrollments, progress, and subscription data');
		console.log('\nTest Login Credentials:');
		console.log('Student: student / password123');
		console.log('Instructor: instructor / password123');
		console.log('Company Admin: company / password123');
		console.log('Internal Admin: admin / password123');
	} catch (error) {
		console.error('Error during seed data generation:', error);
		throw error;
	}
}

if (require.main === module) {
	main()
		.then(() => {
			console.log('Seeding completed successfully!');
			process.exit(0);
		})
		.catch((error) => {
			console.error('Seeding failed:', error);
			process.exit(1);
		});
}

export { main as seedDatabase };
