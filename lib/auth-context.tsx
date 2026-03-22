"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authClient } from "./auth-client";
import type { User } from "./mock-data";

interface AuthContextValue {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const user: User | null =
    session?.user
      ? {
          username: (session.user as { username?: string }).username ?? session.user.name,
          name: session.user.name,
        }
      : null;

  const login = () => router.push("/login");

  const logout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  if (isPending) {
    return null;
  }

  return (
    <AuthContext value={{ user, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
