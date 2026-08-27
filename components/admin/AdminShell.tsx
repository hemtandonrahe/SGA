"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ListChecks, Newspaper } from "lucide-react";
import { Logo } from "@/components/marketing/Logo";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { StaffRole } from "@/lib/auth/requireAdmin";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/waitlist", label: "Waitlist", icon: ListChecks },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];

export function AdminShell({ role, children }: { role: StaffRole; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border-subtle bg-bg-raised px-4 py-6 sm:flex">
        <Link href="/admin/dashboard" className="mb-8 px-2">
          <Logo />
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div className="sm:hidden">
            <Logo />
          </div>
          <Badge variant="accent" className="hidden sm:inline-flex">
            {role}
          </Badge>
          <div className="ml-auto">
            <UserButton />
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
