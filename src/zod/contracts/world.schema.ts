import { FlashCardSchema } from '@/zod/models/flashcard.model';
import { z } from 'zod';

export const CreateWorldRequestSchema = z.object({
  language: z.string(),
  name: z.string(),
  occupation: z.string(),
  cardsPerCategory: z.string(),
  interests: z.object({
    reading: z.boolean(),
    gaming: z.boolean(),
    cooking: z.boolean(),
    music: z.boolean(),
    sports: z.boolean(),
    art: z.boolean(),
    technology: z.boolean(),
    photography: z.boolean(),
    travel: z.boolean(),
    writing: z.boolean(),
    dancing: z.boolean(),
    gardening: z.boolean(),
  }),
  commonScenarios: z.object({
    travel: z.boolean(),
    dining: z.boolean(),
    shopping: z.boolean(),
    healthcare: z.boolean(),
    smallTalk: z.boolean(),
    emergencies: z.boolean(),
    directions: z.boolean(),
    culture: z.boolean(),
  }),
  recaptchaToken: z.string(),
});

export type CreateWorldRequest = z.infer<typeof CreateWorldRequestSchema>;

export const CreateWorldResponseSchema = z.object({
  flashcards: z.object({
    occupation: z.array(FlashCardSchema),
    reading: z.array(FlashCardSchema),
    gaming: z.array(FlashCardSchema),
    cooking: z.array(FlashCardSchema),
    music: z.array(FlashCardSchema),
    sports: z.array(FlashCardSchema),
    art: z.array(FlashCardSchema),
    technology: z.array(FlashCardSchema),
    photography: z.array(FlashCardSchema),
    travel: z.array(FlashCardSchema),
    writing: z.array(FlashCardSchema),
    dancing: z.array(FlashCardSchema),
    gardening: z.array(FlashCardSchema),
    dining: z.array(FlashCardSchema),
    shopping: z.array(FlashCardSchema),
    healthcare: z.array(FlashCardSchema),
    smallTalk: z.array(FlashCardSchema),
    emergencies: z.array(FlashCardSchema),
    directions: z.array(FlashCardSchema),
    culture: z.array(FlashCardSchema),
  }),
});

export type CreateWorldResponse = z.infer<typeof CreateWorldResponseSchema>;
