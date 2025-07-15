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
  
  // Viewers can see all centers but with limited access
  if (user.role === 'viewer') {
    return allCenters;
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
  
  // Viewers can access all centers but with read-only permissions
  if (user.role === 'viewer') {
    return true;
  }
  
  return false;
}

export function canSubmitReports(user: User | null): boolean {
  if (!user) return false;
  
  return user.role === 'head_of_niat' || user.role === 'admin' || user.role === 'cos' || user.role === 'pm';
}

export function canAccessAdminPanel(user: User | null): boolean {
  if (!user) return false;
  
  return user.role === 'head_of_niat' || user.role === 'admin';
}

export function canEditUser(user: User | null, targetUserId: string): boolean {
  if (!user) return false;
  
  // Head of NIAT and Admin can edit all users
  if (user.role === 'head_of_niat' || user.role === 'admin') {
    return true;
  }
  
  // Users can edit their own profile
  return user.id === targetUserId;
}

export function canViewAllCentersData(user: User | null): boolean {
  if (!user) return false;
  
  return user.role === 'head_of_niat' || user.role === 'admin';
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'head_of_niat': return 'Head of NIAT';
    case 'admin': return 'Admin';
    case 'cos': return 'Chief of Staff';
    case 'pm': return 'Project Manager';
    case 'viewer': return 'Viewer';
    default: return role;
  }
}

export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'head_of_niat': return 'bg-purple-600 text-white';
    case 'admin': return 'bg-nxtwave-red text-white';
    case 'cos': return 'bg-nxtwave-gold text-nxtwave-red';
    case 'pm': return 'bg-nxtwave-cream text-nxtwave-red';
    case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}