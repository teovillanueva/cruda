"use client";

import Link from "next/link";
import { FloatingBar } from "./floating-bar";
import { useAuth } from "@/lib/auth-context";
import { useSocial } from "@/lib/social-context";

export type HomeTab = "recientes" | "trending" | "guardadas";

export function HomeBar({
  tab,
  onTabChange,
}: {
  tab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}) {
  const { user } = useAuth();
  const { savedPhotoIds } = useSocial();

  const showGuardadas = !!user && savedPhotoIds.size > 0;

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
          onClick={() => onTabChange("trending")}
          className={`transition-colors ${
            tab === "trending" ? "text-foreground" : "text-foreground/40"
          }`}
        >
          trending
        </button>
        {showGuardadas && (
          <>
            <span className="text-foreground/30">/</span>
            <button
              onClick={() => onTabChange("guardadas")}
              className={`transition-colors ${
                tab === "guardadas" ? "text-foreground" : "text-foreground/40"
              }`}
            >
              guardadas
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
