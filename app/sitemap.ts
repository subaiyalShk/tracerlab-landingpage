import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tracerlabs.io", changeFrequency: "weekly", priority: 1 },
    { url: "https://tracerlabs.io/agents", changeFrequency: "weekly", priority: 0.8 },
    { url: "https://tracerlabs.io/voice-agents", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://tracerlabs.io/solar", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tracerlabs.io/work/harbs-farm", changeFrequency: "monthly", priority: 0.9 },
    { url: "https://tracerlabs.io/work/solar-lead-engine", changeFrequency: "monthly", priority: 0.9 },
  ];
}
