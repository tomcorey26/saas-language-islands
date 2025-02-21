import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FlashCard } from "@/zod/models/flashcard.model";
import { CreateFlashCardRequest } from "@/zod/contracts/flashcard.schema";

interface FlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (card: Pick<FlashCard, "phrase" | "translation">) => void;
  card?: FlashCard | null;
}

export default function FlashcardDialog({
  open,
  onOpenChange,
  onSave,
  card,
}: FlashcardDialogProps) {
  const { register, handleSubmit, reset } = useForm<
    Pick<CreateFlashCardRequest, "phrase" | "translation">
  >({
    defaultValues: {
      phrase: "",
      translation: "",
    },
  });

  useEffect(() => {
    if (card) {
      reset({ phrase: card.phrase, translation: card.translation });
    } else {
      reset({ phrase: "", translation: "" });
    }
  }, [card, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {card ? "Edit Flashcard" : "Create Flashcard"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            onSave(data);
            reset();
          })}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="phrase">Phrase</Label>
            <Input
              id="phrase"
              placeholder="Enter the question or prompt"
              {...register("phrase", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="translation">Translation</Label>
            <Textarea
              id="translation"
              placeholder="Enter the answer or explanation"
              {...register("translation", { required: true })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{card ? "Save Changes" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
