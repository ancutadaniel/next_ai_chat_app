// In: scripts/db-test.mjs
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

async function testConnection() {
  console.log('Attempting to connect to the database...');
  const dbUrl = process.env.POSTGRES_URL;

  if (!dbUrl) {
    console.error('❌ POSTGRES_URL is not defined in your .env.local file.');
    process.exit(1);
  }

  try {
    const sql = neon(dbUrl);
    console.log('Neon instance created. Pinging database...');
    
    // This is the most basic query to confirm a connection.
    const result = await sql`SELECT 1`;

    console.log('✅ Database connection successful! Response from DB:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();