# Stripe Payment Implementation (Archived)

This document preserves the full Stripe payment integration that was previously used in Speech Islands. The app has been made free with 10,000 tokens by default for all new users.

## Overview

The payment system used a token-based model where users could purchase token packages (one-time purchases, no subscriptions) to generate AI-powered flashcards.

### Payment Tiers

| Tier | Tokens | Price | Stripe Price ID Env Var |
|------|--------|-------|-------------------------|
| Free | 100 | $0 | N/A |
| Starter | 500 | $1.99 | `STRIPE_STARTER_PLAN_STRIPE_PRICE_ID` |
| Pro | 2,000 | $5.99 | `STRIPE_PRO_PLAN_STRIPE_PRICE_ID` |
| Premium | 5,000 | $12.99 | `STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID` |

---

## Architecture

### Files Structure

```
src/
├── server/
│   ├── actions/
│   │   └── stripe.ts          # Server actions for checkout & fulfillment
│   └── db/
│       └── purchases.ts       # Database queries for purchases
├── app/
│   ├── api/webhooks/stripe/
│   │   └── route.ts           # Webhook handler
│   └── dashboard/
│       ├── buy/
│       │   └── page.tsx       # Purchase page
│       └── confirmation/
│           ├── page.tsx       # Post-purchase confirmation
│           └── SuccessContent.tsx
├── components/
│   └── CreditPurchaseCards.tsx # Purchase UI cards
├── lib/
│   └── stripe.ts              # Error handling utilities
├── drizzle/
│   ├── user.ts                # User schema (with stripeCustomerId)
│   └── purchases.ts           # Purchases table schema
├── data/
│   ├── paymentTiers.ts        # Tier configuration
│   └── env/
│       ├── server.ts          # Server env vars (Stripe keys)
│       └── client.ts          # Client env vars (publishable key)
└── zod/contracts/
    └── purchase.schema.ts     # Zod schemas for purchases
```

---

## Environment Variables

### Server-side (`src/data/env/server.ts`)

```typescript
STRIPE_SECRET_KEY: z.string().min(1),
STRIPE_WEBHOOK_SECRET: z.string().min(1),
STRIPE_STARTER_PLAN_STRIPE_PRICE_ID: z.string().min(1),
STRIPE_PRO_PLAN_STRIPE_PRICE_ID: z.string().min(1),
STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID: z.string().min(1),
```

### Client-side (`src/data/env/client.ts`)

```typescript
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
NEXT_PUBLIC_STRIPE_LINK: z.string(),
```

---

## Database Schema

### Users Table (`src/drizzle/user.ts`)

```typescript
export const UserTable = pgTable(
  "users",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id"),  // Links to Stripe customer
    tokensBalance: integer("tokens_balance").notNull().default(100),
    baseLanguage: LanguageEnum("base_language"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("users.clerk_user_id_index").on(table.clerkUserId),
    index("users.stripe_customer_id_index").on(table.stripeCustomerId),
  ]
);
```

### Purchases Table (`src/drizzle/purchases.ts`)

```typescript
export const PurchasesTable = pgTable(
  "purchases",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull(),
    tokensPurchased: integer("tokens_purchased").notNull(),
    amountPaidCents: integer("amount_paid_cents").notNull(),
    stripeSessionId: text("stripe_session_id").notNull().unique(), // Idempotency key
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt,
  },
  (table) => [
    index("purchases.clerk_user_id_index").on(table.clerkUserId),
    index("purchases.stripe_session_id_index").on(table.stripeSessionId),
    index("purchases.stripe_customer_id_index").on(table.stripeCustomerId),
  ]
);
```

---

## Checkout Flow

### 1. Create Checkout Session (`src/server/actions/stripe.ts`)

