import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DashboardPageLayout({
  children,
  actions,
  pageTitle,
  backButtonHref,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  pageTitle: string;
  backButtonHref?: string;
}) {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-8 sticky top-0 bg-background z-50 gap-4">
        <div className="flex items-center gap-4">
          {backButtonHref && (
            <Link href={backButtonHref}>
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold">{pageTitle}</h1>
        </div>
        <div className="flex gap-2 items-center">
          {actions}

          {/* Mobile hamburger menu - top right corner */}
          <SidebarTrigger className="h-10 w-10 rounded-lg bg-background/80 backdrop-blur-sm border shadow-sm md:hidden" />
        </div>
      </div>
      {children}
    </>
  );
}
