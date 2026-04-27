"use client";

import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { about } from "@/content/about";

import { HeroTerminal } from "./HeroTerminal";
import { SectionEyebrow } from "./SectionEyebrow";

const PHRASE = "Сотрудники, которые не спят, не болеют и не увольняются";

export function Hero() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const step = reduced ? PHRASE.length : 1;
    const tick = reduced ? 0 : 55;

    const id = setInterval(() => {
      setShown((current) => {
        const next = current + step;
        if (next >= PHRASE.length) {
          clearInterval(id);
          return PHRASE.length;
        }
        return next;
      });
    }, tick);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:px-10 sm:pt-40 lg:px-16 lg:pt-44">
      {/* ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 left-[-15%] h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
        <div>
          <SectionEyebrow>@RadovSSky Automation Engineer</SectionEyebrow>

          <h1 className="mt-6 font-sans text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span aria-label={PHRASE}>{PHRASE.slice(0, shown)}</span>
            <span aria-hidden className="text-primary animate-blink">
              _
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Собираю AI-агентов и автоматизации, которые забирают рутину у вашей
            команды — переписку, обзвон, контент, заявки.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={about.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "font-mono shadow-[0_0_30px_-6px_var(--brand-glow)]",
              )}
            >
              {"> "}написать в Telegram
            </a>
            <a
              href="#services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "font-mono",
              )}
            >
              что я делаю
            </a>
          </div>
        </div>

        <div className="lg:pl-4">
          <HeroTerminal />
        </div>
      </div>
    </section>
  );
}
