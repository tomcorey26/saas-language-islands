import { getComprehensiveStats, getReviewStreak } from "@/server/db/statistics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { StatsOverview } from "./_components/StatsOverview";
import { DifficultyChart } from "./_components/DifficultyChart";
import { LanguageBreakdown } from "./_components/LanguageBreakdown";
import { ReviewHistoryChart } from "./_components/ReviewHistoryChart";
import { DeckPerformance } from "./_components/DeckPerformance";
import { IslandProgress } from "./_components/IslandProgress";
import { LearningStreak } from "./_components/LearningStreak";

export default async function StatisticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stats = await getComprehensiveStats(userId);
  const streak = await getReviewStreak(userId);

  if (!stats) {
    redirect("/dashboard");
  }

  return (
    <DashboardPageLayout pageTitle="Learning Statistics" backButtonHref="/dashboard">
      <div className="space-y-6">
        {/* Overview Cards */}
        <StatsOverview stats={stats.overview} tokensBalance={stats.user.tokensBalance} />
        
        {/* Learning Streak */}
        <LearningStreak streak={streak} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Distribution */}
          <DifficultyChart breakdown={stats.difficultyBreakdown} />
          
          {/* Language Breakdown */}
          <LanguageBreakdown languages={stats.languageStats} />
        </div>

        {/* Review History Chart */}
        <ReviewHistoryChart history={stats.reviewHistory} />

        {/* Deck Performance */}
        <DeckPerformance decks={stats.deckPerformance} />

        {/* Island Progress */}
        <IslandProgress islands={stats.islandStats} />
      </div>
    </DashboardPageLayout>
  );
}