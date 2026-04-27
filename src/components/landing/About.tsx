import Image from "next/image";

import { about } from "@/content/about";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function About() {
  return (
    <SectionShell
      id="about"
      eyebrow="о себе"
      title="Знаю, как устроены процессы — поэтому автоматизирую их так, чтобы работали"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
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
          <div className="space-y-4 text-base text-muted-foreground sm:text-lg">
            {about.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </SectionShell>
  );
}
