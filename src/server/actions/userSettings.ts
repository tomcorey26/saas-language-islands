"use server";

import { auth } from "@clerk/nextjs/server";
import { updateUser, getUser } from "@/server/db/users";
import { UserTable } from "@/drizzle/user";
import { eq } from "drizzle-orm";
import {
  SupportedLanguageCode,
  supportedLanguageCodes,
} from "@/data/supportedLanguages";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const UpdateBaseLanguageSchema = z.object({
  baseLanguage: z.enum(supportedLanguageCodes),
});

export interface UpdateBaseLanguageResult {
  success: boolean;
  error?: string;
}

export async function updateBaseLanguage(
  baseLanguage: SupportedLanguageCode
): Promise<UpdateBaseLanguageResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be signed in to update settings.",
      };
    }

    const validation = UpdateBaseLanguageSchema.safeParse({ baseLanguage });
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid language selection.",
      };
    }

    const user = await getUser(userId);
    if (!user) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    await updateUser(eq(UserTable.clerkUserId, userId), {
      baseLanguage: validation.data.baseLanguage,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    revalidatePath("/onboarding");

    return { success: true };
  } catch (error) {
    console.error("Error updating base language:", error);
    return {
      success: false,
      error: "Failed to update language preference. Please try again.",
    };
  }
}
