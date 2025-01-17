// TODO: Change to something that auto generates the api client and api routes, and react-query hooks

import { api } from '@/server/apiClient';
import {
  CreateWorldRequest,
  CreateWorldResponse,
} from '@/zod/contracts/world.schema';

export async function generateFlashCards(
  prompt: string,
  language: string
): Promise<{ flashcards: { sentence: string; translation: string }[] }> {
  return api.post('/flashcards', { prompt, language });
}

export async function generateIslands(
  data: CreateWorldRequest
): Promise<CreateWorldResponse> {
  return api.post('/world', data);
}
