"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, ChevronDown, Zap, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS } from "@/utils/constants";
import { useState } from "react";

const SEARCH_PLACEHOLDER: Record<string, string> = {
  "/":          "Search tools...",
  "/tools":     "Search in tools catalog...",
  "/analytics": "Search metrics, insights...",
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const placeholder = SEARCH_PLACEHOLDER[pathname] ?? "Search...";

  return (
    <header className="sticky top-0 z-50 bg-ui-card/80 backdrop-blur-md border-b border-ui-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm hidden sm:block">TechCorp</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-brand-white"
                  : "text-ui-muted hover:text-ui-text hover:bg-ui-border"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-auto">
          <div className="relative hidden sm:block flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-muted" />
            <input
              type="text"
              placeholder={placeholder}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-ui-bg border border-ui-border focus:outline-none focus:ring-2 focus:ring-brand-purple/40 transition-all"
            />
          </div>
          <ThemeToggle />

          <button className="relative p-2 rounded-xl hover:bg-ui-border transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-ui-card" />
          </button>

          <button className="p-2 rounded-xl hover:bg-ui-border transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          <button className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-xl hover:bg-ui-border transition-colors">
            <div className="w-7 h-7 rounded-full bg-mist-200 " />
            <ChevronDown className="w-3.5 h-3.5 text-ui-muted" />
          </button>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-ui-border"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ui-border px-4 py-3 space-y-1 animate-fade-in">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-muted" />
            <input
              type="text"
              placeholder={placeholder}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-ui-bg border border-ui-border focus:outline-none"
            />
          </div>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-brand-white"
                  : "text-ui-muted hover:bg-ui-border"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}