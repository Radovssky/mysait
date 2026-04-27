import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-2xl space-y-6 text-center sm:text-left">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>scaffold ready
        </p>
        <h1 className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
          Раду<span className="text-primary">_</span>
        </h1>
        <p className="text-muted-foreground">
          Automation Engineer. Лендинг в разработке — секции появятся на шаге 3
          плана.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Button>{"> "}написать в Telegram</Button>
          <Button variant="outline">смотреть кейсы</Button>
        </div>
      </div>
    </main>
  );
}
