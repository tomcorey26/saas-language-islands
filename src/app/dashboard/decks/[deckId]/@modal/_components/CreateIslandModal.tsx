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
import { Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// TODO: add limits to the prompt and the count, refactor to shadcn/ui form
// Make it so after it generates it switches to the new island tab
// Update cursor rules, to do tdd
export function CreateIslandModal({ deckId }: { deckId: string }) {
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

  console.log("Form state:", form.formState.errors);

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
        </DialogHeader>
        <Form {...form}>
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
                  <p className="text-xs text-gray-500">
                    Generate up to 20 cards per island
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Generation Prompt</FormLabel>
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
                disabled={isGenerating}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                {isGenerating ? "Generating..." : "Generate Cards"}
                {!isGenerating && <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
