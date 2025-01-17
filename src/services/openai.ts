import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { OpenAI } from 'openai';
import {
  CreateWorldRequest,
  CreateWorldResponseSchema,
} from '@/zod/contracts/world.schema';
import { FlashCardSchema } from '@/zod/models/flashcard.model';

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
      z.object({ flashcards: z.array(FlashCardSchema) }),
      'flashcard'
    ),
  });

  const flashcards_response = completion.choices[0].message;

  if (flashcards_response.refusal) {
    throw new Error(flashcards_response.refusal);
  }

  return flashcards_response.parsed;
}

const generateIslandsPrompt = (request: CreateWorldRequest) => {
  return `
  The user has selected filled out a form related to with their name, occupation, and interests, and you need to generate flashcards of useful sentences 
  that the user can study to become conversant in ${
    request.language
  }. The sentence field is english, and the translation field is ${
    request.language
  }.

  Here is the user's form data:
  ${JSON.stringify(request)} 

  List of things you must do:
  - Generate ${
    request.cardsPerCategory
  } flashcards for each category that the user has selected/are truthy
  - Do not generate flashcards for fields that the user has not selected/are not truthy
  - Make sure the flashcards are relevant to the user's form data and that they don't all begin with I
  - Make sure that the sentences generated are practical and useful for having a conversation with someone in ${
    request.language
  }.
  - Make sure that at least 1 flashcard is a question that the user can ask, and at least 1 flashcard is a statement that the user can make.
  `;
};

export async function generateWorld(request: CreateWorldRequest) {
  const completion = await openAiClient.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: generateIslandsPrompt(request) }],
    response_format: zodResponseFormat(
      CreateWorldResponseSchema,
      'world_response'
    ),
  });

  const world_response = completion.choices[0].message;

  if (world_response.refusal) {
    throw new Error(world_response.refusal);
  }

  return world_response.parsed;
}
