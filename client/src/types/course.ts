// types/course.ts

export interface Module {
	id: number;
	title: string;
	duration?: number;
	lessons?: Lesson[];
}

export interface Progress {
	completedLessons: number[];
	currentLessonId?: number;
}

interface Lesson {
	id: number;
	title: string;
	videoUrl: string;
	thumbnailUrl?: string;
	preview?: boolean;
	duration?: number;
	isPreview?: boolean;
	isFree?: boolean;
	content?: string;
}

export interface Course {
	id: number;
	title: string;
	description: string;
	instructorId: number;
	level: string;
	duration: number;
	rating?: number;
	categoryId: number;
	coverImage?: string;
	modules: Module[];
	learningOutcomes?: string[];
	prerequisites?: string[];
}
