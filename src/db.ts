// In: src/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './db/schema';

// Load environment variables
config({ path: '.env.local' });

function createDb() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('Database URL is not set in the environment variables');
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

type Database = ReturnType<typeof createDb>;

let _db: Database | null = null;

function getDb(): Database {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// Lazy-initialized database instance to avoid build-time errors
// when POSTGRES_URL is not available during static page generation
export const db = new Proxy({} as Database, {
  get(_, prop: string | symbol) {
    return Reflect.get(getDb(), prop);
  },
});
