import { getStats } from "@/server/db/stats";
import { Skeleton } from "@/components/ui/skeleton";
import { cache } from "react";

// Cache the stats function to prevent duplicate calls
const getCachedStats = cache(async (userId: string) => {
  return await getStats(userId);
});

interface DashboardStatsProps {
  userId: string;
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const stats = await getCachedStats(userId);

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Cards</p>
            <p className="text-2xl font-semibold">{stats.totalCards}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mastered</p>
            <p className="text-2xl font-semibold">
              {stats.totalCards === 0
                ? 0
                : (
                    (stats.totalMasteredCards / stats.totalCards) *
                    100
                  ).toFixed(2)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}