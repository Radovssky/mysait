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
          <div className="mt-4 max-w-2xl space-y-3 text-muted-foreground">
            <p>
              Напишите в Telegram пару строк о задаче — даже «у меня менеджер
              не вывозит заявки с Авито, можно что-то сделать?» уже хватит. На
              брифе разберёмся, что и как, и стоит ли вообще это
              автоматизировать.
            </p>
            <p>Отвечаю в течение часа в рабочее время.</p>
          </div>
          <div className="mt-8">
            <a
              href={about.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "font-mono",
              )}
            >
              {"> "}написать в Telegram {about.telegram}
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </SectionShell>
  );
}
