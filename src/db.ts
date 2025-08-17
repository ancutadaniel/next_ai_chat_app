// In: src/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './db/schema'; // Import the schema

// This ensures that environment variables are loaded, especially for scripts
config({ path: '.env.local' });

if (!process.env.POSTGRES_URL) {
  throw new Error('Database URL is not set in the environment variables');
}

const sql = neon(process.env.POSTGRES_URL);

// Pass the schema to the drizzle instance to enable the relational query API
export const db = drizzle(sql, { schema });