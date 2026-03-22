import type { Metadata } from "next";
import Link from "next/link";
import { FloatingBar } from "@/components/floating-bar";

export const metadata: Metadata = {
  title: "filosofía — cruda",
  description:
    "sin métricas, sin audiencia, sin algoritmo. un espacio para compartir arte, no contenido.",
  openGraph: {
    title: "filosofía — cruda",
    description:
      "sin métricas, sin audiencia, sin algoritmo. un espacio para compartir arte, no contenido.",
  },
};

export default function PhilosophyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-dvh flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl">{children}</div>
      </div>

      <FloatingBar>
        <Link
          href="/"
          className="text-sm text-foreground/80 hover:text-foreground transition-colors"
        >
          home
        </Link>
      </FloatingBar>
    </>
  );
}
