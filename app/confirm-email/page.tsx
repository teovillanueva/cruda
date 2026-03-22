import { ViewTransition } from "react";
import Link from "next/link";
import { FloatingBar } from "@/components/floating-bar";
import { AuthQuote } from "@/components/auth-quote";

export default function ConfirmEmailPage() {
  return (
    <>
      <ViewTransition enter="vt-fade" exit="vt-fade">
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-serif">ya casi</h1>
              <AuthQuote />
            </div>

            <p className="text-sm text-muted">
              te enviamos un enlace de confirmación. revisá tu bandeja de
              entrada y hacé clic en el enlace para continuar.
            </p>

            <div>
              <Link
                href="/login"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                volver a entrar
              </Link>
            </div>
          </div>
        </div>
      </ViewTransition>

      <FloatingBar>
        <Link
          href="/"
          className="text-sm text-foreground/80 hover:text-foreground transition-colors"
        >
          cruda
        </Link>
      </FloatingBar>
    </>
  );
}
