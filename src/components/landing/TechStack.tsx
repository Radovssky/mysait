import { integrations, tools } from "@/content/tech-stack";

import { RevealOnScroll } from "./RevealOnScroll";

export function TechStack() {
  return (
    <section
      id="stack"
      className="scroll-mt-16 border-t border-border/60 px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <div>
              <p className="font-mono text-sm text-muted-foreground">
                <span className="text-primary">{"// "}</span>стек
              </p>
              <h2 className="mt-4 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
                Чем собираю
              </h2>
              <ul className="mt-10 space-y-3">
                {tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="grid grid-cols-[8rem_1fr] gap-4 font-mono text-sm sm:grid-cols-[10rem_1fr]"
                  >
                    <span className="text-foreground">{tool.name}</span>
                    <span className="text-muted-foreground">
                      {tool.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div>
              <p className="font-mono text-sm text-muted-foreground">
                <span className="text-primary">{"// "}</span>интеграции
              </p>
              <h2 className="mt-4 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
                С чем подключаю
              </h2>
              <ul className="mt-10 space-y-5">
                {integrations.map((row) => (
                  <li
                    key={row.label}
                    className="grid grid-cols-[8rem_1fr] gap-4 font-mono text-sm sm:grid-cols-[9rem_1fr]"
                  >
                    <span className="text-foreground">{row.label}</span>
                    <span className="text-muted-foreground">{row.items}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-sm text-muted-foreground">
                <span className="text-primary">{"// "}</span>и многое другое
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
