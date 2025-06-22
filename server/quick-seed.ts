// import { db } from './db';
// import {
// 	users,
// 	courses,
// 	lessons,
// 	enrollments,
// 	subscriptionPlans,
// 	userSubscriptions,
// 	companies,
// } from '@shared/schema';
// import { scrypt, randomBytes } from 'crypto';
// import { promisify } from 'util';

// const scryptAsync = promisify(scrypt);

// async function hashPassword(password: string) {
// 	const salt = randomBytes(16).toString('hex');
// 	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
// 	return `${buf.toString('hex')}.${salt}`;
// }

// async function quickSeed() {
// 	console.log('Running quick seed for development...');

// 	try {
// 		const hashedPassword = await hashPassword('password123');

// 		// Create essential test users
// 		const testUsers = [
// 			{
// 				id: 'student',
// 				username: 'student',
// 				email: 'student@test.com',
// 				firstName: 'Test',
// 				lastName: 'Student',
// 				role: 'student',
// 			},
// 			{
// 				id: 'instructor',
// 				username: 'instructor',
// 				email: 'instructor@test.com',
// 				firstName: 'Test',
// 				lastName: 'Instructor',
// 				role: 'instructor',
// 			},
// 			{
// 				id: 'company',
// 				username: 'company',
// 				email: 'company@test.com',
// 				firstName: 'Test',
// 				lastName: 'Admin',
// 				role: 'company_admin',
// 			},
// 			{
// 				id: 'admin',
// 				username: 'admin',
// 				email: 'admin@test.com',
// 				firstName: 'Test',
// 				lastName: 'Admin',
// 				role: 'internal_admin',
// 			},
// 		];

// 		console.log('Creating test users...');
// 		for (const user of testUsers) {
// 			await db
// 				.insert(users)
// 				.values({
// 					...user,
// 					password: hashedPassword,
// 					profileImageUrl: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
// 					isEmailVerified: true,
// 				})
// 				.onConflictDoNothing();
// 		}

// 		// Create a sample company
// 		console.log('Creating test company...');
// 		await db
// 			.insert(companies)
// 			.values({
// 				id: 1,
// 				name: 'Test Company Inc.',
// 				email: 'contact@testcompany.com',
// 				phone: '+1-555-0123',
// 			})
// 			.onConflictDoNothing();

// 		// Create basic subscription plan
// 		console.log('Creating subscription plan...');
// 		const [plan] = await db
// 			.insert(subscriptionPlans)
// 			.values({
// 				name: 'Basic Plan',
// 				description: 'Basic access for testing',
// 				price: '9.99',
// 				interval: 'month',
// 				features: ['Basic features'],
// 				isActive: true,
// 			})
// 			.onConflictDoNothing()
// 			.returning();

// 		// Create a sample course
// 		console.log('Creating sample course...');
// 		const [course] = await db
// 			.insert(courses)
// 			.values({
// 				title: 'Introduction to Web Development',
// 				description: 'Learn the basics of HTML, CSS, and JavaScript',
// 				shortDescription: 'Web development fundamentals',
// 				instructorId: 'instructor',
// 				thumbnailUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500',
// 				price: '49.99',
// 				currency: 'USD',
// 				level: 'beginner',
// 				duration: 20,
// 				category: 'Web Development',
// 				tags: ['HTML', 'CSS', 'JavaScript'],
// 				isPublished: true,
// 				language: 'English',
// 				estimatedHours: 20,
// 				studentsCount: 150,
// 				rating: 4.5,
// 				reviewsCount: 45,
// 			})
// 			.onConflictDoNothing()
// 			.returning();

// 		if (course) {
// 			// Create sample lessons
// 			const lessonData = [
// 				{
// 					title: 'HTML Basics',
// 					content: 'Introduction to HTML structure and elements',
// 					duration: 30,
// 				},
// 				{ title: 'CSS Styling', content: 'Learn to style web pages with CSS', duration: 45 },
// 				{
// 					title: 'JavaScript Fundamentals',
// 					content: 'Programming basics with JavaScript',
// 					duration: 60,
// 				},
// 			];

// 			console.log('Creating sample lessons...');
// 			for (let i = 0; i < lessonData.length; i++) {
// 				await db
// 					.insert(lessons)
// 					.values({
// 						courseId: course.id,
// 						title: lessonData[i].title,
// 						content: lessonData[i].content,
// 						videoUrl: `https://example.com/video${i + 1}.mp4`,
// 						duration: lessonData[i].duration,
// 						orderIndex: i + 1,
// 						isPreview: i === 0,
// 					})
// 					.onConflictDoNothing();
// 			}

// 			// Enroll student in course
// 			console.log('Creating sample enrollment...');
// 			await db
// 				.insert(enrollments)
// 				.values({
// 					userId: 'student',
// 					courseId: course.id,
// 					enrolledAt: new Date(),
// 					progress: 35,
// 					lastAccessedAt: new Date(),
// 				})
// 				.onConflictDoNothing();
// 		}

