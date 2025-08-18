// In: src/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './db/schema'; // 1. Import your entire schema

// Load environment variables
config({ path: '.env.local' });

if (!process.env.POSTGRES_URL) {
  throw new Error('Database URL is not set in the environment variables');
}

const sql = neon(process.env.POSTGRES_URL);

// 2. Pass the imported schema to the drizzle instance
// This enables the fully-typed relational query API (db.query)
export const db = drizzle(sql, { schema });