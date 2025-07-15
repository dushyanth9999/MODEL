import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"), // admin, cos, pm, viewer, head_of_niat
  centerId: text("center_id"),
});

// Action Tracker Templates
export const actionTrackerTemplates = sqliteTable("action_tracker_templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(), // cos, pm
  title: text("title").notNull(),
  description: text("description"),
  items: text("items", { mode: 'json' }).notNull().$type<string[]>(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
});

// Daily Action Tracker Completions
export const dailyActionTrackers = sqliteTable("daily_action_trackers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  templateId: integer("template_id").notNull().references(() => actionTrackerTemplates.id),
  centerId: text("center_id"),
  date: integer("date", { mode: 'timestamp' }).notNull(),
  completedItems: text("completed_items", { mode: 'json' }).notNull().default('[]').$type<string[]>(),
  notes: text("notes"),
  completedAt: integer("completed_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  centerId: true,
});

export const insertActionTrackerTemplateSchema = createInsertSchema(actionTrackerTemplates).pick({
  role: true,
  title: true,
  description: true,
  items: true,
});

export const insertDailyActionTrackerSchema = createInsertSchema(dailyActionTrackers).pick({
  userId: true,
  templateId: true,
  centerId: true,
  date: true,
  completedItems: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ActionTrackerTemplate = typeof actionTrackerTemplates.$inferSelect;
export type InsertActionTrackerTemplate = z.infer<typeof insertActionTrackerTemplateSchema>;
export type DailyActionTracker = typeof dailyActionTrackers.$inferSelect;
export type InsertDailyActionTracker = z.infer<typeof insertDailyActionTrackerSchema>;