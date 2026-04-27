import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/landing/SiteFooter";
import { MarkdownContent } from "@/components/project/MarkdownContent";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectHero } from "@/components/project/ProjectHero";
import { Testimonial } from "@/components/project/Testimonial";
import { getProjectBySlug, getPublishedSlugs } from "@/lib/projects";
import { projectJsonLd, toIso } from "@/lib/seo";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const path = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.shortDescription,
      url: path,
      images: project.coverImage ? [project.coverImage] : undefined,
      publishedTime: toIso(project.publishedAt),
      modifiedTime: toIso(project.updatedAt),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const jsonLd = projectJsonLd(project);

  return (
    <>
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProjectHero project={project} />
        <section className="px-6 pb-12 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-3xl space-y-12">
            {project.context && (
              <Block eyebrow="контекст" body={project.context} />
            )}
            {project.solution && (
              <Block eyebrow="решение" body={project.solution} />
            )}
            {project.result && (
              <Block eyebrow="результат" body={project.result} />
            )}
          </div>
        </section>
        <ProjectGallery screenshots={project.screenshots} />
        <Testimonial testimonials={project.testimonials} />
      </main>
      <SiteFooter />
    </>
  );
}

function Block({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-sm text-muted-foreground">
        <span className="text-primary">{"// "}</span>
        {eyebrow}
      </p>
      <div className="mt-4">
        <MarkdownContent>{body}</MarkdownContent>
      </div>
    </div>
  );
}
