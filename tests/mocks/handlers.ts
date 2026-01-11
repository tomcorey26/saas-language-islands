import { http, HttpResponse } from "msw";

/**
 * MSW handlers for mocking API requests in tests
 * Add your API endpoint mocks here
 */
export const handlers = [
  // Example: Mock OpenAI API for flashcard generation
  http.post("https://api.openai.com/v1/chat/completions", () => {
    return HttpResponse.json({
      id: "chatcmpl-test",
      object: "chat.completion",
      created: 1234567890,
      model: "gpt-4",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              islands: [
                {
                  name: "Test Island",
                  description: "A test island for learning",
                  cards: [
                    {
                      front: "Hello",
                      back: "Hola",
                      emoji: "👋",
                    },
                  ],
                },
              ],
            }),
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30,
      },
    });
  }),

  // Example: Mock Stripe API
  http.post("https://api.stripe.com/v1/checkout/sessions", () => {
    return HttpResponse.json({
      id: "cs_test_123",
      object: "checkout.session",
      url: "https://checkout.stripe.com/test",
    });
  }),

  // Add your app's internal API mocks here
  // Example:
  // http.get('/api/decks', () => {
  //   return HttpResponse.json([
  //     { id: 1, name: 'Spanish Basics', language: 'Spanish' }
  //   ]);
  // }),
];
