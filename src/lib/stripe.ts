/**
 * Utility functions for Stripe payment processing
 */

/**
 * Determines if a payment error is retryable
 */
export function shouldAllowRetry(error?: string): boolean {
  if (!error) return false;

  // Retryable errors - temporary issues that might resolve
  const retryableErrors = [
    "Unexpected error",
    "Network error",
    "Fulfillment failed",
    "Database error",
  ];

  // Non-retryable errors - permanent issues requiring user action
  const nonRetryableErrors = [
    "Invalid session ID",
    "Invalid payment session",
    "Payment failed",
    "Payment not completed",
    "Account information missing",
    "Product information missing",
    "Product configuration error",
  ];

  // Check for non-retryable first (more specific)
  if (nonRetryableErrors.some((nonRetryable) => error.includes(nonRetryable))) {
    return false;
  }

  // Check for retryable
  return retryableErrors.some((retryable) => error.includes(retryable));
}

/**
 * Generates user-friendly error messages for payment failures
 */
export function getUserFriendlyMessage(error?: string, details?: string): string {
  if (!error)
    return "An unknown error occurred. Please try again or contact support.";

  const messageMap: Record<string, string> = {
    "Invalid session ID":
      "The payment session is invalid. Please start a new purchase.",
    "Invalid payment session":
      "The payment session has expired or is invalid. Please start a new purchase.",
    "Payment not completed":
      "Your payment is still being processed. Please wait a moment and try again.",
    "Payment failed":
      "Your payment was declined. Please check your payment method and try again.",
    "Account information missing":
      "There was an issue with your account information. Please sign out and sign back in, then try again.",
    "Product information missing":
      "There was an issue with the product information. Please start a new purchase.",
    "Product configuration error":
      "The product you tried to purchase is not available. Please contact support.",
    "Fulfillment failed":
      "Your payment was processed but we couldn't add the tokens to your account. Please contact support - you will not be charged again.",
    "Database error":
      "There was a temporary issue processing your purchase. Please try again in a moment.",
    "Unexpected error":
      "An unexpected error occurred. Please try again or contact support if the problem persists.",
  };

  // Find the most specific error message
  for (const [key, message] of Object.entries(messageMap)) {
    if (error.includes(key)) {
      return message;
    }
  }

  // Fallback with details if available
  if (details) {
    return `${details} Please contact support if this problem persists.`;
  }

  return "An error occurred during payment processing. Please contact support for assistance.";
}

/**
 * Determines the best recovery action for the user
 */
export function getRecoveryAction(error?: string): {
  primaryAction: "retry" | "new_purchase" | "contact_support" | "wait";
  primaryLabel: string;
  secondaryAction?: "contact_support" | "account" | "dashboard";
  secondaryLabel?: string;
} {
  if (!error) {
    return {
      primaryAction: "contact_support",
      primaryLabel: "Contact Support",
    };
  }

  if (error.includes("Invalid") || error.includes("expired")) {
    return {
      primaryAction: "new_purchase",
      primaryLabel: "Start New Purchase",
      secondaryAction: "dashboard",
      secondaryLabel: "Back to Dashboard",
    };
  }

  if (error.includes("Payment not completed")) {
    return {
      primaryAction: "wait",
      primaryLabel: "Check Again",
      secondaryAction: "contact_support",
      secondaryLabel: "Contact Support",
    };
  }

  if (error.includes("Fulfillment failed")) {
    return {
      primaryAction: "contact_support",
      primaryLabel: "Contact Support",
      secondaryAction: "account",
      secondaryLabel: "View Account",
    };
  }

  if (shouldAllowRetry(error)) {
    return {
      primaryAction: "retry",
      primaryLabel: "Try Again",
      secondaryAction: "contact_support",
      secondaryLabel: "Contact Support",
    };
  }

  return {
    primaryAction: "new_purchase",
    primaryLabel: "Start New Purchase",
    secondaryAction: "contact_support",
    secondaryLabel: "Contact Support",
  };
}