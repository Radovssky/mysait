import Image from "next/image";

import { about } from "@/content/about";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function About() {
  return (
    <SectionShell
      id="about"
      eyebrow="о себе"
      title="Один человек на связи от старта до поддержки"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
        <RevealOnScroll>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              src="/radu-photo.jpg"
              alt={`${about.name} — ${about.positioning}`}
              fill
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover grayscale contrast-110"
              priority
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="space-y-8">
            <ul className="grid grid-cols-2 gap-3 font-mono text-sm sm:max-w-md">
              {about.facts.map((fact) => (
                <li
                  key={fact.label}
                  className="flex flex-col rounded-lg border border-border/70 bg-card px-4 py-3"
                >
                  <span className="text-muted-foreground">{fact.label}</span>
                  <span className="text-foreground">{fact.value}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-4 text-base text-muted-foreground sm:text-lg">
              {about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </SectionShell>
  );
}
