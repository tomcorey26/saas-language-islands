import { FlashCardSchema } from "@/zod/models/flashcard.model";
import { z } from "zod";

export const CreateWorldRequestSchema = z.object({
  language: z.string().min(1, "Please select a language"),
  name: z.string().min(1, "Name is required"),
  occupation: z.string().min(1, "Occupation is required"),
  location: z.string().min(1, "Location is required"),
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
  flashcards: z.object({
    // General categories
    introduction: z.array(FlashCardSchema),
    location: z.array(FlashCardSchema),
    occupation: z.array(FlashCardSchema),

    // Interest categories
    reading: z.array(FlashCardSchema),
    cooking: z.array(FlashCardSchema),
    sports: z.array(FlashCardSchema),
    technology: z.array(FlashCardSchema),
    travel: z.array(FlashCardSchema),
    dancing: z.array(FlashCardSchema),
    gaming: z.array(FlashCardSchema),
    art: z.array(FlashCardSchema),
    music: z.array(FlashCardSchema),
    photography: z.array(FlashCardSchema),
    writing: z.array(FlashCardSchema),
    gardening: z.array(FlashCardSchema),

    // Scenario categories
    dining: z.array(FlashCardSchema),
    shopping: z.array(FlashCardSchema),
    healthcare: z.array(FlashCardSchema),
    smallTalk: z.array(FlashCardSchema),
    emergencies: z.array(FlashCardSchema),
    directions: z.array(FlashCardSchema),
    culture: z.array(FlashCardSchema),
    dating: z.array(FlashCardSchema),
  }),
});

export type CreateWorldResponse = z.infer<typeof CreateWorldResponseSchema>;
