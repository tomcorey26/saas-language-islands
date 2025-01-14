// TODO: Change to something that auto generates the api client and api routes, and react-query hooks

import { api } from '@/server/apiClient';
import {
  FlashCardRequestSchema,
  FlashCardResponseSchema,
} from '@/zod/flashCardSchemas';
import { z } from 'zod';

export async function generateFlashCards(
  prompt: string,
  language: string
): Promise<{ flashcards: { sentence: string; translation: string }[] }> {
  // TODO: error handling with zod
  return api.post('/flashcards', { prompt, language });
}

export async function generateIslands(
  data: z.infer<typeof FlashCardRequestSchema>
): Promise<{ flashcards: z.infer<typeof FlashCardResponseSchema> }> {
  return api.post('/flashcards/islands', data);
}
