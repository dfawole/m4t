//shared/schema.ts
import {
	pgTable,
	text,
	varchar,
	timestamp,
	jsonb,
	index,
	integer,
	serial,
	boolean,
	decimal,
	primaryKey,
	date,
	uniqueIndex,
	numeric,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { relations } from 'drizzle-orm';
import { makeInsertSchema } from './_utils';

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
	'sessions',
	{
		sid: varchar('sid').primaryKey(),
		sess: jsonb('sess').notNull(),
		expire: timestamp('expire').notNull(),
	},
	(table) => [index('IDX_session_expire').on(table.expire)]
);

// User roles enum
export const UserRole = {
	STUDENT: 'student',
	INSTRUCTOR: 'instructor',
	COMPANY_ADMIN: 'company_admin',
	INTERNAL_ADMIN: 'internal_admin',
} as const;

// Subscription period enum
export const SubscriptionPeriod = {
	MONTHLY: 'MONTHLY',
	YEARLY: 'YEARLY',
} as const;

// Learning preference enum
export const LearningStyle = {
	VISUAL: 'visual',
	AUDITORY: 'auditory',
	READING: 'reading',
	KINESTHETIC: 'kinesthetic',
} as const;

// Pace preference enum
export const LearningPace = {
	SLOW: 'slow',
	MODERATE: 'moderate',
	FAST: 'fast',
} as const;

