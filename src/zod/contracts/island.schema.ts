import { z } from "zod";
import { FlashCardModel } from "../models/flashcard.model";
import { createInsertSchema } from "drizzle-zod";
import { IslandTable } from "@/drizzle/schema";
import { flashcardSchema } from "@/zod/contracts/islandStream.schema";

export const CreateIslandRequestSchema = createInsertSchema(IslandTable)
  .omit({
    name: true,
  })
  .extend({
    count: z
      .number()
      .min(1, "Count must be at least 1")
      .max(20, "Count must be at most 20"),
    prompt: z
      .string()
      .min(1, "Prompt must be at least 1 character")
      .max(150, "Prompt must be at most 150 characters"),
    cards: z.array(flashcardSchema),
  });

export type CreateIslandRequest = z.infer<typeof CreateIslandRequestSchema>;

export const CreateIslandResponseSchema = z.object({
  island: z.array(FlashCardModel),
});

export type CreateIslandResponse = z.infer<typeof CreateIslandResponseSchema>;
