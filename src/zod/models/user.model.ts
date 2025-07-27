import { UserSubscriptionTable } from "@/drizzle/userSubscription";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserSubscriptionModel = createSelectSchema(UserSubscriptionTable);

export type UserSubscription = z.infer<typeof UserSubscriptionModel>;
