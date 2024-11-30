"use client";
import { generateFlashCards } from "@/server/ai/flashcards";
import { useState } from "react";

interface FlashCard {
  id: string;
  sentence: string;
  translation: string;
  isFavorite: boolean;
}

export default function Home() {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [newSentence, setNewSentence] = useState("");
  const [language, setLanguage] = useState<"spanish" | "french" | "german">(
    "spanish"
  );
  const [newTranslation, setNewTranslation] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFlashCard = () => {
    if (newSentence && newTranslation) {
      const newCard: FlashCard = {
        id: window.crypto.randomUUID(),
        sentence: newSentence,
        translation: newTranslation,
        isFavorite: false,
      };
      setFlashCards([...flashCards, newCard]);
      setNewSentence("");
      setNewTranslation("");
    }
  };

  const handleGenerateFlashCards = async () => {
    setIsLoading(true);
    const res = await generateFlashCards(aiPrompt, language);
    const flashcards = res.flashcards.map<FlashCard>((fc) => ({
      id: window.crypto.randomUUID(),
      sentence: fc.sentence,
      translation: fc.translation,
      isFavorite: false,
    }));

    setFlashCards(flashcards);
    setIsLoading(false);
  };

  const handleToggleFavorite = (id: string) => {
    setFlashCards(
      flashCards.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
    );
  };

  const displayedFlashCards = showFavoritesOnly
    ? flashCards.filter((card) => card.isFavorite)
    : flashCards;

  return (
    <div
      className={`grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8 ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <header className="flex justify-between items-center">
        <h1
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-indigo-400" : "text-indigo-700"
          }`}
        >
          Language Study
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <main className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl">Generate Flashcards</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Have AI generate flash cards"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className={`flex-grow border p-2 rounded ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            />
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "spanish" | "french" | "german")
              }
              className={`border p-2 rounded ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              <option value="spanish">🇪🇸 Spanish</option>
              <option value="french">🇫🇷 French</option>
              <option value="german">🇩🇪 German</option>
            </select>
          </div>
          <button
            onClick={handleGenerateFlashCards}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Flash Cards"}
          </button>

          {flashCards.length > 0 && (
            <div>
              <label
                className={`flex items-center gap-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                />
                Show favorites only
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedFlashCards.map((card) => (
              <FlashCard
                key={card.id}
                card={card}
                onToggleFavorite={handleToggleFavorite}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
          <h1 className="text-2xl">Create Flashcards</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter sentence"
              value={newSentence}
              onChange={(e) => setNewSentence(e.target.value)}
              className={`border p-2 rounded flex-grow ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            />
            <input
              type="text"
              placeholder="Enter translation"
              value={newTranslation}
              onChange={(e) => setNewTranslation(e.target.value)}
              className={`border p-2 rounded flex-grow ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            />
          </div>
          <button
            onClick={handleAddFlashCard}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded transition duration-300"
          >
            Add Flash Card
          </button>
        </div>
      </main>
      <footer
        className={`text-center text-sm ${
          isDarkMode ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        © 2024 Language Study App
      </footer>
    </div>
  );
}

function FlashCard({
  card,
  onToggleFavorite,
  isDarkMode,
}: {
  card: FlashCard;
  onToggleFavorite: (id: string) => void;
  isDarkMode: boolean;
}) {
  const [showTranslation, setShowTranslation] = useState(false);

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(card.translation);
    utterance.lang = "es-ES"; // Set Spanish language
    const voice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang === "es-ES");
    if (voice) {
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`border p-4 rounded shadow ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <p
        className={`font-bold mb-2 ${
          isDarkMode ? "text-indigo-400" : "text-indigo-700"
        }`}
      >
        {card.sentence}
      </p>
      {showTranslation && (
        <p className={isDarkMode ? "text-gray-300 mb-2" : "text-gray-700 mb-2"}>
          {card.translation}
        </p>
      )}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={`${
            isDarkMode
              ? "text-indigo-400 hover:text-indigo-300"
              : "text-indigo-600 hover:text-indigo-800"
          } transition duration-300`}
        >
          {showTranslation ? "Hide" : "Show"} Translation
        </button>
        <button
          onClick={handlePlayAudio}
          className={`${
            isDarkMode
              ? "text-emerald-400 hover:text-emerald-300"
              : "text-emerald-600 hover:text-emerald-800"
          } transition duration-300`}
        >
          Play Translation
        </button>
        <button
          onClick={() => onToggleFavorite(card.id)}
          className={`${
            isDarkMode
              ? "text-yellow-400 hover:text-yellow-300"
              : "text-amber-500 hover:text-amber-600"
          } transition duration-300 ${card.isFavorite ? "font-bold" : ""}`}
        >
          {card.isFavorite ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
