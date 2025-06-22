// import { config } from 'dotenv';
// import { Pool } from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import * as schema from '@shared/schema';

// // // Load environment variables from .env file
// config();

// console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
// console.log('DATABASE_URL loaded: ==>', process.env.DATABASE_URL);

// if (!process.env.DATABASE_URL) {
// 	throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
// }

// export const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// export const db = drizzle(pool, { schema });

// server/db.ts
// server/db.ts
import { config } from 'dotenv';
import { Pool } from 'pg';

// Drizzle adapters
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';

// Your shared schema
import * as schema from '@shared/schema';

config(); // load .env

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL must be set (e.g. in .env or Vercel env vars)');
}

const DATABASE_URL = process.env.DATABASE_URL!;

// Determine if we're running serverless (Vercel) vs. local
const isServerless = !!process.env.VERCEL_ENV;

// Create the appropriate client
let db;
if (isServerless) {
	// ─── Serverless Neon HTTP client ──────────────────────────────
	const client = neon(DATABASE_URL);
	db = drizzleHttp(client, { schema });
} else {
	// ─── Local Postgres pool via node-postgres ────────────────────
	const pool = new Pool({
		connectionString: DATABASE_URL,
		ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
	});
	db = drizzlePg(pool, { schema });
}

export { db };
