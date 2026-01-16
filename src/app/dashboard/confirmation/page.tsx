import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fulfillCheckoutSession } from "@/server/actions/stripe";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
  MessageCircle,
  Home,
  ShoppingCart,
} from "lucide-react";
import { getRecoveryAction } from "@/lib/stripe";
import { SuccessContent } from "./SuccessContent";

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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {fulfillmentResult.error || "Payment Processing Error"}
            </h1>
            <p className="text-gray-500 text-sm">
              {fulfillmentResult.details ||
                "There was an issue processing your payment."}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 text-sm text-center">
              Don&apos;t worry - if your payment went through, you won&apos;t be
              charged again.
            </p>
          </div>

          <div className="space-y-2">
            {recovery.primaryAction === "retry" && (
              <a href={`/dashboard/purchase?session_id=${sessionId}`}>
                <Button className="w-full h-11" variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {recovery.primaryLabel}
                </Button>
              </a>
            )}

            {recovery.primaryAction === "new_purchase" && (
              <a href="/dashboard/buy">
                <Button className="w-full h-11" variant="default">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {recovery.primaryLabel}
                </Button>
              </a>
            )}

            {recovery.primaryAction === "contact_support" && (
              <Button className="w-full h-11" variant="default">
                <MessageCircle className="w-4 h-4 mr-2" />
                {recovery.primaryLabel}
              </Button>
            )}

            {recovery.primaryAction === "wait" && (
              <a href={`/dashboard/purchase?session_id=${sessionId}`}>
                <Button className="w-full h-11" variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {recovery.primaryLabel}
                </Button>
              </a>
            )}

            {recovery.secondaryAction && (
              <>
                {recovery.secondaryAction === "contact_support" && (
                  <Button className="w-full h-11" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {recovery.secondaryLabel}
                  </Button>
                )}

                {recovery.secondaryAction === "account" && (
                  <a href="/dashboard/account">
                    <Button className="w-full h-11" variant="outline">
                      {recovery.secondaryLabel}
                    </Button>
                  </a>
                )}

                {recovery.secondaryAction === "dashboard" && (
                  <a href="/dashboard">
                    <Button className="w-full h-11" variant="outline">
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

  return <SuccessContent tokensAdded={fulfillmentResult.tokensAdded} />;
}
