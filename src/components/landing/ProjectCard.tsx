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
      className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_40px_-10px_var(--brand-glow)]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary/50 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
      {project.coverImage && (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="p-6">
        {project.category && (
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 font-mono text-xs uppercase tracking-[0.16em] text-primary">
            {categoryLabels[project.category] ?? project.category}
          </span>
        )}
        <h3 className="mt-3 font-sans text-xl font-bold leading-tight tracking-tight">
          {project.title}
        </h3>
        <p className="mt-3 text-muted-foreground">{project.shortDescription}</p>
      </div>
    </Link>
  );
}
