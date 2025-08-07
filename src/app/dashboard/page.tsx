import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardStats, DashboardStatsSkeleton } from "@/components/DashboardStats";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Decks Card */}
        <Link href="/dashboard/decks" className="group">
          <div className="p-6 h-48 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between group-hover:border-blue-500">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                Navigate
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition">
                Decks
              </h3>
              <p className="text-gray-600">
                Manage your card decks and collections
              </p>
            </div>
          </div>
        </Link>

        {/* Placeholder for future pages */}
        <div className="p-6 h-48 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between opacity-70">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-500 font-medium">
              Coming Soon
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Statistics</h3>
            <p className="text-gray-600">
              View your learning progress and stats
            </p>
          </div>
        </div>

        {/* Placeholder for future pages */}
        <div className="p-6 h-48 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between opacity-70">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-500 font-medium">
              Coming Soon
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Settings</h3>
            <p className="text-gray-600">Customize your learning experience</p>
          </div>
        </div>
      </div>

      {/* Quick Stats with Suspense */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats userId={userId} />
      </Suspense>
    </div>
  );
}
