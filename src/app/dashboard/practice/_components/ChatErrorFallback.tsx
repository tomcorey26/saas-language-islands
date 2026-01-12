"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ChatErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export function ChatErrorFallback({ error, reset }: ChatErrorFallbackProps) {
  const isNetworkError =
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("Failed to fetch");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-10rem)] items-center justify-center"
    >
      <div className="max-w-md text-center px-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
        >
          <AlertCircle className="h-8 w-8 text-red-600" />
        </motion.div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isNetworkError ? "Connection Lost" : "Something went wrong"}
        </h2>

        <p className="text-gray-600 mb-6">
          {isNetworkError
            ? "We couldn't connect to the chat service. Please check your internet connection and try again."
            : "An error occurred while loading the chat. Your conversation is safe, and you can try again."}
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left bg-gray-50 rounded-lg p-4 border border-gray-200">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            asChild
            className="gap-2"
          >
            <Link href="/dashboard/practice">
              <ArrowLeft className="h-4 w-4" />
              Back to Practice
            </Link>
          </Button>

          <Button
            onClick={reset}
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
