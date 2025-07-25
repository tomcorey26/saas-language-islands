import { CreditPurchaseCards } from "@/components/CreditPurchaseCards";

export default function PurchasePage() {
  // const handlePurchase = (tierName: string) => {
  //   // TODO: Integrate with your payment processor (Stripe, etc.)
  //   console.log(`Purchasing ${tierName} tier`);

  //   // For now, just show an alert
  //   alert(`Redirecting to payment for ${tierName} package...`);
  // };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Credit Package
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Purchase credits to generate more flashcard sets. The more you buy,
            the better value you get!
          </p>
        </div>

        {/* Refund Policy Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>
                  Please review our Refund Policy before buying credits.
                </strong>{" "}
                We do not issue refunds at this time.
              </p>
            </div>
          </div>
        </div>

        {/* Credit Purchase Cards */}
        <CreditPurchaseCards />

        {/* Footer Info */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            Credits never expire • Secure payment processing • Instant
            activation
          </p>
        </div>
      </div>
    </div>
  );
}
