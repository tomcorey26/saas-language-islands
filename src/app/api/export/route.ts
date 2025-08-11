import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { CardTable, DeckTable, IslandTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { generateCSV } from "@/lib/export/csvExport";
import { generateAnkiPackage } from "@/lib/export/ankiExport";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format");
    const deckId = searchParams.get("deckId");
    const islandId = searchParams.get("islandId");
    const includeMetadata = searchParams.get("includeMetadata") === "true";

    if (!format || !["csv", "anki"].includes(format)) {
      return NextResponse.json(
        { error: "Invalid format. Use 'csv' or 'anki'" },
        { status: 400 }
      );
    }

    if (!deckId) {
      return NextResponse.json(
        { error: "deckId is required" },
        { status: 400 }
      );
    }

    // Verify the deck belongs to the user
    const deck = await db.query.DeckTable.findFirst({
      where: and(
        eq(DeckTable.id, deckId),
        eq(DeckTable.clerkUserId, userId)
      ),
    });

    if (!deck) {
      return NextResponse.json(
        { error: "Deck not found or unauthorized" },
        { status: 404 }
      );
    }

    // Build the query conditions
    const conditions = [eq(CardTable.deckId, deckId)];
    
    let island = null;
    if (islandId) {
      conditions.push(eq(CardTable.islandId, islandId));
      island = await db.query.IslandTable.findFirst({
        where: eq(IslandTable.id, islandId),
      });
    }

    // Get the cards
    const cards = await db.query.CardTable.findMany({
      where: and(...conditions),
      orderBy: (cards, { asc }) => [asc(cards.position)],
    });

    if (cards.length === 0) {
      return NextResponse.json(
        { error: "No cards found" },
        { status: 404 }
      );
    }

    if (format === "csv") {
      const csvContent = generateCSV(cards, includeMetadata);
      const filename = island 
        ? `${deck.name}-${island.name}-flashcards.csv`
        : `${deck.name}-flashcards.csv`;

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else if (format === "anki") {
      const buffer = await generateAnkiPackage(
        cards,
        deck.name,
        island?.name
      );
      
      const filename = island
        ? `${deck.name}-${island.name}-flashcards.apkg`
        : `${deck.name}-flashcards.apkg`;

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export cards" },
      { status: 500 }
    );
  }
}