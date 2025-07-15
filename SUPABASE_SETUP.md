# Supabase Setup Guide

## Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard/projects
2. Click "Create a new project"
3. Fill in project details:
   - Project name: `niat-ops-dashboard`
   - Database password: Create a secure password (save it!)
   - Region: Choose closest to your location
4. Click "Create new project"

## Step 2: Find or Reset Database Password
1. In your Supabase project dashboard, go to **Settings** (gear icon in left sidebar)
2. Click on **Database** in the settings menu
3. Scroll down to find the **Database password** section
4. If you don't remember the password, click **"Reset database password"**
5. Set a new password (save it somewhere safe!)

## Step 3: Get Database Connection String
1. Go back to your project dashboard
2. Click the "Connect" button in the top toolbar
3. Select "Connection string" → "Transaction pooler"
4. Copy the URI that looks like:
   ```
   postgresql://postgres.[REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

## Step 4: Add to Replit Secrets
1. In your Replit project, look for the left sidebar
2. Click on the **lock icon** (🔒) labeled "Secrets"
3. Click "Add new secret"
4. Enter:
   - **Key**: `DATABASE_URL`
   - **Value**: Your complete Supabase connection string
5. Click "Add secret"

## Step 5: Switch to Database Storage
Once you've added the DATABASE_URL secret:
1. The system will automatically detect it
2. Update `server/storage.ts` to use `DatabaseStorage` instead of `MemStorage`
3. Run `npm run db:push` to create tables in Supabase
4. Restart the application

## Step 6: Verify Connection
The application will show:
- ✅ Supabase database connected successfully
- ✅ Database initialized with default data

## Test Users
Once connected, you can login with:
- **Admin**: admin@niat.edu / password123
- **COS**: cos@niat.edu / password123  
- **PM**: pm@niat.edu / password123

## Previous Reports Cleared
All previous mock reports have been cleared for a fresh start. The system will now use your Supabase database for all data storage.