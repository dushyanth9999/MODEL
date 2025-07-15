import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
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

// Clean up malformed DATABASE_URL format
let cleanDatabaseUrl = process.env.DATABASE_URL;
// Fix double @ symbol issue in Supabase connection strings
if (cleanDatabaseUrl.includes('@') && cleanDatabaseUrl.match(/@.*@/)) {
  const parts = cleanDatabaseUrl.split('@');
  if (parts.length === 3) {
    // Format: postgresql://user:pass@extra@host:port/db
    cleanDatabaseUrl = `${parts[0]}@${parts[2]}`;
    console.log('🔧 Fixed malformed DATABASE_URL format');
  }
}

// Use standard PostgreSQL driver for better compatibility
export const pool = new Pool({
  connectionString: cleanDatabaseUrl,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Supabase database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Supabase database connection error:', err.message);
});

export const db = drizzle(pool, { schema });
