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
import z from "zod";
import { toast } from "@/hooks/use-toast";
import { createIslandAction } from "../../actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useEffect, useReducer, useState } from "react";

// State management types
type ModalView = "form" | "cardSelection";

type ModalState = {
  view: ModalView;
  selectedCards: Set<number>;
  isSaving: boolean;
  lastFormData: { count: number; prompt: string } | null;
  viewingPreviousCards: Flashcard[] | null;
  previousGeneration: {
    cards: Flashcard[];
    prompt: string;
    timestamp: number;
  } | null;
};

type ModalAction =
  | { type: "RESET" }
  | { type: "SET_VIEW"; view: ModalView }
  | { type: "SET_PREVIOUS_GENERATION"; data: ModalState["previousGeneration"] }
  | { type: "START_GENERATION"; formData: { count: number; prompt: string } }
  | { type: "GENERATION_COMPLETE"; cards: Flashcard[]; deckId: string }
  | { type: "TOGGLE_CARD_SELECTION"; index: number }
  | { type: "SELECT_ALL_CARDS"; indices: number[] }
  | { type: "DESELECT_ALL_CARDS" }
  | { type: "START_SAVING" }
  | { type: "SAVE_COMPLETE" }
  | { type: "VIEW_PREVIOUS_GENERATION" }
  | { type: "BACK_TO_FORM" };

