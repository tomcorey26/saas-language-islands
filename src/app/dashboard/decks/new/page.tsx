import { CreateDeckForm } from "@/app/dashboard/decks/new/_components/CreateDeckForm";
import { getDeck } from "@/server/db/decks";
import { CreateDeckRequest } from "@/zod/contracts/deck.schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewDeckPage({
  searchParams,
}: {
  searchParams: Promise<{ deckId?: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  let initialValues: CreateDeckRequest = {
    name: "",
    description: "",
    emoji: "",
    language: "es",
  };

  const { deckId } = await searchParams;

  if (deckId != null) {
    const deck = await getDeck({
      id: deckId,
      clerkUserId: userId,
    });

    if (deck != null) {
      initialValues = {
        name: deck.name,
        description: deck.description,
        emoji: deck.emoji,
        language: deck.language,
      };
    } else {
      redirect("/dashboard/decks/new");
    }
  }

  return <CreateDeckForm initialValues={initialValues} id={deckId} />;
}
