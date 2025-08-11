import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Clock, Target, TrendingUp, Zap } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalDecks: number;
    totalCards: number;
    totalIslands: number;
    cardsDueForReview: number;
    cardsReviewedToday: number;
    retentionRate: number;
    averageEaseFactor: number;
  };
  tokensBalance: number;
}

export function StatsOverview({ stats, tokensBalance }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Cards",
      value: stats.totalCards.toString(),
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Decks",
      value: stats.totalDecks.toString(),
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Islands Explored",
      value: stats.totalIslands.toString(),
      icon: Brain,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Due for Review",
      value: stats.cardsDueForReview.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Reviewed Today",
      value: stats.cardsReviewedToday.toString(),
      icon: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Retention Rate",
      value: `${stats.retentionRate.toFixed(1)}%`,
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}