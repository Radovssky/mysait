import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { db } from "@/lib/db";
import { projects } from "@db/schema";

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
      <div className="mt-12">
        <ProjectForm
          action={boundUpdate}
          initial={project}
          submitLabel="сохранить"
          successMessage="Сохранено"
        />
      </div>
    </main>
  );
}
