import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubscription } from "@/server/db/subscription";
import { getUserPurchases } from "@/server/db/purchases";
import { TokenUsage } from "@/components/TokenUsage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [userSubscription, purchases] = await Promise.all([
    getUserSubscription(userId),
    getUserPurchases(userId),
  ]);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  // Calculate total tokens purchased
  const totalTokensPurchased = purchases.reduce(
    (sum, purchase) => sum + purchase.tokensPurchased,
    0
  );

  return (
    <DashboardPageLayout pageTitle="Account" backButtonHref="/dashboard">
      <div className="flex flex-col gap-6 w-full">
        {/* Token Balance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Token Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
              <TokenUsage
                availableTokens={userSubscription?.tokensBalance || 0}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Balance</span>
                <span className="text-2xl font-bold">
                  {userSubscription?.tokensBalance?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Purchased</span>
                <span className="text-lg font-semibold">
                  {totalTokensPurchased.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="text-lg font-semibold">
                  {formatPrice(
                    purchases.reduce(
                      (sum, purchase) => sum + purchase.amountPaidCents,
                      0
                    )
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            {purchases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No purchases yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your purchase history will appear here once you buy tokens
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {purchase.tokensPurchased.toLocaleString()} tokens
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(purchase.amountPaidCents)}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
