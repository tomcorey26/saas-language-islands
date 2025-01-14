import { generateIslands } from '@/services/openai';
import { FlashCardRequestSchema } from '@/zod/flashCardSchemas';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestData = await request.json();

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
  const flashcards = await generateIslands(data);

  if (!flashcards) {
    return NextResponse.json(
      { error: 'No flashcards generated' },
      { status: 500 }
    );
  }

  return NextResponse.json({ flashcards });
}
