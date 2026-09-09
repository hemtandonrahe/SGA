import { SplashHero } from "@/components/marketing/SplashHero";
import { SplashHighlights } from "@/components/marketing/SplashHighlights";
import { SplashBuildLog } from "@/components/marketing/SplashBuildLog";
import { SplashCTA } from "@/components/marketing/SplashCTA";
import { Footer } from "@/components/marketing/Footer";

// SplashBuildLog reads published posts straight from the DB — new posts must show
// up immediately rather than waiting out a static build's cache, same reasoning as
// the /blog index page.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <main className="flex-1">
        <SplashHero />
        <SplashHighlights />
        <SplashBuildLog />
        <SplashCTA />
      </main>
      <Footer />
    </>
  );
}
