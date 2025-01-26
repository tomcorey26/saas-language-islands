'use client';
import { useState } from 'react';

export default function FlashCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={`grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8 bg-gray-100 text-gray-800`}
    >
      {children}
    </div>
  );
}
