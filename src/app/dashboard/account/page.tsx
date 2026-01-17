import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/server/db/users";
import { TokenUsage } from "@/components/TokenUsage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await getUser(userId);

  if (!dbUser) {
    redirect("/sign-in");
  }

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
              <TokenUsage availableTokens={dbUser.tokensBalance} />
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
                  {dbUser.tokensBalance.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-4">
                <p>
                  Tokens are used to generate AI-powered flashcards. Each
                  flashcard generation costs 1 token.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
