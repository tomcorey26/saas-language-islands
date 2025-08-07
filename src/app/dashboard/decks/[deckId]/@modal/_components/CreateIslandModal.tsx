"use client";

import { generateIslandAction } from "@/app/dashboard/decks/[deckId]/actions";
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

import { useToast } from "@/hooks/use-toast";
import {
  CreateIslandRequest,
  CreateIslandRequestSchema,
} from "@/zod/contracts/island.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, CreditCard, AlertTriangle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

// TOMDO: add limits to the prompt and the count, refactor to shadcn/ui form
// Make it so after it generates it switches to the new island tab
// Update cursor rules, to do tdd
export function CreateIslandModal({
  deckId,
  userTokens,
}: {
  deckId: string;
  userTokens: number;
}) {
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get("createIsland") === "true";

  const [isGenerating, setIsGenerating] = useState(false);
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
    form.reset();
    router.replace(`/dashboard/decks/${deckId}`);
  }

  const onSubmit = async (data: Omit<CreateIslandRequest, "deckId">) => {
    setIsGenerating(true);

    const result = await generateIslandAction({
      deckId,
      count: data.count,
      prompt: data.prompt,
    });

    if (result?.message) {
      toast({
        title: result.error ? "Error" : "Success",
        description: result.message,
        variant: result.error ? "destructive" : "default",
      });
    }

    // TOMDO: make it so it switches to the new island tab after generating
    if (!result?.error) {
      closeModal();
    }

    setIsGenerating(false);
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => (open ? null : closeModal())}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Generate New Island
          </DialogTitle>
          <DialogDescription>
            Create a new island with AI-generated flashcards. The island name
            will be automatically generated based on your prompt.
          </DialogDescription>

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
