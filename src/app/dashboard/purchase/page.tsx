import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { env } from "@/data/env/server";
import { getPaymentTierByPriceId } from "@/data/paymentTiers";
import { addTokensToUser } from "@/server/db/users";
import { createPurchase, getPurchaseBySessionId } from "@/server/db/purchases";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

interface PurchasePageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function PurchasePage({
  searchParams,
}: PurchasePageProps) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const sessionId = (await searchParams).session_id;
  if (!sessionId) {
    redirect("/dashboard/account");
  }

  // Trigger immediate fulfillment (idempotent)
  const fulfillmentResult = await fulfillCheckoutImmediate(sessionId);

  if (!fulfillmentResult.success) {
    redirect("/dashboard/account?error=payment_failed");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your tokens have been added to your account.
          </p>
        </div>

        {fulfillmentResult.tokensAdded && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              🎉 {fulfillmentResult.tokensAdded} tokens added to your account!
            </p>
          </div>
        )}

        <div className="space-y-3">
          <a
            href="/dashboard"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
          <a
            href="/create"
            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Start Creating Islands
          </a>
        </div>
      </div>
    </div>
  );
}

async function fulfillCheckoutImmediate(sessionId: string): Promise<{
  success: boolean;
  tokensAdded?: number;
  alreadyFulfilled?: boolean;
}> {
  try {
    // Check if fulfillment has already been performed for this Checkout Session
    const existingPurchase = await getPurchaseBySessionId(sessionId);
    if (existingPurchase) {
      return {
        success: true,
        tokensAdded: existingPurchase.tokensPurchased,
        alreadyFulfilled: true,
      };
    }

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    // Check the Checkout Session's payment_status property
    if (checkoutSession.payment_status === "unpaid") {
      return { success: false };
    }

    const clerkUserId = checkoutSession.metadata?.clerkUserId;
    if (!clerkUserId) {
      return { success: false };
    }

    const lineItem = checkoutSession.line_items?.data[0];
    if (!lineItem?.price?.id) {
      return { success: false };
    }

    const tier = getPaymentTierByPriceId(lineItem.price.id);
    if (!tier) {
      return { success: false };
    }

    // Perform fulfillment: add tokens to user and record purchase
    await Promise.all([
      // Add tokens to user's balance
      addTokensToUser(clerkUserId, tier.generationCount),

      // Record the purchase for idempotency and tracking
      createPurchase({
        clerkUserId,
        tokensPurchased: tier.generationCount,
        amountPaidCents: tier.priceInCents,
        stripeSessionId: sessionId,
        stripePaymentIntentId: checkoutSession.payment_intent as string,
        stripeCustomerId: checkoutSession.customer as string,
      }),
    ]);
    // Note: Revalidation will happen naturally when user navigates to dashboard

    return {
      success: true,
      tokensAdded: tier.generationCount,
    };
  } catch (error) {
    console.error(
      `Failed to fulfill purchase for session ${sessionId}:`,
      error
    );
    return { success: false };
  }
}
