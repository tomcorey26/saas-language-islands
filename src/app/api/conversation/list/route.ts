import { auth } from "@clerk/nextjs/server";
import { getUserConversations } from "@/server/db/conversations";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const conversations = await getUserConversations(userId, { limit: 50 });

    return Response.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
