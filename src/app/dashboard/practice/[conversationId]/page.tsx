import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getConversation } from "@/server/db/conversations";
import { getConversationMessages } from "@/server/db/messages";
import { DashboardPageLayout } from "../../_components/DashboardPageLayout";
import { ChatView } from "../_components/ChatView";

interface Props {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: Props) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { conversationId } = await params;

  // Verify conversation exists and belongs to user
  const conversation = await getConversation(conversationId, userId);

  if (!conversation) {
    redirect("/dashboard/practice");
  }

  // Fetch messages
  const messages = await getConversationMessages(conversationId);

  // Truncate prompt for title display
  const truncatedPrompt =
    conversation.customPrompt.length > 50
      ? conversation.customPrompt.substring(0, 50) + "..."
      : conversation.customPrompt;

  return (
    <DashboardPageLayout
      pageTitle={truncatedPrompt}
      backButtonHref="/dashboard/practice"
    >
      <ChatView
        conversationId={conversationId}
        customPrompt={conversation.customPrompt}
        initialMessages={messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </DashboardPageLayout>
  );
}
