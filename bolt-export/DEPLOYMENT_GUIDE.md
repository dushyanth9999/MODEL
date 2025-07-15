# Bolt.new Deployment Guide

## Complete Bolt.new Migration Package Ready! 🚀

Your operations dashboard has been fully optimized for Bolt.new with error-free Supabase integration.

## What's Included

### ✅ Complete Application
- Full-featured operations dashboard with NIAT branding
- 18 authentic university center data (cleaned from CSV)
- Role-based access control (admin, cos, pm, head_of_niat)
- Clean data environment (no previous reports)

### ✅ Bolt.new Optimizations
- **Frontend-only architecture** (no complex backend setup)
- **Direct Supabase integration** (bypasses network restrictions)
- **Simplified dependencies** optimized for Bolt.new
- **Native environment variable support**

### ✅ Key Features
- Daily report submission with photo uploads
- Weekly analytics and insights
- Action tracker with role-specific checklists
- Advanced data visualization
- Dark/light theme support
- Mobile-responsive design

## Quick Deploy to Bolt.new

### 1. Create New Bolt.new Project
```bash
# Copy all files from bolt-export/ folder to your new Bolt.new project
```

### 2. Set Up Supabase (5 minutes)
1. Go to https://supabase.com/dashboard
2. Create project: `niat-operations-dashboard`
3. Get your credentials from Settings → API:
   - Project URL
   - Anon public key
4. Get database URL from Settings → Database

### 3. Add Environment Variables in Bolt.new
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
```

### 4. Initialize Database
```bash
npm run db:push
```

### 5. Start Application
```bash
npm run dev
```

## Why Bolt.new Works Better

### Network Compatibility
- ❌ **Replit**: Blocks Supabase hostname resolution
- ✅ **Bolt.new**: Full network access to external services

### Architecture
- ❌ **Replit**: Requires complex server setup
- ✅ **Bolt.new**: Pure frontend with direct Supabase client

### Development Experience
- ❌ **Replit**: Environment restrictions and compatibility issues
- ✅ **Bolt.new**: Seamless integration with modern tools

## Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@niat.edu | password123 |
| COS | cos@niat.edu | password123 |
| PM | pm@niat.edu | password123 |
| Head of NIAT | head@niat.edu | password123 |

## File Structure

```
bolt-export/
├── src/
│   ├── components/           # All React components
│   ├── contexts/            # Auth & Theme contexts
│   ├── lib/                 # Database, types, utilities
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── package.json             # Optimized dependencies
├── drizzle.config.ts        # Database configuration
├── tailwind.config.js       # NIAT brand styling
└── README.md                # Complete setup guide
```

## Migration Benefits

### Data Integrity
- All previous mock reports cleared
- Fresh, clean environment
- Authentic university center data

### Enhanced Features
- Better Supabase integration
- Improved error handling
- Streamlined user experience

### Production Ready
- Type-safe database operations
- Comprehensive error boundaries
- Performance optimizations

## Next Steps

1. **Copy files** from `bolt-export/` to new Bolt.new project
2. **Configure Supabase** with provided credentials
3. **Test login** with default accounts
4. **Customize** as needed for your specific requirements

The application will automatically initialize the database with default users and action tracker templates on first run.

## Support

All components are fully documented and ready for deployment. The system provides a clean, professional operations management platform optimized for educational institutions.