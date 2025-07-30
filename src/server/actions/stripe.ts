"use server";

import { paymentTiers, PaidTierNames } from "@/data/paymentTiers";
import { currentUser, User as ClerkUser } from "@clerk/nextjs/server";
import { getUser, updateUser } from "@/server/db/users";
import { Stripe } from "stripe";
import { env as serverEnv } from "@/data/env/server";
import { env as clientEnv } from "@/data/env/client";
import { redirect } from "next/navigation";
import { UserTable } from "@/drizzle/user";
import { eq } from "drizzle-orm";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

export async function createCheckoutSession(tier: PaidTierNames) {
  const clerkUser = await currentUser();
  if (clerkUser == null) return { error: true };

  const user = await getUser(clerkUser.id);

  if (user == null) return { error: true, message: "No user found" };

  let stripeCustomerId = user.stripeCustomerId;

  if (stripeCustomerId == null) {
    const customer = await stripe.customers.create({
      email: clerkUser.primaryEmailAddress?.emailAddress,
      metadata: {
        clerkUserId: clerkUser.id,
      },
    });

    await updateUser(eq(UserTable.clerkUserId, user.clerkUserId), {
      stripeCustomerId: customer.id,
    });
    stripeCustomerId = customer.id;
  }

  // If the user has no stripe customer id, create a new checkout session
  const url = await getCheckoutSession(tier, clerkUser, stripeCustomerId);
  if (url == null)
    return { error: true, message: "Failed to create checkout session" };
  redirect(url);
}

async function getCheckoutSession(
  tier: PaidTierNames,
  user: ClerkUser,
  stripeCustomerId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    metadata: {
      clerkUserId: user.id,
    },
    line_items: [
      {
        price: paymentTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/purchase?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/account`,
  });

  return session.url;
}

// export async function createCancelSession() {
//   const user = await currentUser();
//   if (user == null) return { error: true };

//   const subscription = await getUser(user.id);

//   if (subscription == null) return { error: true };

//   if (
//     subscription.stripeCustomerId == null ||
//     subscription.stripeSubscriptionId == null
//   ) {
//     return new Response(null, { status: 500 });
//   }

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: subscription.stripeCustomerId,
//     return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
//     flow_data: {
//       type: "subscription_cancel",
//       subscription_cancel: {
//         subscription: subscription.stripeSubscriptionId,
//       },
//     },
//   });

//   redirect(portalSession.url);
// }

// export async function createCustomerPortalSession() {
//   const { userId } = await auth();

//   if (userId == null) return { error: true };

//   const subscription = await getUser(userId);

//   if (subscription?.stripeCustomerId == null) {
//     return { error: true };
//   }

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: subscription.stripeCustomerId,
//     return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
//   });

//   redirect(portalSession.url);
// }

// async function getSubscriptionUpgradeSession(
//   tier: PaidTierNames,
//   subscription: {
//     stripeCustomerId: string | null;
//     stripeSubscriptionId: string | null;
//     stripeSubscriptionItemId: string | null;
//   }
// ) {
//   if (
//     subscription.stripeCustomerId == null ||
//     subscription.stripeSubscriptionId == null ||
//     subscription.stripeSubscriptionItemId == null
//   ) {
//     throw new Error();
//   }

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: subscription.stripeCustomerId,
//     return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
//     flow_data: {
//       type: "subscription_update_confirm",
//       subscription_update_confirm: {
//         subscription: subscription.stripeSubscriptionId,
//         items: [
//           {
//             id: subscription.stripeSubscriptionItemId,
//             price: subscriptionTiers[tier].stripePriceId,
//             quantity: 1,
//           },
//         ],
//       },
//     },
//   });

//   return portalSession.url;
// }
