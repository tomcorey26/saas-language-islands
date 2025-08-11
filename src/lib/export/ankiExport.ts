import { FlashCard } from "@/zod/models/flashcard.model";
import * as genanki from "genanki-js";

export async function generateAnkiPackage(
  cards: FlashCard[],
  deckName: string,
  islandName?: string
): Promise<ArrayBuffer> {
  const deckId = Math.floor(Math.random() * 1000000000);
  const modelId = Math.floor(Math.random() * 1000000000);
  
  const fullDeckName = islandName 
    ? `${deckName}::${islandName}` 
    : deckName;

  const model = new genanki.Model({
    id: modelId,
    name: "Language Learning Model",
    fields: [
      { name: "Front" },
      { name: "Back" },
      { name: "MemoryPalace" },
      { name: "VisualImagery" },
      { name: "PersonalConnection" },
    ],
    templates: [
      {
        name: "Card 1",
        qfmt: "{{Front}}",
        afmt: `{{FrontSide}}
<hr id="answer">
{{Back}}
{{#MemoryPalace}}
<br><br>
<div style="color: #666; font-size: 0.9em;">
<b>Memory Palace:</b> {{MemoryPalace}}
</div>
{{/MemoryPalace}}
{{#VisualImagery}}
<div style="color: #666; font-size: 0.9em;">
<b>Visual Imagery:</b> {{VisualImagery}}
</div>
{{/VisualImagery}}
{{#PersonalConnection}}
<div style="color: #666; font-size: 0.9em;">
<b>Personal Connection:</b> {{PersonalConnection}}
</div>
{{/PersonalConnection}}`,
      },
    ],
    css: `
.card {
  font-family: arial;
  font-size: 20px;
  text-align: center;
  color: #333;
}
    `,
  });

  const deck = new genanki.Deck(deckId, fullDeckName);

  for (const card of cards) {
    const note = new genanki.Note(model, {
      fields: [
        card.phrase,
        card.translation,
        card.memoryPalaceLocation || "",
        card.visualImagery || "",
        card.personalConnection || "",
      ],
      tags: card.difficulty ? [card.difficulty] : [],
    });

    deck.addNote(note);
  }

  const pkg = new genanki.Package(deck);
  const buffer = await pkg.writeToArrayBuffer();
  
  return buffer;
}

export function downloadAnkiPackage(
  buffer: ArrayBuffer,
  filename: string = "flashcards.apkg"
): void {
  const blob = new Blob([buffer], { type: "application/octet-stream" });
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