import { z } from "zod";

export const FlashCardSchema = z.object({
  category: z.string(),
  phrase: z.string(),
  translation: z.string(),
});

export type FlashCard = z.infer<typeof FlashCardSchema>;
