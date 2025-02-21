import { z } from "zod";

// Private fields
const FlashCardPreviewSchema = z.object({
  category: z.string(),
  phrase: z.string(),
  translation: z.string(),
});

// Public fields
export const CreateWorldRequestSchema = z.object({
  language: z.string().min(1, "Please select a language"),
  name: z.string().min(1, "Name is required"),
  occupation: z.string().min(1, "Occupation is required"),
  location: z.string().min(1, "Location is required"),
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
    introduction: z.array(FlashCardPreviewSchema),
    location: z.array(FlashCardPreviewSchema),
    occupation: z.array(FlashCardPreviewSchema),

    // Interest categories
    reading: z.array(FlashCardPreviewSchema),
    cooking: z.array(FlashCardPreviewSchema),
    sports: z.array(FlashCardPreviewSchema),
    technology: z.array(FlashCardPreviewSchema),
    travel: z.array(FlashCardPreviewSchema),
    dancing: z.array(FlashCardPreviewSchema),
    gaming: z.array(FlashCardPreviewSchema),
    art: z.array(FlashCardPreviewSchema),
    music: z.array(FlashCardPreviewSchema),
    photography: z.array(FlashCardPreviewSchema),
    writing: z.array(FlashCardPreviewSchema),
    gardening: z.array(FlashCardPreviewSchema),

    // Scenario categories
    dining: z.array(FlashCardPreviewSchema),
    shopping: z.array(FlashCardPreviewSchema),
    healthcare: z.array(FlashCardPreviewSchema),
    smallTalk: z.array(FlashCardPreviewSchema),
    emergencies: z.array(FlashCardPreviewSchema),
    directions: z.array(FlashCardPreviewSchema),
    culture: z.array(FlashCardPreviewSchema),
    dating: z.array(FlashCardPreviewSchema),
  }),
});

export type CreateWorldResponse = z.infer<typeof CreateWorldResponseSchema>;
