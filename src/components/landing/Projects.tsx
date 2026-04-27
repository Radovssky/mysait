import { getPublishedProjects } from "@/lib/projects";

import { ProjectCard } from "./ProjectCard";
import { RevealOnScroll } from "./RevealOnScroll";
import { SectionShell } from "./SectionShell";

export async function Projects() {
  const items = await getPublishedProjects();

  return (
    <SectionShell id="projects" eyebrow="кейсы" title="Что я уже сделал">
      {items.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          {"// "}первые кейсы появятся здесь скоро.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((project, index) => (
            <RevealOnScroll key={project.id} delay={index * 0.05}>
              <ProjectCard project={project} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
