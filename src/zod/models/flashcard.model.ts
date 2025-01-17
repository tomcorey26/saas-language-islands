import { z } from 'zod';

export const FlashCardSchema = z.object({
  sentence: z.string(),
  translation: z.string(),
});

export type FlashCard = z.infer<typeof FlashCardSchema>;
