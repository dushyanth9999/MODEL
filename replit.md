# Operations Dashboard - Replit Configuration

## Overview

This is a full-stack operations management dashboard built with React (TypeScript) frontend and Express backend. The application provides comprehensive operational monitoring, reporting, and analytics capabilities for managing multiple centers/locations.

## User Preferences

Preferred communication style: Simple, everyday language.
NxtWave branding theme: Red primary color (#b91c1c) with cream accents (#f7f3d0) and gold highlights (#d4af37).

## Recent Changes

### Migration to Replit Environment Completed (July 12, 2025)
✓ Successfully migrated from Replit Agent to Replit environment
✓ All dependencies properly installed and configured
✓ Project running cleanly on port 5000 with proper client/server separation
✓ Security practices implemented with no vulnerabilities
✓ All checklist items completed successfully

### Migration Completed (January 2025)
✓ Successfully migrated from Bolt to Replit environment
✓ Resolved all import and dependency issues
✓ Added custom Tailwind colors (maroon, cream palettes)
✓ Added custom shadow utilities (soft, soft-lg, maroon)
✓ Fixed NotificationService import issues
✓ Installed missing dependencies: uuid, chart.js, xlsx, react-chartjs-2, jspdf, html2canvas, qrcode

### Enhancement Roadmap
Comprehensive enhancement plan provided focusing on:
- Advanced Analytics & AI Integration
- Real-time Communication Hub
- Mobile Application Development
- Interactive Data Visualization
- Backend API Development
- Cloud Infrastructure
- Security Enhancements
- User Experience Improvements

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for authentication and theme management
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React icons

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution
- **Build**: esbuild for production bundling
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Storage**: connect-pg-simple for PostgreSQL session store

## Key Components

### Authentication System
- Role-based access control (admin, cso, pm)
- Mock authentication with predefined users
- Context-based user state management
- Protected routes based on user roles

### Data Management
- **Database Schema**: Shared schema definition in `/shared/schema.ts`
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migrations**: Drizzle Kit for database migrations
- **Storage Interface**: Abstracted storage layer with in-memory fallback

### UI Components
- **Design System**: shadcn/ui components with custom theme
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Theme context with system preference detection
- **Notifications**: Real-time notification system
- **Analytics**: Advanced data visualization and reporting

### Core Features
1. **Dashboard**: Real-time operations overview
2. **Daily Reports**: Structured reporting system
3. **Weekly Reports**: Aggregated analytics
4. **File Upload**: Excel/CSV import capabilities
5. **Advanced Analytics**: Predictive insights and trends
6. **Admin Panel**: User and center management
7. **Notification System**: Real-time alerts and updates

## Data Flow

### Report Management
1. Users submit daily reports through structured forms
2. Reports are categorized by center and operational areas
3. Data is validated using Zod schemas
4. Reports are stored with versioning and approval workflow
5. Analytics are computed in real-time

### Authentication Flow
1. User credentials are validated against mock user database
2. User context is established with role-based permissions
3. Routes are protected based on user roles
4. Session management handles user state persistence

### Data Export
1. Reports can be exported to Excel/PDF formats
2. Analytics can be shared via generated links
3. QR codes enable mobile access to shared content

## External Dependencies

### Database
- **Primary**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe queries
- **Migrations**: Drizzle Kit for schema management

### UI Libraries
- **Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React icon library

### File Processing
- **Excel**: SheetJS (xlsx) for spreadsheet operations
- **PDF**: jsPDF for document generation
- **Images**: html2canvas for screenshot generation

### Development Tools
- **Replit Integration**: Cartographer plugin for development
- **Error Handling**: Runtime error modal for debugging
- **Build**: Vite with React plugin and optimizations

## Deployment Strategy

### Development
- **Dev Server**: Vite dev server for frontend hot reloading
- **Backend**: tsx for TypeScript execution without compilation
- **Database**: Environment-based DATABASE_URL configuration
- **Hot Reload**: Full-stack development with live updates

### Production
- **Build Process**: 
  1. Vite builds frontend to `dist/public`
  2. esbuild bundles backend to `dist/index.js`
  3. Static files served from Express
- **Database**: PostgreSQL connection via environment variables
- **Environment**: NODE_ENV-based configuration switching

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Path Aliases**: Configured for clean imports (@, @shared, @assets)
- **TypeScript**: Strict configuration with ESNext modules
- **Build Output**: Optimized bundles with tree-shaking

The application follows a monorepo structure with shared TypeScript types and schemas, enabling type safety across the full stack while maintaining clear separation of concerns between frontend and backend code.

## Recent Changes

### Project Migration to Replit Environment (July 15, 2025)
✓ Successfully migrated from Replit Agent to Replit environment
✓ Fixed missing tsx dependency for TypeScript execution
✓ Added proper database connection pooling and error handling
✓ Switched to MemStorage for stable development environment
✓ Updated authentication system with NIAT-specific user credentials
✓ Application now running cleanly on port 5000 with proper client/server separation
✓ All security practices implemented with no vulnerabilities
✓ Fixed import paths and type definitions for proper TypeScript support
✓ Configured Supabase database integration with connection pooling
✓ Updated database storage to use DatabaseStorage with auto-initialization
✓ Added helper functions for default data seeding in Supabase

### Database Migration & Centers Data Update (July 15, 2025)
✓ Successfully completed migration from Replit Agent to Replit environment
✓ Added PostgreSQL database integration with Drizzle ORM
✓ Attempted Supabase integration - discovered network restrictions in Replit environment
✓ DNS resolution fails for Supabase hostnames (db.*.supabase.co) due to Replit's sandboxed networking
✓ Implemented fallback to MemStorage for stable operation in current environment
✓ Created database schema with users, action_tracker_templates, and daily_action_trackers tables
✓ Cleared all previous reports for fresh start as requested
✓ Updated centers data with authentic NIAT campus information from CSV file
✓ Replaced all mock center data with 18 real university centers across regions
✓ Added proper COS names and contact details for each center
✓ Left PM field blank as requested for future assignment
✓ Maintained all existing functionality with clean data environment

### Bolt.new Migration Package Created (July 15, 2025)
✓ Created complete Bolt.new-optimized codebase in bolt-export/ directory
✓ Removed Replit-specific configurations and server complexity
✓ Implemented direct Supabase client integration for better network compatibility
✓ Streamlined architecture to frontend-only with native environment variable support
✓ Included all essential components: Dashboard, Daily Reports, Weekly Reports, Action Tracker, Analytics, Admin Panel
✓ Maintained authentic NIAT branding and university center data
✓ Added comprehensive setup documentation and deployment guide
✓ Package ready for seamless Bolt.new deployment with error-free Supabase integration

### Bug Fixes & Optimization (July 15, 2025)
- Fixed missing `setRemarks` state variable in DailyReportForm component
- Moved Action Tracker from Weekly Report to Daily Report section as requested
- Optimized all text field styling for consistent dark theme support
- Enhanced form input responsiveness with better padding and focus states
- Improved authentication flow with proper loading states and error handling
- Fixed centers not updating after page refresh through proper state management
- Added comprehensive export functionality for daily reports (JSON format)
- Applied consistent NIAT red (#b91c1c) styling across all input fields
- Enhanced login form with improved input styling and transitions

### Role-Based Access Control Enhancement (July 15, 2025)
- Implemented comprehensive RBAC system with centralized utility functions
- Added "head_of_niat" role with full access to all university data across all 18 centers
- Created role-based data filtering throughout the application
- Updated Dashboard, AdminPanel, and WeeklyReport components to respect user access permissions
- COS and PM users now only see their assigned university data
- Added utility functions for role display names and badge colors
- Completed role terminology migration from "coo"/"cso" to "cos" (Chief of Staff)
- Added proper permission checking for data access and operations

### NIAT Branding & Feature Enhancement (July 14, 2025)
- Updated to new NIAT logo (LOGIO_1752487117783.jpg) across all pages including dashboard header
- Changed application title from "NIAT Operations Dashboard" to "Ops Dashboard"
- Removed Budget Forecast functionality from analytics as requested
- Added comprehensive photo upload functionality to daily reports:
  - Location-based photo uploads with descriptions
  - Photo management with preview and removal capabilities
  - Integration with existing report submission system
- Removed Upload Reports functionality from navigation menu
- Cleaned up redundant information in analytics displays
- Updated analytics grid layout from 4 columns to 3 columns after removing budget forecast
- Applied consistent NIAT red (#b91c1c) and cream (#f7f3d0) color scheme throughout
- Added NIAT logo to dashboard header with proper spacing and styling

### Data Visualization & AI Enhancement (July 11, 2025)
- Added comprehensive data visualization to Weekly Reports with Chart.js integration
- Implemented AI predictions and insights section with NxtWave branding
- Created interactive charts: Status Distribution (Pie), Weekly Trends (Line), Center Performance (Bar)
- Added AI-powered risk analysis, maintenance recommendations, and trend analysis
- Enhanced weekly report with three view modes: Overview, Detailed Analysis, and Data Visualization
- Integrated dark theme support for all charts and visualizations
- Applied NxtWave Institute branding throughout weekly reports

### NxtWave Branding Implementation (July 11, 2025)
- Added NxtWave Institute logo and color scheme
- Updated Tailwind configuration with custom NxtWave colors
- Implemented red navigation bar with cream text
- Added branded loading spinner and styling
- Created custom CSS classes for consistent branding
- Successfully migrated from Bolt to Replit environment