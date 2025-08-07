import { CreditPurchaseCards } from "@/components/CreditPurchaseCards";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";

interface BuyPageProps {
  searchParams: Promise<{
    cancelled?: string;
  }>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const { cancelled } = await searchParams;

  // Cancelled message rendering
  const renderCancelledMessage = () => {
    if (!cancelled) return null;

    return (
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
        <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
            Payment Cancelled
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            Your payment was cancelled. You can try again anytime.
          </p>
        </div>
        <Link
          href="/dashboard/buy"
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors"
          title="Dismiss message"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>
    );
  };

  return (
    <DashboardPageLayout
      pageTitle="Choose Your Tokens Package"
      backButtonHref="/dashboard"
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Cancelled Message */}
        {renderCancelledMessage()}

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
