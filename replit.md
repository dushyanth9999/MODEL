# Operations Dashboard - Replit Configuration

## Overview

This is a full-stack operations management dashboard built with React (TypeScript) frontend and Express backend. The application provides comprehensive operational monitoring, reporting, and analytics capabilities for managing multiple centers/locations.

## User Preferences

Preferred communication style: Simple, everyday language.
NxtWave branding theme: Red primary color (#b91c1c) with cream accents (#f7f3d0) and gold highlights (#d4af37).

## Recent Changes

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

### Data Visualization & AI Enhancement (July 11, 2025)
- Added comprehensive data visualization to Weekly Reports with Chart.js integration
- Implemented AI predictions and insights section with NxtWave branding
- Created interactive charts: Status Distribution (Pie), Weekly Trends (Line), Center Performance (Bar)
- Added AI-powered risk analysis, maintenance recommendations, and trend analysis
- Removed estimated budget references from AI predictions in budget forecast
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