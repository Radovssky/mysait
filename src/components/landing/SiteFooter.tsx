import { about } from "@/content/about";
import { lastUpdatedDisplay, lastUpdatedIso } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {about.telegram} · {about.city}
        </span>
        <span>
          <span className="text-primary">{"// "}</span>обновлено:{" "}
          <time dateTime={lastUpdatedIso}>{lastUpdatedDisplay}</time>
        </span>
      </div>
    </footer>
  );
}
