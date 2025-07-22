// Enhanced types for NIAT Operations Dashboard v2.0
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
  region?: string;
  timezone?: string;
  capacity?: number;
  currentStrength?: number;
  establishedDate?: Date;
  contactInfo?: {
    phone: string;
    email: string;
    address: string;
  };
}

// Enhanced ReportItem with voice and geolocation support
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
  photos?: PhotoAttachment[];
  voiceNotes?: VoiceNote[];
  geoLocation?: GeoLocation;
}

// New interfaces for enhanced features
export interface PhotoAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
  description?: string;
  geoLocation?: GeoLocation;
  metadata?: {
    width: number;
    height: number;
    format: string;
    exifData?: any;
  };
}

export interface VoiceNote {
  id: string;
  audioUrl: string;
  duration: number; // in seconds
  transcription?: string;
  recordedAt: Date;
  fieldName: string;
  confidence?: number; // transcription confidence score
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

// Enhanced DailyReport with multimedia support
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
  attachments?: PhotoAttachment[];
  voiceNotes?: VoiceNote[];
  collaborators?: string[];
  aiInsights?: AIInsight[];
}

// AI and Analytics interfaces
export interface AIInsight {
  id: string;
  type: 'PREDICTION' | 'RECOMMENDATION' | 'ALERT' | 'TREND';
  title: string;
  description: string;
  confidence: number; // 0-100
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  generatedAt: Date;
  validUntil?: Date;
  actionable: boolean;
  metadata?: any;
}

export interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    temperature?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    latency: number;
    bandwidth: number;
    packetsLost: number;
  };
  database: {
    connections: number;
    queryTime: number;
    size: number;
  };
  application: {
    activeUsers: number;
    requestsPerMinute: number;
    errorRate: number;
    responseTime: number;
  };
}

// Enhanced User interface with preferences
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
  permissions?: Permission[];
  twoFactorEnabled?: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    sound: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    defaultView: 'overview' | 'detailed';
    autoRefresh: boolean;
    refreshInterval: number;
    showAIInsights: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareUsageData: boolean;
    allowVoiceRecording: boolean;
  };
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  conditions?: any;
}

// Enhanced Notification system
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
  category?: string;
  expiresAt?: Date;
  metadata?: any;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

// Collaboration and sharing
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
  permissions: ('view' | 'comment' | 'edit')[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string; // for threaded comments
  attachments?: string[];
  mentions?: string[];
}

// Enhanced Analytics
export interface Analytics {
  centerPerformance: {
    centerId: string;
    healthScore: number;
    trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    efficiency: number;
    compliance: number;
    predictedScore?: number;
    recommendations?: string[];
  }[];
  predictions: {
    nextWeekIssues: number;
    maintenanceNeeded: string[];
    riskAreas: string[];
    budgetForecast?: number;
    staffingNeeds?: number;
  };
  benchmarks: {
    industryAverage: number;
    topPerformer: number;
    improvement: number;
    ranking?: number;
  };
  realTimeMetrics?: SystemMetrics;
}

// Export and integration types
export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv' | 'json';
  includeCharts: boolean;
  includePhotos: boolean;
  includeVoiceNotes?: boolean;
  includeGeolocation?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  centers?: string[];
  categories?: string[];
  compression?: 'none' | 'low' | 'medium' | 'high';
  watermark?: boolean;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'email' | 'sms' | 'slack' | 'teams';
  endpoint: string;
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key' | 'oauth2';
    credentials: string;
  };
  events: string[];
  active: boolean;
  retryPolicy?: {
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
  };
  rateLimit?: {
    requests: number;
    window: number; // in seconds
  };
}

// Audit and compliance
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
}

export interface ComplianceReport {
  id: string;
  type: 'GDPR' | 'SOX' | 'HIPAA' | 'ISO27001' | 'CUSTOM';
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  findings: ComplianceFinding[];
  overallScore: number;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
}

export interface ComplianceFinding {
  id: string;
  rule: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PASS' | 'FAIL' | 'WARNING';
  evidence?: string[];
  remediation?: string;
}

// System health and monitoring
export interface SystemHealth {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  systemLoad: number;
  memoryUsage: number;
  diskUsage: number;
  lastCheck: Date;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime: number;
  lastCheck: Date;
  dependencies?: string[];
}

// API and response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  requestId: string;
  version: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Enhanced filter and search
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
  tags?: string[];
  hasVoiceNotes?: boolean;
  hasPhotos?: boolean;
  hasGeolocation?: boolean;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  facets: {
    [key: string]: {
      value: string;
      count: number;
    }[];
  };
  suggestions?: string[];
  searchTime: number;
}

// Application state and context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
  sessionExpiry?: Date;
}

export interface AppState {
  theme: Theme;
  notifications: Notification[];
  systemHealth: SystemHealth;
  realTimeData: SystemMetrics;
  activeUsers: number;
  lastSync: Date;
}

// Utility types
export type Theme = 'light' | 'dark' | 'auto';
export type ViewMode = 'dashboard' | 'daily-form' | 'weekly-report' | 'center-detail' | 'admin' | 'file-upload' | 'analytics' | 'tasks' | 'assets' | 'notifications' | 'action-tracker';
export type SortDirection = 'asc' | 'desc';
export type DataFormat = 'json' | 'csv' | 'excel' | 'pdf';

// Event types for real-time updates
export interface RealtimeEvent {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
  centerId?: string;
}

// Configuration types
export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    voiceRecording: boolean;
    geolocation: boolean;
    aiInsights: boolean;
    realTimeUpdates: boolean;
    collaboration: boolean;
    mobileApp: boolean;
  };
  limits: {
    maxFileSize: number;
    maxVoiceNoteLength: number;
    maxPhotosPerReport: number;
    sessionTimeout: number;
  };
  integrations: IntegrationConfig[];
}
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