import { OpenAI } from "openai";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDeck } from "@/server/db/decks";
import { getUser } from "@/server/db/users";
import { CreateIslandRequestSchema } from "@/zod/contracts/island.schema";
import { SupportedLanguageCode } from "@/data/supportedLanguages";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generateFlashcardsStreamingPrompt(
  prompt: string,
  count: number,
  language: SupportedLanguageCode
) {
  return `You are a helpful assistant that generates flashcards that are useful for a conversation with a native speaker. 
  You will generate sentences in English for the phrase field, and the translation field will be the translation of the sentence in ${language}.
  
  Generate exactly ${count} flashcards based on this prompt: ${prompt}
  
  Please format your response as individual flashcards, one per line, in this exact JSON format:
  {"type":"card","phrase":"English phrase","translation":"${language} translation"}
  
  After all cards, provide a name for this collection in this format:
  {"type":"name","value":"Short descriptive name (2-4 words)"}
  
  Make sure the flashcards are relevant to the prompt and useful for conversation with a native speaker of ${language}.
  Each flashcard should be complete and ready to use for language learning.`;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const parsedData = CreateIslandRequestSchema.safeParse(body);
    
    if (!parsedData.success) {
      return new Response("Invalid request data", { status: 400 });
    }

    const { deckId, prompt, count } = parsedData.data;

    // Verify deck ownership and get user data
    const [deck, user] = await Promise.all([
      getDeck({ id: deckId, clerkUserId: userId }),
      getUser(userId),
    ]);

    if (!deck) {
      return new Response("Deck not found", { status: 404 });
    }

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Check if user has enough tokens
    const tokensRequired = count;
    const availableTokens = user.tokensBalance || 0;

    if (availableTokens < tokensRequired) {
      return new Response(
        `Insufficient tokens. You need ${tokensRequired} tokens but only have ${availableTokens}.`,
        { status: 402 }
      );
    }

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: generateFlashcardsStreamingPrompt(prompt, count, deck.language),
        },
      ],
      stream: true,
      temperature: 0.7,
    });

    // Create a ReadableStream for the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send initial progress
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ 
                type: 'progress', 
                message: 'Starting generation...',
                cardsGenerated: 0,
                totalCards: count 
              })}\n\n`
            )
          );

          let accumulatedContent = '';
          let cardsGenerated = 0;

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              accumulatedContent += content;
              
              // Send content update
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ 
                    type: 'content', 
                    content: content 
                  })}\n\n`
                )
              );

              // Try to parse complete cards from accumulated content
              const lines = accumulatedContent.split('\n');
              for (const line of lines) {
                if (line.trim().startsWith('{"type":"card"')) {
                  try {
                    const cardData = JSON.parse(line.trim());
                    if (cardData.type === 'card' && cardData.phrase && cardData.translation) {
                      cardsGenerated++;
                      // Send progress update
                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify({ 
                            type: 'progress', 
                            message: `Generated ${cardsGenerated} of ${count} cards...`,
                            cardsGenerated,
                            totalCards: count,
                            card: cardData 
                          })}\n\n`
                        )
                      );
                    }
                  } catch {
                    // Ignore JSON parsing errors for incomplete lines
                  }
                }
              }
            }
          }

          // Send final completion message
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ 
                type: 'complete',
                content: accumulatedContent,
                message: 'Generation complete!',
                cardsGenerated,
                totalCards: count,
                deckId,
                prompt
              })}\n\n`
            )
          );

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ 
                type: 'error', 
                error: error instanceof Error ? error.message : 'Unknown error' 
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}