import { about } from "@/content/about";

const fallback = "http://localhost:3000";

export const siteUrl =
  process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? fallback;

export const siteTitle = `${about.name} — ${about.positioning}`;
export const siteDescription =
  "Automation Engineer: чат-боты, AI-агенты, голосовые ассистенты, контент-генерация. n8n, OpenAI, интеграции с CRM и мессенджерами.";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: about.name,
  jobTitle: about.positioning,
  url: siteUrl,
  sameAs: [about.telegramUrl],
  address: {
    "@type": "PostalAddress",
    addressLocality: about.city,
    addressCountry: "RU",
  },
};

function toIso(value: Date | string | null | undefined) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function projectJsonLd(project: {
  title: string;
  shortDescription: string;
  slug: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
  updatedAt: Date | string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: `${siteUrl}/projects/${project.slug}`,
    image: project.coverImage ? `${siteUrl}${project.coverImage}` : undefined,
    datePublished: toIso(project.publishedAt),
    dateModified: toIso(project.updatedAt),
    creator: {
      "@type": "Person",
      name: about.name,
      url: siteUrl,
    },
  };
}

export { toIso };
