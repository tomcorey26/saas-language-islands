import { CreateIslandModal } from "@/app/dashboard/decks/[deckId]/@modal/_components/CreateIslandModal";
import { auth } from "@clerk/nextjs/server";

export default async function ModalPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ createIsland?: string }>;
  params: Promise<{ deckId: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const { deckId } = await params;

  const { createIsland } = await searchParams;

  return createIsland ? <CreateIslandModal deckId={deckId} /> : null;
}
