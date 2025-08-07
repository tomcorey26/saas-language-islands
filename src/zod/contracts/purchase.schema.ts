import { z } from "zod";

export const CreatePurchaseSchema = z.object({
  clerkUserId: z.string().min(1, "User ID is required"),
  tokensPurchased: z
    .number()
    .int()
    .positive("Tokens purchased must be a positive integer"),
  amountPaidCents: z
    .number()
    .int()
    .positive("Amount paid must be a positive integer"),
  stripeSessionId: z.string().min(1, "Stripe session ID is required"),
  stripePaymentIntentId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});

export const GetUserPurchasesSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const GetPurchaseBySessionIdSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export type CreatePurchaseInput = z.infer<typeof CreatePurchaseSchema>;
export type GetUserPurchasesInput = z.infer<typeof GetUserPurchasesSchema>;
export type GetPurchaseBySessionIdInput = z.infer<
  typeof GetPurchaseBySessionIdSchema
>;
