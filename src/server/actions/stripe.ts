"use server";

import {
  paymentTiers,
  PaidTierNames,
  getPaymentTierByPriceId,
} from "@/data/paymentTiers";
import { currentUser, User as ClerkUser } from "@clerk/nextjs/server";
import {
  getUser as getUserDb,
  updateUser as updateUserDb,
} from "@/server/db/users";
import { Stripe } from "stripe";
import { env as serverEnv } from "@/data/env/server";
import { env as clientEnv } from "@/data/env/client";
import { redirect } from "next/navigation";
import { UserTable } from "@/drizzle/user";
import { eq } from "drizzle-orm";
import { tryCatch } from "@/lib/try-catch";
import {
  fulfillPurchaseTransaction,
  getPurchaseBySessionId as getPurchaseBySessionIdDb,
  getRecentPurchaseAttempts,
} from "@/server/db/purchases";
import {
  shouldAllowRetry,
  getUserFriendlyMessage,
} from "@/lib/stripe";
export { getRecoveryAction } from "@/lib/stripe";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

interface CreateCheckoutSessionResult {
  error: boolean;
  message?: string;
  redirectUrl?: string;
}

export async function createCheckoutSession(
  tier: PaidTierNames
): Promise<CreateCheckoutSessionResult> {
  console.log(`[STRIPE] Creating checkout session for tier: ${tier}`);
  
  const clerkUser = await currentUser();
  if (clerkUser == null) {
    console.error("[STRIPE] Checkout failed: User not authenticated");
    return {
      error: true,
      message:
        "You must be signed in to make a purchase. Please sign in and try again.",
    };
  }

  const user = await getUserDb(clerkUser.id);
  if (user == null) {
    console.error(`[STRIPE] User not found in database: ${clerkUser.id}`);
    return {
      error: true,
      message:
        "User account not found. Please contact support if this problem persists.",
    };
  }

  // Validate the tier exists
  const tierConfig = paymentTiers[tier];
  if (!tierConfig || !tierConfig.stripePriceId) {
    console.error(`[STRIPE] Invalid payment tier: ${tier}`);
    return {
      error: true,
      message:
        "Invalid payment tier selected. Internal error, please try again later",
    };
  }

  // Rate limiting check - max 5 purchases per hour
  const recentPurchases = await getRecentPurchaseAttempts(clerkUser.id);
  if (recentPurchases.length >= 5) {
    console.warn(`[STRIPE] Rate limit exceeded for user ${clerkUser.id}`);
    return {
      error: true,
      message:
        "Too many recent purchase attempts. Please wait an hour before trying again.",
    };
  }

  let stripeCustomerId = user.stripeCustomerId;

  if (stripeCustomerId == null) {
    console.log(`[STRIPE] Creating new customer for user: ${clerkUser.id}`);
    const { error: stripeError, data: newCustomer } = await tryCatch(
      stripe.customers.create({
        email: clerkUser.primaryEmailAddress?.emailAddress,
        metadata: {
          clerkUserId: clerkUser.id,
        },
      })
    );

    if (stripeError) {
      console.error(`[STRIPE] Failed to create customer: ${stripeError}`);
      return {
        error: true,
        message: "Failed to create Stripe customer. Please try again later.",
      };
    }

    const { error: dbError, data: updatedUser } = await tryCatch(
      updateUserDb(eq(UserTable.clerkUserId, user.clerkUserId), {
        stripeCustomerId: newCustomer.id,
      })
    );

    if (dbError || updatedUser == null) {
      return {
        error: true,
        message: "Failed to update user. Please try again later.",
      };
    }

    stripeCustomerId = newCustomer.id;
    console.log(`[STRIPE] Customer created: ${stripeCustomerId}`);
  }

  // Create the checkout session
  console.log(`[STRIPE] Creating checkout session for customer: ${stripeCustomerId}`);
  const url = await getCheckoutSession(tier, clerkUser, stripeCustomerId);
  if (url == null) {
    console.error(`[STRIPE] Failed to create checkout session for tier: ${tier}`);
    return {
      error: true,
      message:
        "Failed to create payment session. Please try again or contact support if the problem persists.",
    };
  }

  console.log(`[STRIPE] Redirecting to checkout: ${url}`);
  redirect(url);
}

