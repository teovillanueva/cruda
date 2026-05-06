"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";

export default function MasPage() {
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-lg">
        <Link
          href="/"
          className="text-foreground/80 hover:text-foreground transition-colors"
        >
          home
        </Link>
        <Link
          href="/philosophy"
          className="text-foreground/80 hover:text-foreground transition-colors"
        >
          filosofía
        </Link>
        <Link
          href="https://github.com/teovillanueva/cruda"
          className="text-foreground/80 hover:text-foreground transition-colors"
        >
          código
        </Link>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="text-foreground/80 hover:text-foreground transition-colors"
          suppressHydrationWarning
        >
          {mounted ? (resolvedTheme === "dark" ? "claro" : "oscuro") : "tema"}
        </button>
        {user && (
          <button
            onClick={logout}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
}
