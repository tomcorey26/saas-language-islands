import { z } from "zod";
import { FlashCardSchema } from "@/zod/models/flashcard.model";
import { DeckSchema } from "@/zod/models/deck.model";

export const CreateDeckRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  flashcards: z.array(FlashCardSchema),
});

export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;

export const DeckResponseSchema = DeckSchema;

export type DeckResponse = z.infer<typeof DeckResponseSchema>;
