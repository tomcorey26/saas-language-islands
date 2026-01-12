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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Smile } from "lucide-react";
import {
  CreateDeckRequest,
  CreateDeckRequestSchema,
} from "@/zod/contracts/deck.schema";
import { supportedLanguagesArraySorted } from "@/data/supportedLanguages";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Deck } from "@/zod/models/deck.model";

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      emoji: "🏝️", // Default emoji
      language: "es",
    },
  });

  const handleEmojiSelect = (emoji: string) => {
    form.setValue("emoji", emoji);
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
      form.reset({
        name: deck.name,
        description: deck.description || "",
        emoji: deck.emoji || "🏝️",
        language: deck.language || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        emoji: "🏝️",
        language: "es",
      });
    }
  }, [deck, form]);

  const onSubmit = (data: FormValues) => {
    onSave(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{deck ? "Edit Deck" : "Create New Deck"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter deck name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter deck description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Emoji</FormLabel>
                  <div className="flex items-center gap-4 relative">
                    <div className="flex items-center justify-center w-16 h-16 text-4xl bg-muted rounded-md">
                      {field.value || "🏝️"}
                    </div>
                    <FormControl>
                      <div>
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
                        <input type="hidden" {...field} />
                      </div>
                    </FormControl>

                    {emojiPickerOpen && (
                      <div
                        className={`absolute ${
                          pickerPosition === "bottom"
                            ? "top-full"
                            : "bottom-full"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedLanguagesArraySorted.map((lang) => (
                            <SelectItem key={lang.name} value={lang.name}>
                              {lang.formatName()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
