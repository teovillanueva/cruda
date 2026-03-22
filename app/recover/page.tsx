import Link from "next/link";
import { FloatingBar } from "@/components/floating-bar";

export default function RecoverPage() {
  return (
    <>
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-serif">recuperar contraseña</h1>
            <p className="text-sm text-muted">
              te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          <form className="space-y-5">
            <input
              type="email"
              placeholder="email"
              className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              className="w-full text-sm py-2.5 bg-foreground text-background"
            >
              enviar enlace
            </button>
          </form>

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
