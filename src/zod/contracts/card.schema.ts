import { z } from "zod";
import { CardTable } from "@/drizzle/schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const CreateCardRequestSchema = createInsertSchema(CardTable);

export type CreateCardRequest = z.infer<typeof CreateCardRequestSchema>;

export const UpdateCardRequestSchema = createUpdateSchema(CardTable).pick({
  phrase: true,
  translation: true,
  position: true,
  difficulty: true,
});

export type UpdateCardRequest = z.infer<typeof UpdateCardRequestSchema>;