const initialState: ModalState = {
  view: "form",
  selectedCards: new Set(),
  isSaving: false,
  lastFormData: null,
  viewingPreviousCards: null,
  previousGeneration: null,
};

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "RESET":
      return initialState;

    case "SET_VIEW":
      return { ...state, view: action.view };

    case "SET_PREVIOUS_GENERATION":
      return { ...state, previousGeneration: action.data };

    case "START_GENERATION":
      return {
        ...state,
        view: "cardSelection",
        lastFormData: action.formData,
        selectedCards: new Set(),
        viewingPreviousCards: null,
      };

    case "GENERATION_COMPLETE":
      // Save to localStorage when generation completes
      if (action.cards.length > 0 && state.lastFormData) {
        try {
          const storageData = {
            cards: action.cards,
            prompt: state.lastFormData.prompt,
            timestamp: Date.now(),
          };
          localStorage.setItem(
            `island-generation-${action.deckId}`,
            JSON.stringify(storageData)
          );
        } catch (error) {
          console.error("Failed to save to localStorage:", error);
        }
      }

      return {
        ...state,
        previousGeneration: {
          cards: action.cards,
          prompt: state.lastFormData?.prompt || "",
          timestamp: Date.now(),
        },
        selectedCards: new Set(action.cards.map((_, index) => index)),
      };

    case "TOGGLE_CARD_SELECTION":
      const newSet = new Set(state.selectedCards);
      if (newSet.has(action.index)) {
        newSet.delete(action.index);
      } else {
        newSet.add(action.index);
      }
      return { ...state, selectedCards: newSet };

    case "SELECT_ALL_CARDS":
      return { ...state, selectedCards: new Set(action.indices) };

    case "DESELECT_ALL_CARDS":
      return { ...state, selectedCards: new Set() };

    case "START_SAVING":
      return { ...state, isSaving: true };

    case "SAVE_COMPLETE":
      return { ...state, isSaving: false };

    case "VIEW_PREVIOUS_GENERATION":
      if (!state.previousGeneration) return state;
      return {
        ...state,
        view: "cardSelection",
        lastFormData: {
          count: state.previousGeneration.cards.length,
          prompt: state.previousGeneration.prompt,
        },
        selectedCards: new Set(
          state.previousGeneration.cards.map((_, index) => index)
        ),
        viewingPreviousCards: state.previousGeneration.cards,
      };

    case "BACK_TO_FORM":
      return {
        ...state,
        view: "form",
        selectedCards: new Set(),
        viewingPreviousCards: null,
      };

    default:
      return state;
  }
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
  const router = useRouter();

  // Use reducer for complex state management
  const [state, dispatch] = useReducer(modalReducer, initialState);

  // Track tokens deducted from successful generations
  const [deductedTokens, setDeductedTokens] = useState(0);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/use-island",
    schema: z.array(flashcardSchema),
    onFinish: (result) => {
      // Auto-select all completed cards when generation finishes
      const completed =
        result.object?.filter(
          (card): card is Flashcard => !!(card?.phrase && card?.translation)
        ) || [];

      dispatch({ type: "GENERATION_COMPLETE", cards: completed, deckId });

      // Update deducted tokens after successful generation
      if (completed.length > 0 && state.lastFormData) {
        setDeductedTokens((prev) => prev + state.lastFormData!.count);
      }
    },
  });

  const form = useForm<Omit<CreateIslandRequest, "deckId" | "cards">>({
    resolver: zodResolver(
      CreateIslandRequestSchema.omit({ deckId: true, cards: true })
    ),
    defaultValues: {
      count: 5,
      prompt: "",
    },
  });

  // Calculate current tokens as derived state
  const currentTokens = userTokens - deductedTokens;

  const watchedCount = form.watch("count");
  const hasInsufficientTokens = currentTokens < watchedCount;
  const hasNoTokens = currentTokens === 0;

  // Load previous generation from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`island-generation-${deckId}`);
      if (stored) {
        const data = JSON.parse(stored);
        dispatch({ type: "SET_PREVIOUS_GENERATION", data });
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

  const closeModal = () => {
    form.reset();
    dispatch({ type: "RESET" });
    setDeductedTokens(0);
    router.replace(`/dashboard/decks/${deckId}`);
  };

  const onSubmit = async (
    data: Omit<CreateIslandRequest, "deckId" | "cards">
  ) => {
    dispatch({ type: "START_GENERATION", formData: data });

    submit({
      deckId,
      count: data.count,
      prompt: data.prompt,
    });

    toast({
      title: "Island Generation Started",
      description: `Your islands are being generated. Tokens will be deducted after successful generation.`,
    });
  };

  const toggleCardSelection = (index: number) => {
    dispatch({ type: "TOGGLE_CARD_SELECTION", index });
  };

  const selectAllCards = () => {
    const cardsToUse = state.viewingPreviousCards || completedCards;
    const allIndices = cardsToUse.map((_, index) => index);
    dispatch({ type: "SELECT_ALL_CARDS", indices: allIndices });
  };

  const deselectAllCards = () => {
    dispatch({ type: "DESELECT_ALL_CARDS" });
  };

  const handleSaveIsland = async () => {
    if (!state.lastFormData) return;

    // Use previous cards if viewing them, otherwise use current completed cards
    const cardsToUse = state.viewingPreviousCards || completedCards;
    const selectedCardData = cardsToUse
      .filter((_, index) => state.selectedCards.has(index))
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

    dispatch({ type: "START_SAVING" });

    // Use the correct prompt - from previous generation if viewing previous, otherwise from lastFormData
    const promptToUse =
      state.viewingPreviousCards && state.previousGeneration
        ? state.previousGeneration.prompt
        : state.lastFormData.prompt;

    const result = await createIslandAction({
      deckId,
      prompt: promptToUse,
      count: selectedCardData.length,
      cards: selectedCardData,
    });

    dispatch({ type: "SAVE_COMPLETE" });

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
  };

  const goBackToForm = () => {
    dispatch({ type: "BACK_TO_FORM" });
  };

  const handleRegenerate = () => {
    if (!state.lastFormData) return;
    dispatch({ type: "BACK_TO_FORM" });
    onSubmit(state.lastFormData);
  };

  const viewPreviousGeneration = () => {
    dispatch({ type: "VIEW_PREVIOUS_GENERATION" });
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => (open ? null : closeModal())}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          {state.view === "cardSelection" ? (
            <CardSelectionView
              completedCards={state.viewingPreviousCards || completedCards}
              selectedCards={state.selectedCards}
              toggleCardSelection={toggleCardSelection}
              selectAllCards={selectAllCards}
              deselectAllCards={deselectAllCards}
              handleSaveIsland={handleSaveIsland}
              handleRegenerate={handleRegenerate}
              goBackToForm={goBackToForm}
              isSaving={state.isSaving}
              isLoading={isLoading && !state.viewingPreviousCards}
              error={error}
              object={state.viewingPreviousCards || object}
              isViewingPrevious={!!state.viewingPreviousCards}
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
                <TokensBalance userTokens={currentTokens} />

                {/* Previous Generation */}
                {state.previousGeneration && (
                  <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <span className="text-sm font-medium text-green-900">
                            Previous Generation Available
                          </span>
                          <p className="text-xs text-green-700">
                            {state.previousGeneration.cards.length} cards •
                            &quot;
                            {state.previousGeneration.prompt.slice(0, 50)}
                            {state.previousGeneration.prompt.length > 50
                              ? "..."
                              : ""}
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
                          </div>

                          {hasInsufficientTokens && (
                            <div className="border border-amber-200 bg-amber-50 p-3 rounded-md flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-amber-800">
                                You need {watchedCount - currentTokens} more
                                token
                                {watchedCount - currentTokens !== 1
                                  ? "s"
                                  : ""}{" "}
                                to generate this many cards.
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
    <div className="flex items-center bg-blue-50 p-3 rounded-lg border">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-blue-900">
          Available Tokens:{" "}
          <span className="font-bold">{userTokens.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}

function NoTokensMessage() {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Tokens Available</h3>
      <p className="text-muted-foreground">
        You have used all your tokens. Each flashcard generation costs 1 token.
      </p>
    </div>
  );
}

function CardSelectionView({
  completedCards,
  selectedCards,
  toggleCardSelection,
  selectAllCards,
  deselectAllCards,
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
  selectAllCards: () => void;
  deselectAllCards: () => void;
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

      <div className="flex flex-col flex-1 min-h-0 space-y-4 py-4">
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

        {/* Select All/Deselect All Buttons */}
        {generationComplete && completedCards.length > 0 && (
          <div className="flex items-center justify-between border-b pb-3">
            <div className="text-sm text-muted-foreground">
              {selectedCount} of {completedCards.length} cards selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllCards}
                disabled={selectedCount === completedCards.length}
                className="text-xs h-8"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAllCards}
                disabled={selectedCount === 0}
                className="text-xs h-8"
              >
                Deselect All
              </Button>
            </div>
          </div>
        )}

        {/* Card List */}
        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
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

        {/* Action Buttons - Fixed at bottom of modal */}
        <div className="mt-auto flex-shrink-0 bg-white/95 backdrop-blur-sm border-t pt-4 space-y-3">
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
