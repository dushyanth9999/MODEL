// import { Notification } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

// Temporary inline type definition
interface Notification {
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

export class NotificationService {
  private static notifications: Notification[] = [];
  private static listeners: ((notifications: Notification[]) => void)[] = [];

  static subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.notifications);

    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Auto-remove low priority notifications after 5 minutes
    if (notification.priority === 'LOW') {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 5 * 60 * 1000);
    }

    // Show browser notification for high priority
    if (notification.priority === 'HIGH' || notification.priority === 'CRITICAL') {
      this.showBrowserNotification(newNotification);
    }
  }

  static markAsRead(notificationId: string): void {
    this.notifications = this.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    this.notifyListeners();
  }

  static markAllAsRead(): void {
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notifyListeners();
  }

  static removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(
      notification => notification.id !== notificationId
    );
    this.notifyListeners();
  }

  static clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  static getUnreadCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }

  static getNotificationsByPriority(priority: Notification['priority']): Notification[] {
    return this.notifications.filter(notification => notification.priority === priority);
  }

  static getNotificationsByCenter(centerId: string): Notification[] {
    return this.notifications.filter(notification => notification.centerId === centerId);
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  private static async showBrowserNotification(notification: Notification): Promise<void> {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo-niat.png',
        badge: '/logo-niat.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'CRITICAL'
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(notification);
      }
    }
  }

  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Predefined notification templates
  static createIssueNotification(centerName: string, issue: string, priority: Notification['priority']): void {
    this.addNotification({
      type: priority === 'CRITICAL' ? 'error' : 'warning',
      title: `Issue Reported - ${centerName}`,
      message: issue,
      priority,
      actionUrl: '/dashboard'
    });
  }

  static createMaintenanceNotification(centerName: string, item: string): void {
    this.addNotification({
      type: 'info',
      title: `Maintenance Required - ${centerName}`,
      message: `${item} requires maintenance attention`,
      priority: 'MEDIUM',
      actionUrl: '/dashboard'
    });
  }

  static createReportSubmissionNotification(centerName: string, submittedBy: string): void {
    this.addNotification({
      type: 'success',
      title: `Report Submitted - ${centerName}`,
      message: `Daily report submitted by ${submittedBy}`,
      priority: 'LOW',
      actionUrl: '/dashboard'
    });
  }

  static createSystemNotification(message: string, type: Notification['type'] = 'info'): void {
    this.addNotification({
      type,
      title: 'System Notification',
      message,
      priority: 'MEDIUM'
    });
  }

  static createTaskAssignmentNotification(taskTitle: string, assignedTo: string): void {
    this.addNotification({
      type: 'info',
      title: 'New Task Assigned',
      message: `Task "${taskTitle}" has been assigned to ${assignedTo}`,
      priority: 'MEDIUM',
      actionUrl: '/tasks'
    });
  }

  static createComplianceNotification(centerName: string, complianceScore: number): void {
    const type = complianceScore < 70 ? 'error' : complianceScore < 85 ? 'warning' : 'success';
    const priority = complianceScore < 70 ? 'HIGH' : 'MEDIUM';

    this.addNotification({
      type,
      title: `Compliance Update - ${centerName}`,
      message: `Compliance score: ${complianceScore}%`,
      priority,
      actionUrl: '/analytics'
    });
  }
}