import { z } from "zod";
import { FlashCardModel } from "../models/flashcard.model";
import { createInsertSchema } from "drizzle-zod";
import { IslandTable } from "@/drizzle/schema";

export const CreateIslandRequestSchema = createInsertSchema(IslandTable).extend(
  {
    count: z.number().min(1, "Count must be at least 1"),
  }
);

export type CreateIslandRequest = z.infer<typeof CreateIslandRequestSchema>;

export const CreateIslandResponseSchema = z.object({
  island: z.array(FlashCardModel),
});

export type CreateIslandResponse = z.infer<typeof CreateIslandResponseSchema>;
