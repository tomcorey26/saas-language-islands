import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getRecoveryAction,
  fulfillCheckoutSession,
} from "@/server/actions/stripe";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MessageCircle,
  Home,
  ShoppingCart,
} from "lucide-react";

interface ConfirmationPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const sessionId = (await searchParams).session_id;
  if (!sessionId) {
    redirect("/dashboard/account");
  }

  // Trigger immediate fulfillment (idempotent)
  // Avoid race-condition of webhook not yet having run
  const fulfillmentResult = await fulfillCheckoutSession(sessionId);

  // Note: Path revalidation happens in the webhook handler for real-time updates
  // The dashboard will show updated token counts when user navigates there

  if (!fulfillmentResult.success) {
    const recovery = getRecoveryAction(fulfillmentResult.error);

    return (
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {fulfillmentResult.error || "Payment Processing Error"}
            </h1>
            <p className="text-gray-600 mb-4">
              {fulfillmentResult.details ||
                "There was an issue processing your payment."}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              Don&apos;t worry - if your payment went through, you won&apos;t be
              charged again. We&apos;ll help you resolve this issue.
            </p>
          </div>

          <div className="space-y-3">
            {recovery.primaryAction === "retry" && (
              <a href={`/dashboard/purchase?session_id=${sessionId}`}>
                <Button className="w-full" variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {recovery.primaryLabel}
                </Button>
              </a>
            )}

            {recovery.primaryAction === "new_purchase" && (
              <a href="/dashboard/buy">
                <Button className="w-full" variant="default">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {recovery.primaryLabel}
                </Button>
              </a>
            )}

            {recovery.primaryAction === "contact_support" && (
              <Button className="w-full" variant="default">
                <MessageCircle className="w-4 h-4 mr-2" />
                {recovery.primaryLabel}
              </Button>
            )}

            {recovery.primaryAction === "wait" && (
              <a href={`/dashboard/purchase?session_id=${sessionId}`}>
                <Button className="w-full" variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {recovery.primaryLabel}
                </Button>
              </a>
            )}

            {recovery.secondaryAction && (
              <>
                {recovery.secondaryAction === "contact_support" && (
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {recovery.secondaryLabel}
                  </Button>
                )}

                {recovery.secondaryAction === "account" && (
                  <a href="/dashboard/account">
                    <Button className="w-full" variant="outline">
                      {recovery.secondaryLabel}
                    </Button>
                  </a>
                )}

                {recovery.secondaryAction === "dashboard" && (
                  <a href="/dashboard">
                    <Button className="w-full" variant="outline">
                      <Home className="w-4 h-4 mr-2" />
                      {recovery.secondaryLabel}
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
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
              🎉 {fulfillmentResult.tokensAdded.toLocaleString()} tokens added
              to your account!
            </p>
            {fulfillmentResult.alreadyFulfilled && (
              <p className="text-blue-700 text-sm mt-1">
                (Previously processed - no duplicate charge)
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <a href="/dashboard">
            <Button className="w-full" size="lg">
              Go to Dashboard
            </Button>
          </a>
          <a href="/create">
            <Button className="w-full" variant="outline" size="lg">
              Start Creating Islands
            </Button>
          </a>
          <a href="/dashboard/buy">
            <Button className="w-full" variant="ghost">
              Buy More Tokens
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
