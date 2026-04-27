"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { about } from "@/content/about";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "о себе" },
  { href: "#services", label: "услуги" },
  { href: "#stack", label: "стек" },
  { href: "#projects", label: "кейсы" },
  { href: "#contact", label: "контакт" },
];

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Админка живёт под собственным layout — публичный nav там не нужен.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 sm:h-16 sm:px-10 lg:px-16">
        <a href="#" className="group flex items-center gap-2 font-mono text-sm">
          <span className="text-primary transition-transform duration-300 group-hover:rotate-12">
            {"</>"}
          </span>
          <span className="text-foreground">radovssky</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={about.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "sm", variant: "default" }),
            "font-mono",
          )}
        >
          {"> "}связаться
        </a>
      </div>
    </header>
  );
}