```typescript
export async function createCheckoutSession(
  tier: PaidTierNames
): Promise<CreateCheckoutSessionResult> {
  // 1. Validate tier exists and has stripePriceId
  const tierConfig = paymentTiers[tier];
  if (!tierConfig || !tierConfig.stripePriceId) {
    return { error: true, message: "Invalid payment tier" };
  }

  // 2. Get authenticated user
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { error: true, message: "Not authenticated" };
  }

  // 3. Get user from database
  const user = await getUserDb(clerkUser.id);
  if (!user) {
    return { error: true, message: "User not found" };
  }

  // 4. Rate limiting - max 5 purchases per hour
  const recentPurchases = await getRecentPurchaseAttempts(clerkUser.id);
  if (recentPurchases.length >= 5) {
    return { error: true, message: "Rate limit exceeded" };
  }

  // 5. Create or get Stripe customer
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const newCustomer = await stripe.customers.create({
      email: clerkUser.primaryEmailAddress?.emailAddress,
      metadata: { clerkUserId: clerkUser.id },
    });
    await updateUserDb(eq(UserTable.clerkUserId, user.clerkUserId), {
      stripeCustomerId: newCustomer.id,
    });
    stripeCustomerId = newCustomer.id;
  }

  // 6. Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    metadata: {
      clerkUserId: clerkUser.id,
      tier: tier,
    },
    line_items: [{ price: tierConfig.stripePriceId, quantity: 1 }],
    mode: "payment",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/buy?cancelled=true`,
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    allow_promotion_codes: true,
  });

  // 7. Redirect to Stripe
  redirect(session.url);
}
```

### 2. Webhook Handler (`src/app/api/webhooks/stripe/route.ts`)

```typescript
export async function POST(request: NextRequest) {
  // 1. Verify webhook signature
  const signature = request.headers.get("stripe-signature");
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  // 2. Handle checkout.session.completed event
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      const result = await fulfillCheckoutSession(session.id, true);

      if (!result.success) {
        // Return 500 for temporary errors (Stripe will retry)
        // Return 200 for permanent errors (no retry)
        const temporaryErrors = ["Database error", "Network error", "Fulfillment failed"];
        const shouldRetry = temporaryErrors.some(err => result.error?.includes(err));

        if (shouldRetry) {
          return new Response(JSON.stringify({ error: result.error }), { status: 500 });
        }
        return new Response(null, { status: 200 });
      }

      // Revalidate dashboard paths
      if (result.success && !result.alreadyFulfilled) {
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/account");
      }
      break;
    }
  }

  return new Response(null, { status: 200 });
}
```

### 3. Fulfillment Logic (`src/server/actions/stripe.ts`)

```typescript
export async function fulfillCheckoutSession(
  sessionId: string,
  isWebhook: boolean = false
): Promise<FulfillmentResult> {
  // 1. Idempotency check - already fulfilled?
  const existingPurchase = await getPurchaseBySessionIdDb(sessionId);
  if (existingPurchase) {
    return { success: true, tokensAdded: existingPurchase.tokensPurchased, alreadyFulfilled: true };
  }

  // 2. Retrieve session from Stripe
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  // 3. Verify payment completed
  if (checkoutSession.payment_status !== "paid") {
    return { success: false, error: "Payment not completed" };
  }

  // 4. Validate metadata and user
  const clerkUserId = checkoutSession.metadata?.clerkUserId;
  if (!clerkUserId) {
    return { success: false, error: "Account information missing" };
  }

  // 5. Authorization check (skip for webhooks)
  if (!isWebhook) {
    const currentClerkUser = await currentUser();
    if (currentClerkUser?.id !== clerkUserId) {
      return { success: false, error: "Unauthorized access" };
    }
  }

  // 6. Get tier from price ID
  const lineItem = checkoutSession.line_items?.data[0];
  const tier = getPaymentTierByPriceId(lineItem?.price?.id);
  if (!tier) {
    return { success: false, error: "Product configuration error" };
  }

  // 7. Execute fulfillment transaction (atomic)
  await fulfillPurchaseTransaction(clerkUserId, tier.generationCount, {
    clerkUserId,
    tokensPurchased: tier.generationCount,
    amountPaidCents: tier.priceInCents,
    stripeSessionId: sessionId,
    stripePaymentIntentId: checkoutSession.payment_intent as string,
    stripeCustomerId: checkoutSession.customer as string,
  });

  return { success: true, tokensAdded: tier.generationCount };
}
```

### 4. Atomic Transaction (`src/server/db/purchases.ts`)

```typescript
export async function fulfillPurchaseTransaction(
  clerkUserId: string,
  tokensToAdd: number,
  purchaseData: CreatePurchaseInput
) {
  // Pre-transaction idempotency check
  const existingPurchase = await db.query.PurchasesTable.findFirst({
    where: eq(PurchasesTable.stripeSessionId, purchaseData.stripeSessionId),
  });
  if (existingPurchase) return true;

  // Atomic transaction
  await db.transaction(async (tx) => {
    // 1. Record purchase (claims session ID via unique constraint)
    const [purchase] = await tx
      .insert(PurchasesTable)
      .values(purchaseData)
      .onConflictDoNothing({ target: PurchasesTable.stripeSessionId })
      .returning({ id: PurchasesTable.id });

    // If insert returned nothing, another process claimed this session
    if (!purchase) return;

    // 2. Add tokens to user balance
    await tx
      .update(UserTable)
      .set({
        tokensBalance: sql`${UserTable.tokensBalance} + ${tokensToAdd}`,
      })
      .where(eq(UserTable.clerkUserId, clerkUserId));
  });

  return true;
}
```

---

## Security Features

### 1. Idempotency
- `stripeSessionId` is unique in purchases table
- Prevents double-fulfillment from webhook + confirmation page race condition
- `onConflictDoNothing` ensures only first process succeeds

### 2. Atomic Transactions
- Purchase record + token balance update in single transaction
- Rollback on any failure

### 3. Authorization
- Webhook signature verification
- User ID validation (session metadata vs authenticated user)
- Customer ID verification

### 4. Rate Limiting
- Max 5 purchase attempts per hour per user

### 5. Error Recovery
- Webhook returns 500 for temporary errors (Stripe retries)
- Webhook returns 200 for permanent errors (no retry)
- Confirmation page can retry fulfillment

---

## Error Handling (`src/lib/stripe.ts`)

```typescript
// Retryable errors (temporary)
const retryableErrors = [
  "Unexpected error",
  "Network error",
  "Fulfillment failed",
  "Database error",
];

