import { generateWorld } from '@/services/openai';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { env } from '@/data/env/server';
import { CreateWorldRequestSchema } from '@/zod/contracts/world.schema';
import { currentUser } from '@clerk/nextjs/server';
import { getUser } from '@/server/db/users';

export async function POST(request: Request) {
  // Authentication check
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Get user data to check token balance
  const dbUser = await getUser(user.id);
  if (!dbUser) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Check if user has tokens (basic authorization)
  if (dbUser.tokenBalance <= 0) {
    return NextResponse.json(
      { error: 'Insufficient tokens. Please purchase tokens to generate content.' },
      { status: 403 }
    );
  }

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
