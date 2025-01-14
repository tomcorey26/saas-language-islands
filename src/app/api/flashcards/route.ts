import { generateFlashCards } from '@/app/api/openai';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { prompt, language } = await request.json();

  const response = await generateFlashCards(prompt, language, openAiClient);

  if (!response) {
    return NextResponse.json(
      { error: 'No response from GPT' },
      { status: 500 }
    );
  }

  return NextResponse.json({ flashcards: response.flashcards });
}