// Non-retryable errors (permanent)
const nonRetryableErrors = [
  "Invalid session ID",
  "Invalid payment session",
  "Payment failed",
  "Payment not completed",
  "Account information missing",
  "Product information missing",
  "Product configuration error",
];

export function getUserFriendlyMessage(error?: string): string {
  const messageMap = {
    "Invalid session ID": "The payment session is invalid. Please start a new purchase.",
    "Payment not completed": "Your payment is still being processed. Please wait.",
    "Fulfillment failed": "Payment processed but tokens not added. Contact support.",
    // ... etc
  };
  return messageMap[error] || "An error occurred.";
}
```

---

## UI Components

### Purchase Cards (`src/components/CreditPurchaseCards.tsx`)

- Grid of 3 purchasable tiers (Starter, Pro, Premium)
- Per-generation cost calculation
- Loading states during checkout creation
- Error states with retry functionality
- Toast notifications for success/failure

### Confirmation Page (`src/app/dashboard/confirmation/`)

- Triggers fulfillment on load (idempotent)
- Success animation with token count
- Error recovery UI with contextual actions
- Links back to dashboard

### Account Page (`src/app/dashboard/account/page.tsx`)

- Token balance display
- Purchase history list
- Total spent calculation

---

## Testing

### Local Development

```bash
# Start Stripe webhook listener
npm run stripe:webhook
# or
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires auth: `4000 0025 0000 3155`

---

## Zod Schemas

### Purchase Schema (`src/zod/contracts/purchase.schema.ts`)

```typescript
export const CreatePurchaseSchema = z.object({
  clerkUserId: z.string().min(1),
  tokensPurchased: z.number().int().positive(),
  amountPaidCents: z.number().int().positive(),
  stripeSessionId: z.string().min(1),
  stripePaymentIntentId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});
```

---

## Payment Tiers Configuration (`src/data/paymentTiers.ts`)

```typescript
export const paymentTiers = {
  Free: {
    name: "Free",
    priceInCents: 0,
    generationCount: 100,
    icon: "",
    stripePriceId: undefined,
  },
  Starter: {
    name: "500 Generations",
    priceInCents: 199,
    generationCount: 500,
    stripePriceId: env.STRIPE_STARTER_PLAN_STRIPE_PRICE_ID,
    icon: "🌱",
  },
  Pro: {
    name: "2000 Generations",
    priceInCents: 599,
    generationCount: 2000,
    stripePriceId: env.STRIPE_PRO_PLAN_STRIPE_PRICE_ID,
    icon: "🌴",
  },
  Premium: {
    name: "5000 Generations",
    priceInCents: 1299,
    generationCount: 5000,
    stripePriceId: env.STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID,
    icon: "🏝️",
  },
};

export function getPaymentTierByPriceId(priceId: string) {
  return Object.values(paymentTiers).find(
    (tier) => tier.stripePriceId === priceId
  );
}
```

---

## Re-enabling Payments

To restore payment functionality:

1. Add Stripe environment variables back to `.env`
2. Restore files from this documentation or git history
3. Re-add `stripe` npm dependency
4. Update user schema to include `stripeCustomerId`
5. Run database migration to add back the column
6. Update marketing pages and UI components

---

## Package Dependencies

```json
{
  "dependencies": {
    "stripe": "^20.0.0"
  },
  "scripts": {
    "stripe:webhook": "stripe listen --forward-to localhost:3000/api/webhooks/stripe"
  }
}
```
