"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function MasPage() {
  const { user, logout } = useAuth();

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
