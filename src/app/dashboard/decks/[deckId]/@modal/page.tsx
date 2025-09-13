import { CreateIslandStreamingModal } from "@/app/dashboard/decks/[deckId]/@modal/_components/CreateIslandStreamingModal";
import { DeleteIslandDialog } from "@/app/dashboard/decks/[deckId]/_components/ui/DeleteIslandDialog";
import { getUser } from "@/server/db/users";
import { auth } from "@clerk/nextjs/server";

export default async function ModalPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const { deckId } = await params;

  const user = await getUser(userId);

  if (!user) return redirectToSignIn();

  return (
    <>
      <DeleteIslandDialog />
      <CreateIslandStreamingModal deckId={deckId} userTokens={user.tokensBalance} />
    </>
  );
}
