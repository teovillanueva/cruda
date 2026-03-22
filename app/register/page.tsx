"use client";

import { useState } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FloatingBar } from "@/components/floating-bar";
import { AuthQuote } from "@/components/auth-quote";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      username,
    });

    if (error) {
      setError(error.message ?? "error al crear cuenta");
      setLoading(false);
    } else {
      router.push("/philosophy");
      router.refresh();
    }
  };

  return (
    <>
      <ViewTransition enter="vt-fade" exit="vt-fade">
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-4">
              <Logo size={28} />
              <div className="space-y-2">
                <h1 className="text-2xl font-serif">unite</h1>
                <AuthQuote />
              </div>
            </div>

            <form id="register-form" className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
              />
              <input
                type="text"
                placeholder="usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
              />
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
                {loading ? "creando..." : "crear cuenta"}
              </button>
            </form>

            <div>
              <Link
                href="/login"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                ya tengo cuenta
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
