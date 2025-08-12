"use client";

import { processStreamedIslandAction } from "@/app/dashboard/decks/[deckId]/actions";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

import { useToast } from "@/hooks/use-toast";
import {
  CreateIslandRequest,
  CreateIslandRequestSchema,
} from "@/zod/contracts/island.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, CreditCard, AlertTriangle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface StreamData {
  type: 'progress' | 'content' | 'complete' | 'error';
  message?: string;
  cardsGenerated?: number;
  totalCards?: number;
  content?: string;
  error?: string;
  card?: { phrase: string; translation: string };
  deckId?: string;
  prompt?: string;
}

interface GeneratedCard {
  phrase: string;
  translation: string;
}

export function CreateIslandStreamingModal({
  deckId,
  userTokens,
}: {
  deckId: string;
  userTokens: number;
}) {
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get("createIsland") === "true";

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [streamedContent, setStreamedContent] = useState("");
  const [canCancel, setCanCancel] = useState(true);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Omit<CreateIslandRequest, "deckId">>({
    resolver: zodResolver(CreateIslandRequestSchema.omit({ deckId: true })),
    defaultValues: {
      count: 5,
      prompt: "",
    },
  });

  const watchedCount = form.watch("count");
  const hasInsufficientTokens = userTokens < watchedCount;
  const hasNoTokens = userTokens === 0;

  function closeModal() {
    if (isGenerating && canCancel) {
      // Reset streaming state
      setIsGenerating(false);
      setStreamProgress(0);
      setProgressMessage("");
      setGeneratedCards([]);
      setStreamedContent("");
      setCanCancel(true);
    }
    form.reset();
    router.replace(`/dashboard/decks/${deckId}`);
  }

  const parseStreamedContent = useCallback((content: string) => {
    const lines = content.split('\n');
    const cards: GeneratedCard[] = [];
    let islandName = '';

    for (const line of lines) {
      if (line.trim().startsWith('{"type":"card"')) {
        try {
          const cardData = JSON.parse(line.trim());
          if (cardData.type === 'card' && cardData.phrase && cardData.translation) {
            cards.push({ phrase: cardData.phrase, translation: cardData.translation });
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      } else if (line.trim().startsWith('{"type":"name"')) {
        try {
          const nameData = JSON.parse(line.trim());
          if (nameData.type === 'name' && nameData.value) {
            islandName = nameData.value;
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
    }

    return { cards, islandName };
  }, []);

  const onSubmit = async (data: Omit<CreateIslandRequest, "deckId">) => {
    setIsGenerating(true);
    setStreamProgress(0);
    setProgressMessage("Starting generation...");
    setGeneratedCards([]);
    setStreamedContent("");
    setCanCancel(true);

    try {
      const response = await fetch('/api/generate-island/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deckId,
          count: data.count,
          prompt: data.prompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate flashcards');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              setCanCancel(false);
              
              // Parse final content and save to database
              const { cards, islandName } = parseStreamedContent(accumulatedContent);
              
              if (cards.length > 0 && islandName) {
                const result = await processStreamedIslandAction({
                  deckId,
                  prompt: data.prompt,
                  islandName,
                  cards,
                  tokensUsed: data.count,
                });

                if (result?.error) {
                  throw new Error(result.message);
                }

                toast({
                  title: "Success",
                  description: result?.message || "Flashcards generated successfully!",
                });

                closeModal();
              } else {
                throw new Error("Failed to parse generated content");
              }
              return;
            }

            try {
              const parsed: StreamData = JSON.parse(data);
              
              if (parsed.type === 'progress') {
                setProgressMessage(parsed.message || "Generating...");
                if (parsed.cardsGenerated !== undefined && parsed.totalCards !== undefined) {
                  setStreamProgress((parsed.cardsGenerated / parsed.totalCards) * 100);
                }
                
                // If this progress update includes a card, add it to our display
                if (parsed.card) {
                  setGeneratedCards(prev => {
                    const exists = prev.some(card => 
                      card.phrase === parsed.card?.phrase && card.translation === parsed.card?.translation
                    );
                    if (!exists) {
                      return [...prev, parsed.card!];
                    }
                    return prev;
                  });
                }
              } else if (parsed.type === 'content') {
                accumulatedContent += parsed.content || '';
                setStreamedContent(accumulatedContent);
              } else if (parsed.type === 'complete') {
                accumulatedContent = parsed.content || accumulatedContent;
                setStreamedContent(accumulatedContent);
                setProgressMessage(parsed.message || "Generation complete!");
                setStreamProgress(100);
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error || 'Unknown streaming error');
              }
            } catch (e) {
              // Ignore JSON parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate flashcards",
        variant: "destructive",
      });
      setIsGenerating(false);
      setCanCancel(true);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => (open ? null : closeModal())}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Generate New Island
              </DialogTitle>
              <DialogDescription>
                Create a new island with AI-generated flashcards. The island name
                will be automatically generated based on your prompt.
              </DialogDescription>
            </div>
            {isGenerating && canCancel && (
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Token Display */}
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-900">
                Available Tokens:{" "}
                <span className="font-bold">{userTokens.toLocaleString()}</span>
              </span>
            </div>
            <Link href="/dashboard/buy">
              <Button variant="outline" size="sm" className="text-xs">
                <CreditCard className="h-3 w-3 mr-1" />
                Buy More
              </Button>
            </Link>
          </div>

          {/* Progress Display */}
          {isGenerating && (
            <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generation Progress</span>
                <span className="text-xs text-gray-600">{Math.round(streamProgress)}%</span>
              </div>
              <Progress value={streamProgress} className="w-full" />
              <p className="text-sm text-gray-600">{progressMessage}</p>
              
              {/* Show generated cards as they come in */}
              {generatedCards.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <p className="text-xs font-medium text-gray-700">Generated Cards:</p>
                  {generatedCards.map((card, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-xs">
                      <div className="font-medium">{card.phrase}</div>
                      <div className="text-gray-600">{card.translation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogHeader>
        
        <Form {...form}>
          {hasNoTokens ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Tokens Available
              </h3>
              <p className="text-muted-foreground mb-4">
                You need tokens to generate flashcards. Purchase tokens to
                continue creating islands.
              </p>
              <div className="flex justify-center">
                <Link href="/dashboard/buy">
                  <Button>
                    <CreditCard className="h-4 w-4" />
                    Buy Tokens
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-4"
            >
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Number of Cards</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        className="h-11"
                        disabled={isGenerating}
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 1 : value);
                        }}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Generate up to 20 cards per island
                      </span>
                      <span
                        className={`font-medium ${
                          hasInsufficientTokens
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {watchedCount} token{watchedCount !== 1 ? "s" : ""}{" "}
                        required
                      </span>
                    </div>

                    {hasInsufficientTokens && (
                      <div className="border border-amber-200 bg-amber-50 p-3 rounded-md flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          You need {watchedCount - userTokens} more token
                          {watchedCount - userTokens !== 1 ? "s" : ""} to
                          generate this many cards.
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Generation Prompt
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Describe what kind of cards you want to generate..."
                          className="min-h-[120px]"
                          disabled={isGenerating}
                          {...field}
                          maxLength={150}
                        />
                        <div className="text-sm text-muted-foreground text-right">
                          {field.value.length}/150 characters
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      For example: &quot;Create beginner-friendly conversational
                      phrases for ordering food in a restaurant&quot;
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isGenerating || hasInsufficientTokens}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  {isGenerating ? "Generating..." : "Generate Cards"}
                  {!isGenerating && <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}