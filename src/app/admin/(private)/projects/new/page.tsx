import Link from "next/link";

import { ProjectForm } from "@/components/admin/ProjectForm";

import { createProjectAction } from "../_actions";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <header className="space-y-3">
        <Link
          href="/admin"
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {"<- "}все кейсы
        </Link>
        <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          Новый кейс
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">{"// "}</span>
          медиа (cover, скриншоты, отзыв) подключим на шаге 8 плана.
        </p>
      </header>
      <div className="mt-12">
        <ProjectForm
          action={createProjectAction}
          submitLabel="создать кейс"
        />
      </div>
    </main>
  );
}
