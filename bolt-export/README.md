# NIAT Operations Dashboard - Bolt.new Version

## Overview
Complete operations management dashboard optimized for Bolt.new environment with seamless Supabase integration.

## Features
- 🏢 **Multi-Center Management**: Support for 18 authentic NIAT campuses
- 👥 **Role-Based Access**: Admin, COS, PM, and Head of NIAT roles
- 📊 **Advanced Analytics**: Real-time performance monitoring and insights
- 📝 **Daily Reporting**: Structured operational reporting system
- 📈 **Weekly Reports**: Comprehensive analytics and trend analysis
- ✅ **Action Tracking**: Daily checklists for COS and PM roles
- 🌙 **Dark Mode**: Complete dark/light theme support
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS

## Quick Setup

### 1. Environment Variables
Add these to your Bolt.new environment:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url
```

### 2. Database Setup
```bash
npm run db:push
```

### 3. Start Development
```bash
npm run dev
```

## Supabase Setup Guide

### Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Create new project: `niat-operations-dashboard`
3. Note your Project URL and anon key

### Step 2: Get Connection Details
1. In Supabase dashboard → Settings → Database
2. Copy "Connection string" for DATABASE_URL
3. Copy "Project URL" for VITE_SUPABASE_URL
4. Copy "anon public" key for VITE_SUPABASE_ANON_KEY

### Step 3: Initialize Database
The application will automatically:
- Create required tables
- Set up user roles and permissions
- Initialize default action tracker templates
- Create test users

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@niat.edu | password123 |
| COS | cos@niat.edu | password123 |
| PM | pm@niat.edu | password123 |
| Head of NIAT | head@niat.edu | password123 |

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with custom NIAT branding
- **Wouter** for routing
- **TanStack Query** for state management
- **Chart.js** for data visualization
- **Framer Motion** for animations

### Backend Integration
- **Supabase** for database and authentication
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for data persistence

### Development Tools
- **Vite** for fast development
- **TypeScript** for type safety
- **ESLint** for code quality
- **Drizzle Kit** for database migrations

## Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, Theme)
├── lib/               # Utilities and services
│   ├── supabase.ts    # Supabase client setup
│   ├── database.ts    # Database service functions
│   ├── schema.ts      # Database schema definitions
│   ├── types.ts       # TypeScript type definitions
│   └── data.ts        # Static data (centers, etc.)
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and theme
```

## Key Improvements for Bolt.new

1. **Simplified Architecture**: Removed server-side complexity, pure frontend app
2. **Direct Supabase Integration**: Uses Supabase client directly, no custom backend
3. **Better Environment Handling**: Uses Vite's environment variable system
4. **Optimized Dependencies**: Streamlined package.json for Bolt.new compatibility
5. **Clean Data Environment**: Starts with empty reports for fresh testing

## Database Schema

### Users Table
- User management with role-based permissions
- Support for multiple centers and hierarchical access

### Action Tracker Templates
- Customizable daily checklists for different roles
- Pre-configured templates for COS and PM roles

### Daily Action Trackers
- Progress tracking for daily operational tasks
- Links to users and templates with completion tracking

## NIAT Branding

The application uses authentic NIAT branding:
- **Primary Color**: Maroon (#b91c1c)
- **Secondary Color**: Cream (#f7f3d0)
- **Accent Color**: Gold (#d4af37)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Database operations
npm run db:generate    # Generate migrations
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio
```

## Migration from Replit

This version is specifically optimized for Bolt.new and removes:
- Express server setup
- Replit-specific configurations
- Network compatibility workarounds
- Custom backend API routes

Instead, it uses:
- Direct Supabase client integration
- Frontend-only architecture
- Bolt.new's native environment variable support
- Streamlined deployment process

## Support

For issues or questions:
1. Check Supabase connection setup
2. Verify environment variables
3. Run `npm run db:push` to initialize database
4. Check browser console for detailed error messages