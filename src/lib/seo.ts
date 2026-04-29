import { about } from "@/content/about";
import type { FaqItem } from "@/content/faq";
import type { Service } from "@/content/services";

const fallback = "http://localhost:3000";

export const siteUrl =
  process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? fallback;

export const siteTitle = `${about.name} — ${about.positioning}`;
export const siteDescription =
  "Automation Engineer: чат-боты, AI-агенты, голосовые ассистенты, контент-генерация. n8n, OpenAI, интеграции с CRM и мессенджерами.";

export const lastUpdatedIso = "2026-04-29";
const ruMonthsGenitive = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
const lastUpdatedDate = new Date(lastUpdatedIso);
export const lastUpdatedDisplay = `${lastUpdatedDate.getUTCDate()} ${ruMonthsGenitive[lastUpdatedDate.getUTCMonth()]} ${lastUpdatedDate.getUTCFullYear()}`;

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

function parseMinPrice(price: string): number | undefined {
  const match = price.replace(/ /g, " ").match(/\d[\d\s]*/);
  if (!match) return undefined;
  const value = Number(match[0].replace(/\s/g, ""));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function serviceJsonLd(items: Service[]) {
  return items.map((service) => {
    const minPrice = parseMinPrice(service.price);
    const offers = minPrice
      ? {
          offers: {
            "@type": "Offer",
            url: `${siteUrl}/#services`,
            priceCurrency: "RUB",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "RUB",
              minPrice,
            },
          },
        }
      : {};
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.description,
      areaServed: "RU",
      provider: {
        "@type": "Person",
        name: about.name,
        url: siteUrl,
      },
      ...offers,
    };
  });
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

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
