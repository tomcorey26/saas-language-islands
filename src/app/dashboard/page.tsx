"use client";
import { PracticeView } from "@/app/dashboard/_components/PracticeView";
import { GenerateView } from "@/app/dashboard/_components/GenerateView";
import Link from "next/link";
import { useState } from "react";
import type { FlashCard, FlashCardViews } from "@/app/dashboard/types";

export default function FlashCards() {
  const [view, setView] = useState<FlashCardViews>("edit");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);

  if (view === "practice") {
    return <PracticeView flashCards={flashCards} setView={setView} />;
  }

  return (
    <>
      <header className="flex justify-between items-center">
        <Link
          href="/"
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-indigo-400" : "text-indigo-700"
          }`}
        >
          Language Study
        </Link>
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
        <GenerateView
          setView={setView}
          isDarkMode={isDarkMode}
          flashCards={flashCards}
          setFlashCards={setFlashCards}
        />
      </main>
      <footer
        className={`text-center text-sm ${
          isDarkMode ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        © 2024 Language Study App
      </footer>
    </>
  );
}