// Users table
export const users = pgTable('users', {
	id: varchar('id').primaryKey().notNull(),
	username: varchar('username').unique(),
	password: varchar('password'),
	email: varchar('email').unique(),
	firstName: varchar('first_name'),
	lastName: varchar('last_name'),
	profileImageUrl: varchar('profile_image_url'),
	authProvider: varchar('auth_provider'), // Tracks which authentication method was used (google, github, email, etc.)
	googleId: varchar('google_id'),
	githubId: varchar('github_id'),
	appleId: varchar('apple_id'),
	role: text('role').notNull().default(UserRole.STUDENT),
	companyId: integer('company_id'),
	stripeCustomerId: varchar('stripe_customer_id'),
	stripeSubscriptionId: varchar('stripe_subscription_id'),
	learningPreferences: jsonb('learning_preferences'), // Store preferred learning style, pace, etc.
	interests: jsonb('interests'), // Store tag IDs or areas of interest
	skillLevels: jsonb('skill_levels'), // Store user's self-reported skill levels
	isEmailVerified: boolean('is_email_verified').default(false),
	verificationToken: varchar('verification_token'),
	verificationTokenExpiry: timestamp('verification_token_expiry'),
	resetPasswordToken: varchar('reset_password_token'),
	resetPasswordTokenExpiry: timestamp('reset_password_token_expiry'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Companies table
export const companies = pgTable('companies', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull(),
	phone: varchar('phone'),
	address: varchar('address'),
	stripeCustomerId: varchar('stripe_customer_id'),
	stripeSubscriptionId: varchar('stripe_subscription_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
	company: one(companies, {
		fields: [users.companyId],
		references: [companies.id],
	}),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
	users: many(users),
	subscriptions: many(companySubscriptions),
	licenses: many(licenses),
}));

// Subscription plans
export const subscriptionPlans = pgTable('subscription_plans', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description').notNull(),
	price: numeric('price', { precision: 10, scale: 2 }).notNull(),
	period: text('period').notNull(),
	features: jsonb('features').$type<string[]>().notNull(),
	stripeProductId: varchar('stripe_product_id'),
	stripePriceId: varchar('stripe_price_id'),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	maxUsers: integer('max_users').notNull(),
	trialDays: integer('trial_days').notNull(),
});

// User Subscriptions
export const userSubscriptions = pgTable('user_subscriptions', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => users.id),
	planId: integer('plan_id')
		.notNull()
		.references(() => subscriptionPlans.id),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	isActive: boolean('is_active').default(true),
	stripeSubscriptionId: varchar('stripe_subscription_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Business License Status enum
export const LicenseStatus = {
	ACTIVE: 'active',
	ASSIGNED: 'assigned',
	SUSPENDED: 'suspended',
	EXPIRED: 'expired',
} as const;

// Company Subscriptions
export const companySubscriptions = pgTable('company_subscriptions', {
	id: serial('id').primaryKey(),
	companyId: integer('company_id')
		.notNull()
		.references(() => companies.id),
	planId: integer('plan_id')
		.notNull()
		.references(() => subscriptionPlans.id),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	userLimit: integer('user_limit').notNull(),
	isActive: boolean('is_active').default(true),
	stripeSubscriptionId: varchar('stripe_subscription_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// License Management
export const licenses = pgTable('licenses', {
	id: serial('id').primaryKey(),
	companyId: integer('company_id')
		.notNull()
		.references(() => companies.id),
	subscriptionId: integer('subscription_id')
		.notNull()
		.references(() => companySubscriptions.id),
	licenseKey: varchar('license_key', { length: 100 }).notNull().unique(),
	userId: varchar('user_id').references(() => users.id),
	status: varchar('status', { length: 20 }).notNull().default(LicenseStatus.ACTIVE),
	assignedAt: timestamp('assigned_at'),
	revokedAt: timestamp('revoked_at'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const licensesRelations = relations(licenses, ({ one }) => ({
	company: one(companies, {
		fields: [licenses.companyId],
		references: [companies.id],
	}),
	subscription: one(companySubscriptions, {
		fields: [licenses.subscriptionId],
		references: [companySubscriptions.id],
	}),
	user: one(users, {
		fields: [licenses.userId],
		references: [users.id],
	}),
}));

// Categories for courses
export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Courses
// Tags for course tagging system
export const tags = pgTable('tags', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 50 }).notNull().unique(),
	description: text('description'),
	category: varchar('category', { length: 50 }), // skill, technology, industry, etc.
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Many-to-many relationship between courses and tags
export const courseTags = pgTable(
	'course_tags',
	{
		id: serial('id').primaryKey(),
		courseId: integer('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
		tagId: integer('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
	},
	(table) => {
		return {
			courseTagUnique: uniqueIndex('course_tag_unique').on(table.courseId, table.tagId),
		};
	}
);

export const courses = pgTable('courses', {
	id: serial('id').primaryKey(),
	title: varchar('title').notNull(),
	description: text('description').notNull(),
	coverImage: varchar('cover_image'),
	teaserVideo: varchar('teaser_video'), // URL to teaser video for non-subscribed users
	teaserVideoId: varchar('teaser_video_id'), // ID for teaser video from third-party service
	duration: integer('duration').notNull(), // in minutes
	level: varchar('level').notNull(), // beginner, intermediate, advanced
	categoryId: integer('category_id').references(() => categories.id),
	instructorId: varchar('instructor_id').references(() => users.id),
	popularity: integer('popularity').default(0), // track popularity for recommendations
	difficulty: integer('difficulty').default(5), // 1-10 difficulty score
	rating: decimal('rating', { precision: 3, scale: 1 }), // Rating out of 5
	learningStyles: jsonb('learning_styles'), // Array of learning styles this course supports
	industry: varchar('industry', { length: 100 }), // Target industry for the course
	prerequisites: jsonb('prerequisites'), // array of skill or course IDs that are prerequisites
	learningOutcomes: jsonb('learning_outcomes'), // array of skills/competencies gained
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
	category: one(categories, {
		fields: [courses.categoryId],
		references: [categories.id],
	}),
	instructor: one(users, {
		fields: [courses.instructorId],
		references: [users.id],
	}),
	modules: many(modules),
	enrollments: many(enrollments),
	tags: many(courseTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	courses: many(courseTags),
}));

export const courseTagsRelations = relations(courseTags, ({ one }) => ({
	course: one(courses, {
		fields: [courseTags.courseId],
		references: [courses.id],
	}),
	tag: one(tags, {
		fields: [courseTags.tagId],
		references: [tags.id],
	}),
}));

// Course Modules
export const modules = pgTable('modules', {
	id: serial('id').primaryKey(),
	title: varchar('title').notNull(),
	description: text('description'),
	courseId: integer('course_id')
		.notNull()
		.references(() => courses.id),
	orderIndex: integer('order_index').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const modulesRelations = relations(modules, ({ one, many }) => ({
	course: one(courses, {
		fields: [modules.courseId],
		references: [courses.id],
	}),
	lessons: many(lessons),
}));

// Lessons
export const lessons = pgTable('lessons', {
	id: serial('id').primaryKey(),
	title: varchar('title').notNull(),
	content: text('content'),
	moduleId: integer('module_id')
		.notNull()
		.references(() => modules.id),
	videoUrl: varchar('video_url'),
	quizVideoUrl: varchar('quiz_video_url'),
	orderIndex: integer('order_index').notNull(),
	duration: integer('duration'), // in minutes
	isPreview: boolean('is_preview').default(false), // free preview access
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
	module: one(modules, {
		fields: [lessons.moduleId],
		references: [modules.id],
	}),
	completions: many(lessonCompletions),
}));

// User Enrollments
export const enrollments = pgTable(
	'enrollments',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		courseId: integer('course_id')
			.notNull()
			.references(() => courses.id),
		enrolledAt: timestamp('enrolled_at').defaultNow(),
		completedAt: timestamp('completed_at'),
	},
	(t) => ({
		unq: uniqueIndex('user_course_unique').on(t.userId, t.courseId),
	})
);

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
	user: one(users, {
		fields: [enrollments.userId],
		references: [users.id],
	}),
	course: one(courses, {
		fields: [enrollments.courseId],
		references: [courses.id],
	}),
	progress: many(lessonCompletions, {
		relationName: 'enrollment_progress',
	}),
}));

// Lesson Completions
export const lessonCompletions = pgTable(
	'lesson_completions',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		lessonId: integer('lesson_id')
			.notNull()
			.references(() => lessons.id),
		completedAt: timestamp('completed_at').defaultNow(),
	},
	(t) => ({
		unq: uniqueIndex('user_lesson_unique').on(t.userId, t.lessonId),
	})
);

// Interactive Quiz System
export const quizzes = pgTable('quizzes', {
	id: serial('id').primaryKey(),
	lessonId: integer('lesson_id')
		.notNull()
		.references(() => lessons.id),
	title: varchar('title', { length: 200 }).notNull(),
	description: text('description'),
	passingScore: integer('passing_score').default(70), // percentage
	timeLimit: integer('time_limit'), // in minutes, null for unlimited
	maxAttempts: integer('max_attempts').default(3),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const quizQuestions = pgTable('quiz_questions', {
	id: serial('id').primaryKey(),
	quizId: integer('quiz_id')
		.notNull()
		.references(() => quizzes.id, { onDelete: 'cascade' }),
	questionText: text('question_text').notNull(),
	questionType: varchar('question_type', { length: 50 }).default('multiple_choice'), // multiple_choice, true_false, fill_in_blank
	points: integer('points').default(1),
	explanation: text('explanation'),
	orderIndex: integer('order_index').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
});

export const quizAnswers = pgTable('quiz_answers', {
	id: serial('id').primaryKey(),
	questionId: integer('question_id')
		.notNull()
		.references(() => quizQuestions.id, { onDelete: 'cascade' }),
	answerText: text('answer_text').notNull(),
	isCorrect: boolean('is_correct').default(false),
	orderIndex: integer('order_index').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
});

export const userQuizAttempts = pgTable('user_quiz_attempts', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => users.id),
	quizId: integer('quiz_id')
		.notNull()
		.references(() => quizzes.id),
	score: integer('score').notNull(), // percentage
	totalQuestions: integer('total_questions').notNull(),
	correctAnswers: integer('correct_answers').notNull(),
	timeSpent: integer('time_spent'), // in seconds
	answers: jsonb('answers'), // user's selected answers
	isPassed: boolean('is_passed').default(false),
	attemptNumber: integer('attempt_number').notNull(),
	startedAt: timestamp('started_at').defaultNow(),
	completedAt: timestamp('completed_at'),
});

export const lessonCompletionsRelations = relations(lessonCompletions, ({ one }) => ({
	user: one(users, {
		fields: [lessonCompletions.userId],
		references: [users.id],
	}),
	lesson: one(lessons, {
		fields: [lessonCompletions.lessonId],
		references: [lessons.id],
	}),
	enrollment: one(enrollments, {
		fields: [lessonCompletions.userId],
		references: [enrollments.userId],
		relationName: 'enrollment_progress',
	}),
}));

// Quiz Relations
export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
	lesson: one(lessons, {
		fields: [quizzes.lessonId],
		references: [lessons.id],
	}),
	questions: many(quizQuestions),
	attempts: many(userQuizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
	quiz: one(quizzes, {
		fields: [quizQuestions.quizId],
		references: [quizzes.id],
	}),
	answers: many(quizAnswers),
}));

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
	question: one(quizQuestions, {
		fields: [quizAnswers.questionId],
		references: [quizQuestions.id],
	}),
}));

