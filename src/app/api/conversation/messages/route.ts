import { auth } from "@clerk/nextjs/server";
import { getConversation } from "@/server/db/conversations";
import { getConversationMessages } from "@/server/db/messages";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const conversationId = req.nextUrl.searchParams.get("conversationId");
    if (!conversationId) {
      return new Response("Missing conversationId", { status: 400 });
    }

    // Verify ownership
    const conversation = await getConversation(conversationId, userId);
    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    const messages = await getConversationMessages(conversationId);

    return Response.json({ messages, conversation });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
