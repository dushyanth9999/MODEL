import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Check for DATABASE_URL and provide helpful error message
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("📝 To set up Supabase database:");
  console.error("   1. Go to https://supabase.com/dashboard/projects");
  console.error("   2. Create a new project if you haven't already");
  console.error("   3. Click the 'Connect' button on the top toolbar");
  console.error("   4. Copy URI value under 'Connection string' -> 'Transaction pooler'");
  console.error("   5. Replace [YOUR-PASSWORD] with your database password");
  console.error("   6. Add it as DATABASE_URL in Replit Secrets");
  console.error("   7. Restart the server with 'npm run dev'");
  process.exit(1);
}

// Configure connection pool for Supabase
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Add connection event handlers
pool.on('connect', () => {
  console.log('✅ Supabase database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Supabase database connection error:', err);
});

export const db = drizzle({ client: pool, schema });
