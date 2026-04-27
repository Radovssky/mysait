import Image from "next/image";
import Link from "next/link";

import type { Project } from "../../../drizzle/schema";

const categoryLabels: Record<string, string> = {
  chatbot: "чат-бот",
  ai_agent: "AI-агент",
  voice: "голос",
  content: "контент",
  custom: "кастом",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_30px_-5px_var(--brand-glow)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            {"// no cover"}
          </div>
        )}
      </div>
      <div className="p-6">
        {project.category && (
          <span className="inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {categoryLabels[project.category] ?? project.category}
          </span>
        )}
        <h3 className="mt-3 font-mono text-xl font-semibold leading-tight">
          {project.title}
        </h3>
        <p className="mt-3 text-muted-foreground">{project.shortDescription}</p>
      </div>
    </Link>
  );
}