export const userQuizAttemptsRelations = relations(userQuizAttempts, ({ one }) => ({
	user: one(users, {
		fields: [userQuizAttempts.userId],
		references: [users.id],
	}),
	quiz: one(quizzes, {
		fields: [userQuizAttempts.quizId],
		references: [quizzes.id],
	}),
}));

// Insert schemas for validation
export const insertCategorySchema = makeInsertSchema(categories).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertCourseSchema = makeInsertSchema(courses).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertModuleSchema = makeInsertSchema(modules).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertLessonSchema = makeInsertSchema(lessons).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertEnrollmentSchema = makeInsertSchema(enrollments).omit({
	id: true,
});

export const insertCompanySchema = makeInsertSchema(companies).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertSubscriptionPlanSchema = makeInsertSchema(subscriptionPlans).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertUserSubscriptionSchema = makeInsertSchema(userSubscriptions).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertCompanySubscriptionSchema = makeInsertSchema(companySubscriptions).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Use Drizzle's built-in type inference
export type InsertCategory = typeof categories.$inferInsert;
export type Category = typeof categories.$inferSelect;

export type InsertCourse = typeof courses.$inferInsert;
export type Course = typeof courses.$inferSelect;

export type InsertModule = typeof modules.$inferInsert;
export type Module = typeof modules.$inferSelect;

