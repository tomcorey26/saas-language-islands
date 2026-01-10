import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getDeckWithCards } from "@/server/db/decks";
import { ConversationalStudyMode } from "./_components/ConversationalStudyMode";

export default async function ConversationalStudyPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { deckId } = await params;
  const deck = await getDeckWithCards(deckId);

  if (!deck) {
    notFound();
  }

  return <ConversationalStudyMode deckId={deckId} deckName={deck.name} />;
}
