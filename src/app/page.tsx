import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { Process } from "@/components/landing/Process";
import { Projects } from "@/components/landing/Projects";
import { Services } from "@/components/landing/Services";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TechStack } from "@/components/landing/TechStack";
import { Testimonials } from "@/components/landing/Testimonials";
import { personJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Hero />
        <About />
        <Services />
        <TechStack />
        <Process />
        <Projects />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
