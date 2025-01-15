import { generateIslands } from '@/services/openai';
import { FlashCardRequestSchema } from '@/zod/flashCardSchemas';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { env } from '@/data/env/server';

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

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`,
      {}
    );

    const { success, score } = response.data;

    if (!success || score < 0.5) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return NextResponse.json(
      { error: 'CAPTCHA verification failed' },
      { status: 400 }
    );
  }

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
