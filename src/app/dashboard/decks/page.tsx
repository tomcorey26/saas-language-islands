import { auth } from "@clerk/nextjs/server";
import { getDecks } from "@/server/db/decks";
import { Button } from "@/components/ui/button";
import DeckItem from "@/app/dashboard/decks/_components/DeckItem";
import Link from "next/link";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { Sparkles } from "lucide-react";

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

  const decks = await getDecks(userId, { limit: 10 });

  return (
    <DashboardPageLayout
      pageTitle="Decks"
      actions={
        <Link href="/dashboard/decks/new">
          <Button className="flex items-center gap-2" variant="secondary">
            <Sparkles className="h-4 w-4" />
            Create Deck
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.length === 0 ? (
          <Link href="/dashboard/decks/new">
            <Button
              variant="outline"
              className="h-[300px] border-dashed w-full"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-6xl mb-2">🏝️</div>
                <span className="text-lg font-medium">
                  Create Your First Deck
                </span>
                <div className="flex items-center gap-2 text-2xl">+</div>
              </div>
            </Button>
          </Link>
        ) : (
          decks.map((deck) => <DeckItem key={deck.id} deck={deck} />)
        )}
      </div>
    </DashboardPageLayout>
  );
}
