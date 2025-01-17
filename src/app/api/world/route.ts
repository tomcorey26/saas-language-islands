import { generateWorld } from '@/services/openai';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { env } from '@/data/env/server';
import { CreateWorldRequestSchema } from '@/zod/contracts/world.schema';

export async function POST(request: Request) {
  const requestData = await request.json();

  const parsedData = CreateWorldRequestSchema.safeParse(requestData);

  if (!parsedData.success) {
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
  try {
    const flashcards = await generateWorld(data);

    if (!flashcards) {
      return NextResponse.json(
        { error: 'No flashcards generated' },
        { status: 500 }
      );
    }

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Error generating flashcards' },
      { status: 500 }
    );
  }
}
