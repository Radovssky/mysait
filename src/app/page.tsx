import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Hero } from "@/components/landing/Hero";
import { Process } from "@/components/landing/Process";
import { Services } from "@/components/landing/Services";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TechStack } from "@/components/landing/TechStack";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <TechStack />
        <Process />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