// 		console.log('Quick seed completed successfully!');
// 		console.log('Test accounts created:');
// 		console.log('- student / password123');
// 		console.log('- instructor / password123');
// 		console.log('- company / password123');
// 		console.log('- admin / password123');
// 	} catch (error) {
// 		console.error('Quick seed failed:', error);
// 		throw error;
// 	}
// }

// // ES module check to run seeding when file is executed directly
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);

// if (process.argv[1] === __filename) {
// 	quickSeed().catch(console.error);
// }

// export { quickSeed };

/// =====>

// import { db } from './db';
// import {
// 	users,
// 	courses,
// 	lessons,
// 	enrollments,
// 	subscriptionPlans,
// 	userSubscriptions,
// 	companies,
// } from '@shared/schema';
// import { scrypt, randomBytes } from 'crypto';
// import { promisify } from 'util';

// const scryptAsync = promisify(scrypt);

// async function hashPassword(password: string) {
// 	const salt = randomBytes(16).toString('hex');
// 	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
// 	return `${buf.toString('hex')}.${salt}`;
// }

// async function quickSeed() {
// 	console.log('Running quick seed for development...');

// 	try {
// 		const hashedPassword = await hashPassword('password123');

// 		// Create essential test users
// 		const testUsers = [
// 			{
// 				id: 'student',
// 				username: 'student',
// 				email: 'student@test.com',
// 				firstName: 'Test',
// 				lastName: 'Student',
// 				role: 'student' as const,
// 			},
// 			{
// 				id: 'instructor',
// 				username: 'instructor',
// 				email: 'instructor@test.com',
// 				firstName: 'Test',
// 				lastName: 'Instructor',
// 				role: 'instructor' as const,
// 			},
// 			{
// 				id: 'company',
// 				username: 'company',
// 				email: 'company@test.com',
// 				firstName: 'Test',
// 				lastName: 'Admin',
// 				role: 'company_admin' as const,
// 			},
// 			{
// 				id: 'admin',
// 				username: 'admin',
// 				email: 'admin@test.com',
// 				firstName: 'Test',
// 				lastName: 'Admin',
// 				role: 'internal_admin' as const,
// 			},
// 		];

// 		console.log('Creating test users...');
// 		for (const user of testUsers) {
// 			await db
// 				.insert(users)
// 				.values({
// 					...user,
// 					password: hashedPassword,
// 					profileImageUrl: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
// 					isEmailVerified: true,
// 				})
// 				.onConflictDoNothing();
// 		}

// 		// Create a sample company
// 		console.log('Creating test company...');
// 		await db
// 			.insert(companies)
// 			.values({
// 				name: 'Test Company Inc.',
// 				email: 'contact@testcompany.com',
// 				phone: '+1-555-0123',
// 			})
// 			.onConflictDoNothing();

// 		// Create basic subscription plan
// 		console.log('Creating subscription plan...');
// 		await db
// 			.insert(subscriptionPlans)
// 			.values({
// 				name: 'Basic Plan',
// 				description: 'Basic access for testing',
// 				price: '9.99',
// 				period: 'month', // Fixed: was 'interval'
// 				features: ['Basic features'],
// 				isActive: true,
// 			})
// 			.onConflictDoNothing();

// 		// Create a sample course
// 		console.log('Creating sample course...');
// 		const [course] = await db
// 			.insert(courses)
// 			.values({
// 				title: 'Introduction to Web Development',
// 				description: 'Learn the basics of HTML, CSS, and JavaScript',
// 				instructorId: 'instructor',
// 				price: '49.99', // String format
// 				level: 'beginner' as const,
// 				duration: 20,
// 				isPublished: true,
// 				rating: '4.5', // String format
// 			})
// 			.onConflictDoNothing()
// 			.returning();

// 		if (course) {
// 			// Create sample lessons
// 			const lessonData = [
// 				// Fixed: renamed from 'lessons'
// 				{
// 					title: 'HTML Basics',
// 					content: 'Introduction to HTML structure and elements',
// 					duration: 30,
// 				},
// 				{
// 					title: 'CSS Styling',
// 					content: 'Learn to style web pages with CSS',
// 					duration: 45,
// 				},
// 				{
// 					title: 'JavaScript Fundamentals',
// 					content: 'Programming basics with JavaScript',
// 					duration: 60,
// 				},
// 			];

// 			console.log('Creating sample lessons...');
// 			for (let i = 0; i < lessonData.length; i++) {
// 				await db
// 					.insert(lessons)
// 					.values({
// 						// courseId: course.id,
// 						title: lessonData[i].title,
// 						content: lessonData[i].content,
// 						videoUrl: `https://example.com/video${i + 1}.mp4`,
// 						duration: lessonData[i].duration,
// 						orderIndex: i + 1,
// 						isPreview: i === 0,
// 					})
// 					.onConflictDoNothing();
// 			}

