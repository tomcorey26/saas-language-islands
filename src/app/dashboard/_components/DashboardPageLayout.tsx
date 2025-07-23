import { Button } from "@/components/ui/button";
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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {backButtonHref && (
            <Link href={backButtonHref}>
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
        </div>
        <div className="flex gap-2">{actions}</div>
      </div>
      {children}
    </>
  );
}
