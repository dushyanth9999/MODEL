import { User } from '@/types';

export function getUserAccessibleCenters(user: User | null, allCenters: any[]): any[] {
  if (!user) return [];
  
  // Head of NIAT and Admin can see all centers
  if (user.role === 'head_of_niat' || user.role === 'admin') {
    return allCenters;
  }
  
  // COS and PM can only see their assigned center
  if ((user.role === 'cos' || user.role === 'pm') && user.centerId) {
    return allCenters.filter(center => center.id === user.centerId);
  }
  

  
  return [];
}

export function canAccessCenter(user: User | null, centerId: string): boolean {
  if (!user) return false;
  
  // Head of NIAT and Admin can access all centers
  if (user.role === 'head_of_niat' || user.role === 'admin') {
    return true;
  }
  
  // COS and PM can only access their assigned center
  if ((user.role === 'cos' || user.role === 'pm') && user.centerId) {
    return user.centerId === centerId;
  }
  

  
  return false;
}

export function canSubmitReports(user: User | null): boolean {
  if (!user) return false;
  
  // Head of NIAT (Pavan Dharma) has view-only access - cannot submit reports
  // Only admin, cos, and pm can submit reports
  return user.role === 'admin' || user.role === 'cos' || user.role === 'pm';
}

export function canAccessAdminPanel(user: User | null): boolean {
  if (!user) return false;
  
  // Only admin has full access to admin panel
  // Head of NIAT has view-only access (can see users but cannot modify)
  return user.role === 'admin' || user.role === 'head_of_niat';
}

export function canEditUser(user: User | null, targetUserId: string): boolean {
  if (!user) return false;
  
  // Only Admin can edit all users
  // Head of NIAT has view-only access - cannot edit users
  if (user.role === 'admin') {
    return true;
  }
  
  // Users can edit their own profile (except Head of NIAT in view-only mode)
  if (user.role !== 'head_of_niat') {
    return user.id === targetUserId;
  }
  
  return false;
}

export function canViewAllCentersData(user: User | null): boolean {
  if (!user) return false;
  
  return user.role === 'head_of_niat' || user.role === 'admin';
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'head_of_niat': return 'Head of NIAT';
    case 'admin': return 'Administrator';
    case 'cos': return 'Chief of Staff';
    case 'pm': return 'Program Manager';
    default: return role;
  }
}

export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'head_of_niat': return 'bg-purple-600 text-white';
    case 'admin': return 'bg-red-600 text-white';
    case 'cos': return 'bg-blue-600 text-white';
    case 'pm': return 'bg-green-600 text-white';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

// Helper functions for role-based permissions
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isViewOnly(user: User | null): boolean {
  return user?.role === 'head_of_niat';
}

export function canModifyData(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'cos' || user.role === 'pm';
}