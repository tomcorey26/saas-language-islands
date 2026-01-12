"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
} from "@/data/supportedLanguages";
import { updateBaseLanguage } from "@/server/actions/userSettings";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  baseLanguage: z.enum(supportedLanguageCodes),
});

type FormData = z.infer<typeof FormSchema>;

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      baseLanguage: "en",
    },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      const result = await updateBaseLanguage(data.baseLanguage);

      if (result.success) {
        toast({
          title: "Welcome!",
          description: "Your language preference has been saved.",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save settings.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="baseLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Your Language</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full text-base py-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguagesArraySorted.map((lang) => (
                      <SelectItem
                        key={lang.languageCode}
                        value={lang.languageCode}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                You can change this later in your settings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
