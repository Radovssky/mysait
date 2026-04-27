import { desc } from "drizzle-orm";
import Link from "next/link";

import { auth } from "@/auth";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { projects } from "@db/schema";

import { togglePublishAction } from "./projects/_actions";

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  chatbot: "чат-бот",
  ai_agent: "AI-агент",
  voice: "голос",
  content: "контент",
  custom: "кастом",
};

export default async function AdminDashboard() {
  const session = await auth();
  const list = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.sortOrder), desc(projects.updatedAt));

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">{"// "}</span>админ-панель
          </p>
          <h1 className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            Кейсы
          </h1>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            вошли как: {session?.user?.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className={cn(
              buttonVariants({ variant: "default" }),
              "font-mono",
            )}
          >
            {"> "}новый кейс
          </Link>
          <LogoutButton />
        </div>
      </header>

      <section className="mt-12 overflow-hidden rounded-xl border border-border bg-card">
        {list.length === 0 ? (
          <p className="p-8 font-mono text-sm text-muted-foreground">
            <span className="text-primary">{"// "}</span>
            кейсов ещё нет — нажмите «новый кейс».
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-background/40 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">slug · заголовок</th>
                  <th className="px-4 py-3 text-left">категория</th>
                  <th className="px-4 py-3 text-left">статус</th>
                  <th className="px-4 py-3 text-left">order</th>
                  <th className="px-4 py-3 text-right">действия</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="font-mono text-xs text-muted-foreground">
                        {row.slug}
                      </div>
                      <div className="mt-1 text-foreground">{row.title}</div>
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-xs text-muted-foreground">
                      {row.category
                        ? (categoryLabels[row.category] ?? row.category)
                        : "—"}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <form
                        action={togglePublishAction.bind(
                          null,
                          row.id,
                          row.isPublished,
                        )}
                      >
                        <button
                          type="submit"
                          className={cn(
                            "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                            row.isPublished
                              ? "border-primary/60 bg-primary/10 text-primary hover:bg-primary/20"
                              : "border-border bg-muted text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {row.isPublished ? "опубликован" : "черновик"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-xs">
                      {row.sortOrder}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/projects/${row.id}/edit`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "font-mono",
                          )}
                        >
                          редактировать
                        </Link>
                        {row.isPublished && (
                          <Link
                            href={`/projects/${row.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "ghost",
                                size: "sm",
                              }),
                              "font-mono",
                            )}
                          >
                            открыть
                          </Link>
                        )}
                        <DeleteProjectButton id={row.id} title={row.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

// «Button» helper — namespace import keeps the dashboard renderable when
// other admin views are built on top of the same primitives.
export { Button };
