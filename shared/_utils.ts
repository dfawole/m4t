// server/schema/_utils.ts
import { AnyPgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

/**
 * Build a Zod insert‐schema for `table`, automatically
 * omitting ['id','createdAt','updatedAt'] plus any `extra` keys.
 * This uses a local `as any` to avoid the current overload
 * mismatch — we’ll tighten it up later.
 */
export function makeInsertSchema(table: AnyPgTable, extraOmitKeys: readonly string[] = []) {
	// default keys to drop on every insert
	const defaults = ['id', 'createdAt', 'updatedAt'];

	// final list of keys to omit
	const keysToOmit = [...defaults, ...extraOmitKeys];

	// coerce to any just for this call
	return (createInsertSchema(table) as any).omit(keysToOmit);
}
