import { supportedLanguageCodes } from "@/data/supportedLanguages";
import { z } from "zod";

export const DemoRequestSchema = z.object({
  prompt: z.string().min(1).max(100),
  language: z.enum(supportedLanguageCodes),
});

export const DemoResponseSchema = z.object({
  flashcards: z
    .array(
      z.object({
        phrase: z.string().min(1).max(150),
        translation: z.string().min(1).max(150),
      })
    )
    .length(5),
});

export type DemoResponse = z.infer<typeof DemoResponseSchema>;
