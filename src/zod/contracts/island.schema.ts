import { z } from "zod";
import { FlashCardModel } from "../models/flashcard.model";
export const CreateIslandRequestSchema = z.object({
  deckId: z.string(),
  category: z.string(),
  count: z.number(),
  prompt: z.string(),
});

export type CreateIslandRequest = z.infer<typeof CreateIslandRequestSchema>;

export const CreateIslandResponseSchema = z.object({
  island: z.array(FlashCardModel),
});

export type CreateIslandResponse = z.infer<typeof CreateIslandResponseSchema>;