export type InsertLesson = typeof lessons.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;

export type InsertEnrollment = typeof enrollments.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertCompany = typeof companies.$inferInsert;
export type Company = typeof companies.$inferSelect;

export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

export type InsertCompanySubscription = typeof companySubscriptions.$inferInsert;
export type CompanySubscription = typeof companySubscriptions.$inferSelect;

export type InsertLicense = typeof licenses.$inferInsert;
export type License = typeof licenses.$inferSelect;

export type LessonCompletion = typeof lessonCompletions.$inferSelect;

// Learning Tips System
export const TipContext = {
	COURSE_OVERVIEW: 'course_overview',
	LESSON_VIEWER: 'lesson_viewer',
	DASHBOARD: 'dashboard',
	SKILL_TREE: 'skill_tree',
	QUIZ: 'quiz',
	GENERAL: 'general',
} as const;

// Video Caption Track Types
export const VideoTrackKind = {
	SUBTITLES: 'subtitles',
	CAPTIONS: 'captions',
	DESCRIPTIONS: 'descriptions',
	CHAPTERS: 'chapters',
	METADATA: 'metadata',
} as const;

export const learningTips = pgTable('learning_tips', {
	id: serial('id').primaryKey(),
	tipKey: varchar('tip_key', { length: 50 }).notNull().unique(),
	title: varchar('title', { length: 100 }).notNull(),
	content: text('content').notNull(),
	context: varchar('context', { length: 50 }).notNull(),
	priority: integer('priority').default(1).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
});

export const userTipPreferences = pgTable(
	'user_tip_preferences',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		tipId: integer('tip_id')
			.notNull()
			.references(() => learningTips.id),
		seen: boolean('seen').default(false),
		dismissed: boolean('dismissed').default(false),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow(),
	},
	(table) => {
		return {
			userTipUnique: uniqueIndex('user_tip_unique').on(table.userId, table.tipId),
		};
	}
);

export const userTipPreferencesRelations = relations(userTipPreferences, ({ one }) => ({
	user: one(users, {
		fields: [userTipPreferences.userId],
		references: [users.id],
	}),
	tip: one(learningTips, {
		fields: [userTipPreferences.tipId],
		references: [learningTips.id],
	}),
}));

export type LearningTip = typeof learningTips.$inferSelect;
export type InsertLearningTip = typeof learningTips.$inferInsert;
export type UserTipPreference = typeof userTipPreferences.$inferSelect;
export type InsertUserTipPreference = typeof userTipPreferences.$inferInsert;

