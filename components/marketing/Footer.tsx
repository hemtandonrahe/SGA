import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} SGA. The trusted competitive network for simulated golf.
        </p>
        <nav className="flex gap-6 text-sm text-text-secondary">
          <Link href="/blog" className="hover:text-text-primary">
            Blog
          </Link>
          <Link href="/#waitlist" className="hover:text-text-primary">
            Join the waitlist
          </Link>
        </nav>
      </div>
    </footer>
  );
}
