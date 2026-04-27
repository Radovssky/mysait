import { processSteps } from "@/content/process-steps";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function Process() {
  return (
    <SectionShell id="process" eyebrow="процесс" title="Как идёт работа">
      <ol className="relative space-y-8 border-l border-border/70 pl-10">
        {processSteps.map((step, index) => (
          <RevealOnScroll key={step.title} delay={index * 0.05}>
            <li className="relative">
              <span className="absolute -left-[2.6rem] top-0 flex h-7 w-7 items-center justify-center rounded-md border border-primary/40 bg-card font-mono text-xs text-primary shadow-[0_0_20px_-8px_var(--brand-glow)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-sans text-lg font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {step.description}
              </p>
            </li>
          </RevealOnScroll>
        ))}
      </ol>
    </SectionShell>
  );
}