export const insertLearningTipSchema = makeInsertSchema(learningTips).omit({
	id: true,
	createdAt: true,
});

export const insertUserTipPreferenceSchema = makeInsertSchema(userTipPreferences).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Video Storage and Playback System
export const videos = pgTable('videos', {
	id: varchar('id').primaryKey(), // String ID for teaser videos
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	url: varchar('url', { length: 500 }).notNull(),
	duration: integer('duration'), // in seconds
	thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
	isTeaser: boolean('is_teaser').default(false),
	isPublic: boolean('is_public').default(false),
	lessonId: integer('lesson_id').references(() => lessons.id),
	courseId: integer('course_id').references(() => courses.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const videoCaptionTracks = pgTable(
	'video_caption_tracks',
	{
		id: serial('id').primaryKey(),
		videoId: varchar('video_id')
			.notNull()
			.references(() => videos.id),
		language: varchar('language', { length: 20 }).notNull(), // e.g., 'en', 'es', 'fr'
		label: varchar('label', { length: 100 }).notNull(), // e.g., 'English', 'Spanish', 'French'
		kind: varchar('kind', { length: 20 }).notNull(), // e.g., 'subtitles', 'captions'
		content: text('content').notNull(), // WebVTT content
		isDefault: boolean('is_default').default(false),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow(),
	},
	(table) => {
		return {
			videoLanguageUnique: uniqueIndex('video_language_unique').on(table.videoId, table.language),
		};
	}
);

// Videos relations
export const videosRelations = relations(videos, ({ one, many }) => ({
	lesson: one(lessons, {
		fields: [videos.lessonId],
		references: [lessons.id],
	}),
	course: one(courses, {
		fields: [videos.courseId],
		references: [courses.id],
	}),
	captionTracks: many(videoCaptionTracks),
}));

export const videoCaptionTracksRelations = relations(videoCaptionTracks, ({ one }) => ({
	video: one(videos, {
		fields: [videoCaptionTracks.videoId],
		references: [videos.id],
	}),
}));

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type VideoCaptionTrack = typeof videoCaptionTracks.$inferSelect;
export type InsertVideoCaptionTrack = typeof videoCaptionTracks.$inferInsert;

export const insertVideoSchema = makeInsertSchema(videos).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertVideoCaptionTrackSchema = makeInsertSchema(videoCaptionTracks).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Emoji Reactions System
export const EmojiReactionType = {
	LIKE: 'like',
	LOVE: 'love',
	INSIGHTFUL: 'insightful',
	CONFUSED: 'confused',
	EXCITED: 'excited',
	CURIOUS: 'curious',
} as const;

export const emojiReactions = pgTable(
	'emoji_reactions',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		contentType: varchar('content_type', { length: 50 }).notNull(), // course, lesson, comment
		contentId: integer('content_id').notNull(),
		reactionType: varchar('reaction_type', { length: 50 }).notNull(), // like, love, insightful, confused, excited, etc.
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow(),
	},
	(table) => {
		return {
			userContentReaction: uniqueIndex('user_content_reaction').on(
				table.userId,
				table.contentType,
				table.contentId,
				table.reactionType
			),
		};
	}
);

export const emojiReactionsRelations = relations(emojiReactions, ({ one }) => ({
	user: one(users, {
		fields: [emojiReactions.userId],
		references: [users.id],
	}),
}));

export type EmojiReaction = typeof emojiReactions.$inferSelect;
export type InsertEmojiReaction = typeof emojiReactions.$inferInsert;

export const insertEmojiReactionSchema = makeInsertSchema(emojiReactions).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Gamification Elements
export const badges = pgTable('badges', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	description: text('description').notNull(),
	imageUrl: varchar('image_url', { length: 255 }),
	category: varchar('category', { length: 50 }).notNull(), // achievement, skill, participation
	pointsValue: integer('points_value').default(10).notNull(),
	criteria: jsonb('criteria').notNull(), // conditions to earn badge
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const userBadges = pgTable(
	'user_badges',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		badgeId: integer('badge_id')
			.notNull()
			.references(() => badges.id),
		earnedAt: timestamp('earned_at').defaultNow(),
	},
	(table) => {
		return {
			userBadgeUnique: uniqueIndex('user_badge_unique').on(table.userId, table.badgeId),
		};
	}
);

export const userPoints = pgTable('user_points', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => users.id),
	totalPoints: integer('total_points').default(0).notNull(),
	level: integer('level').default(1).notNull(),
	pointsToNextLevel: integer('points_to_next_level').default(100).notNull(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const pointTransactions = pgTable('point_transactions', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => users.id),
	points: integer('points').notNull(),
	description: varchar('description', { length: 255 }).notNull(),
	transactionType: varchar('transaction_type', { length: 50 }).notNull(), // course_completion, lesson_completion, badge_earned, quiz_completed, login_streak
	relatedEntityType: varchar('related_entity_type', { length: 50 }), // course, lesson, badge, quiz
	relatedEntityId: varchar('related_entity_id', { length: 100 }),
	createdAt: timestamp('created_at').defaultNow(),
});

export const streaks = pgTable('streaks', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => users.id),
	currentStreak: integer('current_streak').default(0).notNull(),
	longestStreak: integer('longest_streak').default(0).notNull(),
	lastActivityDate: timestamp('last_activity_date'),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const challenges = pgTable('challenges', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 100 }).notNull(),
	description: text('description').notNull(),
	type: varchar('type', { length: 50 }).notNull(), // daily, weekly, course-specific, platform-wide
	pointsReward: integer('points_reward').default(0).notNull(),
	startDate: timestamp('start_date'),
	endDate: timestamp('end_date'),
	criteria: jsonb('criteria').notNull(), // conditions to complete challenge
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const userChallenges = pgTable(
	'user_challenges',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		challengeId: integer('challenge_id')
			.notNull()
			.references(() => challenges.id),
		progress: integer('progress').default(0), // as percentage
		isCompleted: boolean('is_completed').default(false),
		completedAt: timestamp('completed_at'),
		updatedAt: timestamp('updated_at').defaultNow(),
	},
	(table) => {
		return {
			userChallengeUnique: uniqueIndex('user_challenge_unique').on(table.userId, table.challengeId),
		};
	}
);

