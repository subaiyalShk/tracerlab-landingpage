import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tracerlabs.io/sitemap.xml",
    host: "https://tracerlabs.io",
  };
}
