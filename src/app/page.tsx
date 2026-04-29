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
import { faqItems } from "@/content/faq";
import { services } from "@/content/services";
import { faqJsonLd, personJsonLd, serviceJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {serviceJsonLd(services).map((entry) => (
          <script
            key={entry.name}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
          />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
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
