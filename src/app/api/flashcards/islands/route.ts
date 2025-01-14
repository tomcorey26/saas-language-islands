import { generateIslands } from '@/app/api/openai';
import { FlashCardRequestSchema } from '@/zod/flashCardSchemas';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const requestData = await request.json();

  console.log(requestData);

  // Validate the incoming request data
  const parsedData = FlashCardRequestSchema.safeParse(requestData);
  if (!parsedData.success) {
    console.log(parsedData.error, 'parsedData');
    return NextResponse.json(
      { error: 'Invalid request data', issues: parsedData.error.errors },
      { status: 400 }
    );
  }

  const data = parsedData.data;

  // Generate flashcards using the validated data
  const flashcards = await generateIslands(data.language, data, openAiClient);

  if (!flashcards) {
    return NextResponse.json(
      { error: 'No flashcards generated' },
      { status: 500 }
    );
  }

  return NextResponse.json({ flashcards });
}
