import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  eyebrow: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  className,
  children,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 border-t border-border/60 px-6 py-24 sm:px-10 lg:px-16",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>
          {eyebrow}
        </p>
        {title && (
          <h2 className="mt-4 max-w-3xl font-mono text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
            {title}
          </h2>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
