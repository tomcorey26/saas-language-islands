import { z } from "zod";
import { CardTable } from "@/drizzle/schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const CreateCardRequestSchema = createInsertSchema(CardTable);

export type CreateCardRequest = z.infer<typeof CreateCardRequestSchema>;

export const UpdateCardRequestSchema = createUpdateSchema(CardTable).pick({
  phrase: true,
  translation: true,
  difficulty: true,
  easeFactor: true,
  repetitions: true,
  lastReviewedAt: true,
  nextReviewAt: true,
});

export type UpdateCardRequest = z.infer<typeof UpdateCardRequestSchema>;

export const UpdateCardMemoryTechniquesRequestSchema = createUpdateSchema(CardTable).pick({
  memoryPalaceLocation: true,
  visualImagery: true,
  personalConnection: true,
  easeFactor: true,
  repetitions: true,
  lastReviewedAt: true,
  nextReviewAt: true,
});

export type UpdateCardMemoryTechniquesRequest = z.infer<typeof UpdateCardMemoryTechniquesRequestSchema>;
