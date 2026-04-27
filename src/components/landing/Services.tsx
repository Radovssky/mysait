import { services } from "@/content/services";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function Services() {
  return (
    <SectionShell id="services" eyebrow="услуги" title="Что я делаю">
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
        {services.map((service, index) => (
          <RevealOnScroll key={service.slug} delay={index * 0.05}>
            <article className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-mono text-xl font-semibold">
                  {service.title}
                </h3>
                <span className="font-mono text-sm text-primary">
                  {service.price}
                </span>
              </div>
              <span className="mt-3 block h-px w-12 bg-border transition-all duration-300 group-hover:w-24 group-hover:bg-primary" />
              <p className="mt-5 text-muted-foreground">
                {service.description}
              </p>
              <ul className="mt-5 space-y-1.5 font-mono text-sm text-muted-foreground/85">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>
                    <span className="text-primary">— </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </SectionShell>
  );
}
