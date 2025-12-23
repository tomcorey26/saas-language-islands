import { z } from "zod";
import { DeckTable } from "@/drizzle/schema";
import { createInsertSchema } from "drizzle-zod";
import {
  SupportedLanguageCode,
  supportedLanguages,
} from "@/data/supportedLanguages";

export const CreateDeckRequestSchema = createInsertSchema(DeckTable)
  .omit({
    clerkUserId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name must be less than 100 characters" }),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .max(500, { message: "Description must be less than 500 characters" }),
    language: z.enum(
      Object.values(supportedLanguages).map((lang) => lang.languageCode) as [
        SupportedLanguageCode
      ]
    ),
    emoji: z.string().min(1, { message: "Emoji is required" }),
  });

export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;
