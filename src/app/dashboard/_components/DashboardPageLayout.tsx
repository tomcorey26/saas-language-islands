import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DashboardPageLayout({
  children,
  actions,
  pageTitle,
  pageDescription,
  backButtonHref,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  pageTitle: string;
  pageDescription?: string;
  backButtonHref?: string;
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start sticky top-0 bg-background/95 backdrop-blur-sm z-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 -mt-4 gap-4">
        <div className="flex items-center gap-3">
          {backButtonHref && (
            <Link
              href={backButtonHref}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="text-sm text-gray-500 truncate">{pageDescription}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center shrink-0">
          {actions}
          <SidebarTrigger className="h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 md:hidden" />
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
