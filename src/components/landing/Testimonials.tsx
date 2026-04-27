import Image from "next/image";
import Link from "next/link";

import { testimonials } from "@/content/testimonials";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <SectionShell
      id="testimonials"
      eyebrow="отзывы"
      title="Что говорят клиенты"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {testimonials.map((item, index) => (
          <RevealOnScroll key={item.image} delay={index * 0.05}>
            <figure className="group relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_40px_-12px_var(--brand-glow)]">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary/50 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
              <div className="relative aspect-[4/3] overflow-hidden bg-background">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              {item.caseSlug && item.caseTitle && (
                <figcaption className="border-t border-border/60 px-5 py-3">
                  <Link
                    href={`/projects/${item.caseSlug}`}
                    className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="text-primary">{"// "}</span>о кейсе:{" "}
                    {item.caseTitle}
                  </Link>
                </figcaption>
              )}
            </figure>
          </RevealOnScroll>
        ))}
      </div>
    </SectionShell>
  );
}
