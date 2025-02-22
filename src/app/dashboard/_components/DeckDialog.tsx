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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  CreateDeckRequest,
  CreateDeckRequestSchema,
  Deck,
} from "@/zod/contracts/deck.schema";
import { supportedLanguagesArray } from "@/data/supportedLanguages";
import { formatLanguageName } from "@/lib/formatters";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface DeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (deck: CreateDeckRequest) => void;
  deck?: Deck | null;
}

const formSchema = CreateDeckRequestSchema;

type FormValues = z.infer<typeof formSchema>;

export default function DeckDialog({
  open,
  onOpenChange,
  onSave,
  deck,
}: DeckDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      languages: [],
    },
  });

  const selectedLanguages = watch("languages") || [];

  const handleLanguageSelect = (language: string) => {
    const current = selectedLanguages;
    if (!current.includes(language)) {
      setValue("languages", [...current, language], { shouldValidate: true });
    }
  };

  const handleLanguageRemove = (language: string) => {
    const current = selectedLanguages;
    setValue(
      "languages",
      current.filter((l) => l !== language),
      { shouldValidate: true }
    );
  };

  useEffect(() => {
    if (deck) {
      reset({
        name: deck.name,
        description: deck.description || "",
        imageUrl: deck.imageUrl,
        languages: deck.languages || [],
      });
    } else {
      reset({
        name: "",
        description: "",
        imageUrl: "",
        languages: [],
      });
    }
  }, [deck, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{deck ? "Edit Deck" : "Create New Deck"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            onSave(data);
            reset();
          })}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter deck name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter deck description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Languages</Label>
              <Select onValueChange={handleLanguageSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Add a language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguagesArray
                    .filter((lang) => !selectedLanguages.includes(lang.name))
                    .map((lang) => (
                      <SelectItem key={lang.name} value={lang.name}>
                        {formatLanguageName(lang)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLanguages.map((lang) => (
                  <Badge
                    key={lang}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => handleLanguageRemove(lang)}
                      className="ml-1 hover:bg-secondary/80 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {errors.languages && (
                <p className="text-sm text-destructive">
                  {errors.languages.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {deck ? "Save Changes" : "Create Deck"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
