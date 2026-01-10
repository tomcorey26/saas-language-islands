import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getDeckWithCards } from "@/server/db/decks";
import { ListeningStudyMode } from "./_components/ListeningStudyMode";

export default async function ListeningStudyPage({
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

  return <ListeningStudyMode deckId={deckId} deckName={deck.name} />;
}
