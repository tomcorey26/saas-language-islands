import { z } from "zod";
import { DeckTable } from "@/drizzle/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const DeckModel = createSelectSchema(DeckTable);

export type Deck = z.infer<typeof DeckModel>;

export const CreateDeckRequestSchema = createInsertSchema(DeckTable);

export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;
