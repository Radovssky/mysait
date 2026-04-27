import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { ScreenshotsManager } from "@/components/admin/ScreenshotsManager";
import { TestimonialEditor } from "@/components/admin/TestimonialEditor";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { projects, projectScreenshots, testimonials } from "@db/schema";

import { updateProjectAction } from "../../_actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) notFound();

  const [shots, [existingTestimonial]] = await Promise.all([
    db
      .select()
      .from(projectScreenshots)
      .where(eq(projectScreenshots.projectId, id))
      .orderBy(asc(projectScreenshots.sortOrder)),
    db
      .select()
      .from(testimonials)
      .where(eq(testimonials.projectId, id))
      .limit(1),
  ]);

  const boundUpdate = updateProjectAction.bind(null, id);

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
          {project.title}
        </h1>
        <p className="font-mono text-xs text-muted-foreground">{project.slug}</p>
      </header>

      <section className="mt-12">
        <ProjectForm
          action={boundUpdate}
          initial={project}
          submitLabel="сохранить"
          successMessage="Сохранено"
        />
      </section>

      <Separator className="my-16" />

      <section className="space-y-4">
        <header>
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">{"// "}</span>скриншоты
          </p>
          <h2 className="mt-2 font-mono text-2xl font-semibold">Галерея</h2>
        </header>
        <ScreenshotsManager projectId={id} screenshots={shots} />
      </section>

      <Separator className="my-16" />

      <section className="space-y-4">
        <header>
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">{"// "}</span>отзыв
          </p>
          <h2 className="mt-2 font-mono text-2xl font-semibold">
            {existingTestimonial ? "Редактировать отзыв" : "Добавить отзыв"}
          </h2>
        </header>
        <TestimonialEditor
          projectId={id}
          initial={existingTestimonial ?? null}
        />
      </section>
    </main>
  );
}
