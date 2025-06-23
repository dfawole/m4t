import {
	users,
	type User,
	type UpsertUser,
	courses,
	type Course,
	categories,
	type Category,
	modules,
	type Module,
	lessons,
	type Lesson,
	enrollments,
	type Enrollment,
	companies,
	type Company,
	type InsertCompany,
	subscriptionPlans,
	type SubscriptionPlan,
	userSubscriptions,
	emojiReactions,
	type EmojiReaction,
	type InsertEmojiReaction,
	type UserSubscription,
	companySubscriptions,
	type CompanySubscription,
	lessonCompletions,
	type LessonCompletion,
	// License management imports
	licenses,
	type License,
	type InsertLicense,
	LicenseStatus,
	// Video related imports
	videos,
	type Video,
	type InsertVideo,
	videoCaptionTracks,
	type VideoCaptionTrack,
	type InsertVideoCaptionTrack,
	// Gamification imports
	badges,
	userBadges,
	userPoints,
	pointTransactions,
	streaks,
	challenges,
	userChallenges,
	type Badge,
	type InsertBadge,
	// Company onboarding imports
	companyOnboardingApplications,
	type CompanyOnboardingApplication,
	type InsertCompanyOnboardingApplication,
	type UserBadge,
	type InsertUserBadge,
	type UserPoints,
	type InsertUserPoints,
	type PointTransaction,
	type InsertPointTransaction,
	type Streak,
	type InsertStreak,
	type Challenge,
	type InsertChallenge,
	type UserChallenge,
	type InsertUserChallenge,
	InsertUser,
	licenseActivities,
} from '@shared/schema';
import { db } from './db';
import { and, eq, sql, desc, asc, count, isNull, not, inArray, or } from 'drizzle-orm';

export type InsertLicenseActivity = {
	licenseId: string;
	userId: string;
	activity: string;
	ipAddress?: string;
	userAgent?: string;
	timestamp: Date;
};

// Interface for storage operations
export interface IStorage {
	// User operations (required for Replit Auth)
	getUser(id: string): Promise<User | undefined>;
	getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined>;
	getUserByEmail(email: string): Promise<User | undefined>;
	createUser(user: InsertUser): Promise<User>;
	upsertUser(user: UpsertUser): Promise<User>;
	updateUserStripeInfo(
		userId: string,
		stripeInfo: { customerId: string; subscriptionId: string }
	): Promise<User>;
	updateUserCompany(userId: string, companyId: number): Promise<User>;
	updateUserRole(userId: string, role: string): Promise<User>;

	// Company operations
	createCompany(company: InsertCompany): Promise<Company>;
	getCompany(id: number): Promise<Company | undefined>;
	getCompanyByName(name: string): Promise<Company | undefined>;
	updateCompanyStripeInfo(
		companyId: number,
		stripeInfo: { customerId: string; subscriptionId: string }
	): Promise<Company>;

	// Subscription plan operations
	createSubscriptionPlan(plan: any): Promise<SubscriptionPlan>;
	getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
	getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
	updateSubscriptionPlanStripeInfo(
		planId: number,
		stripeInfo: { productId: string; priceId: string }
	): Promise<SubscriptionPlan>;

	// User subscription operations
	createUserSubscription(subscription: any): Promise<UserSubscription>;
	getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
	getUserActiveSubscription(userId: string): Promise<UserSubscription | undefined>;

	// Company subscription operations
	createCompanySubscription(subscription: any): Promise<CompanySubscription>;
	getCompanySubscription(companyId: number): Promise<CompanySubscription | undefined>;
	getCompanyActiveSubscription(companyId: number): Promise<CompanySubscription | undefined>;

	// License operations
	createLicense(license: InsertLicense): Promise<License>;
	createLicenseActivity(
		licenseActivity: InsertLicenseActivity
	): Promise<InsertLicenseActivity | undefined>;
	getLicense(id: number): Promise<License | undefined>;
	getLicenseByKey(licenseKey: string): Promise<License | undefined>;
	getCompanyLicenses(companyId: number): Promise<License[]>;
	getAvailableCompanyLicenses(companyId: number): Promise<License[]>;
	getAssignedCompanyLicenses(companyId: number): Promise<License[]>;
	assignLicenseToUser(licenseId: number, userId: string): Promise<License>;
	revokeLicenseFromUser(licenseId: number): Promise<License>;
	updateLicenseStatus(licenseId: number, status: string): Promise<License>;

	// Course operations
	createCourse(course: any): Promise<Course>;
	getCourse(id: number): Promise<Course | undefined>;
	getCourses(limit?: number): Promise<Course[]>;
	getCoursesByCategory(categoryId: number): Promise<Course[]>;
	getCoursesByInstructor(instructorId: string): Promise<Course[]>;
	searchCourses(query: string): Promise<Course[]>;

	// Category operations
	createCategory(category: any): Promise<Category>;
	getCategories(): Promise<Category[]>;
	getCategory(id: number): Promise<Category | undefined>;

	// Module operations
	createModule(module: any): Promise<Module>;
	getModulesByCourse(courseId: number): Promise<Module[]>;
	getModule(id: number): Promise<Module | undefined>;

	// Lesson operations
	createLesson(lesson: any): Promise<Lesson>;
	getLessonsByModule(moduleId: number): Promise<Lesson[]>;
	getLesson(id: number): Promise<Lesson | undefined>;

	// Enrollment operations
	createEnrollment(enrollment: any): Promise<Enrollment>;
	getEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined>;
	getUserEnrollments(userId: string): Promise<any[]>; // With progress info

	// Lesson completion operations
	completeLessonForUser(userId: string, lessonId: number): Promise<LessonCompletion>;
	getUserCompletedLessons(userId: string, courseId: number): Promise<number[]>;
	getUserCourseProgress(
		userId: string,
		courseId: number
	): Promise<{ completed: number; total: number }>;