// Relations for gamification
export const badgesRelations = relations(badges, ({ many }) => ({
	userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
	user: one(users, {
		fields: [userBadges.userId],
		references: [users.id],
	}),
	badge: one(badges, {
		fields: [userBadges.badgeId],
		references: [badges.id],
	}),
}));

export const userPointsRelations = relations(userPoints, ({ one, many }) => ({
	user: one(users, {
		fields: [userPoints.userId],
		references: [users.id],
	}),
	transactions: many(pointTransactions),
}));

export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
	user: one(users, {
		fields: [pointTransactions.userId],
		references: [users.id],
	}),
}));

export const streaksRelations = relations(streaks, ({ one }) => ({
	user: one(users, {
		fields: [streaks.userId],
		references: [users.id],
	}),
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
	userChallenges: many(userChallenges),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
	user: one(users, {
		fields: [userChallenges.userId],
		references: [users.id],
	}),
	challenge: one(challenges, {
		fields: [userChallenges.challengeId],
		references: [challenges.id],
	}),
}));

// Types for gamification elements
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = typeof userPoints.$inferInsert;

export type PointTransaction = typeof pointTransactions.$inferSelect;
export type InsertPointTransaction = typeof pointTransactions.$inferInsert;

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = typeof streaks.$inferInsert;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = typeof userChallenges.$inferInsert;

// Zod schemas for gamification
export const insertBadgeSchema = makeInsertSchema(badges).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertUserBadgeSchema = makeInsertSchema(userBadges).omit({
	id: true,
	earnedAt: true,
});

export const insertUserPointsSchema = makeInsertSchema(userPoints).omit({
	id: true,
	updatedAt: true,
});

export const insertPointTransactionSchema = makeInsertSchema(pointTransactions).omit({
	id: true,
	createdAt: true,
});

export const insertStreakSchema = makeInsertSchema(streaks).omit({
	id: true,
	updatedAt: true,
});

export const insertChallengeSchema = makeInsertSchema(challenges).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const insertUserChallengeSchema = makeInsertSchema(userChallenges).omit({
	id: true,
	completedAt: true,
	updatedAt: true,
});

