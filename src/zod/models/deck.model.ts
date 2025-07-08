import { DeckTable } from "@/drizzle/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const DeckModel = createSelectSchema(DeckTable);

export type Deck = z.infer<typeof DeckModel>;
