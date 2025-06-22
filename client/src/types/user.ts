export interface User {
	id: string;
	username: string | null;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	profileImageUrl: string | null;
	authProvider: string | null;
}

export interface Instructor {
	id: number;
	firstName: string;
	lastName: string;
	profileImageUrl?: string;
}
