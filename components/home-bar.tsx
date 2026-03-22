"use client";

import Link from "next/link";
import { FloatingBar } from "./floating-bar";
import { useAuth } from "@/lib/auth-context";

export type HomeTab = "recientes" | "random" | "feed";

export function HomeBar({
  tab,
  onTabChange,
}: {
  tab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}) {
  const { user } = useAuth();

  return (
    <FloatingBar>
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => onTabChange("recientes")}
          className={`transition-colors ${
            tab === "recientes" ? "text-foreground" : "text-foreground/40"
          }`}
        >
          recientes
        </button>
        <span className="text-foreground/30">/</span>
        <button
          onClick={() => onTabChange("random")}
          className={`transition-colors ${
            tab === "random" ? "text-foreground" : "text-foreground/40"
          }`}
        >
          random
        </button>
        {user && (
          <>
            <span className="text-foreground/30">/</span>
            <button
              onClick={() => onTabChange("feed")}
              className={`transition-colors ${
                tab === "feed" ? "text-foreground" : "text-foreground/40"
              }`}
            >
              feed
            </button>
          </>
        )}
      </div>

      <div className="h-3 w-px bg-foreground/10" />

      {user ? (
        <Link
          href={`/profile/${user.username}`}
          className="text-sm italic text-foreground/80 hover:text-foreground transition-colors"
        >
          {user.name.split(" ")[0]}
        </Link>
      ) : (
        <Link
          href="/login"
          className="text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          entrar
        </Link>
      )}
    </FloatingBar>
  );
}
