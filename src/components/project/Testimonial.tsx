import Image from "next/image";

import type { Testimonial as TestimonialRow } from "../../../drizzle/schema";

export function Testimonial({
  testimonials,
}: {
  testimonials: TestimonialRow[];
}) {
  if (testimonials.length === 0) return null;
  const [first] = testimonials;

  return (
    <section className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-3xl">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>отзыв
        </p>
        <figure className="mt-6 rounded-2xl border border-border bg-card p-8">
          <blockquote className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
            «{first.text}»
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-4">
            {first.photoPath && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border">
                <Image
                  src={first.photoPath}
                  alt={first.authorName}
                  fill
                  sizes="48px"
                  className="object-cover grayscale"
                />
              </div>
            )}
            <div className="font-mono text-sm">
              <div className="text-foreground">{first.authorName}</div>
              {first.authorRole && (
                <div className="text-muted-foreground">{first.authorRole}</div>
              )}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
