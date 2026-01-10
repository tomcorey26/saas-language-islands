import { Deck } from "@/zod/models/deck.model";
import { Island } from "@/zod/models/island.model";
import { FlashCard } from "@/zod/models/flashcard.model";

/**
 * Type for a deck with its nested islands and cards
 */
export type DeckWithCards = Deck & {
  islands: (Island & { cards: FlashCard[] })[];
};

/**
 * Sanitizes a deck name to create a safe filename
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Limits to 50 characters
 */
export function sanitizeFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, "-") // spaces to hyphens
      .replace(/[^\w-]/g, "") // remove special chars
      .replace(/^-+|-+$/g, "") // trim hyphens
      .substring(0, 50) || "deck" // limit length with fallback
  );
}

/**
 * Escapes a field for CSV format by wrapping in quotes and escaping internal quotes
 */
function escapeCsvField(field: string): string {
  // Escape quotes by doubling them
  const escaped = field.replace(/"/g, '""');
  // Always quote fields for consistency
  return `"${escaped}"`;
}

/**
 * Exports a deck to CSV format with Front and Back columns
 * @param deck - The deck with islands and cards to export
 * @returns CSV string with header row
 */
export function exportDeckToCsv(deck: DeckWithCards): string {
  const rows: string[] = ["Front,Back"]; // Header

  for (const island of deck.islands) {
    for (const card of island.cards) {
      const front = escapeCsvField(card.phrase);
      const back = escapeCsvField(card.translation);
      rows.push(`${front},${back}`);
    }
  }

  return rows.join("\n");
}

/**
 * Exports a deck to Anki text format (tab-delimited)
 * @param deck - The deck with islands and cards to export
 * @returns Tab-delimited text with no header
 */
export function exportDeckToAnki(deck: DeckWithCards): string {
  const rows: string[] = [];

  for (const island of deck.islands) {
    for (const card of island.cards) {
      // Replace actual newlines with \n for Anki compatibility
      const front = card.phrase.replace(/\n/g, "\\n");
      const back = card.translation.replace(/\n/g, "\\n");
      rows.push(`${front}\t${back}`);
    }
  }

  return rows.join("\n");
}

/**
 * Triggers a file download in the browser
 * @param content - The file content as a string
 * @param filename - The name for the downloaded file
 * @param mimeType - The MIME type of the file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  // Create a Blob from the content
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
