import { z } from "zod";
import { CardTable } from "@/drizzle/schema";
import { createInsertSchema } from "drizzle-zod";

export const CreateFlashCardRequestSchema = createInsertSchema(CardTable);

export type CreateFlashCardRequest = z.infer<
  typeof CreateFlashCardRequestSchema
>;
