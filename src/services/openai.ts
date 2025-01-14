import {
  FlashCardArray,
  FlashCardRequestSchema,
  FlashCardResponseSchema,
} from '@/zod/flashCardSchemas';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { OpenAI } from 'openai';
const generateFlashCardsPrompt = (prompt: string, language: string) => {
  return `The user will provide a prompt of a situation, and you need to generate flashcards of useful sentences to study pertaining to the prompt in ${language}. The sentence field is english, and the translation field is ${language}.`;
};

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateFlashCards(prompt: string, language: string) {
  const completion = await openAiClient.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: generateFlashCardsPrompt(prompt, language),
      },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(
      z.object({ flashcards: FlashCardArray }),
      'flashcard'
    ),
  });

  const flashcards = completion.choices[0].message.parsed;
  return flashcards;
}

const generateIslandsPrompt = (
  request: z.infer<typeof FlashCardRequestSchema>
) => {
  return `The user will provide a prompt of a situation, and you need to generate flashcards of useful sentences to study pertaining to the prompt in ${
    request.language
  }. The sentence field is english, and the translation field is ${
    request.language
  }. You will only generate flashcards for the fields that the user has selected/are truthy. You will generate ${
    request.cardsPerCategory
  } flashcards per category. You will only generate flashcards for the fields that the user has selected/are truthy.
  ${JSON.stringify(request)} 
  `;
};

export async function generateIslands(
  request: z.infer<typeof FlashCardRequestSchema>
) {
  const completion = await openAiClient.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: generateIslandsPrompt(request) }],
    response_format: zodResponseFormat(
      FlashCardResponseSchema,
      'flashcard_response'
    ),
  });

  const flashcards = completion.choices[0].message.parsed;
  return flashcards;
}
