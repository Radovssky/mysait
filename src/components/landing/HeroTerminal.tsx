export function HeroTerminal() {
  return (
    <div className="relative">
      {/* glow halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-3xl bg-primary/10 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl backdrop-blur-sm">
        {/* terminal chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-background/40 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">
            ~/automation.ts
          </span>
        </div>

        {/* code body */}
        <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
          <div>
            <span className="text-muted-foreground">$ </span>
            <span className="text-foreground">n8n workflow run</span>
          </div>
          <div className="pl-4 text-muted-foreground">
            →{" "}
            <span className="text-foreground">webhook</span>
            <span className="text-primary"> · </span>
            <span className="text-foreground">llm.classify</span>
            <span className="text-primary"> · </span>
            <span className="text-foreground">bitrix.update_deal</span>
          </div>
          <div className="pl-4 text-muted-foreground">
            <span className="text-primary">{"// "}</span>47 заявок обработано
          </div>
          <div className="pt-2">
            <span className="text-primary">✓ </span>
            <span className="text-foreground">done in 12s</span>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="text-muted-foreground">
              <span className="text-primary">$ </span>
              <span className="text-foreground">avito.agent --watch</span>
            </div>
            <div className="pl-4 text-muted-foreground">
              <span className="text-foreground">[INFO]</span> 100 объявлений в
              мониторинге
            </div>
            <div className="pl-4 text-muted-foreground">
              <span className="text-foreground">[CHAT]</span> новый лид →
              квалификация → КП
            </div>
            <div className="pl-4">
              <span className="text-primary">→ </span>
              <span className="text-foreground">передано продавцу</span>
            </div>
          </div>
        </div>
      </div>

      {/* floating tag */}
      <span className="absolute -bottom-3 left-6 rounded-md border border-primary/40 bg-card px-3 py-1.5 font-mono text-xs shadow-lg">
        <span className="text-primary">{"</>"}</span>{" "}
        <span className="text-foreground">automation</span>
      </span>
    </div>
  );
}
