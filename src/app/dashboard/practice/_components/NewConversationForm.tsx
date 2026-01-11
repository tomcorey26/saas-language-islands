"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { promptSuggestions } from "@/data/conversationPromptSuggestions";
import { TOKEN_COSTS } from "@/data/tokenCosts";
import { supportedLanguagesArraySorted } from "@/data/supportedLanguages";
import {
  startConversationRequestSchema,
  type StartConversationRequest,
} from "@/zod/contracts/conversation.schema";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TokenBalanceInfo } from "./TokenBalanceInfo";

interface NewConversationFormProps {
  userTokens: number;
  onBack: () => void;
}

export function NewConversationForm({
  userTokens,
  onBack,
}: NewConversationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const hasEnoughTokens = userTokens >= TOKEN_COSTS.CONVERSATION;

  const form = useForm<StartConversationRequest>({
    resolver: zodResolver(startConversationRequestSchema),
    defaultValues: {
      customPrompt: "",
      targetLanguage: "",
    },
  });

  const { isSubmitting } = form.formState;
  const selectedPrompt = form.watch("customPrompt");

  async function onSubmit(data: StartConversationRequest) {
    setServerError(null);

    try {
      const response = await fetch("/api/conversation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { conversationId } = await response.json();
        router.push(`/dashboard/practice/${conversationId}`);
      } else {
        const errorText = await response.text();
        setServerError(errorText);
      }
    } catch (err) {
      console.error("Error starting conversation:", err);
      setServerError("Failed to start conversation. Please try again.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl"
    >
      {/* Back button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to conversations
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold mb-1">New Conversation</h2>
        <p className="text-gray-500">
          Choose a language and scenario to practice
        </p>
      </motion.div>

      {/* Token Balance Info */}
      <TokenBalanceInfo
        userTokens={userTokens}
        hasEnoughTokens={hasEnoughTokens}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1,
            }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
          >
            {/* Language Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Language</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedLanguagesArraySorted.map((lang) => (
                            <SelectItem
                              key={lang.languageCode}
                              value={lang.name}
                            >
                              {lang.formatName()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Scenario Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="customPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scenario</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {promptSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion.title}
                          type="button"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => field.onChange(suggestion.prompt)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border text-left transition-colors",
                            selectedPrompt === suggestion.prompt
                              ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          )}
                        >
                          <span className="text-2xl">{suggestion.icon}</span>
                          <span className="font-medium text-gray-900">
                            {suggestion.title}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    <FormControl>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                      >
                        <Textarea
                          placeholder="Or describe your own scenario..."
                          {...field}
                          rows={3}
                          className="resize-none rounded-xl border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Server Error Message */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Unable to start conversation</p>
                    <p className="text-sm text-red-600">{serverError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={hasEnoughTokens ? { scale: 1.01 } : {}}
              whileTap={hasEnoughTokens ? { scale: 0.99 } : {}}
            >
              <Button
                type="submit"
                disabled={isSubmitting || !hasEnoughTokens}
                className={cn(
                  "w-full h-12 font-medium",
                  hasEnoughTokens
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : !hasEnoughTokens ? (
                  "Not enough tokens"
                ) : (
                  `Start Conversation (${TOKEN_COSTS.CONVERSATION} tokens)`
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
