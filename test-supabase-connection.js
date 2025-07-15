// Test Supabase connection with different approaches
import { Pool } from 'pg';

const originalUrl = process.env.DATABASE_URL;
console.log('Original URL format:', originalUrl ? 'Set' : 'Missing');

// Try different URL parsing approaches
function fixDatabaseUrl(url) {
  if (!url) return null;
  
  // Method 1: Fix double @ issue
  if (url.includes('@') && url.match(/@.*@/)) {
    const parts = url.split('@');
    if (parts.length === 3) {
      return `${parts[0]}@${parts[2]}`;
    }
  }
  
  return url;
}

async function testConnection() {
  const cleanUrl = fixDatabaseUrl(originalUrl);
  console.log('Testing connection with cleaned URL...');
  
  const pool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 10000,
  });
  
  try {
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log('✅ Query successful:', result.rows[0]);
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    await pool.end();
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});