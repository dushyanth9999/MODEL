// Core application types

export interface Center {
  id: string;
  name: string;
  location: string;
  region: string;
  cos: string;
  pm: string;
  contact: string;
  students: number;
  established: string;
  type: 'main' | 'satellite' | 'partner';
}

export interface ReportItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  status: 'OK' | 'ISSUE' | 'HIGH_RISK' | 'NA';
  remarks: string;
  responsiblePerson: string;
  photos: string[];
  timestamp: Date;
}

export interface DailyReport {
  id: string;
  centerId: string;
  date: Date;
  items: ReportItem[];
  summary: {
    goingGood: string[];
    goingWrong: string[];
    highRisk: string[];
    immediateAttention: string[];
    progressFromLastDay: string;
  };
  submittedBy: string;
  submittedAt: Date;
  version: number;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'cos' | 'pm' | 'head_of_niat';
  centerId?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export type Theme = 'light' | 'dark' | 'system';