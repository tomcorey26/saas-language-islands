import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { pgTable, text, varchar, pgEnum } from "drizzle-orm/pg-core";

export const featureRequestStatusEnum = pgEnum("feature_request_status", [
  "pending",
  "in_progress",
  "completed",
  "rejected",
]);

export const featureRequestPriorityEnum = pgEnum("feature_request_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const FeatureRequestTable = pgTable("feature_requests", {
  id,
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }),
  status: featureRequestStatusEnum("status").notNull().default("pending"),
  priority: featureRequestPriorityEnum("priority").notNull().default("medium"),
  adminNotes: text("admin_notes"),
  createdAt,
  updatedAt,
});
