type Props = {
  children: React.ReactNode;
};

export function SectionEyebrow({ children }: Props) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/30 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur-md shadow-[0_0_30px_-16px_var(--brand-glow)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span className="text-primary">{"// "}</span>
      {children}
    </span>
  );
}
