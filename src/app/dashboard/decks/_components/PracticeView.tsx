import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { speak } from "@/lib/textToSpeech";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FlashCard = {
  id: string;
  phrase: string;
  translation: string;
  category: string;
  difficulty: string;
};

type FlashCardViews = "edit" | "practice";

interface PronouncePracticeViewProps {
  flashCards: FlashCard[];
  setView: Dispatch<SetStateAction<FlashCardViews>>;
}

export const PracticeView: React.FC<PronouncePracticeViewProps> = ({
  flashCards,
  setView,
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = useCallback(() => {
    if (currentCardIndex === flashCards.length - 1) {
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  }, [currentCardIndex, flashCards]);

  const handlePreviousCard = useCallback(() => {
    if (currentCardIndex === 0) {
      setCurrentCardIndex(flashCards.length - 1);
    } else {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  }, [currentCardIndex, flashCards]);

  const handleExit = useCallback(() => {
    setView("edit");
  }, [setView]);

  const handlePlayAudio = useCallback(() => {
    speak(flashCards[currentCardIndex].translation, "es-ES");
  }, [currentCardIndex, flashCards]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          handleNextCard();
          break;
        case "ArrowLeft":
          handlePreviousCard();
          break;
        case "Escape":
          handleExit();
          break;
        case " ":
          handlePlayAudio();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentCardIndex,
    flashCards,
    handleNextCard,
    handlePreviousCard,
    handleExit,
    handlePlayAudio,
  ]);

  return (
    <div className="flex flex-col items-center h-screen p-4 space-y-4">
      <div className="flex justify-between w-1/2">
        <span className="text-xl font-bold">
          Card {currentCardIndex + 1} of {flashCards.length}
        </span>

        <Button className="text-xl font-bold" onClick={handleExit}>
          Exit
        </Button>
      </div>
      <Card className="bg-gray-800 border-gray-700 text-indigo-400 w-1/2">
        <CardHeader className="flex items-end"></CardHeader>
        <CardContent className="text-center mb-4 flex flex-col gap-6">
          <h2 className="text-xl">{flashCards[currentCardIndex].phrase}</h2>
          <h2 className="text-xl text-emerald-400 italic">
            {flashCards[currentCardIndex].translation}
          </h2>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex justify-between w-full">
            <button className="text-3xl" onClick={handlePreviousCard}>
              &larr;
            </button>
            <button className="text-3xl" onClick={handlePlayAudio}>
              &#9658;
            </button>
            <button className="text-3xl" onClick={handleNextCard}>
              &rarr;
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
