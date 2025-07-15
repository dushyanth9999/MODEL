import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import ws from "ws";
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL || process.env.REPLIT_DB_URL;

// Check for DATABASE_URL and provide helpful error message
  console.warn('⚠️  DATABASE_URL not found, using SQLite fallback for development');
  const sqlite = new Database(':memory:');
  export const db = drizzleSqlite(sqlite, { schema });
} else {
  const client = postgres(databaseUrl);
  export const db = drizzle(client, { schema });
}
