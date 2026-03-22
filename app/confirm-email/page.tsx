import Link from "next/link";
import { FloatingBar } from "@/components/floating-bar";

export default function ConfirmEmailPage() {
  return (
    <>
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-serif">revisa tu correo</h1>
            <p className="text-sm text-muted">
              te enviamos un enlace de confirmación. revisá tu bandeja de
              entrada y hacé clic en el enlace para continuar.
            </p>
          </div>

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
