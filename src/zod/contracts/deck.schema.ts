import { z } from "zod";
import { DeckTable } from "@/drizzle/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  SupportedLanguageCode,
  supportedLanguages,
} from "@/data/supportedLanguages";

export const DeckModel = createSelectSchema(DeckTable);

export type Deck = z.infer<typeof DeckModel>;

export const CreateDeckRequestSchema = createInsertSchema(DeckTable)
  .omit({
    clerkUserId: true,
  })
  .extend({
    name: z.string().min(1, { message: "Name is required" }),
    language: z.enum(
      Object.values(supportedLanguages).map((lang) => lang.languageCode) as [
        SupportedLanguageCode
      ]
    ),
    emoji: z.string().default("🏝️"),
  });

export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;
