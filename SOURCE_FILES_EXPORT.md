# NIAT Operations Dashboard - Source Files Export

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── AdvancedAnalytics.tsx
│   │   │   ├── CenterDetail.tsx
│   │   │   ├── DailyReportForm.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── ShareModal.tsx
│   │   │   └── WeeklyReport.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── data/
│   │   │   └── mockData.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── analytics.ts
│   │   │   ├── export.ts
│   │   │   └── notifications.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── attached_assets/
│   └── LOGIO_1752487117783.jpg (NIAT Logo)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── replit.md
```

## Key Features Implemented

### 1. NIAT Branding
- New NIAT logo (LOGIO_1752487117783.jpg) across all pages
- Consistent red (#b91c1c) and cream (#f7f3d0) color scheme
- Updated title to "Ops Dashboard"

### 2. Daily Report Form with Photo Upload
- Location-based photo uploads with descriptions
- Photo management (preview, edit, remove)
- Integration with existing report submission system

### 3. Analytics & Reporting
- Real-time dashboard with center performance metrics
- Weekly report generation with data visualization
- Advanced analytics with AI predictions (budget forecast removed)

### 4. User Management
- Role-based access control (admin, cso, pm, viewer)
- Authentication system with protected routes
- User preferences and settings

### 5. Data Management
- Mock data structure for development
- Export functionality for reports
- Notification system for alerts

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Chart.js + React Chart.js 2
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Context API

## Installation & Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access at: http://localhost:5000

## Login Credentials
- **Admin**: admin@company.com / password
- **CSO**: shivika@company.com / password
- **PM**: anurag@company.com / password
- **Viewer**: viewer@company.com / password

## Recent Updates (July 14, 2025)
- Updated to new NIAT logo across all pages
- Added photo upload functionality to daily reports
- Removed budget forecast from analytics
- Removed upload reports functionality
- Cleaned up redundant information
- Enhanced dashboard with logo in header

## File Locations
All source files are available in the current directory structure. The main entry point is `client/src/App.tsx` and the server entry point is `server/index.ts`.