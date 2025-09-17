"use client";

import React from "react";
import { useTheme, Theme } from "@/contexts/theme-context";
import { Button } from "../ui/button";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-lg border border-border bg-muted p-1">
        {options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant={theme === opt.value ? "default" : "ghost"}
            className={theme === opt.value ? "h-9 px-4" : "h-9 px-4 text-muted-foreground"}
            onClick={() => setTheme(opt.value)}
            aria-pressed={theme === opt.value}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Theme preference is saved to your browser.</p>
    </div>
  );
}
