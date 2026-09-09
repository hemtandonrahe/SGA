import Link from "next/link";
import { Logo } from "./Logo";
import { buttonVariants } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Deliberately minimal — no menu, no waitlist form fields, just the mark and a
// single way forward. The full nav (Nav.tsx) with its section links only makes
// sense once you're on /join, where those sections actually exist on the page.
export function SplashNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/join" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            Learn more
          </Link>
        </div>
      </div>
    </header>
  );
}
