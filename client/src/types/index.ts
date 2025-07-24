export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cos' | 'pm' | 'head_of_niat';
  centerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Center {
  id: string;
  name: string;
  location: string;
  cos: string;
  pm: string;
  isActive: boolean;
}

export interface ReportItem {
  id: string;
  category: string;
  item: string;
  status: 'OK' | 'ISSUE' | 'HIGH_RISK' | 'NA';
  remarks: string;
  timestamp: Date;
  photos?: string[];
}

export interface DailyReport {
  id: string;
  centerId: string;
  submittedBy: string;
  submittedAt: Date;
  items: ReportItem[];
  summary: {
    goingGood: string[];
    highRisk: string[];
    immediateAttention: string[];
  };
  remarks?: string;
}

export interface ActionTrackerTemplate {
  id: string;
  category: string;
  item: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface DailyActionTracker {
  id: string;
  centerId: string;
  templateId: string;
  date: Date;
  status: 'OK' | 'ISSUE' | 'HIGH_RISK' | 'NA';
  remarks: string;
  photos?: string[];
  submittedBy: string;
  submittedAt: Date;
}