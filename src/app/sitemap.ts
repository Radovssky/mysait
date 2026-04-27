import type { MetadataRoute } from "next";

import { getPublishedSlugs } from "@/lib/projects";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedSlugs();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugs.map((row) => ({
      url: `${siteUrl}/projects/${row.slug}`,
      lastModified: row.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
