"use client";

import { useState } from "react";

import { faqItems } from "@/content/faq";
import { cn } from "@/lib/utils";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionShell id="faq" eyebrow="FAQ" title="Частые вопросы">
      <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border bg-card">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <RevealOnScroll key={item.question} delay={index * 0.04}>
              <li>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-background/40 sm:px-6"
                >
                  <span className="mt-0.5 font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-sans text-base font-semibold tracking-tight sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 font-mono text-sm text-muted-foreground transition-transform duration-300",
                      isOpen ? "rotate-45 text-primary" : "rotate-0",
                    )}
                  >
                    {"+"}
                  </span>
                </button>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 pl-[3.25rem] text-muted-foreground sm:px-6 sm:pl-[3.75rem]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            </RevealOnScroll>
          );
        })}
      </ul>
    </SectionShell>
  );
}
