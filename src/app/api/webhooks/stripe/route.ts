import { env } from "@/data/env/server";
import { tryCatchSync } from "@/lib/try-catch";
import { fulfillCheckoutSession } from "@/server/actions/stripe";
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
    console.error(`[WEBHOOK] Signature verification failed:`, error.message);
    return new Response(null, { status: 400 });
  }

  const event = data;
  console.log(`[WEBHOOK] Received event: ${event.type} (${event.id})`);

  // Optional events you might consider later:
  // - payment_intent.payment_failed - Track failed payments for analytics
  // - customer.subscription.created/updated/deleted - If you add subscription features
  // - invoice.payment_succeeded - For recurring billing

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const result = await fulfillCheckoutSession(session.id, true);

      // Handle fulfillment result and return appropriate status
      if (!result.success) {
        console.error(
          `[WEBHOOK] Fulfillment failed for session ${session.id}:`,
          {
            error: result.error,
            details: result.details,
            sessionId: session.id,
            customerId: session.customer,
            paymentIntent: session.payment_intent,
          }
        );

        // Determine if Stripe should retry based on error type
        // Return 500 for temporary errors (Stripe will retry)
        // Return 200 for permanent errors or already-fulfilled (no retry needed)
        const temporaryErrors = [
          "Database error",
          "Network error",
          "Unexpected error",
          "Fulfillment failed",
        ];

        const shouldRetry = temporaryErrors.some((err) =>
          result.error?.includes(err)
        );

        if (shouldRetry) {
          console.error(`[WEBHOOK] Returning 500 for retry: ${result.error}`);
          return new Response(
            JSON.stringify({ error: result.error, details: result.details }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        // For permanent failures, return 200 to acknowledge receipt
        console.log(
          `[WEBHOOK] Permanent error, acknowledging: ${result.error}`
        );
        return new Response(null, { status: 200 });
      }

      // Invalidate relevant caches after successful fulfillment
      if (result.success && !result.alreadyFulfilled) {
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/account");
      }

      console.log(
        `[WEBHOOK] Fulfillment successful for session ${session.id}: ${result.tokensAdded} tokens`
      );
      break; // Continue to success response
    }

    default: {
      console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }
  }

  console.log(`[WEBHOOK] Event processed successfully: ${event.id}`);
  return new Response(null, { status: 200 });
}
