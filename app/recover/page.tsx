"use client";

import { useState } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import { FloatingBar } from "@/components/floating-bar";
import { AuthQuote } from "@/components/auth-quote";
import { authClient } from "@/lib/auth-client";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError(error.message ?? "error al enviar enlace");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <>
      <ViewTransition enter="vt-fade" exit="vt-fade">
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-serif">no pasa nada</h1>
              <AuthQuote />
            </div>

            {sent ? (
              <p className="text-sm text-muted">
                si el email existe, recibirás un enlace para restablecer tu contraseña.
              </p>
            ) : (
              <form id="recover-form" className="space-y-5" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? "enviando..." : "enviar enlace"}
                </button>
              </form>
            )}

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
