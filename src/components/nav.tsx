"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 bg-[#e8dcc8]/90 backdrop-blur-sm border-b-2 border-red-pen/20">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-typewriter)] text-xl text-ink tracking-wide"
        >
          🍴 Napi Meal Planning
        </Link>
        <nav className="flex gap-2">
          <Link
            href="/"
            className={`font-[family-name:var(--font-typewriter)] px-3 py-1.5 text-sm transition-colors ${
              pathname === "/"
                ? "text-red-pen red-underline"
                : "text-muted hover:text-ink"
            }`}
          >
            📖 Menu
          </Link>
          <Link
            href="/plan"
            className={`font-[family-name:var(--font-typewriter)] px-3 py-1.5 text-sm transition-colors ${
              pathname === "/plan"
                ? "text-red-pen red-underline"
                : "text-muted hover:text-ink"
            }`}
          >
            📅 This Week
          </Link>
        </nav>
      </div>
    </header>
  );
}
