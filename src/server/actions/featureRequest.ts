"use server";

import { redirect, RedirectType } from "next/navigation";
import { db } from "@/drizzle/db";
import { FeatureRequestTable } from "@/drizzle/featureRequest";
import { CreateFeatureRequestSchema } from "@/zod/models/featureRequest.model";

export async function submitFeatureRequest(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    userEmail: formData.get("userEmail") as string,
    userName: (formData.get("userName") as string) || undefined,
  };

  try {
    const validatedData = CreateFeatureRequestSchema.parse(data);

    await db.insert(FeatureRequestTable).values(validatedData);
  } catch (error) {
    console.error("Error submitting feature request:", error);
    redirect("/contact?error=true#feature-request");
  }

  redirect("/feature-request-success", RedirectType.replace);
}
