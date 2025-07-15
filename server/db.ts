import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
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

// Use HTTP connection instead of WebSocket for better Replit compatibility
const sql = neon(process.env.DATABASE_URL);

console.log('✅ Supabase database connection configured');

export const db = drizzle(sql, { schema });
