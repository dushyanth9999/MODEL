import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"), // admin, cos, pm, viewer, head_of_niat
  centerId: text("center_id"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Action Tracker Templates
export const actionTrackerTemplates = pgTable("action_tracker_templates", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // cos, pm
  title: text("title").notNull(),
  description: text("description"),
  items: jsonb("items").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Daily Action Tracker Completions
export const dailyActionTrackers = pgTable("daily_action_trackers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  templateId: integer("template_id").references(() => actionTrackerTemplates.id).notNull(),
  centerId: text("center_id"),
  date: timestamp("date").notNull(),
  completedItems: jsonb("completed_items").notNull().default([]),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  centerId: true,
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["admin", "cos", "pm", "viewer", "head_of_niat"]),
  centerId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
