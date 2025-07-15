import { z } from "zod";
import { FlashCardModel } from "../models/flashcard.model";
import { createInsertSchema } from "drizzle-zod";
import { IslandTable } from "@/drizzle/schema";

export const CreateIslandRequestSchema = createInsertSchema(IslandTable).extend(
  {
    count: z
      .number()
      .min(1, "Count must be at least 1")
      .max(20, "Count must be at most 20"),
    prompt: z
      .string()
      .min(1, "Prompt must be at least 1 character")
      .max(150, "Prompt must be at most 150 characters"),
  }
);

export type CreateIslandRequest = z.infer<typeof CreateIslandRequestSchema>;

export const CreateIslandResponseSchema = z.object({
  island: z.array(FlashCardModel),
});

export type CreateIslandResponse = z.infer<typeof CreateIslandResponseSchema>;
