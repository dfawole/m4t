// src/types/express/index.d.ts
import type { JwtPayload } from 'jsonwebtoken';

// domain User type:
import type { User as DbUser } from '@shared/schema';

declare global {
	namespace Express {
		// Define exactly what you put on `req.user`
		interface User extends JwtPayload {
			id?: string;
			// any other custom fields you can be added here:
			// email?: string;
			// role?: string;
		}

		// Extend the Request interface
		interface Request {
			user?: User;
		}
	}
}
