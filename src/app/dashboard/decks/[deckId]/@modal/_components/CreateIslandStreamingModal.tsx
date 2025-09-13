"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { DeepPartial } from "ai";
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
import {
  CreateIslandRequest,
  CreateIslandRequestSchema,
} from "@/zod/contracts/island.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  CreditCard,
  AlertTriangle,
  Loader2,
  CheckCircle,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Flashcard,
  flashcardSchema,
} from "@/zod/contracts/islandStream.schema";
import Link from "next/link";
import z from "zod";
import { toast } from "@/hooks/use-toast";
import { createIslandAction } from "../../actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo, useEffect, useRef } from "react";

export function CreateIslandStreamingModal({
  deckId,
  userTokens,
}: {
  deckId: string;
  userTokens: number;
}) {
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get("createIsland") === "true";

  // Use a ref to hold the form data for the onFinish callback
  const formDataRef = useRef<{ count: number; prompt: string } | null>(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/use-island",
    schema: z.array(flashcardSchema),
    onFinish: (result) => {
      // Auto-select all completed cards when generation finishes
      const completed =
        result.object?.filter(
          (card): card is Flashcard => !!(card?.phrase && card?.translation)
        ) || [];

      // Save to localStorage using the ref
      if (completed.length > 0 && formDataRef.current) {
        const storageData = {
          cards: completed,
          prompt: formDataRef.current.prompt,
          timestamp: Date.now(),
        };
        console.log("Saving to localStorage:", { storageData, formDataRef: formDataRef.current });
        localStorage.setItem(
          `island-generation-${deckId}`,
          JSON.stringify(storageData)
        );
      }

      setSelectedCards(new Set(completed.map((_, index) => index)));
      setShowCardSelection(true);
    },
  });

  const router = useRouter();

  // State for card selection phase
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [lastFormData, setLastFormData] = useState<{
    count: number;
    prompt: string;
  } | null>(null);
  const [viewingPreviousCards, setViewingPreviousCards] = useState<
    Flashcard[] | null
  >(null);

  // State for previous generation
  const [previousGeneration, setPreviousGeneration] = useState<{
    cards: Flashcard[];
    prompt: string;
    timestamp: number;
  } | null>(null);

  const form = useForm<Omit<CreateIslandRequest, "deckId" | "cards">>({
    resolver: zodResolver(
      CreateIslandRequestSchema.omit({ deckId: true, cards: true })
    ),
    defaultValues: {
      count: 5,
      prompt: "",
    },
  });

  const watchedCount = form.watch("count");
  const hasInsufficientTokens = userTokens < watchedCount;
  const hasNoTokens = userTokens === 0;

  // Load previous generation from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`island-generation-${deckId}`);
      if (stored) {
        const data = JSON.parse(stored);
        console.log("Loaded from localStorage:", data);
        setPreviousGeneration(data);
      }
    } catch (error) {
      console.error("Failed to load previous generation:", error);
    }
  }, [deckId]);

  // Initialize completed cards when object is complete
  const completedCards = useMemo(() => {
    return (
      object?.filter(
        (card): card is Flashcard => !!(card?.phrase && card?.translation)
      ) || []
    );
  }, [object]);

  function closeModal() {
    form.reset();
    setShowCardSelection(false);
    setSelectedCards(new Set());
    setIsSaving(false);
    setLastFormData(null);
    setViewingPreviousCards(null);
    router.replace(`/dashboard/decks/${deckId}`);
  }

  const onSubmit = async (
    data: Omit<CreateIslandRequest, "deckId" | "cards">
  ) => {
    setLastFormData(data);
    formDataRef.current = data; // Set the ref for onFinish callback
    setShowCardSelection(true); // Switch to card selection immediately
    setSelectedCards(new Set()); // Start with no cards selected
    setViewingPreviousCards(null); // Clear any previous cards being viewed

    submit({
      deckId,
      count: data.count,
      prompt: data.prompt,
    });

    toast({
      title: "Island Generation Started",
      description: `Your islands are being generated, ${data.count} token${
        data.count !== 1 ? "s" : ""
      } will be deducted.`,
    });
  };

  const toggleCardSelection = (index: number) => {
    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSaveIsland = async () => {
    if (!lastFormData) return;

    // Use previous cards if viewing them, otherwise use current completed cards
    const cardsToUse = viewingPreviousCards || completedCards;
    const selectedCardData = cardsToUse
      .filter((_, index) => selectedCards.has(index))
      .map((card) => ({
        phrase: card.phrase,
        translation: card.translation,
      }));

    if (selectedCardData.length === 0) {
      toast({
        title: "No Cards Selected",
        description: "Please select at least one card to save.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Use the correct prompt - from previous generation if viewing previous, otherwise from lastFormData
    const promptToUse = viewingPreviousCards && previousGeneration
      ? previousGeneration.prompt
      : lastFormData.prompt;

    console.log("Saving island with prompt:", { promptToUse, viewingPreviousCards, previousGeneration, lastFormData });

    const result = await createIslandAction({
      deckId,
      prompt: promptToUse,
      count: selectedCardData.length,
      cards: selectedCardData,
    });

    if (result?.error) {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: result?.message || "Island created successfully!",
      });
      closeModal();
    }

    setIsSaving(false);
  };

  const goBackToForm = () => {
    setShowCardSelection(false);
    setSelectedCards(new Set());
    setViewingPreviousCards(null);
  };

  const handleRegenerate = () => {
    if (!lastFormData) return;
    setShowCardSelection(false);
    setSelectedCards(new Set());
    setViewingPreviousCards(null);
    formDataRef.current = lastFormData; // Set the ref for onFinish callback
    onSubmit(lastFormData);
  };

  const viewPreviousGeneration = () => {
    if (!previousGeneration) return;

    // Set up the selection view with previous data
    setLastFormData({
      count: previousGeneration.cards.length,
      prompt: previousGeneration.prompt,
    });
    setSelectedCards(
      new Set(previousGeneration.cards.map((_, index) => index))
    );
    setViewingPreviousCards(previousGeneration.cards);
    setShowCardSelection(true);
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => (open ? null : closeModal())}
      >
        <DialogContent className="w-[95vw] sm:max-w-[800px] max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          {showCardSelection ? (
            <CardSelectionView
              completedCards={viewingPreviousCards || completedCards}
              selectedCards={selectedCards}
              toggleCardSelection={toggleCardSelection}
              handleSaveIsland={handleSaveIsland}
              handleRegenerate={handleRegenerate}
              goBackToForm={goBackToForm}
              isSaving={isSaving}
              isLoading={isLoading && !viewingPreviousCards}
              error={error}
              object={viewingPreviousCards || object}
              isViewingPrevious={!!viewingPreviousCards}
            />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Generate New Island
                </DialogTitle>
                <DialogDescription>
                  Create a new island with AI-generated flashcards. The island
                  name will be automatically generated based on your prompt.
                </DialogDescription>

                {/* Token Display */}
                <TokensBalance userTokens={userTokens} />

                {/* Previous Generation */}
                {previousGeneration && (
                  <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <span className="text-sm font-medium text-green-900">
                            Previous Generation Available
                          </span>
                          <p className="text-xs text-green-700">
                            {previousGeneration.cards.length} cards • &quot;
                            {previousGeneration.prompt.slice(0, 50)}
                            {previousGeneration.prompt.length > 50 ? "..." : ""}
                            &quot;
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={viewPreviousGeneration}
                        className="text-green-700 border-green-300 hover:bg-green-100"
                      >
                        View & Select
                      </Button>
                    </div>
                  </div>
                )}
              </DialogHeader>

              <Form {...form}>
                {hasNoTokens ? (
                  <NoTokensMessage />
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
                          <FormLabel className="text-base">
                            Number of Cards
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={20}
                              className="h-11"
                              disabled={isLoading}
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
                              {watchedCount} token
                              {watchedCount !== 1 ? "s" : ""} required
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
                                disabled={isLoading}
                                {...field}
                                maxLength={150}
                              />
                              <div className="text-sm text-muted-foreground text-right">
                                {field.value.length}/150 characters
                              </div>
                            </div>
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            For example: &quot;Create beginner-friendly
                            conversational phrases for ordering food in a
                            restaurant&quot;
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading || hasInsufficientTokens}
                        className="w-full sm:w-auto flex items-center gap-2"
                      >
                        {isLoading ? "Generating..." : "Generate Cards"}
                        {!isLoading && <Sparkles className="h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                )}
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function TokensBalance({ userTokens }: { userTokens: number }) {
  return (
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
  );
}

function NoTokensMessage() {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Tokens Available</h3>
      <p className="text-muted-foreground mb-4">
        You need tokens to generate flashcards. Purchase tokens to continue
        creating islands.
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
  );
}

function CardSelectionView({
  completedCards,
  selectedCards,
  toggleCardSelection,
  handleSaveIsland,
  handleRegenerate,
  goBackToForm,
  isSaving,
  isLoading,
  error,
  object,
  isViewingPrevious = false,
}: {
  completedCards: Flashcard[];
  selectedCards: Set<number>;
  toggleCardSelection: (index: number) => void;
  handleSaveIsland: () => void;
  handleRegenerate: () => void;
  goBackToForm: () => void;
  isSaving: boolean;
  isLoading: boolean;
  error: Error | undefined;
  object: DeepPartial<Flashcard[]> | undefined;
  isViewingPrevious?: boolean;
}) {
  const allCards = object || [];
  const generationComplete = isViewingPrevious || (!isLoading && !error);
  const selectedCount = selectedCards.size;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          {isViewingPrevious
            ? "Previous Generation"
            : isLoading
            ? "Generating Cards..."
            : "Select Cards to Save"}
        </DialogTitle>
        <DialogDescription>
          {isViewingPrevious
            ? "Review and select cards from your previous generation. You can save the ones you want to keep."
            : isLoading
            ? "Watch as your flashcards are being generated. You can select which ones to keep once generation is complete."
            : "Choose which flashcards you want to keep in your new island. All cards are selected by default."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Generation Progress */}
        {isLoading && !isViewingPrevious && (
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Generating flashcards...
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Generated {allCards.length} flashcard(s)
              <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && !isViewingPrevious && (
          <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">
                Generation Failed
              </span>
            </div>
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}

        {/* Success Message */}
        {generationComplete &&
          completedCards.length > 0 &&
          !isViewingPrevious && (
            <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Successfully generated {completedCards.length} flashcards!
                </span>
              </div>
            </div>
          )}

        {/* Previous Generation Info */}
        {isViewingPrevious && (
          <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Reviewing {completedCards.length} previously generated
                flashcards
              </span>
            </div>
          </div>
        )}

        {/* Card List */}
        <div className="space-y-2 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          {allCards.map((card, index) => {
            const isCompleted =
              isViewingPrevious || !!(card?.phrase && card?.translation);
            const isSelected = selectedCards.has(index);

            return (
              <div
                key={index}
                className={`border rounded-lg p-3 sm:p-4 transition-all duration-300 ${
                  isSelected && generationComplete
                    ? "border-blue-300 bg-blue-50"
                    : isCompleted
                    ? "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-25 active:bg-blue-50"
                    : "border-gray-100 bg-gray-50"
                } ${
                  !isCompleted
                    ? "animate-pulse"
                    : "animate-in slide-in-from-top-2 fade-in"
                } ${
                  generationComplete && isCompleted
                    ? "cursor-pointer touch-manipulation"
                    : "cursor-default"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                  minHeight: "60px", // Ensure good touch target size
                }}
                onClick={() => {
                  if (generationComplete && isCompleted) {
                    toggleCardSelection(index);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCardSelection(index)}
                    disabled={!generationComplete || !isCompleted}
                    className="mt-1 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()} // Prevent double-click when clicking checkbox directly
                  />
                  <div className="flex-1 space-y-2 min-w-0">
                    {" "}
                    {/* min-w-0 for text truncation */}
                    {isCompleted ? (
                      <>
                        <div className="font-medium text-gray-900 text-sm sm:text-base leading-tight">
                          {isViewingPrevious
                            ? (card as Flashcard).phrase
                            : card?.phrase}
                        </div>
                        <div className="text-gray-600 text-sm leading-tight">
                          {isViewingPrevious
                            ? (card as Flashcard).translation
                            : card?.translation}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 sm:h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons - Sticky at bottom of modal */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t mt-4 pt-4 space-y-3">
          {/* Mobile: Stack all buttons */}
          <div className="flex flex-col sm:hidden gap-2">
            <Button
              onClick={handleSaveIsland}
              disabled={isSaving || !generationComplete || selectedCount === 0}
              className="flex items-center justify-center gap-2 w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {generationComplete
                    ? `Save Island (${selectedCount} cards)`
                    : "Waiting for generation..."}
                </>
              )}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={goBackToForm}
                disabled={isSaving || isLoading}
                className="flex items-center justify-center gap-2 flex-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden xs:inline">Back to Form</span>
                <span className="xs:hidden">Back</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isSaving || isLoading}
                className="flex items-center justify-center gap-2 flex-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden xs:inline">Regenerate</span>
                <span className="xs:hidden">Retry</span>
              </Button>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={goBackToForm}
                disabled={isSaving || isLoading}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Form
              </Button>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isSaving || isLoading}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
            <Button
              onClick={handleSaveIsland}
              disabled={isSaving || !generationComplete || selectedCount === 0}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {generationComplete
                    ? `Save Island (${selectedCount} cards)`
                    : "Waiting for generation..."}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
