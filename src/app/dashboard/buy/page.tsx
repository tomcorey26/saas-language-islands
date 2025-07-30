import { CreditPurchaseCards } from "@/components/CreditPurchaseCards";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";

export default function PurchasePage() {
  return (
    <DashboardPageLayout
      pageTitle="Choose Your Credit Package"
      backButtonHref="/dashboard"
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Description */}
        <div>
          <p className="text-xl text-muted-foreground">
            Purchase credits to generate more flashcard sets. The more you buy,
            the better value you get!
          </p>
        </div>

        {/* Refund Policy Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
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
    </DashboardPageLayout>
  );
}
