import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openAiClient = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const DemoRequestSchema = z.object({
  prompt: z.string().min(1).max(100),
});

const DemoResponseSchema = z.object({
  flashcards: z.array(z.object({
    phrase: z.string(),
    translation: z.string(),
  })).length(5),
});

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 3; // 3 requests per 5 minutes per IP

function getRateLimitKey(request: NextRequest): string {
  // Get IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0] || realIp || cfIp || 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(key);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new entry
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return true;
  }

  userLimit.count++;
  return false;
}

function generateDemoPrompt(userPrompt: string): string {
  return `You are creating sample flashcards for a language learning demo. 
  Generate exactly 5 flashcards based on this scenario: "${userPrompt}"
  
  Rules:
  - Each flashcard should have a "phrase" in English and "translation" in the target language
  - Make the flashcards practical and useful for the scenario
  - Include a mix of statements, questions, and common expressions
  - If no specific language is mentioned, default to Spanish
  - Keep phrases conversational and realistic
  - Ensure variety in the types of phrases (greetings, questions, responses, etc.)
  
  Example scenario: "Ordering coffee in Spanish"
  Should produce flashcards like:
  - "Can I have a coffee, please?" → "¿Puedo tomar un café, por favor?"
  - "How much does it cost?" → "¿Cuánto cuesta?"
  - etc.`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const requestData = await request.json();
    const parsedData = DemoRequestSchema.safeParse(requestData);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request. Please provide a valid prompt.' },
        { status: 400 }
      );
    }

    const { prompt } = parsedData.data;

    // Generate flashcards using OpenAI
    const completion = await openAiClient.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [{ 
        role: "user", 
        content: generateDemoPrompt(prompt) 
      }],
      response_format: zodResponseFormat(
        DemoResponseSchema,
        "demo_response"
      ),
      temperature: 0.7,
    });

    const result = completion.choices[0].message;

    if (result.refusal) {
      throw new Error(result.refusal);
    }

    return NextResponse.json(result.parsed);

  } catch (error) {
    console.error('Demo API error:', error);
    
    // Don't expose internal errors to users
    return NextResponse.json(
      { error: 'Sorry, we couldn\'t generate flashcards right now. Please try again.' },
      { status: 500 }
    );
  }
}