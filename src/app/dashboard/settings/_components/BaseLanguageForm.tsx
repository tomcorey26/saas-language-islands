"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  supportedLanguagesArraySorted,
  supportedLanguageCodes,
  SupportedLanguageCode,
} from "@/data/supportedLanguages";
import { updateBaseLanguage } from "@/server/actions/userSettings";
import { CheckCircle2, Loader2 } from "lucide-react";

const FormSchema = z.object({
  baseLanguage: z.enum(supportedLanguageCodes),
});

type FormData = z.infer<typeof FormSchema>;

interface BaseLanguageFormProps {
  currentBaseLanguage: SupportedLanguageCode;
}

export function BaseLanguageForm({
  currentBaseLanguage,
}: BaseLanguageFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      baseLanguage: currentBaseLanguage,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSuccessMessage("");
    setErrorMessage("");

    startTransition(async () => {
      const result = await updateBaseLanguage(data.baseLanguage);

      if (result.success) {
        setSuccessMessage("Language preference updated successfully!");
      } else {
        setErrorMessage(result.error || "Failed to update settings.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base Language</CardTitle>
        <CardDescription>
          Select your native or preferred language. Flashcard phrases will be
          shown in this language, with translations in your target language.
          <span className="block mt-2 text-yellow-700 dark:text-yellow-500 font-medium">
            Note: This will only affect new flashcards. Existing cards will
            remain in your previous base language.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="baseLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Language</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguagesArraySorted.map((lang) => (
                          <SelectItem
                            key={lang.languageCode}
                            value={lang.languageCode}
                          >
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This determines what language the &quot;phrase&quot; field
                    of your flashcards will be in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {successMessage && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="text-red-600 text-sm">{errorMessage}</div>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
