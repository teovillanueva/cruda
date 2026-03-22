"use client";

import Link from "next/link";
import { useSocial } from "@/lib/social-context";
import { FloatingBar } from "@/components/floating-bar";
import { BackLink } from "@/components/back-link";

export function PhotoBar({ photoId }: { photoId: number }) {
  const { toggleSave, isSaved } = useSocial();

  const saved = isSaved(photoId);

  return (
    <FloatingBar>
      <BackLink />
      <div className="h-3 w-px bg-foreground/10" />
      <button
        onClick={() => toggleSave(photoId)}
        className={`text-sm whitespace-nowrap transition-colors ${
          saved
            ? "text-foreground"
            : "text-foreground/50 hover:text-foreground"
        }`}
      >
        {saved ? "guardada" : "guardar"}
      </button>
      <div className="h-3 w-px bg-foreground/10" />
      <Link
        href="/"
        className="text-sm italic tracking-wide whitespace-nowrap text-foreground/80 hover:text-foreground transition-colors"
      >
        cruda
      </Link>
    </FloatingBar>
  );
}