async function getCheckoutSession(
  tier: PaidTierNames,
  user: ClerkUser,
  stripeCustomerId: string
): Promise<string | null> {
  try {
    const tierConfig = paymentTiers[tier];

    if (!tierConfig.stripePriceId) {
      console.error(`No Stripe price ID configured for tier: ${tier}`);
      return null;
    }

    console.log(`[STRIPE] Creating session: tier=${tier}, customer=${stripeCustomerId}`);
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      metadata: {
        clerkUserId: user.id,
        tier: tier,
      },
      line_items: [
        {
          price: tierConfig.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/buy?cancelled=true`,
      // Add additional security and UX improvements
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      // automatic_tax: { // TOMDO: enable this if we want to actually charge money
      //   enabled: true,
      // },
    });

    console.log(`[STRIPE] Session created: ${session.id}`);
    return session.url;
  } catch (error) {
    console.error(`[STRIPE] Session creation failed:`, error);
    return null;
  }
}

// =====================================================
// FULFILLMENT INTERFACES AND FUNCTIONS
// =====================================================

export interface FulfillmentResult {
  success: boolean;
  tokensAdded?: number;
  alreadyFulfilled?: boolean;
  error?: string;
  details?: string;
}

/**
 * Shared fulfillment logic for processing completed payments.
 * Used by both webhook handler and purchase success page for consistency.
 */
export async function fulfillCheckoutSession(
  sessionId: string,
  isWebhook: boolean = false
): Promise<FulfillmentResult> {
  console.log(`[STRIPE] Fulfilling session: ${sessionId} (webhook=${isWebhook})`);
  
  if (!sessionId || typeof sessionId !== "string") {
    console.error(`[STRIPE] Invalid session ID provided`);
    return {
      success: false,
      error: "Invalid session ID",
      details: "Session ID is required and must be a valid string",
    };
  }

  // Check if fulfillment has already been performed for this Checkout Session
  const existingPurchase = await getPurchaseBySessionIdDb(sessionId);
  if (existingPurchase) {
    console.log(`[STRIPE] Session ${sessionId} already fulfilled`);
    return {
      success: true,
      tokensAdded: existingPurchase.tokensPurchased,
      alreadyFulfilled: true,
    };
  }

  // Retrieve the Checkout Session from the API with line_items expanded
  let checkoutSession: Stripe.Checkout.Session;
  try {
    checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    console.log(`[STRIPE] Retrieved session: status=${checkoutSession.payment_status}`);
  } catch (error) {
    console.error(`[STRIPE] Failed to retrieve session ${sessionId}:`, error);
    return {
      success: false,
      error: "Invalid payment session",
      details: "The payment session could not be found or has expired",
    };
  }

  // Check the Checkout Session's payment_status property
  // For completed sessions, status can only be "paid" or "no_payment_required"
  if (
    checkoutSession.payment_status !== "paid" &&
    checkoutSession.payment_status !== "no_payment_required"
  ) {
    console.warn(`[STRIPE] Payment not completed for session ${sessionId}: ${checkoutSession.payment_status}`);
    return {
      success: false,
      error: "Payment not completed",
      details: "The payment has not been completed yet",
    };
  }

  // Validate required metadata
  const clerkUserId = checkoutSession.metadata?.clerkUserId;
  if (!clerkUserId) {
    console.error(`[STRIPE] No clerkUserId in metadata for session ${sessionId}`);
    return {
      success: false,
      error: "Account information missing",
      details: "User account information not found in payment session",
    };
  }

  // Verify user authorization (skip for webhooks as they are system-initiated)
  if (!isWebhook) {
    const currentClerkUser = await currentUser();
    if (!currentClerkUser) {
      console.error(`[STRIPE] No authenticated user for session ${sessionId}`);
      return {
        success: false,
        error: "Authentication required",
        details: "You must be signed in to complete this purchase",
      };
    }
    
    if (currentClerkUser.id !== clerkUserId) {
      console.error(`[STRIPE] User mismatch: current=${currentClerkUser.id}, session=${clerkUserId}`);
      return {
        success: false,
        error: "Unauthorized access",
        details: "This purchase session belongs to a different account",
      };
    }
  }

  // Validate line items
  const lineItem = checkoutSession.line_items?.data[0];
  if (!lineItem?.price?.id) {
    console.error(`[STRIPE] No price ID found for session ${sessionId}`);
    return {
      success: false,
      error: "Product information missing",
      details: "Product information not found in payment session",
    };
  }

  // Get payment tier configuration
  const tier = getPaymentTierByPriceId(lineItem.price.id);
  if (!tier) {
    console.error(`[STRIPE] No tier found for price ID ${lineItem.price.id}`);
    return {
      success: false,
      error: "Product configuration error",
      details: "The purchased product configuration could not be found",
    };
  }

  // Validate payment intent and customer
  if (!checkoutSession.payment_intent || !checkoutSession.customer) {
    console.error(
      `[STRIPE] Missing payment data for session ${sessionId}`
    );
    return {
      success: false,
      error: "Payment information incomplete",
      details: "Payment verification information is missing",
    };
  }

  // Verify the Stripe customer ID matches the user's stored customer ID
  const user = await getUserDb(clerkUserId);
  if (user?.stripeCustomerId && user.stripeCustomerId !== checkoutSession.customer) {
    console.error(
      `[STRIPE] Customer mismatch for ${sessionId}: expected=${user.stripeCustomerId}, got=${checkoutSession.customer}`
    );
    return {
      success: false,
      error: "Customer verification failed",
      details: "The payment customer does not match your account",
    };
  }

  console.log(`[STRIPE] Processing purchase: ${tier.generationCount} tokens for ${clerkUserId}`);
  const success = await fulfillPurchaseTransaction(
    clerkUserId,
    tier.generationCount,
    {
      clerkUserId,
      tokensPurchased: tier.generationCount,
      amountPaidCents: tier.priceInCents,
      stripeSessionId: sessionId,
      stripePaymentIntentId: checkoutSession.payment_intent as string,
      stripeCustomerId: checkoutSession.customer as string,
    }
  );

  if (!success) {
    console.error(`[STRIPE] Failed to fulfill purchase for session ${sessionId}`);
    return {
      success: false,
      error: "Fulfillment failed",
      details: "Failed to complete purchase",
    };
  }

  console.log(`[STRIPE] Successfully fulfilled session ${sessionId}: ${tier.generationCount} tokens`);
  return {
    success: true,
    tokensAdded: tier.generationCount,
  };
}

// =====================================================
// PAYMENT RECOVERY INTERFACES AND FUNCTIONS
// =====================================================

export interface PaymentRecoveryResult {
  success: boolean;
  message: string;
  shouldRetry: boolean;
  tokensAdded?: number;
}

/**
 * Utility for recovering from failed payment processing
 * Provides user-friendly guidance on next steps
 */
export async function attemptPaymentRecovery(
  sessionId: string
): Promise<PaymentRecoveryResult> {
  if (!sessionId) {
    return {
      success: false,
      message: "No payment session provided. Please start a new purchase.",
      shouldRetry: false,
    };
  }

  try {
    const result = await fulfillCheckoutSession(sessionId);

    if (result.success) {
      return {
        success: true,
        message: result.alreadyFulfilled
          ? "Payment already processed successfully."
          : "Payment recovered successfully!",
        shouldRetry: false,
        tokensAdded: result.tokensAdded,
      };
    }

    // Determine if retry is appropriate based on error type
    const shouldRetry = shouldAllowRetry(result.error);
    const userMessage = getUserFriendlyMessage(result.error, result.details);

    return {
      success: false,
      message: userMessage,
      shouldRetry,
    };
  } catch (error) {
    console.error("Error during payment recovery:", error);
    return {
      success: false,
      message:
        "Unable to recover payment. Please contact support for assistance.",
      shouldRetry: false,
    };
  }
}

