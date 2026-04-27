import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProjectNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md space-y-6 text-center">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>404
        </p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight">
          Кейс не найден
        </h1>
        <p className="text-muted-foreground">
          Возможно, страница ещё не опубликована или ссылка устарела.
        </p>
        <Link
          href="/#projects"
          className={cn(buttonVariants({ variant: "outline" }), "font-mono")}
        >
          ко всем кейсам
        </Link>
      </div>
    </main>
  );
}
