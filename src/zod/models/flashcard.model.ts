import { CardTable } from "@/drizzle/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const FlashCardModel = createSelectSchema(CardTable);

export type FlashCard = z.infer<typeof FlashCardModel>;
