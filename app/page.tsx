import { Nav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { WhyItMatters } from "@/components/marketing/WhyItMatters";
import { AudienceSection } from "@/components/marketing/AudienceSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WaitlistSection } from "@/components/marketing/WaitlistSection";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <WhyItMatters />
        <AudienceSection />
        <HowItWorks />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
