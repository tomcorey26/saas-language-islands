import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CreateDeckRequestSchema } from "@/zod/contracts/deck.schema";
import { createDeck } from "@/server/db/decks";

export async function POST(req: Request) {
  const parsedData = CreateDeckRequestSchema.safeParse(await req.json());

  if (!parsedData.success) {
    return NextResponse.json(
      { error: "Invalid request data", issues: parsedData.error.errors },
      { status: 400 }
    );
  }

  try {
    const authResult = await auth();
    const userId = authResult.userId;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = parsedData.data;

    const deck = await createDeck({
      name,
      clerkUserId: userId,
      description: "",
      imageUrl: "",
      languages: [],
    });

    return NextResponse.json({ deckId: deck.id });
  } catch (error) {
    console.error("Error creating deck:", error);
    return new NextResponse("Error creating deck", { status: 500 });
  }
}
