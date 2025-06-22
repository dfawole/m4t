// server/userProfile.ts
import { Router } from 'express';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/api/users/:id', async (req, res) => {
	const { id } = req.params;
	console.log('🔍 Looking for user with ID:', id);

	try {
		const result = await db
			.select({
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				profileImageUrl: users.profileImageUrl,
				role: users.role,
			})
			.from(users)
			.where(eq(users.id, id));
		console.log('📦 DB result:', result);

		if (result.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.json(result[0]);
	} catch (error) {
		console.error('Error fetching user:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

export default router;
