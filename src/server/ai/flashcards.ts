// TODO: Change to something that auto generates the api client and api routes, and react-query hooks

import { api } from "@/server/apiClient";

export async function generateFlashCards(
  prompt: string,
  language: string
): Promise<{ flashcards: { sentence: string; translation: string }[] }> {
  // TODO: error handling with zod
  return api.post("/flashcards", { prompt, language });
}
