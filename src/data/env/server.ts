import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_STARTER_PLAN_STRIPE_PRICE_ID: z.string().min(1),
    STRIPE_PRO_PLAN_STRIPE_PRICE_ID: z.string().min(1),
    STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_STARTER_PLAN_STRIPE_PRICE_ID:
      process.env.STRIPE_STARTER_PLAN_STRIPE_PRICE_ID,
    STRIPE_PRO_PLAN_STRIPE_PRICE_ID:
      process.env.STRIPE_PRO_PLAN_STRIPE_PRICE_ID,
    STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID:
      process.env.STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID,
  },
});
