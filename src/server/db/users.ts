import { db } from "@/drizzle/db";
import { DeckTable, UserTable } from "@/drizzle/schema";
import { eq, SQL, sql } from "drizzle-orm";

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

export async function updateUser(
  where: SQL,
  data: Partial<typeof UserTable.$inferInsert>
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(where)
    .returning({
      id: UserTable.id,
      clerkUserId: UserTable.clerkUserId,
    });

  return updatedUser;
}

export function addTokensToUser(clerkUserId: string, tokensToAdd: number) {
  return db
    .update(UserTable)
    .set({
      tokensBalance: sql`${UserTable.tokensBalance} + ${tokensToAdd}`,
    })
    .where(eq(UserTable.clerkUserId, clerkUserId));
}

export function deductTokensFromUser(
  clerkUserId: string,
  tokensToDeduct: number
) {
  return db
    .update(UserTable)
    .set({
      tokensBalance: sql`${UserTable.tokensBalance} - ${tokensToDeduct}`,
    })
    .where(eq(UserTable.clerkUserId, clerkUserId));
}

export function deleteUser(clerkUserId: string) {
  return db.batch([
    db.delete(UserTable).where(eq(UserTable.clerkUserId, clerkUserId)),
    db.delete(DeckTable).where(eq(DeckTable.clerkUserId, clerkUserId)),
  ]);
}
