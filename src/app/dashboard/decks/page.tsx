import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";
import { DecksList, DecksListSkeleton } from "@/components/DecksList";

/*
  TODO:
  - Add a login count to the user subscription
  - upon first login, check if the user has cards in local storage
  - if they do, add them to the database. Or just regenerate the deck
  - if they don't, prompt them to generate cards
  - Create UI from https://bolt.new/~/bolt-shadcn-xwqb6qvu
*/

// Cards
// Each card has the deck name and photo
// If no decks added have one with the dash outline, with a plus button in
// the center of the card that says "Create Deck"

// TODO:
// Make it so
// Deck Generation form
// + Add a island name
// + Add a name
// + Add a description
// + Add a photo
// + Add a language
// + Add a category
// + Add a difficulty
// Add card count you want to generate
// add the prompt you want to use to generate the deck (optional)
// can choose to auto translate when editing individual cards
// Can add individual islands to the deck with just the island
// part of the form, creating the world requires multiple of these forms

// The tokens are cheap enough that we can afford to generate a lot of cards
// and show the user a preview. They can then click to generate the rest.
// We can also do it in multiple languages at once.
// Maybe we should limit the size of the users prompt, or add guardrails
// so that they can't just add a raw prompt.
// generate the tts audio using chatgpt api, its way cheaper than using ElevenLabs
// Secure the API's
// https://www.linkedin.com/posts/realmatt_softwareengineering-cybersecurity-softwaredesign-activity-7308020318768402434-n4ub?utm_source=share&utm_medium=member_desktop&rcm=ACoAACikAHUBSa68bBUyW1uu2f2ORNqXgAlMQlY

// Deck of flash cards about the cultrue

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  return (
    <DashboardPageLayout
      pageTitle="Decks"
      actions={
        <Link href="/dashboard/decks/new">
          <Button className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create Deck
          </Button>
        </Link>
      }
      backButtonHref="/dashboard"
    >
      <Suspense fallback={<DecksListSkeleton />}>
        <DecksList userId={userId} />
      </Suspense>
    </DashboardPageLayout>
  );
}
