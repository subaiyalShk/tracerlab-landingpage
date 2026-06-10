import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tracerlabs.io", changeFrequency: "weekly", priority: 1 },
    { url: "https://tracerlabs.io/solar", changeFrequency: "monthly", priority: 0.8 },
  ];
}
