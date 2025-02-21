import FlashcardGrid from "@/app/dashboard/_components/FlashcardGrid";
import Link from "next/link";

/*
  TODO:
  - Add a login count to the user subscription
  - upon first login, check if the user has cards in local storage
  - if they do, add them to the database. Or just regenerate the deck
  - if they don't, prompt them to generate cards
  - Create UI from https://bolt.new/~/bolt-shadcn-xwqb6qvu
*/

export default async function Dashboard() {
  // const [view, setView] = useState<FlashCardViews>("edit");
  // const [isDarkMode, setIsDarkMode] = useState(true);
  // const [flashCards, setFlashCards] = useState<FlashCard[]>([]);

  // if (view === "practice") {
  //   return <PracticeView flashCards={flashCards} setView={setView} />;
  // }

  return (
    <>
      <header className="flex justify-between items-center">
        <Link href="/">Language Study</Link>
      </header>
      <main>
        <FlashcardGrid />
      </main>
      <footer className="text-center text-sm">© 2024 Language Study App</footer>
    </>
  );
}
