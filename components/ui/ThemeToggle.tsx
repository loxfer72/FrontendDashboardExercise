"use client";

import { Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toggleTheme } from "@/store/themeSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const isDark   = useAppSelector((s) => s.theme.isDark);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-xl hover:bg-ui-border transition-colors"
      aria-label="Toggle theme"
    >
      {isDark
        ? <Sun  className="w-5 h-5 text-amber-400" />
        : <Moon className="w-5 h-5 text-ui-muted"  />
      }
    </button>
  );
}