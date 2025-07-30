import { env } from "@/data/env/server";
import { getPaymentTierByPriceId } from "@/data/paymentTiers";
import { tryCatchSync } from "@/lib/try-catch";
import { addTokensToUser } from "@/server/db/users";
import { createPurchase, getPurchaseBySessionId } from "@/server/db/purchases";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature") as string;
  const text = await request.text();

  const { data, error } = tryCatchSync(() =>
    stripe.webhooks.constructEvent(text, signature, endpointSecret)
  );

  if (error != null) {
    console.log(`⚠️  Webhook signature verification failed.`, error.message);
    return new Response(null, { status: 400 });
  }

  const event = data;

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const result = await fulfillCheckout(session.id);

      // Handle fulfillment result and return appropriate status
      if (result.error) {
        console.error(`Fulfillment failed: ${result.message}`);
        return new Response(result.message, { status: result.status });
      }

      break; // Continue to success response
    }
    // case "customer.subscription.deleted": {
    //   await handleDelete(event.data.object);
    //   break;
    // }
    // case "customer.subscription.updated": {
    //   await handleUpdate(event.data.object);
    //   break;
    // }
    // case "customer.subscription.created": {
    //   await handleCreate(event.data.object);
    //   break;
    // }
  }

  return new Response(null, { status: 200 });
}

async function fulfillCheckout(sessionId: string): Promise<{
  error?: boolean;
  message?: string;
  status?: number;
  success?: boolean;
}> {
  console.log("Fulfilling Checkout Session", sessionId);

  try {
    // Check if fulfillment has already been performed for this Checkout Session
    const existingPurchase = await getPurchaseBySessionId(sessionId);
    if (existingPurchase) {
      console.log(`Purchase already fulfilled for session ${sessionId}`);
      return { success: true }; // ✅ Return 200 - idempotent success
    }

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    // Check the Checkout Session's payment_status property
    if (checkoutSession.payment_status === "unpaid") {
      console.log(`Payment not completed for session ${sessionId}`);
      return { success: true }; // ✅ Return 200 - payment not ready yet
    }

    const clerkUserId = checkoutSession.metadata?.clerkUserId;
    if (!clerkUserId) {
      console.error(
        `No clerkUserId found in metadata for session ${sessionId}`
      );
      return {
        error: true,
        message: "No clerkUserId found in metadata",
        status: 400,
      };
    }

    const lineItem = checkoutSession.line_items?.data[0];
    if (!lineItem?.price?.id) {
      console.error(`No price ID found for session ${sessionId}`);
      return {
        error: true,
        message: "No price ID found for session",
        status: 400,
      };
    }

    const tier = getPaymentTierByPriceId(lineItem.price.id);
    if (!tier) {
      console.error(`No tier found for price ID ${lineItem.price.id}`);
      return {
        error: true,
        message: "No tier found for price ID",
        status: 400,
      };
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

    // Invalidate dashboard cache to show updated token count
    revalidatePath("/dashboard");

    console.log(
      `Successfully fulfilled ${tier.generationCount} tokens for user ${clerkUserId}`
    );

    return { success: true };
  } catch (error) {
    console.error(
      `Failed to fulfill purchase for session ${sessionId}:`,
      error
    );
    return {
      error: true,
      message: "Internal server error during fulfillment",
      status: 500,
    };
  }
}
