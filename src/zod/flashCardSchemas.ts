import { z } from 'zod';

const FlashCard = z.object({
  sentence: z.string(),
  translation: z.string(),
});

export const FlashCardArray = z.array(FlashCard);

export const FlashCardRequestSchema = z.object({
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
  email: z.string().email(),
  recaptchaToken: z.string(),
});

// the request schema will be the same as the flashcard request schema, but it will have arrays of the flashcard schema for each field
export const FlashCardResponseSchema = z.object({
  occupation: z.array(FlashCard),
  reading: z.array(FlashCard),
  gaming: z.array(FlashCard),
  cooking: z.array(FlashCard),
  music: z.array(FlashCard),
  sports: z.array(FlashCard),
  art: z.array(FlashCard),
  technology: z.array(FlashCard),
  photography: z.array(FlashCard),
  travel: z.array(FlashCard),
  writing: z.array(FlashCard),
  dancing: z.array(FlashCard),
  gardening: z.array(FlashCard),
  dining: z.array(FlashCard),
  shopping: z.array(FlashCard),
  healthcare: z.array(FlashCard),
  smallTalk: z.array(FlashCard),
  emergencies: z.array(FlashCard),
  directions: z.array(FlashCard),
  culture: z.array(FlashCard),
});
