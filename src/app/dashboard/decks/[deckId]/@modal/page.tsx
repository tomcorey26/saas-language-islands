import { CreateIslandModal } from "@/app/dashboard/decks/[deckId]/@modal/_components/CreateIslandModal";
import { auth } from "@clerk/nextjs/server";

export default async function ModalPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const { deckId } = await params;

  return <CreateIslandModal deckId={deckId} />;
}