	// Emoji Reaction operations
	addEmojiReaction(data: InsertEmojiReaction): Promise<EmojiReaction>;
	removeEmojiReaction(
		userId: string,
		contentType: string,
		contentId: number,
		reactionType: string
	): Promise<void>;
	getContentEmojiReactions(
		contentType: string,
		contentId: number
	): Promise<{ type: string; count: number }[]>;
	getUserReactionToContent(
		userId: string,
		contentType: string,
		contentId: number
	): Promise<string | null>;

	// Company onboarding operations
	createCompanyOnboardingApplication(
		data: InsertCompanyOnboardingApplication
	): Promise<CompanyOnboardingApplication>;
	getAllCompanyOnboardingApplications(): Promise<CompanyOnboardingApplication[]>;
	getCompanyOnboardingApplication(id: number): Promise<CompanyOnboardingApplication | undefined>;
	updateCompanyOnboardingApplicationStatus(
		id: number,
		status: string,
		reviewedBy: string,
		reviewNotes?: string
	): Promise<CompanyOnboardingApplication>;

	// Gamification operations - Badges
	createBadge(badge: InsertBadge): Promise<Badge>;
	getBadge(id: number): Promise<Badge | undefined>;
	getAllBadges(): Promise<Badge[]>;
	getBadgesByCategory(category: string): Promise<Badge[]>;

	// User Badges operations
	awardBadgeToUser(userId: string, badgeId: number): Promise<UserBadge>;
	getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]>;
	hasUserEarnedBadge(userId: string, badgeId: number): Promise<boolean>;

	// User Points operations
	createOrUpdateUserPoints(userId: string, data: Partial<InsertUserPoints>): Promise<UserPoints>;
	getUserPoints(userId: string): Promise<UserPoints | undefined>;
	addPointsToUser(
		userId: string,
		points: number,
		description: string,
		transactionType: string,
		entityType?: string,
		entityId?: string
	): Promise<{ userPoints: UserPoints; transaction: PointTransaction }>;
	getUserPointTransactions(userId: string, limit?: number): Promise<PointTransaction[]>;
	getUserLeaderboard(
		limit?: number
	): Promise<{ userId: string; username: string; totalPoints: number; level: number }[]>;

	// Streak operations
	getOrCreateUserStreak(userId: string): Promise<Streak>;
	updateUserStreak(userId: string, increment: boolean): Promise<Streak>;
	getUserStreakStats(userId: string): Promise<Streak | undefined>;

	// Challenge operations
	createChallenge(challenge: InsertChallenge): Promise<Challenge>;
	getChallenge(id: number): Promise<Challenge | undefined>;
	getActiveChallenges(): Promise<Challenge[]>;
	getActiveChallengesByType(type: string): Promise<Challenge[]>;

	// User Challenge operations
	assignChallengeToUser(userId: string, challengeId: number): Promise<UserChallenge>;
	updateUserChallengeProgress(
		userId: string,
		challengeId: number,
		progress: number
	): Promise<UserChallenge>;
	completeUserChallenge(userId: string, challengeId: number): Promise<UserChallenge>;
	getUserActiveChallenges(userId: string): Promise<(UserChallenge & { challenge: Challenge })[]>;
	getUserCompletedChallenges(userId: string): Promise<(UserChallenge & { challenge: Challenge })[]>;
}

export class DatabaseStorage implements IStorage {
	updateUser(id: string, arg1: { googleId: string; authProvider: string; githubId: string }) {
		throw new Error('Method not implemented.');
	}
	// Module operation methods
	async getModule(id: number): Promise<Module | undefined> {
		const [module] = await db.select().from(modules).where(eq(modules.id, id));
		return module;
	}

