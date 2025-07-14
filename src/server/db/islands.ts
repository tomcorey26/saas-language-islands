import { IslandTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function createIsland(island: typeof IslandTable.$inferInsert) {
  const [createdIsland] = await db
    .insert(IslandTable)
    .values(island)
    .returning();

  return createdIsland;
}

export async function deleteIsland(id: string) {
  const { rowCount } = await db
    .delete(IslandTable)
    .where(eq(IslandTable.id, id));

  return rowCount > 0;
}
