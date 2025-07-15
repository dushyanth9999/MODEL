# Operations Dashboard - Bolt.new Migration Package

## Migration Overview
Complete codebase optimized for Bolt.new environment with seamless Supabase integration.

## Key Improvements for Bolt.new
1. **Simplified Database Integration**: Direct Supabase client setup without network compatibility issues
2. **Environment Variable Management**: Bolt.new's native support for environment variables
3. **Package Dependencies**: Optimized package.json for Bolt.new's build system
4. **Streamlined Architecture**: Removed Replit-specific configurations

## Supabase Setup for Bolt.new
1. Create Supabase project at https://supabase.com
2. Go to Settings → API → Copy Project URL and anon key
3. In Bolt.new, add environment variables:
   - `VITE_SUPABASE_URL`: Your project URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon key
   - `DATABASE_URL`: Direct connection string from Supabase

## File Structure Changes
- Simplified database configuration for Bolt.new compatibility
- Updated environment variable usage patterns
- Optimized build configuration for Bolt.new
- Enhanced error handling for smoother deployment

## Migration Steps
1. Create new Bolt.new project
2. Copy all files from this export
3. Set up Supabase environment variables
4. Run the application - database will auto-initialize

## Features Included
- Complete operations dashboard with NIAT branding
- Role-based access control (admin, cos, pm)
- Daily and weekly reporting systems
- Action tracker functionality
- Advanced analytics and data visualization
- File upload and export capabilities
- Authentic university center data (18 campuses)
- Clean data environment (no mock reports)

## Database Schema
All tables and relationships ready for Supabase:
- Users with role-based permissions
- Action tracker templates
- Daily action trackers
- Automatic data seeding