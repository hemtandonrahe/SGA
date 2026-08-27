"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getServerTheme, getStoredTheme, subscribeToThemeChange } from "@/lib/theme/theme";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  // useSyncExternalStore (not effect+setState) is the correct way to read/subscribe
  // to external state like localStorage — getServerTheme keeps SSR/hydration in
  // sync, and React itself corrects the client value right after hydration. No
  // effect needed here: the inline script (app/layout.tsx) already applies the
  // stored theme to the DOM before paint, and toggle() below is the only thing
  // that should ever write to it afterward.
  const theme = useSyncExternalStore(subscribeToThemeChange, getStoredTheme, getServerTheme);

  function toggle() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-text-secondary transition-colors hover:border-accent-border hover:text-accent",
        className
      )}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