// 			// Enroll student in course
// 			console.log('Creating sample enrollment...');
// 			await db
// 				.insert(enrollments)
// 				.values({
// 					userId: 'student',
// 					courseId: course.id,
// 					enrolledAt: new Date(),
// 					// Removed 'progress' field - doesn't exist in schema
// 				})
// 				.onConflictDoNothing();
// 		}

// 		console.log('Quick seed completed successfully!');
// 		console.log('Test accounts created:');
// 		console.log('- student / password123');
// 		console.log('- instructor / password123');
// 		console.log('- company / password123');
// 		console.log('- admin / password123');
// 	} catch (error) {
// 		console.error('Quick seed failed:', error);
// 		throw error;
// 	}
// }

// // ES module check to run seeding when file is executed directly
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);

// if (process.argv[1] === __filename) {
// 	quickSeed().catch(console.error); // Fixed: was 'main()'
// }

// export { quickSeed };

import { db } from './db';
import {
	users,
	courses,
	lessons,
	enrollments,
	subscriptionPlans,
	userSubscriptions,
	companies,
	categories,
	modules,
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

		// Create a category first
		console.log('Creating category...');
		const [category] = await db
			.insert(categories)
			.values({
				name: 'Web Development',
				description: 'Web development courses',
			})
			.onConflictDoNothing()
			.returning();

		// Create essential test users
		const testUsers = [
			{
				id: 'student',
				username: 'student',
				email: 'student@test.com',
				firstName: 'Test',
				lastName: 'Student',
				role: 'student' as const,
			},
			{
				id: 'instructor',
				username: 'instructor',
				email: 'instructor@test.com',
				firstName: 'Test',
				lastName: 'Instructor',
				role: 'instructor' as const,
			},
			{
				id: 'company',
				username: 'company',
				email: 'company@test.com',
				firstName: 'Test',
				lastName: 'Admin',
				role: 'company_admin' as const,
			},
			{
				id: 'admin',
				username: 'admin',
				email: 'admin@test.com',
				firstName: 'Test',
				lastName: 'Admin',
				role: 'internal_admin' as const,
			},
		];

		console.log('Creating test users...');
		for (const user of testUsers) {
			await db
				.insert(users)
				.values({
					...user,
					password: hashedPassword,
					profileImageUrl: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
					isEmailVerified: true,
				})
				.onConflictDoNothing();
		}

		// Create a sample company
		console.log('Creating test company...');
		await db
			.insert(companies)
			.values({
				name: 'Test Company Inc.',
				email: 'contact@testcompany.com',
				phone: '+1-555-0123',
			})
			.onConflictDoNothing();

		// Create basic subscription plan
		console.log('Creating subscription plan...');
		await db
			.insert(subscriptionPlans)
			.values({
				name: 'Basic Plan',
				description: 'Basic access for testing',
				price: '9.99',
				period: 'MONTHLY',
				features: ['Basic features'],
				isActive: true,
			})
			.onConflictDoNothing();

		// Create a sample course
		console.log('Creating sample course...');
		const [course] = await db
			.insert(courses)
			.values({
				title: 'Introduction to Web Development',
				description: 'Learn the basics of HTML, CSS, and JavaScript',
				duration: 1200, // 20 hours in minutes
				level: 'beginner',
				categoryId: category?.id || null,
				instructorId: 'instructor',
				rating: '4.5',
			})
			.onConflictDoNothing()
			.returning();

		if (course) {
			// Create a module first
			console.log('Creating sample module...');
			const [module] = await db
				.insert(modules)
				.values({
					title: 'Web Fundamentals',
					description: 'Basic web development concepts',
					courseId: course.id,
					orderIndex: 1,
				})
				.onConflictDoNothing()
				.returning();

			if (module) {
				// Create sample lessons
				const lessonData = [
					{
						title: 'HTML Basics',
						content: 'Introduction to HTML structure and elements',
						duration: 30,
					},
					{
						title: 'CSS Styling',
						content: 'Learn to style web pages with CSS',
						duration: 45,
					},
					{
						title: 'JavaScript Fundamentals',
						content: 'Programming basics with JavaScript',
						duration: 60,
					},
				];

				console.log('Creating sample lessons...');
				for (let i = 0; i < lessonData.length; i++) {
					await db
						.insert(lessons)
						.values({
							title: lessonData[i].title,
							content: lessonData[i].content,
							moduleId: module.id,
							videoUrl: `https://example.com/video${i + 1}.mp4`,
							duration: lessonData[i].duration,
							orderIndex: i + 1,
							isPreview: i === 0,
						})
						.onConflictDoNothing();
				}
			}

			// Enroll student in course
			console.log('Creating sample enrollment...');
			await db
				.insert(enrollments)
				.values({
					userId: 'student',
					courseId: course.id,
					enrolledAt: new Date(),
				})
				.onConflictDoNothing();
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

// ES module check to run seeding when file is executed directly
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
	quickSeed().catch(console.error);
}

export { quickSeed };
