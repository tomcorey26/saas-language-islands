import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { speak } from "@/lib/textToSpeech";
import { FlashCard, FlashCardViews } from "@/app/flashcards/types";

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
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-200 rounded-lg p-8 w-3/4 h-2/4">
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-end">
            <button className="text-xl font-bold" onClick={handleExit}>
              X
            </button>
          </div>
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">
              {flashCards[currentCardIndex].sentence}
            </h2>
            <h2 className="text-xl font-bold">
              {flashCards[currentCardIndex].translation}
            </h2>
          </div>
          <div className="flex justify-between">
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
          </div>
        </div>
      </div>
    </div>
  );
};
