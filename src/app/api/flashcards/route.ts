import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FlashCard = z.object({
  sentence: z.string(),
  translation: z.string(),
});

const FlashCardArray = z.array(FlashCard);

async function generateFlashCards(prompt: string, language: string) {
  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `The user will provide a prompt of a situation, and you need to generate flashcards of useful sentences to study pertaining to the prompt in ${language}. The sentence field is english, and the translation field is ${language}.`,
      },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(
      z.object({ flashcards: FlashCardArray }),
      "flashcard"
    ),
  });

  const flashcards = completion.choices[0].message.parsed;
  return flashcards;
}

export async function POST(request: Request) {
  const { prompt, language } = await request.json();

  const response = await generateFlashCards(prompt, language);

  if (!response) {
    return NextResponse.json(
      { error: "No response from GPT" },
      { status: 500 }
    );
  }

  return NextResponse.json({ flashcards: response.flashcards });
}
