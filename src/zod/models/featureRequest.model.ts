import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { FeatureRequestTable } from "@/drizzle/featureRequest";

export const FeatureRequestSchema = createSelectSchema(FeatureRequestTable);
export const CreateFeatureRequestSchema = createInsertSchema(FeatureRequestTable, {
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be 2000 characters or less"),
  userEmail: z.string().email("Please enter a valid email address"),
  userName: z.string().max(255, "Name must be 255 characters or less").optional(),
}).omit({
  id: true,
  status: true,
  priority: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateFeatureRequestSchema = createInsertSchema(FeatureRequestTable).omit({
  id: true,
  createdAt: true,
}).partial();

export type FeatureRequest = z.infer<typeof FeatureRequestSchema>;
export type CreateFeatureRequest = z.infer<typeof CreateFeatureRequestSchema>;
export type UpdateFeatureRequest = z.infer<typeof UpdateFeatureRequestSchema>;