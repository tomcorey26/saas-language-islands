import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getDeck } from "@/server/db/decks";
import { getStudyStats } from "@/server/db/cards";
import { StudySessionManager } from "./_components/StudySessionManager";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { deckId } = await params;

  const deck = await getDeck({ id: deckId, clerkUserId: userId });
  if (!deck) {
    notFound();
  }

  const stats = await getStudyStats(deckId);

  return (
    <StudySessionManager
      deckId={deckId}
      deckName={deck.name}
      deckLanguage={deck.language}
      stats={stats}
    />
  );
}
