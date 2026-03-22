"use client";

import { useState, type JSX } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FloatingBar } from "@/components/floating-bar";
import { AuthQuote } from "@/components/auth-quote";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      setError(error.message ?? "error al iniciar sesión");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <>
      <ViewTransition enter="vt-fade" exit="vt-fade">
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-serif">hola de nuevo</h1>
              <AuthQuote />
            </div>

            <form id="login-form" className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
              />
              <input
                type="password"
                placeholder="contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="text-sm text-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                {loading ? "entrando..." : "entrar"}
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
