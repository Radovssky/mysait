import { techStack } from "@/content/tech-stack";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function TechStack() {
  return (
    <SectionShell id="stack" eyebrow="стек" title="С чем работаю">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
        {techStack.map((category, index) => (
          <RevealOnScroll key={category.title} delay={index * 0.05}>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {category.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-card/60 px-2.5 py-1 font-mono text-xs text-foreground/90 transition-all duration-200 hover:scale-[1.04] hover:border-primary/60 hover:text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </SectionShell>
  );
}
