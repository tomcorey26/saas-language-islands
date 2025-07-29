import { db } from "@/drizzle/db";
import { DeckTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function createUser(data: typeof UserTable.$inferInsert) {
  return db
    .insert(UserTable)
    .values(data)
    .onConflictDoNothing({ target: UserTable.clerkUserId });
}

export function getUser(userId: string) {
  return db.query.UserTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
  });
}

export function deleteUser(clerkUserId: string) {
  return db.batch([
    db.delete(UserTable).where(eq(UserTable.clerkUserId, clerkUserId)),
    db.delete(DeckTable).where(eq(DeckTable.clerkUserId, clerkUserId)),
  ]);
}
