import { FlashCard } from "@/zod/models/flashcard.model";

export function generateCSV(cards: FlashCard[], includeMetadata = false): string {
  if (cards.length === 0) {
    return "";
  }

  const headers = ["Front", "Back"];
  
  if (includeMetadata) {
    headers.push(
      "Difficulty",
      "Ease Factor",
      "Repetitions",
      "Last Reviewed",
      "Next Review",
      "Memory Palace Location",
      "Visual Imagery",
      "Personal Connection"
    );
  }

  const rows = cards.map((card) => {
    const row = [
      escapeCSV(card.phrase),
      escapeCSV(card.translation),
    ];

    if (includeMetadata) {
      row.push(
        card.difficulty || "",
        card.easeFactor ? (card.easeFactor / 100).toFixed(2) : "",
        card.repetitions?.toString() || "0",
        card.lastReviewedAt ? new Date(card.lastReviewedAt).toISOString() : "",
        card.nextReviewAt ? new Date(card.nextReviewAt).toISOString() : "",
        escapeCSV(card.memoryPalaceLocation || ""),
        escapeCSV(card.visualImagery || ""),
        escapeCSV(card.personalConnection || "")
      );
    }

    return row.join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCSV(
  csvContent: string,
  filename: string = "flashcards.csv"
): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}