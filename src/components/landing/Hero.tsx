"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { about } from "@/content/about";

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
    <section className="relative px-6 pt-32 pb-24 sm:px-10 sm:pt-40 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>
          @RadovSSky Automation Engineer
        </p>
        <h1 className="mt-6 font-mono text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
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
              "font-mono",
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
    </section>
  );
}