	// Lesson operation methods
	async getLesson(id: number): Promise<Lesson | undefined> {
		const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));

		if (lesson) {
			// Get the module to find course ID for enhanced video selection
			const [module] = await db.select().from(modules).where(eq(modules.id, lesson.moduleId));
			const courseId = module?.courseId || 1;

			// Add multi-language captions and enhanced video content to all lessons
			const enhancedLesson = {
				...lesson,
				// Use enhanced video selection based on course type
				videoUrl: this.getEnhancedVideoForCourse(courseId, id),
				captionTracks: [
					{
						kind: 'subtitles',
						label: 'English',
						language: 'en',
						url: `/api/lessons/${id}/captions/en`,
						default: true,
					},
					{
						kind: 'subtitles',
						label: 'Español',
						language: 'es',
						url: `/api/lessons/${id}/captions/es`,
					},
					{
						kind: 'subtitles',
						label: 'Français',
						language: 'fr',
						url: `/api/lessons/${id}/captions/fr`,
					},
					{
						kind: 'subtitles',
						label: 'Deutsch',
						language: 'de',
						url: `/api/lessons/${id}/captions/de`,
					},
					{
						kind: 'subtitles',
						label: 'Italiano',
						language: 'it',
						url: `/api/lessons/${id}/captions/it`,
					},
					{
						kind: 'subtitles',
						label: 'Português',
						language: 'pt',
						url: `/api/lessons/${id}/captions/pt`,
					},
					{
						kind: 'subtitles',
						label: '日本語',
						language: 'ja',
						url: `/api/lessons/${id}/captions/ja`,
					},
					{
						kind: 'subtitles',
						label: '한국어',
						language: 'ko',
						url: `/api/lessons/${id}/captions/ko`,
					},
					{
						kind: 'subtitles',
						label: '中文',
						language: 'zh',
						url: `/api/lessons/${id}/captions/zh`,
					},
					{
						kind: 'subtitles',
						label: 'العربية',
						language: 'ar',
						url: `/api/lessons/${id}/captions/ar`,
					},
					{
						kind: 'subtitles',
						label: 'हिन्दी',
						language: 'hi',
						url: `/api/lessons/${id}/captions/hi`,
					},
					{
						kind: 'subtitles',
						label: 'Русский',
						language: 'ru',
						url: `/api/lessons/${id}/captions/ru`,
					},
				],
				// Enhanced video player features
				playerFeatures: {
					playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
					autoplay: false,
					pip: true, // Picture-in-Picture
					fullscreen: true,
					keyboardShortcuts: true,
					seekThumbnails: true,
					chapters: [
						{ time: 0, title: 'Introduction' },
						{ time: 60, title: 'Core Concepts' },
						{ time: 180, title: 'Practical Examples' },
						{ time: 280, title: 'Summary' },
					],
				},
				// Add interactive quiz capability for specific lessons
				hasQuiz: id === 45 || id === 46, // Python intro lessons
				quizUrl: `/api/lessons/${id}/quiz`,
			};

			return enhancedLesson;
		}

		return lesson;
	}

	// Emoji Reaction operations
	async addEmojiReaction(data: InsertEmojiReaction): Promise<EmojiReaction> {
		// Check if the user already has a reaction of this type on this content
		const existingReaction = await db
			.select()
			.from(emojiReactions)
			.where(
				and(
					eq(emojiReactions.userId, data.userId),
					eq(emojiReactions.contentType, data.contentType),
					eq(emojiReactions.contentId, data.contentId),
					eq(emojiReactions.reactionType, data.reactionType)
				)
			)
			.then((rows) => rows[0]);

		if (existingReaction) {
			return existingReaction;
		}

		// If the user has a different reaction type on this content, remove it first
		await db
			.delete(emojiReactions)
			.where(
				and(
					eq(emojiReactions.userId, data.userId),
					eq(emojiReactions.contentType, data.contentType),
					eq(emojiReactions.contentId, data.contentId)
				)
			);

		// Add the new reaction
		const [reaction] = await db.insert(emojiReactions).values(data).returning();

		return reaction;
	}

	async removeEmojiReaction(
		userId: string,
		contentType: string,
		contentId: number,
		reactionType: string
	): Promise<void> {
		await db
			.delete(emojiReactions)
			.where(
				and(
					eq(emojiReactions.userId, userId),
					eq(emojiReactions.contentType, contentType),
					eq(emojiReactions.contentId, contentId),
					eq(emojiReactions.reactionType, reactionType)
				)
			);
	}

	async getContentEmojiReactions(
		contentType: string,
		contentId: number
	): Promise<{ type: string; count: number }[]> {
		// Get counts of each reaction type for the content
		const reactionCounts = await db
			.select({
				type: emojiReactions.reactionType,
				count: count(),
			})
			.from(emojiReactions)
			.where(
				and(eq(emojiReactions.contentType, contentType), eq(emojiReactions.contentId, contentId))
			)
			.groupBy(emojiReactions.reactionType);

		return reactionCounts;
	}

	async getUserReactionToContent(
		userId: string,
		contentType: string,
		contentId: number
	): Promise<string | null> {
		const [reaction] = await db
			.select()
			.from(emojiReactions)
			.where(
				and(
					eq(emojiReactions.userId, userId),
					eq(emojiReactions.contentType, contentType),
					eq(emojiReactions.contentId, contentId)
				)
			);

		return reaction ? reaction.reactionType : null;
	}
	// User operations
	async getUser(id: string): Promise<User | undefined> {
		const [user] = await db.select().from(users).where(eq(users.id, id));
		return user;
	}

	async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(users)
			.where(or(eq(users.username, usernameOrEmail), eq(users.email, usernameOrEmail)));
		return user || null;
	}

	async updateUserCompany(userId: string, companyId: number): Promise<User> {
		const [user] = await db
			.update(users)
			.set({
				companyId: companyId,
				updatedAt: new Date(),
			})
			.where(eq(users.id, userId))
			.returning();
		return user;
	}

	async updateUserRole(userId: string, role: string): Promise<User> {
		const [user] = await db
			.update(users)
			.set({
				role: role,
				updatedAt: new Date(),
			})
			.where(eq(users.id, userId))
			.returning();
		return user;
	}

	async getUsers(): Promise<User[]> {
		return db.select().from(users);
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
		return user || null;
	}

	async createUser(userData: Omit<InsertUser, 'id'>): Promise<User> {
		const id = crypto.randomUUID();

		const [user] = await db
			.insert(users)
			.values({ id, ...userData })
			.returning();

		return user;
	}

	async upsertUser(userData: UpsertUser): Promise<User> {
		const [user] = await db
			.insert(users)
			.values(userData)
			.onConflictDoUpdate({
				target: users.id,
				set: {
					...userData,
					updatedAt: new Date(),
				},
			})
			.returning();
		return user;
	}

	async updateUserStripeInfo(
		userId: string,
		stripeInfo: { customerId: string; subscriptionId: string }
	): Promise<User> {
		const [user] = await db
			.update(users)
			.set({
				stripeCustomerId: stripeInfo.customerId,
				stripeSubscriptionId: stripeInfo.subscriptionId,
				updatedAt: new Date(),
			})
			.where(eq(users.id, userId))
			.returning();
		return user;
	}

	// Gamification - Badge operations
	async createBadge(badge: InsertBadge): Promise<Badge> {
		const [newBadge] = await db.insert(badges).values(badge).returning();
		return newBadge;
	}

	async getBadge(id: number): Promise<Badge | undefined> {
		const [badge] = await db.select().from(badges).where(eq(badges.id, id));
		return badge;
	}

	async getAllBadges(): Promise<Badge[]> {
		return db.select().from(badges);
	}

	async getBadgesByCategory(category: string): Promise<Badge[]> {
		return db.select().from(badges).where(eq(badges.category, category));
	}

	// User Badges operations
	async awardBadgeToUser(userId: string, badgeId: number): Promise<UserBadge> {
		// Check if the user already has this badge
		const exists = await this.hasUserEarnedBadge(userId, badgeId);

		if (exists) {
			const [existingUserBadge] = await db
				.select()
				.from(userBadges)
				.where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)));
			return existingUserBadge;
		}

		// Award the badge and add points
		const [userBadge] = await db
			.insert(userBadges)
			.values({
				userId,
				badgeId,
			})
			.returning();

		// Get badge details
		const badge = await this.getBadge(badgeId);
		if (badge) {
			// Add points for earning this badge
			await this.addPointsToUser(
				userId,
				badge.pointsValue,
				`Earned badge: ${badge.name}`,
				'badge_earned',
				'badge',
				String(badgeId)
			);
		}

		return userBadge;
	}

	async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
		return db
			.select({
				userBadge: userBadges,
				badge: badges,
			})
			.from(userBadges)
			.innerJoin(badges, eq(userBadges.badgeId, badges.id))
			.where(eq(userBadges.userId, userId))
			.then((rows) =>
				rows.map((row) => ({
					...row.userBadge,
					badge: row.badge,
				}))
			);
	}

	async hasUserEarnedBadge(userId: string, badgeId: number): Promise<boolean> {
		const [result] = await db
			.select({ count: count() })
			.from(userBadges)
			.where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)));

		return result.count > 0;
	}

	// User Points operations
	async createOrUpdateUserPoints(
		userId: string,
		data: Omit<InsertUserPoints, 'userId'>
	): Promise<UserPoints> {
		// Check if user points record exists
		const existingPoints = await this.getUserPoints(userId);

		if (existingPoints) {
			// Update existing record
			const [updated] = await db
				.update(userPoints)
				.set({
					...data,
					updatedAt: new Date(),
				})
				.where(eq(userPoints.userId, userId))
				.returning();

			return updated;
		} else {
			// Create new record
			const [newPoints] = await db
				.insert(userPoints)
				.values({
					userId,
					...data,
				})
				.returning();

			return newPoints;
		}
	}

	async getUserPoints(userId: string): Promise<UserPoints | undefined> {
		const [points] = await db.select().from(userPoints).where(eq(userPoints.userId, userId));

		return points;
	}

	async addPointsToUser(
		userId: string,
		points: number,
		description: string,
		transactionType: string,
		entityType?: string,
		entityId?: string
	): Promise<{ userPoints: UserPoints; transaction: PointTransaction }> {
		// Create the transaction record
		const [transaction] = await db
			.insert(pointTransactions)
			.values({
				userId,
				points,
				description,
				transactionType,
				relatedEntityType: entityType,
				relatedEntityId: entityId,
			})
			.returning();

		// Get current user points or create if not exists
		let userPointsData = await this.getUserPoints(userId);

		if (!userPointsData) {
			userPointsData = await this.createOrUpdateUserPoints(userId, {
				totalPoints: 0,
				level: 1,
				pointsToNextLevel: 100,
			});
		}

		// Update the total points
		const newTotalPoints = userPointsData.totalPoints + points;

		// Calculate new level
		// Simple level formula: level = floor(sqrt(totalPoints / 100)) + 1
		const newLevel = Math.floor(Math.sqrt(newTotalPoints / 100)) + 1;

		// Calculate points to next level
		const pointsToNextLevel = Math.pow(newLevel, 2) * 100 - newTotalPoints;

		// Update user points
		const userPoints = await this.createOrUpdateUserPoints(userId, {
			totalPoints: newTotalPoints,
			level: newLevel,
			pointsToNextLevel: pointsToNextLevel > 0 ? pointsToNextLevel : 100,
		});

		return { userPoints, transaction };
	}

	async getUserPointTransactions(userId: string, limit: number = 10): Promise<PointTransaction[]> {
		return db
			.select()
			.from(pointTransactions)
			.where(eq(pointTransactions.userId, userId))
			.orderBy(desc(pointTransactions.createdAt))
			.limit(limit);
	}

	async getUserLeaderboard(
		limit: number = 10
	): Promise<{ userId: string; username: string; totalPoints: number; level: number }[]> {
		const leaderboard = await db
			.select({
				userId: userPoints.userId,
				totalPoints: userPoints.totalPoints,
				level: userPoints.level,
			})
			.from(userPoints)
			.orderBy(desc(userPoints.totalPoints))
			.limit(limit);

		// Fetch usernames
		const result = [];
		for (const entry of leaderboard) {
			const user = await this.getUser(entry.userId);
			result.push({
				...entry,
				username: user?.username || 'Unknown User',
			});
		}

		return result;
	}

	// Streak operations
	async getOrCreateUserStreak(userId: string): Promise<Streak> {
		const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));

		if (streak) {
			return streak;
		}

		// Create new streak record
		const [newStreak] = await db
			.insert(streaks)
			.values({
				userId,
				currentStreak: 0,
				longestStreak: 0,
			})
			.returning();

		return newStreak;
	}

	async updateUserStreak(userId: string, increment: boolean): Promise<Streak> {
		// Get current streak or create if not exists
		const currentStreak = await this.getOrCreateUserStreak(userId);

		// Get today's date at midnight for comparison
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Check if last activity was yesterday
		const lastActivity = currentStreak.lastActivityDate
			? new Date(currentStreak.lastActivityDate)
			: null;
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		yesterday.setHours(0, 0, 0, 0);

		let newCurrentStreak = currentStreak.currentStreak;
		let newLongestStreak = currentStreak.longestStreak;

		if (increment) {
			// If last activity was yesterday or this is the first activity, increment streak
			if (
				lastActivity &&
				lastActivity.getTime() >= yesterday.getTime() &&
				lastActivity.getTime() < today.getTime()
			) {
				newCurrentStreak += 1;
			} else if (!lastActivity) {
				// First activity ever
				newCurrentStreak = 1;
			} else if (lastActivity.getTime() < yesterday.getTime()) {
				// Streak broken, start a new one
				newCurrentStreak = 1;
			}
			// Otherwise we've already logged in today, don't change streak

			// Update longest streak if current streak is longer
			if (newCurrentStreak > newLongestStreak) {
				newLongestStreak = newCurrentStreak;
			}
		}

		// Update the streak record
		const [updatedStreak] = await db
			.update(streaks)
			.set({
				currentStreak: newCurrentStreak,
				longestStreak: newLongestStreak,
				lastActivityDate: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(streaks.userId, userId))
			.returning();

		return updatedStreak;
	}

	async getUserStreakStats(userId: string): Promise<Streak | undefined> {
		const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));

		return streak;
	}

	async createLicenseActivity(data: InsertLicenseActivity): Promise<InsertLicenseActivity> {
		await db.insert(licenseActivities).values(data);
		return data;
	}

	// Challenge operations
	async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
		const [newChallenge] = await db.insert(challenges).values(challenge).returning();

		return newChallenge;
	}

	async getChallenge(id: number): Promise<Challenge | undefined> {
		const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));

		return challenge;
	}

	async getActiveChallenges(): Promise<Challenge[]> {
		const now = new Date();

		return db
			.select()
			.from(challenges)
			.where(
				and(
					eq(challenges.isActive, true),
					or(isNull(challenges.startDate), sql`${challenges.startDate} <= ${now}`),
					or(isNull(challenges.endDate), sql`${challenges.endDate} >= ${now}`)
				)
			);
	}

	async getActiveChallengesByType(type: string): Promise<Challenge[]> {
		const now = new Date();

		return db
			.select()
			.from(challenges)
			.where(
				and(
					eq(challenges.isActive, true),
					eq(challenges.type, type),
					or(isNull(challenges.startDate), sql`${challenges.startDate} <= ${now}`),
					or(isNull(challenges.endDate), sql`${challenges.endDate} >= ${now}`)
				)
			);
	}

	// User Challenge operations
	async assignChallengeToUser(userId: string, challengeId: number): Promise<UserChallenge> {
		// Check if already assigned
		const [existing] = await db
			.select()
			.from(userChallenges)
			.where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)));

		if (existing) {
			return existing;
		}

		// Assign the challenge
		const [userChallenge] = await db
			.insert(userChallenges)
			.values({
				userId,
				challengeId,
				progress: 0,
				isCompleted: false,
			})
			.returning();

		return userChallenge;
	}

	async updateUserChallengeProgress(
		userId: string,
		challengeId: number,
		progress: number
	): Promise<UserChallenge> {
		const [userChallenge] = await db
			.update(userChallenges)
			.set({
				progress,
				updatedAt: new Date(),
			})
			.where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)))
			.returning();

		return userChallenge;
	}

	async completeUserChallenge(userId: string, challengeId: number): Promise<UserChallenge> {
		// Mark as completed
		const [userChallenge] = await db
			.update(userChallenges)
			.set({
				progress: 100,
				isCompleted: true,
				completedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)))
			.returning();

		// Award points for completing the challenge
		if (userChallenge) {
			const challenge = await this.getChallenge(challengeId);
			if (challenge) {
				await this.addPointsToUser(
					userId,
					challenge.pointsReward,
					`Completed challenge: ${challenge.title}`,
					'challenge_completed',
					'challenge',
					String(challengeId)
				);
			}
		}

		return userChallenge;
	}

	async getUserActiveChallenges(
		userId: string
	): Promise<(UserChallenge & { challenge: Challenge })[]> {
		return db
			.select({
				userChallenge: userChallenges,
				challenge: challenges,
			})
			.from(userChallenges)
			.innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
			.where(
				and(
					eq(userChallenges.userId, userId),
					eq(userChallenges.isCompleted, false),
					eq(challenges.isActive, true)
				)
			)
			.then((rows) =>
				rows.map((row) => ({
					...row.userChallenge,
					challenge: row.challenge,
				}))
			);
	}

	async getUserCompletedChallenges(
		userId: string
	): Promise<(UserChallenge & { challenge: Challenge })[]> {
		return db
			.select({
				userChallenge: userChallenges,
				challenge: challenges,
			})
			.from(userChallenges)
			.innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
			.where(and(eq(userChallenges.userId, userId), eq(userChallenges.isCompleted, true)))
			.then((rows) =>
				rows.map((row) => ({
					...row.userChallenge,
					challenge: row.challenge,
				}))
			);
	}

	// Company operations
	async createCompany(company: InsertCompany): Promise<Company> {
		const [newCompany] = await db.insert(companies).values(company).returning();
		return newCompany;
	}

	async getCompany(id: number): Promise<Company | undefined> {
		const [company] = await db.select().from(companies).where(eq(companies.id, id));
		return company;
	}

	async getCompanyByName(name: string): Promise<Company | undefined> {
		const [company] = await db.select().from(companies).where(eq(companies.name, name));
		return company;
	}

	async updateCompanyStripeInfo(
		companyId: number,
		stripeInfo: { customerId: string; subscriptionId: string }
	): Promise<Company> {
		const [company] = await db
			.update(companies)
			.set({
				stripeCustomerId: stripeInfo.customerId,
				stripeSubscriptionId: stripeInfo.subscriptionId,
				updatedAt: new Date(),
			})
			.where(eq(companies.id, companyId))
			.returning();
		return company;
	}

	// Subscription plan operations
	async createSubscriptionPlan(plan: any): Promise<SubscriptionPlan> {
		const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
		return newPlan;
	}

	async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
		return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
	}

	async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
		const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
		return plan;
	}

	async updateSubscriptionPlanStripeInfo(
		planId: number,
		stripeInfo: { productId: string; priceId: string }
	): Promise<SubscriptionPlan> {
		const [plan] = await db
			.update(subscriptionPlans)
			.set({
				stripeProductId: stripeInfo.productId,
				stripePriceId: stripeInfo.priceId,
				updatedAt: new Date(),
			})
			.where(eq(subscriptionPlans.id, planId))
			.returning();
		return plan;
	}

	// User subscription operations
	async createUserSubscription(subscription: any): Promise<UserSubscription> {
		const [newSubscription] = await db.insert(userSubscriptions).values(subscription).returning();
		return newSubscription;
	}

	async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
		const [subscription] = await db
			.select()
			.from(userSubscriptions)
			.where(eq(userSubscriptions.userId, userId))
			.orderBy(desc(userSubscriptions.createdAt))
			.limit(1);
		return subscription;
	}

	async getUserActiveSubscription(userId: string): Promise<UserSubscription | undefined> {
		const [subscription] = await db
			.select()
			.from(userSubscriptions)
			.where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.isActive, true)))
			.orderBy(desc(userSubscriptions.createdAt))
			.limit(1);
		return subscription;
	}

	// Company subscription operations
	async createCompanySubscription(subscription: any): Promise<CompanySubscription> {
		const [newSubscription] = await db
			.insert(companySubscriptions)
			.values(subscription)
			.returning();
		return newSubscription;
	}

	async getCompanySubscription(companyId: number): Promise<CompanySubscription | undefined> {
		const [subscription] = await db
			.select()
			.from(companySubscriptions)
			.where(eq(companySubscriptions.companyId, companyId))
			.orderBy(desc(companySubscriptions.createdAt))
			.limit(1);
		return subscription;
	}

	async getCompanyActiveSubscription(companyId: number): Promise<CompanySubscription | undefined> {
		const [subscription] = await db
			.select()
			.from(companySubscriptions)
			.where(
				and(eq(companySubscriptions.companyId, companyId), eq(companySubscriptions.isActive, true))
			)
			.orderBy(desc(companySubscriptions.createdAt))
			.limit(1);
		return subscription;
	}

	// License operations
	async createLicense(license: InsertLicense): Promise<License> {
		const [newLicense] = await db.insert(licenses).values(license).returning();
		return newLicense;
	}

	async getLicense(id: number): Promise<License | undefined> {
		const [license] = await db.select().from(licenses).where(eq(licenses.id, id));
		return license;
	}

	async getLicenseByKey(licenseKey: string): Promise<License | undefined> {
		const [license] = await db.select().from(licenses).where(eq(licenses.licenseKey, licenseKey));
		return license;
	}

	async getCompanyLicenses(companyId: number): Promise<License[]> {
		return db.select().from(licenses).where(eq(licenses.companyId, companyId));
	}

	async getAvailableCompanyLicenses(companyId: number): Promise<License[]> {
		return db
			.select()
			.from(licenses)
			.where(
				and(
					eq(licenses.companyId, companyId),
					eq(licenses.status, LicenseStatus.ACTIVE),
					isNull(licenses.userId)
				)
			);
	}

	async getAssignedCompanyLicenses(companyId: number): Promise<License[]> {
		return db
			.select()
			.from(licenses)
			.where(
				and(
					eq(licenses.companyId, companyId),
					eq(licenses.status, LicenseStatus.ASSIGNED),
					not(isNull(licenses.userId))
				)
			);
	}

	async assignLicenseToUser(licenseId: number, userId: string): Promise<License> {
		const [license] = await db
			.update(licenses)
			.set({
				userId: userId,
				status: LicenseStatus.ASSIGNED,
				assignedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(licenses.id, licenseId))
			.returning();
		return license;
	}

	async revokeLicenseFromUser(licenseId: number): Promise<License> {
		const [license] = await db
			.update(licenses)
			.set({
				userId: null,
				status: LicenseStatus.ACTIVE,
				revokedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(licenses.id, licenseId))
			.returning();
		return license;
	}

	async updateLicenseStatus(licenseId: number, status: string): Promise<License> {
		const [license] = await db
			.update(licenses)
			.set({
				status: status,
				updatedAt: new Date(),
			})
			.where(eq(licenses.id, licenseId))
			.returning();
		return license;
	}

	// Enhanced video content for different course types
	private getEnhancedVideoForCourse(courseId: number, lessonId: number) {
		const videoLibrary = {
			// Web Development courses
			1: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
			// Data Science courses
			2: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
			// Machine Learning courses
			3: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
			// UI/UX Design courses
			4: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
			// Default fallback
			default: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
		};

		return videoLibrary[courseId as keyof typeof videoLibrary] || videoLibrary.default;
	}

	// Course operations
	async createCourse(course: any): Promise<Course> {
		const [newCourse] = await db.insert(courses).values(course).returning();
		return newCourse;
	}

	async getCourse(id: number): Promise<Course | undefined> {
		const [course] = await db.select().from(courses).where(eq(courses.id, id));
		return course;
	}

	async getCourses(limit = 10): Promise<Course[]> {
		return await db.select().from(courses).limit(limit);
	}

	async getCourseById(id: number): Promise<Course | undefined> {
		try {
			const result = await db.select().from(courses).where(eq(courses.id, id));

			if (result.length === 0) {
				return undefined;
			}

			// Get course modules
			const courseModules = await db
				.select()
				.from(modules)
				.where(eq(modules.courseId, id))
				.orderBy(modules.orderIndex);

			// Get lessons for each module
			for (const module of courseModules) {
				const moduleLessons = await db
					.select()
					.from(lessons)
					.where(eq(lessons.moduleId, module.id))
					.orderBy(lessons.orderIndex);

				(module as any).lessons = moduleLessons;
			}

			const course = result[0];
			(course as any).modules = courseModules;

			// If the course has a teaser video ID, fetch its details from videos table
			if (course.teaserVideoId) {
				try {
					const teaserVideos = await db
						.select()
						.from(videos)
						.where(eq(videos.id, course.teaserVideoId));

					if (teaserVideos.length > 0) {
						(course as any).teaserVideoDetails = teaserVideos[0];
					}
				} catch (videoError) {
					console.warn('Could not fetch teaser video details:', videoError);
					// Continue without teaser video details
				}
			}

			return course;
		} catch (error) {
			console.error('Error in getCourseById:', error);
			throw error;
		}
	}

	async getCoursesByCategory(categoryId: number): Promise<Course[]> {
		return await db.select().from(courses).where(eq(courses.categoryId, categoryId));
	}

	async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
		return await db.select().from(courses).where(eq(courses.instructorId, instructorId));
	}

	async searchCourses(query: string): Promise<Course[]> {
		return await db
			.select()
			.from(courses)
			.where(
				sql`to_tsvector('english', ${courses.title} || ' ' || ${
					courses.description
				}) @@ to_tsquery('english', ${query.replace(/ /g, ' & ')})`
			);
	}

	// Category operations
	async createCategory(category: any): Promise<Category> {
		const [newCategory] = await db.insert(categories).values(category).returning();
		return newCategory;
	}

	async getCategories(): Promise<Category[]> {
		return await db.select().from(categories);
	}

	async getCategory(id: number): Promise<Category | undefined> {
		const [category] = await db.select().from(categories).where(eq(categories.id, id));
		return category;
	}

	// Module operations
	async createModule(module: any): Promise<Module> {
		const [newModule] = await db.insert(modules).values(module).returning();
		return newModule;
	}

	async getModulesByCourse(courseId: number): Promise<Module[]> {
		return await db
			.select()
			.from(modules)
			.where(eq(modules.courseId, courseId))
			.orderBy(asc(modules.orderIndex));
	}

	// Lesson operations
	async createLesson(lesson: any): Promise<Lesson> {
		const [newLesson] = await db.insert(lessons).values(lesson).returning();
		return newLesson;
	}

	async getLessonsByModule(moduleId: number): Promise<any[]> {
		return await db
			.select({
				id: lessons.id,
				title: lessons.title,
				content: lessons.content,
				moduleId: lessons.moduleId,
				videoUrl: lessons.videoUrl,
				orderIndex: lessons.orderIndex,
				duration: lessons.duration,
				isPreview: lessons.isPreview,
				createdAt: lessons.createdAt,
				updatedAt: lessons.updatedAt,
			})
			.from(lessons)
			.where(eq(lessons.moduleId, moduleId))
			.orderBy(asc(lessons.orderIndex));
	}

	// Enrollment operations
	async createEnrollment(enrollment: any): Promise<Enrollment> {
		const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
		return newEnrollment;
	}

	async getEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined> {
		const [enrollment] = await db
			.select()
			.from(enrollments)
			.where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
		return enrollment;
	}

	async getUserEnrollments(userId: string): Promise<any[]> {
		// Get all enrollments with course information and progress
		const userEnrollments = await db
			.select({
				enrollment: enrollments,
				course: courses,
				category: categories,
			})
			.from(enrollments)
			.innerJoin(courses, eq(enrollments.courseId, courses.id))
			.leftJoin(categories, eq(courses.categoryId, categories.id))
			.where(eq(enrollments.userId, userId));

		// For each enrollment, get the progress information
		const enrichedEnrollments = await Promise.all(
			userEnrollments.map(async (enrollment) => {
				const progress = await this.getUserCourseProgress(userId, enrollment.course.id);
				return {
					...enrollment,
					progress,
				};
			})
		);

		return enrichedEnrollments;
	}

	// Lesson completion operations
	async completeLessonForUser(userId: string, lessonId: number): Promise<LessonCompletion> {
		// First check if the lesson is already completed
		const [existingCompletion] = await db
			.select()
			.from(lessonCompletions)
			.where(and(eq(lessonCompletions.userId, userId), eq(lessonCompletions.lessonId, lessonId)));

		if (existingCompletion) {
			return existingCompletion;
		}

		// If not, create a new completion record
		const [completion] = await db
			.insert(lessonCompletions)
			.values({
				userId,
				lessonId,
			})
			.returning();

		return completion;
	}

	async getUserCompletedLessons(userId: string, courseId: number): Promise<number[]> {
		// Get all modules for the course
		const courseModules = await this.getModulesByCourse(courseId);
		const moduleIds = courseModules.map((module) => module.id);

		if (moduleIds.length === 0) return [];

		// Get all lessons from those modules
		const courseLessons = await db
			.select()
			.from(lessons)
			.where(moduleIds.length > 0 ? inArray(lessons.moduleId, moduleIds) : undefined);

		const lessonIds = courseLessons.map((lesson) => lesson.id);

		if (lessonIds.length === 0) return [];

		// Get all completed lessons
		const completedLessons = await db
			.select({ lessonId: lessonCompletions.lessonId })
			.from(lessonCompletions)
			.where(
				and(
					eq(lessonCompletions.userId, userId),
					lessonIds.length > 0 ? inArray(lessonCompletions.lessonId, lessonIds) : undefined
				)
			);

		return completedLessons.map((c) => c.lessonId);
	}

	async getUserCourseProgress(
		userId: string,
		courseId: number
	): Promise<{ completed: number; total: number }> {
		// Get all modules for the course
		const courseModules = await this.getModulesByCourse(courseId);
		const moduleIds = courseModules.map((module) => module.id);

		if (moduleIds.length === 0) return { completed: 0, total: 0 };

		// Count all lessons in the course
		const totalLessonsResult = await db
			.select({ count: count() })
			.from(lessons)
			.where(moduleIds.length > 0 ? inArray(lessons.moduleId, moduleIds) : undefined);

		const totalLessons = totalLessonsResult[0]?.count || 0;

		// If no lessons, return early
		if (totalLessons === 0) return { completed: 0, total: 0 };

		// Get lesson IDs for the course
		const courseLessons = await db
			.select({ id: lessons.id })
			.from(lessons)
			.where(moduleIds.length > 0 ? inArray(lessons.moduleId, moduleIds) : undefined);

		const lessonIds = courseLessons.map((lesson) => lesson.id);

		// Count completed lessons
		const completedLessonsResult =
			lessonIds.length > 0
				? await db
						.select({ count: count() })
						.from(lessonCompletions)
						.where(
							and(
								eq(lessonCompletions.userId, userId),
								inArray(lessonCompletions.lessonId, lessonIds)
							)
						)
				: [{ count: 0 }];

		const completedLessons = completedLessonsResult[0]?.count || 0;

		return {
			completed: completedLessons,
			total: totalLessons,
		};
	}

	// ---- Emoji Reactions Methods ----

	async getContentReactions(
		contentType: string,
		contentId: number
	): Promise<{ reactions: any[]; userReaction: string | null }> {
		try {
			// Get all reactions for this content, grouped by type with counts
			const reactionsQuery = db.execute(
				sql`SELECT reaction_type, COUNT(*) as count 
            FROM emoji_reactions 
            WHERE content_type = ${contentType} AND content_id = ${contentId}
            GROUP BY reaction_type`
			);

			const reactions = await reactionsQuery;

			// Transform the DB results to the expected format
			const formattedReactions = Array.isArray(reactions.rows)
				? reactions.rows.map((row: any) => ({
						type: row.reaction_type,
						count: parseInt(row.count),
				  }))
				: [];

			return {
				reactions: formattedReactions,
				userReaction: null, // This will be filled by the API route for authenticated users
			};
		} catch (error) {
			console.error('Error fetching emoji reactions:', error);
			return { reactions: [], userReaction: null };
		}
	}

	async getUserReaction(
		userId: string,
		contentType: string,
		contentId: number
	): Promise<string | null> {
		try {
			const userReaction = await db
				.select({ reactionType: emojiReactions.reactionType })
				.from(emojiReactions)
				.where(
					and(
						eq(emojiReactions.userId, userId),
						eq(emojiReactions.contentType, contentType),
						eq(emojiReactions.contentId, contentId)
					)
				)
				.limit(1);

			return userReaction.length > 0 ? userReaction[0].reactionType : null;
		} catch (error) {
			console.error('Error fetching user reaction:', error);
			return null;
		}
	}

	async addOrUpdateReaction(
		userId: string,
		contentType: string,
		contentId: number,
		reactionType: string
	): Promise<EmojiReaction> {
		try {
			// Check if this user already has a reaction of this type for this content
			const existingReaction = await db
				.select()
				.from(emojiReactions)
				.where(
					and(
						eq(emojiReactions.userId, userId),
						eq(emojiReactions.contentType, contentType),
						eq(emojiReactions.contentId, contentId)
					)
				)
				.limit(1);

			if (existingReaction.length > 0) {
				// If they have a different reaction, update it
				if (existingReaction[0].reactionType !== reactionType) {
					const [updated] = await db
						.update(emojiReactions)
						.set({
							reactionType,
							updatedAt: new Date(),
						})
						.where(eq(emojiReactions.id, existingReaction[0].id))
						.returning();

					return updated;
				}

				// If they have the same reaction, just return it (no change)
				return existingReaction[0];
			}

			// Otherwise, create a new reaction
			const [newReaction] = await db
				.insert(emojiReactions)
				.values({
					userId,
					contentType,
					contentId,
					reactionType,
				})
				.returning();

			return newReaction;
		} catch (error) {
			console.error('Error adding/updating reaction:', error);
			throw error;
		}
	}

	async removeReaction(
		userId: string,
		contentType: string,
		contentId: number,
		reactionType: string
	): Promise<void> {
		try {
			await db
				.delete(emojiReactions)
				.where(
					and(
						eq(emojiReactions.userId, userId),
						eq(emojiReactions.contentType, contentType),
						eq(emojiReactions.contentId, contentId),
						eq(emojiReactions.reactionType, reactionType)
					)
				);
		} catch (error) {
			console.error('Error removing reaction:', error);
			throw error;
		}
	}

	// Company onboarding operations
	async createCompanyOnboardingApplication(
		data: InsertCompanyOnboardingApplication
	): Promise<CompanyOnboardingApplication> {
		const [application] = await db.insert(companyOnboardingApplications).values(data).returning();
		return application;
	}

	async getAllCompanyOnboardingApplications(): Promise<CompanyOnboardingApplication[]> {
		return await db
			.select()
			.from(companyOnboardingApplications)
			.orderBy(desc(companyOnboardingApplications.createdAt));
	}

	async getCompanyOnboardingApplication(
		id: number
	): Promise<CompanyOnboardingApplication | undefined> {
		const [application] = await db
			.select()
			.from(companyOnboardingApplications)
			.where(eq(companyOnboardingApplications.id, id));
		return application;
	}

	async updateCompanyOnboardingApplicationStatus(
		id: number,
		status: string,
		reviewedBy: string,
		reviewNotes?: string
	): Promise<CompanyOnboardingApplication> {
		const [updated] = await db
			.update(companyOnboardingApplications)
			.set({
				status,
				reviewedBy,
				reviewedAt: new Date(),
				reviewNotes,
				updatedAt: new Date(),
			})
			.where(eq(companyOnboardingApplications.id, id))
			.returning();
		return updated;
	}
}

export const storage = new DatabaseStorage();
