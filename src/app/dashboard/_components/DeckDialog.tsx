import { useEffect, useState, useRef } from "react";
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
import { Smile, X } from "lucide-react";
import {
  CreateDeckRequest,
  CreateDeckRequestSchema,
  Deck,
} from "@/zod/contracts/deck.schema";
import { supportedLanguagesArray } from "@/data/supportedLanguages";
import { formatLanguageName } from "@/lib/formatters";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";

// Lazy load the emoji picker
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="p-4 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    </div>
  ),
});

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
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const [emojiPickerLoaded, setEmojiPickerLoaded] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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
      emoji: "🏝️", // Default emoji
      languages: [],
    },
  });

  const selectedLanguages = watch("languages") || [];
  const selectedEmoji = watch("emoji");

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

  const handleEmojiSelect = (emoji: string) => {
    setValue("emoji", emoji);
    setEmojiPickerOpen(false);
  };

  // Preload the emoji picker when the dialog opens
  useEffect(() => {
    if (open && !emojiPickerLoaded) {
      // Start loading the emoji picker in the background
      import("emoji-picker-react").then(() => {
        setEmojiPickerLoaded(true);
      });
    }
  }, [open, emojiPickerLoaded]);

  // Calculate position when opening the picker
  const toggleEmojiPicker = () => {
    if (!emojiPickerOpen) {
      // Calculate if there's enough space below
      if (emojiButtonRef.current) {
        const buttonRect = emojiButtonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;

        // If less than 450px below (emoji picker height + some margin), position above
        if (spaceBelow < 450) {
          setPickerPosition("top");
        } else {
          setPickerPosition("bottom");
        }
      }
    }
    setEmojiPickerOpen(!emojiPickerOpen);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (deck) {
      reset({
        name: deck.name,
        description: deck.description || "",
        emoji: deck.emoji || "🏝️",
        languages: deck.languages || [],
      });
    } else {
      reset({
        name: "",
        description: "",
        emoji: "🏝️",
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

          <div className="space-y-2">
            <Label>Deck Emoji</Label>
            <div className="flex items-center gap-4 relative">
              <div className="flex items-center justify-center w-16 h-16 text-4xl bg-muted rounded-md">
                {selectedEmoji || "🏝️"}
              </div>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={toggleEmojiPicker}
                ref={emojiButtonRef}
              >
                <Smile className="h-4 w-4" />
                Choose Emoji
              </Button>
              <input type="hidden" {...register("emoji")} />

              {emojiPickerOpen && (
                <div
                  className={`absolute ${
                    pickerPosition === "bottom" ? "top-full" : "bottom-full"
                  } left-0 ${
                    pickerPosition === "bottom" ? "mt-2" : "mb-2"
                  } z-50 bg-background border rounded-md shadow-md`}
                  ref={emojiPickerRef}
                  style={{ maxHeight: "400px" }}
                >
                  <EmojiPicker
                    onEmojiClick={(data) => handleEmojiSelect(data.emoji)}
                    lazyLoadEmojis={true}
                    skinTonesDisabled={true}
                    searchDisabled={false}
                    previewConfig={{ showPreview: false }}
                    width={300}
                    height={350}
                  />
                </div>
              )}
            </div>
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
