import { db } from "@/drizzle/db";
import { PurchasesTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export function getUserPurchases(userId: string) {
  return db.query.PurchasesTable.findMany({
    where: eq(PurchasesTable.clerkUserId, userId),
    orderBy: [desc(PurchasesTable.createdAt)],
  });
}

export function createPurchase(data: typeof PurchasesTable.$inferInsert) {
  return db.insert(PurchasesTable).values(data);
}