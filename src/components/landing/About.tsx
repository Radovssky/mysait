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
      <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
        <RevealOnScroll>
          <div className="relative mx-auto aspect-square w-full max-w-[360px]">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-full bg-primary/15 blur-3xl"
            />
            <div className="relative aspect-square overflow-hidden rounded-full border-2 border-primary/30 shadow-[0_0_50px_-15px_var(--brand-glow)]">
              <Image
                src="/radu-photo.jpg"
                alt={`${about.name} — ${about.positioning}`}
                fill
                sizes="(min-width: 1024px) 360px, 80vw"
                className="object-cover grayscale contrast-110"
                priority
              />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-primary/40 bg-card px-3 py-1.5 font-mono text-xs shadow-lg">
              <span className="text-primary">{"</>"}</span>{" "}
              <span className="text-foreground">automation engineer</span>
            </span>
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
