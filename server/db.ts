import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Check for DATABASE_URL and provide helpful error message
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("📝 To fix this:");
  console.error("   1. In Replit, click on the 'Secrets' tab (lock icon) in the sidebar");
  console.error("   2. Add a new secret with key: DATABASE_URL");
  console.error("   3. Set the value to your PostgreSQL connection string");
  console.error("   4. If using Replit's built-in PostgreSQL, the connection string should be auto-provided");
  console.error("   5. Restart the server with 'npm run dev'");
  process.exit(1);
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
