import { z } from "zod";
import { DeckTable } from "@/drizzle/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const DeckModel = createSelectSchema(DeckTable);

export type Deck = z.infer<typeof DeckModel>;

export const CreateDeckRequestSchema = createInsertSchema(DeckTable)
  .omit({
    clerkUserId: true,
  })
  .extend({
    languages: z.array(z.string()).refine((value) => value.length > 0, {
      message: "Please select at least one language",
    }),
    emoji: z.string().default("🏝️"),
  });

export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;
