import { about } from "@/content/about";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {about.name} · {about.city}
        </span>
        <a
          href={about.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-primary"
        >
          {about.telegram}
        </a>
      </div>
    </footer>
  );
}
