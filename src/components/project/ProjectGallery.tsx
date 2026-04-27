import Image from "next/image";

import type { ProjectScreenshot } from "../../../drizzle/schema";

export function ProjectGallery({
  screenshots,
}: {
  screenshots: ProjectScreenshot[];
}) {
  if (screenshots.length === 0) return null;

  return (
    <section className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>скриншоты
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {screenshots.map((shot) => (
            <figure
              key={shot.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={shot.imagePath}
                  alt={shot.caption ?? ""}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {shot.caption && (
                <figcaption className="px-4 py-3 font-mono text-sm text-muted-foreground">
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
