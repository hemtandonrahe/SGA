"use client";

import { useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ComboboxOption = { value: string; label: string };

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  disabled,
}: {
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-border-strong bg-bg-raised px-4 text-sm outline-none transition-colors",
            "focus:border-accent-border focus:ring-2 focus:ring-accent/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            selected ? "text-text-primary" : "text-text-muted"
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="size-4 shrink-0 text-text-muted" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-md border border-border-strong bg-bg-elevated shadow-xl"
        >
          <Command className="flex flex-col">
            <CommandInput
              placeholder={searchPlaceholder}
              className="w-full border-b border-border-subtle bg-transparent px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
            <CommandList className="max-h-64 overflow-y-auto p-1">
              <CommandEmpty className="px-3 py-6 text-center text-sm text-text-muted">
                {emptyText}
              </CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      onValueChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm text-text-secondary outline-none",
                      "data-[selected=true]:bg-bg-elevated-2 data-[selected=true]:text-text-primary"
                    )}
                  >
                    <Check
                      className={cn("size-4 shrink-0", opt.value === value ? "text-accent" : "opacity-0")}
                    />
                    <span className="truncate">{opt.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
