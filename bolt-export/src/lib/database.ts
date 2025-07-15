import { eq, and } from 'drizzle-orm';
import { db } from './supabase';
import { 
  users, 
  actionTrackerTemplates, 
  dailyActionTrackers,
  type User,
  type ActionTrackerTemplate,
  type DailyActionTracker,
  type InsertUser,
  type InsertActionTrackerTemplate,
  type InsertDailyActionTracker
} from './schema';

// Database service functions
export class DatabaseService {
  
  // Users
  static async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  static async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  static async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  static async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result[0];
  }

  static async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Action Tracker Templates
  static async getActionTrackerTemplates(): Promise<ActionTrackerTemplate[]> {
    return await db.select().from(actionTrackerTemplates).where(eq(actionTrackerTemplates.isActive, true));
  }

  static async getActionTrackerTemplatesByRole(role: string): Promise<ActionTrackerTemplate[]> {
    return await db.select().from(actionTrackerTemplates)
      .where(and(eq(actionTrackerTemplates.role, role), eq(actionTrackerTemplates.isActive, true)));
  }

  static async createActionTrackerTemplate(templateData: InsertActionTrackerTemplate): Promise<ActionTrackerTemplate> {
    const result = await db.insert(actionTrackerTemplates).values(templateData).returning();
    return result[0];
  }

  static async updateActionTrackerTemplate(id: number, templateData: Partial<ActionTrackerTemplate>): Promise<ActionTrackerTemplate | undefined> {
    const result = await db.update(actionTrackerTemplates).set(templateData).where(eq(actionTrackerTemplates.id, id)).returning();
    return result[0];
  }

  static async deleteActionTrackerTemplate(id: number): Promise<boolean> {
    const result = await db.update(actionTrackerTemplates)
      .set({ isActive: false })
      .where(eq(actionTrackerTemplates.id, id));
    return true;
  }

  // Daily Action Trackers
  static async getDailyActionTrackers(userId: number, date: Date): Promise<DailyActionTracker[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db.select().from(dailyActionTrackers)
      .where(and(
        eq(dailyActionTrackers.userId, userId),
        eq(dailyActionTrackers.date, startOfDay)
      ));
  }

  static async getDailyActionTrackersByCenter(centerId: string, date: Date): Promise<DailyActionTracker[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    return await db.select().from(dailyActionTrackers)
      .where(and(
        eq(dailyActionTrackers.centerId, centerId),
        eq(dailyActionTrackers.date, startOfDay)
      ));
  }

  static async createDailyActionTracker(trackerData: InsertDailyActionTracker): Promise<DailyActionTracker> {
    const result = await db.insert(dailyActionTrackers).values(trackerData).returning();
    return result[0];
  }

  static async updateDailyActionTracker(id: number, trackerData: Partial<DailyActionTracker>): Promise<DailyActionTracker | undefined> {
    const result = await db.update(dailyActionTrackers).set(trackerData).where(eq(dailyActionTrackers.id, id)).returning();
    return result[0];
  }

  // Initialize default data
  static async initializeDefaultData(): Promise<void> {
    try {
      // Check if templates already exist
      const existingTemplates = await this.getActionTrackerTemplates();
      if (existingTemplates.length > 0) {
        return; // Already initialized
      }

      // Create default templates
      await this.createActionTrackerTemplate({
        role: 'cos',
        title: 'Chief of Staff Daily Checklist',
        description: 'Daily operational checklist for Chief of Staff',
        items: [
          'Review daily campus performance reports (CSAT, attendance, budget)',
          'Check in with 1–2 Program Managers on key priorities',
          'Scan dashboards for red flags (e.g., churn, lagging KPIs)',
          'Review new issues/requests from campuses',
          'Prioritize escalations and align with leadership calendar',
          'Lead or attend cross-functional syncs (ops, academic, tech)',
          'Finalize strategy notes or review decks for leadership meetings',
          'Align resource allocation decisions (budget, staffing)',
          'Share insights or playbooks with PMs (best practices)',
          'Advocate for campus needs in central leadership meetings',
          'Log summary updates: performance insights, blockers, wins',
          'Prepare updates or key messages for next day\'s standups'
        ],
        isActive: true
      });

      await this.createActionTrackerTemplate({
        role: 'pm',
        title: 'Program Manager Daily Checklist',
        description: 'Daily operational checklist for Program Managers',
        items: [
          'Conduct a daily ops standup with campus staff (15–20 mins)',
          'Ensure all classes/events are live and running smoothly',
          'Track attendance and resolve any student/ops issues',
          'Check on lab/technical uptime and classroom readiness',
          'Meet with faculty or success team on at-risk students',
          'Coordinate ongoing events/workshops (if any)',
          'Follow up on student engagement activities (clubs, tasks)',
          'Liaise with placement cell/industry partners if scheduled',
          'Submit mini status updates to CoS (Slack/email/portal)',
          'Review CSAT/NPS feedback for the day',
          'Evaluate team performance: log key actions and attendance',
          'Document any operational issues or escalations',
          'Plan and schedule improvements (labs, training, events)',
          'Wrap-up with quick sync with senior campus team'
        ],
        isActive: true
      });

      // Create default users
      const defaultUsers = [
        {
          username: 'admin',
          email: 'admin@niat.edu',
          role: 'admin' as const,
        },
        {
          username: 'cos_hyderabad',
          email: 'cos@niat.edu', 
          role: 'cos' as const,
          centerId: 'niat-main-hyd',
        },
        {
          username: 'pm_bangalore',
          email: 'pm@niat.edu',
          role: 'pm' as const,
          centerId: 'niat-bangalore',
        },
        {
          username: 'head_of_niat',
          email: 'head@niat.edu',
          role: 'head_of_niat' as const,
        },
      ];

      for (const userData of defaultUsers) {
        const existingUser = await this.getUserByUsername(userData.username);
        if (!existingUser) {
          await this.createUser(userData);
        }
      }

      console.log('✅ Default data initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing default data:', error);
    }
  }
}