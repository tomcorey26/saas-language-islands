import { db } from "@/drizzle/db";
import { PurchasesTable, UserTable } from "@/drizzle/schema";
import { and, desc, eq, sql, gte } from "drizzle-orm";
import { type CreatePurchaseInput } from "@/zod/contracts/purchase.schema";
import { revalidatePath } from "next/cache";

export async function getUserPurchases(clerkUserId: string) {
  return db.query.PurchasesTable.findMany({
    where: eq(PurchasesTable.clerkUserId, clerkUserId),
    orderBy: [desc(PurchasesTable.createdAt)],
  });
}

export async function getPurchaseBySessionId(sessionId: string) {
  return db.query.PurchasesTable.findFirst({
    where: eq(PurchasesTable.stripeSessionId, sessionId),
  });
}

/**
 * Get recent purchase attempts for rate limiting
 * Returns purchases from the last hour
 */
export async function getRecentPurchaseAttempts(clerkUserId: string) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  return db.query.PurchasesTable.findMany({
    where: and(
      eq(PurchasesTable.clerkUserId, clerkUserId),
      gte(PurchasesTable.createdAt, oneHourAgo)
    ),
    orderBy: [desc(PurchasesTable.createdAt)],
  });
}

export async function createPurchase(data: typeof PurchasesTable.$inferInsert) {
  const [newPurchase] = await db
    .insert(PurchasesTable)
    .values(data)
    .onConflictDoNothing({
      target: PurchasesTable.stripeSessionId,
    })
    .returning({
      id: PurchasesTable.id,
      clerkUserId: PurchasesTable.clerkUserId,
    });

  return newPurchase;
}

export async function updatePurchase(
  data: Partial<typeof PurchasesTable.$inferInsert>,
  { id, userId }: { id: string; userId: string }
) {
  const { rowCount } = await db
    .update(PurchasesTable)
    .set(data)
    .where(
      and(eq(PurchasesTable.clerkUserId, userId), eq(PurchasesTable.id, id))
    );

  if ((rowCount ?? 0) > 0) {
    revalidatePath(`/dashboard/account`);
  }

  return (rowCount ?? 0) > 0;
}

/**
 * Fulfills a purchase by adding tokens and recording the purchase.
 * Uses database transaction for atomicity - all operations succeed or all roll back.
 */
export async function fulfillPurchaseTransaction(
  clerkUserId: string,
  tokensToAdd: number,
  purchaseData: CreatePurchaseInput
) {
  // Idempotency check before starting transaction
  const existingPurchase = await db.query.PurchasesTable.findFirst({
    where: eq(PurchasesTable.stripeSessionId, purchaseData.stripeSessionId),
  });

  if (existingPurchase) {
    console.log(`Purchase already fulfilled for session ${purchaseData.stripeSessionId}`);
    return true;
  }

  await db.transaction(async (tx) => {
    // 1. Record the purchase (claims the session ID)
    const [purchase] = await tx
      .insert(PurchasesTable)
      .values(purchaseData)
      .onConflictDoNothing({
        target: PurchasesTable.stripeSessionId,
      })
      .returning({ id: PurchasesTable.id });

    // If insert returned nothing, another process already claimed this session
    if (!purchase) {
      console.log(`Purchase session ${purchaseData.stripeSessionId} already claimed by another process`);
      return; // Transaction commits with no changes
    }

    // 2. Add tokens to user's balance
    const [userUpdate] = await tx
      .update(UserTable)
      .set({
        tokensBalance: sql`${UserTable.tokensBalance} + ${tokensToAdd}`,
      })
      .where(eq(UserTable.clerkUserId, clerkUserId))
      .returning({ id: UserTable.id });

    if (!userUpdate) {
      throw new Error(`User ${clerkUserId} not found`);
    }

    console.log(`Successfully fulfilled purchase for session ${purchaseData.stripeSessionId}: ${tokensToAdd} tokens added`);
  });

  return true;
}