// Personalized Learning Path System

// User Learning Paths
export const learningPaths = pgTable('learning_paths', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	description: text('description'),
	goalDescription: text('goal_description'),
	estimatedHours: integer('estimated_hours'),
	targetSkillLevel: varchar('target_skill_level', { length: 50 }), // beginner, intermediate, advanced, expert
	isCustom: boolean('is_custom').default(false), // custom path vs. predefined
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Courses in a learning path (ordered sequence)
export const learningPathCourses = pgTable(
	'learning_path_courses',
	{
		id: serial('id').primaryKey(),
		pathId: integer('path_id')
			.notNull()
			.references(() => learningPaths.id, { onDelete: 'cascade' }),
		courseId: integer('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
		orderIndex: integer('order_index').notNull(), // Position in the learning path
		isRequired: boolean('is_required').default(true),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(table) => {
		return {
			pathCourseUnique: uniqueIndex('path_course_unique').on(table.pathId, table.courseId),
		};
	}
);

// User's enrolled learning paths
export const userLearningPaths = pgTable(
	'user_learning_paths',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		pathId: integer('path_id')
			.notNull()
			.references(() => learningPaths.id),
		enrolledAt: timestamp('enrolled_at').defaultNow(),
		completedAt: timestamp('completed_at'),
		progress: integer('progress').default(0), // Percentage of path completed
		isActive: boolean('is_active').default(true),
		estimatedCompletionDate: date('estimated_completion_date'),
	},
	(table) => {
		return {
			userPathUnique: uniqueIndex('user_path_unique').on(table.userId, table.pathId),
		};
	}
);

// Course recommendations for users
export const courseRecommendations = pgTable(
	'course_recommendations',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		courseId: integer('course_id')
			.notNull()
			.references(() => courses.id),
		score: decimal('score', { precision: 5, scale: 2 }).notNull(), // Recommendation score/relevance
		reason: varchar('reason', { length: 255 }), // Why this course was recommended
		source: varchar('source', { length: 50 }).notNull(), // algorithm, instructor, peer, etc.
		isViewed: boolean('is_viewed').default(false),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(table) => {
		return {
			userCourseRecUnique: uniqueIndex('user_course_rec_unique').on(table.userId, table.courseId),
		};
	}
);

// User skills and competencies
export const userSkills = pgTable(
	'user_skills',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id')
			.notNull()
			.references(() => users.id),
		tagId: integer('tag_id')
			.notNull()
			.references(() => tags.id), // Skill maps to a tag
		proficiencyLevel: integer('proficiency_level').default(1).notNull(), // 1-10 scale
		endorsedBy: jsonb('endorsed_by'), // Array of user IDs who endorsed this skill
		updatedAt: timestamp('updated_at').defaultNow(),
	},
	(table) => {
		return {
			userSkillUnique: uniqueIndex('user_skill_unique').on(table.userId, table.tagId),
		};
	}
);

// User learning activity tracking for analytics
export const learningActivities = pgTable('learning_activities', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => users.id),
	activityType: varchar('activity_type', { length: 50 }).notNull(), // video_watched, quiz_taken, etc.
	resourceType: varchar('resource_type', { length: 50 }).notNull(), // course, lesson, quiz, etc.
	resourceId: integer('resource_id').notNull(), // ID of the resource
	duration: integer('duration'), // Time spent in seconds
	completionPercentage: integer('completion_percentage'),
	metadata: jsonb('metadata'), // Additional activity data
	createdAt: timestamp('created_at').defaultNow(),
});

// Relations for personalized learning path system
export const learningPathsRelations = relations(learningPaths, ({ many }) => ({
	courses: many(learningPathCourses),
	users: many(userLearningPaths),
}));

export const learningPathCoursesRelations = relations(learningPathCourses, ({ one }) => ({
	path: one(learningPaths, {
		fields: [learningPathCourses.pathId],
		references: [learningPaths.id],
	}),
	course: one(courses, {
		fields: [learningPathCourses.courseId],
		references: [courses.id],
	}),
}));

export const userLearningPathsRelations = relations(userLearningPaths, ({ one }) => ({
	user: one(users, {
		fields: [userLearningPaths.userId],
		references: [users.id],
	}),
	path: one(learningPaths, {
		fields: [userLearningPaths.pathId],
		references: [learningPaths.id],
	}),
}));

