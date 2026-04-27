import { about } from "@/content/about";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl font-mono text-xs text-muted-foreground">
        <span>
          © {new Date().getFullYear()} {about.telegram} · {about.city}
        </span>
      </div>
    </footer>
  );
}
