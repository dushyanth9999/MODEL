import { 
  users, 
  actionTrackerTemplates,
  dailyActionTrackers,
  type User, 
  type InsertUser, 
  type ActionTrackerTemplate, 
  type InsertActionTrackerTemplate,
  type DailyActionTracker,
  type InsertDailyActionTracker 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Action Tracker Templates
  getActionTrackerTemplates(): Promise<ActionTrackerTemplate[]>;
  getActionTrackerTemplatesByRole(role: string): Promise<ActionTrackerTemplate[]>;
  createActionTrackerTemplate(template: InsertActionTrackerTemplate): Promise<ActionTrackerTemplate>;
  updateActionTrackerTemplate(id: number, template: Partial<ActionTrackerTemplate>): Promise<ActionTrackerTemplate | undefined>;
  deleteActionTrackerTemplate(id: number): Promise<boolean>;
  
  // Daily Action Trackers
  getDailyActionTrackers(userId: number, date: Date): Promise<DailyActionTracker[]>;
  getDailyActionTrackersByCenter(centerId: string, date: Date): Promise<DailyActionTracker[]>;
  createDailyActionTracker(tracker: InsertDailyActionTracker): Promise<DailyActionTracker>;
  updateDailyActionTracker(id: number, tracker: Partial<DailyActionTracker>): Promise<DailyActionTracker | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDefaultData();
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async getActionTrackerTemplates(): Promise<ActionTrackerTemplate[]> {
    try {
      return await db.select().from(actionTrackerTemplates).where(eq(actionTrackerTemplates.isActive, true));
    } catch (error) {
      console.error('Error getting action tracker templates:', error);
      return [];
    }
  }

  async getActionTrackerTemplatesByRole(role: string): Promise<ActionTrackerTemplate[]> {
    try {
      return await db.select().from(actionTrackerTemplates)
        .where(and(eq(actionTrackerTemplates.role, role), eq(actionTrackerTemplates.isActive, true)));
    } catch (error) {
      console.error('Error getting templates by role:', error);
      return [];
    }
  }

  async createActionTrackerTemplate(template: InsertActionTrackerTemplate): Promise<ActionTrackerTemplate> {
    const [newTemplate] = await db
      .insert(actionTrackerTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateActionTrackerTemplate(id: number, templateData: Partial<ActionTrackerTemplate>): Promise<ActionTrackerTemplate | undefined> {
    try {
      const [template] = await db
        .update(actionTrackerTemplates)
        .set(templateData)
        .where(eq(actionTrackerTemplates.id, id))
        .returning();
      return template || undefined;
    } catch (error) {
      console.error('Error updating template:', error);
      return undefined;
    }
  }

  async deleteActionTrackerTemplate(id: number): Promise<boolean> {
    try {
      const [template] = await db
        .update(actionTrackerTemplates)
        .set({ isActive: false })
        .where(eq(actionTrackerTemplates.id, id))
        .returning();
      return !!template;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }

  async getDailyActionTrackers(userId: number, date: Date): Promise<DailyActionTracker[]> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      return await db.select().from(dailyActionTrackers)
        .where(and(
          eq(dailyActionTrackers.userId, userId),
          eq(dailyActionTrackers.date, new Date(dateStr))
        ));
    } catch (error) {
      console.error('Error getting daily trackers:', error);
      return [];
    }
  }

  async getDailyActionTrackersByCenter(centerId: string, date: Date): Promise<DailyActionTracker[]> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      return await db.select().from(dailyActionTrackers)
        .where(and(
          eq(dailyActionTrackers.centerId, centerId),
          eq(dailyActionTrackers.date, new Date(dateStr))
        ));
    } catch (error) {
      console.error('Error getting trackers by center:', error);
      return [];
    }
  }

  async createDailyActionTracker(tracker: InsertDailyActionTracker): Promise<DailyActionTracker> {
    const [newTracker] = await db
      .insert(dailyActionTrackers)
      .values(tracker)
      .returning();
    return newTracker;
  }

  async updateDailyActionTracker(id: number, trackerData: Partial<DailyActionTracker>): Promise<DailyActionTracker | undefined> {
    try {
      const [tracker] = await db
        .update(dailyActionTrackers)
        .set(trackerData)
        .where(eq(dailyActionTrackers.id, id))
        .returning();
      return tracker || undefined;
    } catch (error) {
      console.error('Error updating tracker:', error);
      return undefined;
    }
  }

  private async initializeDefaultData(): Promise<void> {
    try {
      // Check if templates already exist
      const existingTemplates = await this.getActionTrackerTemplates();
      if (existingTemplates.length > 0) {
        return; // Already initialized
      }

      // Create default templates
      const cosTemplate = {
        role: "cos",
        title: "Chief of Staff Daily Checklist",
        description: "Daily operational checklist for Chief of Staff",
        items: [
          "Review daily campus performance reports (CSAT, attendance, budget)",
          "Check in with 1–2 Program Managers on key priorities",
          "Scan dashboards for red flags (e.g., churn, lagging KPIs)",
          "Review new issues/requests from campuses",
          "Prioritize escalations and align with leadership calendar",
          "Lead or attend cross-functional syncs (ops, academic, tech)",
          "Finalize strategy notes or review decks for leadership meetings",
          "Align resource allocation decisions (budget, staffing)",
          "Share insights or playbooks with PMs (best practices)",
          "Advocate for campus needs in central leadership meetings",
          "Log summary updates: performance insights, blockers, wins",
          "Prepare updates or key messages for next day's standups"
        ]
      };

      const pmTemplate = {
        role: "pm",
        title: "Program Manager Daily Checklist",
        description: "Daily operational checklist for Program Managers",
        items: [
          "Conduct a daily ops standup with campus staff (15–20 mins)",
          "Ensure all classes/events are live and running smoothly",
          "Track attendance and resolve any student/ops issues",
          "Check on lab/technical uptime and classroom readiness",
          "Meet with faculty or success team on at-risk students",
          "Coordinate ongoing events/workshops (if any)",
          "Follow up on student engagement activities (clubs, tasks)",
          "Liaise with placement cell/industry partners if scheduled",
          "Submit mini status updates to CoS (Slack/email/portal)",
          "Review CSAT/NPS feedback for the day",
          "Evaluate team performance: log key actions and attendance",
          "Document any operational issues or escalations",
          "Plan and schedule improvements (labs, training, events)",
          "Wrap-up with quick sync with senior campus team"
        ]
      };

      await this.createActionTrackerTemplate(cosTemplate);
      await this.createActionTrackerTemplate(pmTemplate);

      console.log('✅ Default action tracker templates initialized');
    } catch (error) {
      console.error('❌ Error initializing default data:', error);
    }
  }
}

export const storage = new DatabaseStorage();