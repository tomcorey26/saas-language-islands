import { auth } from "@clerk/nextjs/server";
import { getUserConversations } from "@/server/db/conversations";
import { NextRequest } from "next/server";

const PAGE_SIZE = 9;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
    const limit = PAGE_SIZE;

    // Fetch one extra to check if there are more
    const conversations = await getUserConversations(userId, {
      limit: limit + 1,
      offset,
    });

    const hasMore = conversations.length > limit;
    const results = hasMore ? conversations.slice(0, limit) : conversations;

    return Response.json({
      conversations: results,
      hasMore,
      nextOffset: hasMore ? offset + limit : null,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
