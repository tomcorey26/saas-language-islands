import { FlashCardSchema } from "@/zod/models/flashcard.model";
import { z } from "zod";

export const CreateWorldRequestSchema = z.object({
  language: z.string(),
  name: z.string(),
  occupation: z.string(),
  cardsPerCategory: z.number(),
  interests: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
  commonScenarios: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
  recaptchaToken: z.string(),
});

export type CreateWorldRequest = z.infer<typeof CreateWorldRequestSchema>;

export const CreateWorldResponseSchema = z.object({
  flashcards: z.array(
    z.object({
      category: z.string(),
      flashcards: z.array(FlashCardSchema),
    })
  ),
});

export type CreateWorldResponse = z.infer<typeof CreateWorldResponseSchema>;
