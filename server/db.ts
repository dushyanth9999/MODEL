import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Check for DATABASE_URL and provide helpful guidance
if (!process.env.DATABASE_URL) {
  console.log("⚠️  DATABASE_URL environment variable is not set!");
  console.log("📝 Using in-memory storage for development.");
  console.log("   To use a database, add DATABASE_URL in Replit Secrets:");
  console.log("   1. Go to https://supabase.com/dashboard/projects");
  console.log("   2. Create a new project if you haven't already");
  console.log("   3. Click the 'Connect' button on the top toolbar");
  console.log("   4. Copy URI value under 'Connection string' -> 'Transaction pooler'");
  console.log("   5. Replace [YOUR-PASSWORD] with your database password");
  console.log("   6. Add it as DATABASE_URL in Replit Secrets");
  console.log("   7. Restart the server with 'npm run dev'");
}

// Only initialize database if DATABASE_URL is available
export let pool: Pool | null = null;
export let db: any = null;

if (process.env.DATABASE_URL) {
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
  pool = new Pool({
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
    console.log('✅ Database connected successfully');
  });

  pool.on('error', (err) => {
    console.error('❌ Database connection error:', err.message);
  });

  db = drizzle(pool, { schema });
}
