import { pgTable, text, integer, timestamp, boolean, json } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  username: text("username").unique().notNull(),
  email: text("email").unique(),
  role: text("role").notNull(), // 'admin', 'cos', 'pm', 'head_of_niat'
  centerId: text("center_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Action Tracker Templates
export const actionTrackerTemplates = pgTable("action_tracker_templates", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  role: text("role").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  items: text("items").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Daily Action Trackers
export const dailyActionTrackers = pgTable("daily_action_trackers", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull(),
  templateId: integer("template_id").notNull(),
  centerId: text("center_id"),
  date: timestamp("date").notNull(),
  completedItems: text("completed_items").array().default([]).notNull(),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  role: true,
  centerId: true,
});

export const insertActionTrackerTemplateSchema = createInsertSchema(actionTrackerTemplates).pick({
  role: true,
  title: true,
  description: true,
  items: true,
  isActive: true,
});

export const insertDailyActionTrackerSchema = createInsertSchema(dailyActionTrackers).pick({
  userId: true,
  templateId: true,
  centerId: true,
  date: true,
  completedItems: true,
  notes: true,
  completedAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ActionTrackerTemplate = typeof actionTrackerTemplates.$inferSelect;
export type InsertActionTrackerTemplate = z.infer<typeof insertActionTrackerTemplateSchema>;
export type DailyActionTracker = typeof dailyActionTrackers.$inferSelect;
export type InsertDailyActionTracker = z.infer<typeof insertDailyActionTrackerSchema>;