import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { updateLastAnalyzedMessageId } from "@/server/db/conversations";

const updateAnalysisIndexSchema = z.object({
  conversationId: z.string().uuid(),
  lastAnalyzedMessageId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { conversationId, lastAnalyzedMessageId } =
      updateAnalysisIndexSchema.parse(body);

    await updateLastAnalyzedMessageId(
      conversationId,
      userId,
      lastAnalyzedMessageId
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update analysis index error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
