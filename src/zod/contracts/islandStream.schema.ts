import { CreateCardRequestSchema } from "@/zod/contracts/card.schema";
import { z } from "zod";

// Schema for individual flashcards (for array streaming)
export const flashcardSchema = CreateCardRequestSchema.pick({
  phrase: true,
  translation: true,
});

// Schema for island name generation
export const islandNameSchema = z.object({
  name: z
    .string()
    .describe(
      "A short, descriptive name (2-4 words) for this collection of flashcards"
    ),
});

// Schema for a flashcard island (original object format)
export const flashcardIslandSchema = z.object({
  name: z
    .string()
    .describe(
      "A short, descriptive name (2-4 words) for this collection of flashcards"
    ),
  island: z
    .array(flashcardSchema)
    .describe("Array of flashcards for language learning"),
});

// Schema for use-island API request
export const useIslandRequestSchema = z.object({
  deckId: z.string(),
  prompt: z.string(),
  count: z.number().int().positive(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;
export type IslandName = z.infer<typeof islandNameSchema>;
export type FlashcardIsland = z.infer<typeof flashcardIslandSchema>;
export type UseIslandRequest = z.infer<typeof useIslandRequestSchema>;
