import Link from "next/link";
import { FloatingBar } from "@/components/floating-bar";

export default function LoginPage() {
  return (
    <>
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <h1 className="text-2xl font-serif">entrar</h1>

          <form className="space-y-5">
            <input
              type="email"
              placeholder="email"
              className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
            />
            <input
              type="password"
              placeholder="contraseña"
              className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              className="w-full text-sm py-2.5 bg-foreground text-background"
            >
              entrar
            </button>
          </form>

          <div className="flex justify-between">
            <Link
              href="/register"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              crear cuenta
            </Link>
            <Link
              href="/recover"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              olvidé mi contraseña
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
