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

// modify the interface with any CRUD methods
// you might need

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private actionTrackerTemplates: Map<number, ActionTrackerTemplate>;
  private dailyActionTrackers: Map<number, DailyActionTracker>;
  currentId: number;
  currentTemplateId: number;
  currentTrackerId: number;
  private initialized = false;

  constructor() {
    this.users = new Map();
    this.actionTrackerTemplates = new Map();
    this.dailyActionTrackers = new Map();
    this.currentId = 1;
    this.currentTemplateId = 1;
    this.currentTrackerId = 1;
    
    // Initialize default templates and users
    this.initializeDefaultTemplates();
    this.initializeDefaultUsers();
  }

  async initialize() {
    if (this.initialized) return;
    console.log('✅ MemStorage initialized with default data');
    this.initialized = true;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "viewer",
      centerId: insertUser.centerId || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Action Tracker Templates
  async getActionTrackerTemplates(): Promise<ActionTrackerTemplate[]> {
    return Array.from(this.actionTrackerTemplates.values()).filter(t => t.isActive);
  }

  async getActionTrackerTemplatesByRole(role: string): Promise<ActionTrackerTemplate[]> {
    return Array.from(this.actionTrackerTemplates.values()).filter(t => t.role === role && t.isActive);
  }

  async createActionTrackerTemplate(template: InsertActionTrackerTemplate): Promise<ActionTrackerTemplate> {
    const id = this.currentTemplateId++;
    const newTemplate: ActionTrackerTemplate = {
      ...template,
      id,
      description: template.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    this.actionTrackerTemplates.set(id, newTemplate);
    return newTemplate;
  }

  async updateActionTrackerTemplate(id: number, templateData: Partial<ActionTrackerTemplate>): Promise<ActionTrackerTemplate | undefined> {
    const existingTemplate = this.actionTrackerTemplates.get(id);
    if (!existingTemplate) return undefined;
    
    const updatedTemplate = { ...existingTemplate, ...templateData, updatedAt: new Date() };
    this.actionTrackerTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteActionTrackerTemplate(id: number): Promise<boolean> {
    const template = this.actionTrackerTemplates.get(id);
    if (!template) return false;
    
    template.isActive = false;
    this.actionTrackerTemplates.set(id, template);
    return true;
  }

  // Daily Action Trackers
  async getDailyActionTrackers(userId: number, date: Date): Promise<DailyActionTracker[]> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.dailyActionTrackers.values()).filter(t => 
      t.userId === userId && t.date.toISOString().split('T')[0] === dateString
    );
  }

  async getDailyActionTrackersByCenter(centerId: string, date: Date): Promise<DailyActionTracker[]> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.dailyActionTrackers.values()).filter(t => 
      t.centerId === centerId && t.date.toISOString().split('T')[0] === dateString
    );
  }

  async createDailyActionTracker(tracker: InsertDailyActionTracker): Promise<DailyActionTracker> {
    const id = this.currentTrackerId++;
    const newTracker: DailyActionTracker = {
      ...tracker,
      id,
      centerId: tracker.centerId || null,
      notes: tracker.notes || null,
      completedItems: Array.isArray(tracker.completedItems) ? tracker.completedItems : [],
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.dailyActionTrackers.set(id, newTracker);
    return newTracker;
  }

  async updateDailyActionTracker(id: number, trackerData: Partial<DailyActionTracker>): Promise<DailyActionTracker | undefined> {
    const existingTracker = this.dailyActionTrackers.get(id);
    if (!existingTracker) return undefined;
    
    const updatedTracker = { ...existingTracker, ...trackerData, updatedAt: new Date() };
    this.dailyActionTrackers.set(id, updatedTracker);
    return updatedTracker;
  }

  private initializeDefaultTemplates(): void {
    // Chief of Staff (COS) template
    const cosTemplate: ActionTrackerTemplate = {
      id: this.currentTemplateId++,
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
      ] as string[],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    // Program Manager (PM) template
    const pmTemplate: ActionTrackerTemplate = {
      id: this.currentTemplateId++,
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
      ] as string[],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.actionTrackerTemplates.set(cosTemplate.id, cosTemplate);
    this.actionTrackerTemplates.set(pmTemplate.id, pmTemplate);
  }

  private initializeDefaultUsers(): void {
    // Add default users for testing
    const defaultUsers = [
      {
        id: this.currentId++,
        username: "admin@niat.edu",
        role: "head_of_niat",
        centerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentId++,
        username: "cos@niat.edu",
        role: "cos",
        centerId: "niat-hyderabad",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentId++,
        username: "pm@niat.edu",
        role: "pm",
        centerId: "niat-hyderabad",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }
}

export class DatabaseStorage implements IStorage {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Check if we have any templates, if not initialize with defaults
      const templates = await this.getActionTrackerTemplates();
      if (templates.length === 0) {
        await this.initializeDefaultTemplates();
      }
      
      // Check if we have any users, if not initialize with defaults
      const users = await this.getAllUsers();
      if (users.length === 0) {
        await this.initializeDefaultUsers();
      }
      
      this.initialized = true;
      console.log('✅ Database initialized with default data');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
    }
  }

  private async initializeDefaultTemplates() {
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
      ],
      isActive: true
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
      ],
      isActive: true
    };

    await this.createActionTrackerTemplate(cosTemplate);
    await this.createActionTrackerTemplate(pmTemplate);
  }

  private async initializeDefaultUsers() {
    const defaultUsers = [
      {
        username: "admin@niat.edu",
        role: "head_of_niat",
        centerId: null
      },
      {
        username: "cos@niat.edu",
        role: "cos",
        centerId: "niat-hyderabad"
      },
      {
        username: "pm@niat.edu",
        role: "pm",
        centerId: "niat-hyderabad"
      }
    ];

    for (const user of defaultUsers) {
      await this.createUser(user);
    }
  }
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getActionTrackerTemplates(): Promise<ActionTrackerTemplate[]> {
    return await db.select().from(actionTrackerTemplates).where(eq(actionTrackerTemplates.isActive, true));
  }

  async getActionTrackerTemplatesByRole(role: string): Promise<ActionTrackerTemplate[]> {
    return await db.select().from(actionTrackerTemplates)
      .where(and(eq(actionTrackerTemplates.role, role), eq(actionTrackerTemplates.isActive, true)));
  }

  async createActionTrackerTemplate(template: InsertActionTrackerTemplate): Promise<ActionTrackerTemplate> {
    const [newTemplate] = await db
      .insert(actionTrackerTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateActionTrackerTemplate(id: number, templateData: Partial<ActionTrackerTemplate>): Promise<ActionTrackerTemplate | undefined> {
    const [template] = await db
      .update(actionTrackerTemplates)
      .set(templateData)
      .where(eq(actionTrackerTemplates.id, id))
      .returning();
    return template || undefined;
  }

  async deleteActionTrackerTemplate(id: number): Promise<boolean> {
    const [template] = await db
      .update(actionTrackerTemplates)
      .set({ isActive: false })
      .where(eq(actionTrackerTemplates.id, id))
      .returning();
    return !!template;
  }

  async getDailyActionTrackers(userId: number, date: Date): Promise<DailyActionTracker[]> {
    const dateStr = date.toISOString().split('T')[0];
    return await db.select().from(dailyActionTrackers)
      .where(and(
        eq(dailyActionTrackers.userId, userId),
        eq(dailyActionTrackers.date, new Date(dateStr))
      ));
  }

  async getDailyActionTrackersByCenter(centerId: string, date: Date): Promise<DailyActionTracker[]> {
    const dateStr = date.toISOString().split('T')[0];
    return await db.select().from(dailyActionTrackers)
      .where(and(
        eq(dailyActionTrackers.centerId, centerId),
        eq(dailyActionTrackers.date, new Date(dateStr))
      ));
  }

  async createDailyActionTracker(tracker: InsertDailyActionTracker): Promise<DailyActionTracker> {
    const [newTracker] = await db
      .insert(dailyActionTrackers)
      .values(tracker)
      .returning();
    return newTracker;
  }

  async updateDailyActionTracker(id: number, trackerData: Partial<DailyActionTracker>): Promise<DailyActionTracker | undefined> {
    const [tracker] = await db
      .update(dailyActionTrackers)
      .set(trackerData)
      .where(eq(dailyActionTrackers.id, id))
      .returning();
    return tracker || undefined;
  }
}

// Dynamically choose storage based on database availability
function createStorage(): IStorage {
  if (db && process.env.DATABASE_URL) {
    console.log('🗄️  Using database storage');
    return new DatabaseStorage();
  } else {
    console.log('🧠 Using in-memory storage for development');
    return new MemStorage();
  }
}

export const storage = createStorage();
