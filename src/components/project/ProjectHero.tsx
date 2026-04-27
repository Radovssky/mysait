import Image from "next/image";

import type { Project } from "../../../drizzle/schema";

export function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="px-6 pt-24 pb-12 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-4xl">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>кейс
          {project.client && (
            <>
              {" — "}
              <span className="text-foreground">{project.client}</span>
            </>
          )}
        </p>
        <h1 className="mt-4 font-mono text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          {project.shortDescription}
        </p>
        {project.stack && project.stack.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground/90"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        {project.coverImage && (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
