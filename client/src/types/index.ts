export interface Center {
  id: string;
  name: string;
  location: string;
  cos: string; // Chief of Staff
  pm: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timezone?: string;
  capacity?: number;
  establishedDate?: Date;
}

export interface ReportItem {
  id: string;
  category: string;
  subcategory: string;
  item: string;
  status: 'OK' | 'ISSUE' | 'HIGH_RISK' | 'NA';
  remarks: string;
  responsiblePerson: string;
  timestamp: Date;
  centerId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedResolution?: Date;
  actualResolution?: Date;
  cost?: number;
  photos?: string[];
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
  reviewedBy?: string;
  reviewedAt?: Date;
  sharedLinks?: ShareLink[];
}

export interface WeeklyReport {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  centers: string[];
  aggregatedData: {
    totalItems: number;
    okItems: number;
    issueItems: number;
    highRiskItems: number;
    naItems: number;
  };
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
  predictions?: {
    nextWeekRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendedActions: string[];
  };
  sharedLinks?: ShareLink[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cos' | 'pm' | 'head_of_niat';
  centerId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  preferences?: UserPreferences;
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    defaultView: 'overview' | 'detailed';
    autoRefresh: boolean;
    refreshInterval: number;
  };
  language: string;
  timezone: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ShareLink {
  id: string;
  url: string;
  qrCode: string;
  expiresAt?: Date;
  accessCount: number;
  maxAccess?: number;
  password?: string;
  createdBy: string;
  createdAt: Date;
  type: 'report' | 'dashboard' | 'analysis';
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  centerId?: string;
  userId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  centerId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  category: string;
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  centerId: string;
  qrCode: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'RETIRED';
  purchaseDate: Date;
  warrantyExpiry?: Date;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  cost: number;
  vendor: string;
  location: string;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface Analytics {
  centerPerformance: {
    centerId: string;
    healthScore: number;
    trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    efficiency: number;
    compliance: number;
  }[];
  predictions: {
    nextWeekIssues: number;
    maintenanceNeeded: string[];
    riskAreas: string[];
  };
  benchmarks: {
    industryAverage: number;
    topPerformer: number;
    improvement: number;
  };
}

export type ViewMode = 'dashboard' | 'daily-form' | 'weekly-report' | 'center-detail' | 'admin' | 'file-upload' | 'analytics' | 'tasks' | 'assets' | 'notifications' | 'action-tracker';

export type Theme = 'light' | 'dark' | 'auto';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  search?: string;
  status?: string[];
  priority?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  centerId?: string;
  category?: string;
  assignedTo?: string;
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv' | 'json';
  includeCharts: boolean;
  includePhotos: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  centers?: string[];
  categories?: string[];
}

export interface IntegrationConfig {
  type: 'webhook' | 'api' | 'email' | 'sms';
  endpoint: string;
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key';
    credentials: string;
  };
  events: string[];
  active: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SystemHealth {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  systemLoad: number;
  memoryUsage: number;
  diskUsage: number;
  lastCheck: Date;
}