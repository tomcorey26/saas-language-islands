"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
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
import { CreateDeckRequestSchema } from "@/zod/contracts/deck.schema";
import { supportedLanguagesArray } from "@/data/supportedLanguages";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createDeck, updateDeck } from "@/app/dashboard/decks/actions";
import EmojiPicker from "emoji-picker-react";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { toast } from "@/hooks/use-toast";
import { CreateDeckRequest } from "@/zod/contracts/deck.schema";

export function CreateDeckForm({
  initialValues,
  id,
}: {
  initialValues: CreateDeckRequest;
  id?: string;
}) {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const form = useForm<CreateDeckRequest>({
    resolver: zodResolver(CreateDeckRequestSchema),
    defaultValues: {
      name: initialValues.name,
      description: initialValues.description,
      emoji: initialValues.emoji,
      language: initialValues.language,
    },
  });

  const handleEmojiSelect = (emoji: string) => {
    form.setValue("emoji", emoji);
    setEmojiPickerOpen(false);
  };

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

  const onSubmit = async (data: CreateDeckRequest) => {
    let result;
    if (id == null) {
      result = await createDeck(data);
    } else {
      result = await updateDeck(id, data);
    }

    if (result?.message) {
      toast({
        title: result.error ? "Error" : "Success",
        description: result.message,
        variant: result.error ? "destructive" : "default",
      });
    }
  };

  return (
    <DashboardPageLayout
      pageTitle={id == null ? "Create Deck" : "Edit Deck"}
      backButtonHref="/dashboard/decks"
    >
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguagesArray.map((lang) => (
                          <SelectItem
                            key={lang.languageCode}
                            value={lang.languageCode}
                          >
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
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting
                ? "Saving..."
                : id == null
                ? "Create Deck"
                : "Update Deck"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardPageLayout>
  );
}
