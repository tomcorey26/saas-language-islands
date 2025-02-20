import { z } from "zod";
import { FlashCardSchema } from "./flashcard.model";

export const DeckSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cards: z.array(FlashCardSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Deck = z.infer<typeof DeckSchema>;
