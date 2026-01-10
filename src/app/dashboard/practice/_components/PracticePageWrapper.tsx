"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DashboardPageLayout } from "../../_components/DashboardPageLayout";
import { ConversationPracticeMode } from "./ConversationPracticeMode";

export function PracticePageWrapper() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "new">("list");

  return (
    <DashboardPageLayout
      pageTitle="Conversation Practice"
      pageDescription="Practice speaking with AI tutors"
      backButtonHref="/dashboard"
      actions={
        view === "list" ? (
          <Button
            onClick={() => setView("new")}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white h-9"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Chat
          </Button>
        ) : null
      }
    >
      <ConversationPracticeMode
        view={view}
        onViewChange={setView}
      />
    </DashboardPageLayout>
  );
}
