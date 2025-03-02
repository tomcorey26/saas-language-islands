import { db } from "@/drizzle/db";
import { DeckTable, UserSubscriptionTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function deleteUser(clerkUserId: string) {
  return db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId)),
    db.delete(DeckTable).where(eq(DeckTable.clerkUserId, clerkUserId)),
  ]);
}
