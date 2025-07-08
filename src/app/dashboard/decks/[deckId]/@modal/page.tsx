import { CreateIslandModal } from "@/app/dashboard/decks/[deckId]/@modal/_components/CreateIslandModal";
import { DeleteIslandDialog } from "@/app/dashboard/decks/[deckId]/_components/ui/DeleteIslandDialog";
import { auth } from "@clerk/nextjs/server";

export default async function ModalPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const { deckId } = await params;

  return (
    <>
      <DeleteIslandDialog />
      <CreateIslandModal deckId={deckId} />
    </>
  );
}
