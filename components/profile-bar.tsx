"use client";

import Link from "next/link";
import { useFollowToggle } from "@/lib/hooks/use-follow";
import { useUser } from "@/lib/hooks/use-user";
import { FloatingBar } from "@/components/floating-bar";
import { BackLink } from "@/components/back-link";
import { useAuth } from "@/lib/auth-context";

export type ProfileTab = "fotos" | "guardadas";

export function ProfileBar({
  userId,
  username,
  tab,
  onTabChange,
}: {
  userId: string;
  username: string;
  tab?: ProfileTab;
  onTabChange?: (tab: ProfileTab) => void;
}) {
  const { user: currentUser } = useAuth();
  const { data: profile } = useUser(username);
  const followToggle = useFollowToggle();

  const followed = profile?.isFollowed ?? false;
  const isOwnProfile = currentUser?.id === userId;

  return (
    <FloatingBar>
      <BackLink />
      <div className="h-3 w-px bg-foreground/10" />
      {isOwnProfile && tab && onTabChange ? (
        <>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onTabChange("fotos")}
              className={`transition-colors ${
                tab === "fotos" ? "text-foreground" : "text-foreground/40"
              }`}
            >
              fotos
            </button>
            <span className="text-foreground/30">/</span>
            <button
              onClick={() => onTabChange("guardadas")}
              className={`transition-colors ${
                tab === "guardadas" ? "text-foreground" : "text-foreground/40"
              }`}
            >
              guardadas
            </button>
          </div>
          <div className="h-3 w-px bg-foreground/10" />
          <Link
            href="/upload"
            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            subir
          </Link>
          <div className="h-3 w-px bg-foreground/10" />
        </>
      ) : currentUser && !isOwnProfile ? (
        <>
          <button
            onClick={() => followToggle.mutate(userId)}
            className={`text-sm whitespace-nowrap transition-colors ${
              followed
                ? "text-foreground"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            {followed ? "siguiendo" : "seguir"}
          </button>
          <div className="h-3 w-px bg-foreground/10" />
        </>
      ) : null}
      <Link
        href="/"
        className="text-sm italic tracking-wide whitespace-nowrap text-foreground/80 hover:text-foreground transition-colors"
      >
        cruda
      </Link>
    </FloatingBar>
  );
}
