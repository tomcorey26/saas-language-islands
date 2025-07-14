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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/hooks/use-toast";
import { CreateIslandRequest } from "@/zod/contracts/island.schema";
import { Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// TOMDO: add limits to the prompt and the count, refactor to shadcn/ui form
// Make it so after it generates it switches to the new island tab
export function CreateIslandModal({ deckId }: { deckId: string }) {
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get("createIsland") === "true";

  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateIslandRequest, "deckId">>(
    {
      name: "",
      count: 10,
      prompt: "",
    }
  );
  const { toast } = useToast();
  const router = useRouter();

  function closeModal() {
    router.replace(`/dashboard/decks/${deckId}`);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const result = await generateIslandAction({
      deckId,
      count: formData.count,
      prompt: formData.prompt,
      name: formData.name,
    });

    if (result?.message) {
      toast({
        title: result.error ? "Error" : "Success",
        description: result.message,
        variant: result.error ? "destructive" : "default",
      });
    }

    if (!result?.error) {
      closeModal();
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => (open ? null : closeModal())}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Generate New Cards
          </DialogTitle>
          <DialogDescription>
            Create a new island with AI-generated flashcards
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Island Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="e.g., Greetings, Business, Travel"
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="count" className="text-base">
              Number of Cards
            </Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={50}
              value={formData.count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  count: parseInt(e.target.value),
                })
              }
              className="h-11"
              required
            />
            <p className="text-xs text-gray-500">
              Generate up to 50 cards per island
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-base">
              Generation Prompt
            </Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Describe what kind of cards you want to generate..."
              className="min-h-[120px]"
              required
            />
            <p className="text-xs text-gray-500">
              For example: &quot;Create beginner-friendly conversational phrases
              for ordering food in a restaurant&quot;
            </p>
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
