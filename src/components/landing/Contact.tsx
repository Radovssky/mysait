import { buttonVariants } from "@/components/ui/button";
import { about } from "@/content/about";
import { cn } from "@/lib/utils";

import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export function Contact() {
  return (
    <SectionShell id="contact" eyebrow="контакт">
      <RevealOnScroll>
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
          <h2 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            Расскажите о задаче
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Стартуем с брифа: разбираемся в процессе и оцениваем срок. Без
            обязательств с вашей стороны.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
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
            <span className="font-mono text-sm text-muted-foreground">
              {about.telegram}
            </span>
          </div>
        </div>
      </RevealOnScroll>
    </SectionShell>
  );
}