export const courseRecommendationsRelations = relations(courseRecommendations, ({ one }) => ({
	user: one(users, {
		fields: [courseRecommendations.userId],
		references: [users.id],
	}),
	course: one(courses, {
		fields: [courseRecommendations.courseId],
		references: [courses.id],
	}),
}));

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
	user: one(users, {
		fields: [userSkills.userId],
		references: [users.id],
	}),
	tag: one(tags, {
		fields: [userSkills.tagId],
		references: [tags.id],
	}),
}));

export const learningActivitiesRelations = relations(learningActivities, ({ one }) => ({
	user: one(users, {
		fields: [learningActivities.userId],
		references: [users.id],
	}),
}));

// Types for personalized learning system
export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

export type CourseTag = typeof courseTags.$inferSelect;
export type InsertCourseTag = typeof courseTags.$inferInsert;

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = typeof learningPaths.$inferInsert;

export type LearningPathCourse = typeof learningPathCourses.$inferSelect;
export type InsertLearningPathCourse = typeof learningPathCourses.$inferInsert;

export type UserLearningPath = typeof userLearningPaths.$inferSelect;
export type InsertUserLearningPath = typeof userLearningPaths.$inferInsert;

export type CourseRecommendation = typeof courseRecommendations.$inferSelect;
export type InsertCourseRecommendation = typeof courseRecommendations.$inferInsert;

export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = typeof userSkills.$inferInsert;

export type LearningActivity = typeof learningActivities.$inferSelect;
export type InsertLearningActivity = typeof learningActivities.$inferInsert;

// Company Onboarding System
export const companyOnboardingApplications = pgTable('company_onboarding_applications', {
	id: serial('id').primaryKey(),
	companyName: varchar('company_name', { length: 200 }).notNull(),
	industry: varchar('industry', { length: 100 }).notNull(),
	companySize: varchar('company_size', { length: 100 }).notNull(),
	website: varchar('website', { length: 255 }),
	description: text('description').notNull(),

	// Contact Information
	contactFirstName: varchar('contact_first_name', { length: 100 }).notNull(),
	contactLastName: varchar('contact_last_name', { length: 100 }).notNull(),
	contactEmail: varchar('contact_email', { length: 255 }).notNull(),
	contactPhone: varchar('contact_phone', { length: 50 }).notNull(),
	contactJobTitle: varchar('contact_job_title', { length: 150 }).notNull(),

	// Address Information
	addressStreet: text('address_street').notNull(),
	addressCity: varchar('address_city', { length: 100 }).notNull(),
	addressState: varchar('address_state', { length: 100 }).notNull(),
	addressZipCode: varchar('address_zip_code', { length: 20 }).notNull(),
	addressCountry: varchar('address_country', { length: 100 }).notNull(),

	// Requirements
	licensesNeeded: integer('licenses_needed').notNull(),
	preferredPlan: varchar('preferred_plan', { length: 100 }).notNull(),
	specialRequirements: text('special_requirements'),

	// Application Status
	status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected, in_review
	reviewedBy: varchar('reviewed_by').references(() => users.id),
	reviewedAt: timestamp('reviewed_at'),
	reviewNotes: text('review_notes'),

	// Terms acceptance
	termsAccepted: boolean('terms_accepted').notNull(),
	termsAcceptedAt: timestamp('terms_accepted_at').defaultNow(),

	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const companyOnboardingApplicationsRelations = relations(
	companyOnboardingApplications,
	({ one }) => ({
		reviewer: one(users, {
			fields: [companyOnboardingApplications.reviewedBy],
			references: [users.id],
		}),
	})
);

export type CompanyOnboardingApplication = typeof companyOnboardingApplications.$inferSelect;
export type InsertCompanyOnboardingApplication = typeof companyOnboardingApplications.$inferInsert;

export const insertCompanyOnboardingApplicationSchema = makeInsertSchema(
	companyOnboardingApplications
).omit({
	id: true,
	status: true,
	reviewedBy: true,
	reviewedAt: true,
	reviewNotes: true,
	termsAcceptedAt: true,
	createdAt: true,
	updatedAt: true,
});
