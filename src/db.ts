// In: src/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './db/schema'; // 1. Import your entire schema

// Load environment variables
config({ path: '.env.local' });

let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    const url = process.env.POSTGRES_URL;
    if (!url) {
      throw new Error('Database URL is not set in the environment variables');
    }
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Lazy-initialized database instance to avoid build-time errors
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as Record<string | symbol, unknown>)[prop];
  },
});