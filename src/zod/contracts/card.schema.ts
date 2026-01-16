import { z } from "zod";
import { CardTable } from "@/drizzle/schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const CreateCardRequestSchema = createInsertSchema(CardTable);

export type CreateCardRequest = z.infer<typeof CreateCardRequestSchema>;

export const UpdateCardRequestSchema = createUpdateSchema(CardTable).pick({
  phrase: true,
  translation: true,
  position: true,
  difficulty: true,
});

export type UpdateCardRequest = z.infer<typeof UpdateCardRequestSchema>;

// Review quality for spaced repetition
export const ReviewQualitySchema = z.enum([
  "again",
  "difficult",
  "good",
  "easy",
]);

export type ReviewQuality = z.infer<typeof ReviewQualitySchema>;

export const ReviewCardRequestSchema = z.object({
  cardId: z.string().uuid(),
  quality: ReviewQualitySchema,
});

export type ReviewCardRequest = z.infer<typeof ReviewCardRequestSchema>;
