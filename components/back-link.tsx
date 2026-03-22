"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-foreground/60 hover:text-foreground transition-colors text-sm"
    >
      &larr;
    </button>
  );
}
