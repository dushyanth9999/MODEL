// Core Types for NIAT Operations Dashboard
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'cos' | 'pm' | 'head_of_niat';
  centerId?: string;
  lastLoginAt?: Date;
}

export interface Center {
  id: string;
  name: string;
  location: string;
  region: string;
  cos: string;
  pm?: string;
  contact: string;
  established: string;
  capacity: number;
  currentStrength: number;
}

export interface ReportItem {
  id: string;
  category: string;
  item: string;
  status: 'OK' | 'ISSUE' | 'HIGH_RISK' | 'NA';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
  actionRequired?: string;
  responsible?: string;
  dueDate?: string;
  notes?: string;
}

export interface DailyReport {
  id: string;
  centerId: string;
  centerName: string;
  date: string;
  submittedBy: string;
  items: ReportItem[];
  summary: {
    goingGood: string;
    goingWrong: string;
    highRisk: string;
    immediateAttention: string;
    progressFromLastDay: string;
  };
  photos?: Array<{ location: string; description: string; }>;
  status: 'draft' | 'submitted' | 'reviewed';
  submittedAt?: Date;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}

export interface WeeklyAnalytics {
  period: string;
  totalReports: number;
  centersReporting: number;
  totalCenters: number;
  averageHealthScore: number;
  statusDistribution: {
    OK: number;
    ISSUE: number;
    HIGH_RISK: number;
    NA: number;
  };
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
  criticalIssues: string[];
  achievements: string[];
}