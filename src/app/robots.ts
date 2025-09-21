import { MetadataRoute } from "next";
import { COMPANY } from "@/data/marketing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/sign-in/", "/sign-up/", "/admin/"],
    },
    sitemap: `${COMPANY.url}/sitemap.xml`,
  };
}
