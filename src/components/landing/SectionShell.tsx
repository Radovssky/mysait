import { cn } from "@/lib/utils";

import { SectionEyebrow } from "./SectionEyebrow";

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
        "scroll-mt-20 relative px-6 py-24 sm:px-10 lg:px-16",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent"
      />
      <div className="mx-auto w-full max-w-6xl">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        {title && (
          <h2 className="mt-5 max-w-3xl font-sans text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
