import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-provider";
import { ScrollBackground } from "@/components/scroll-bg";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cruda.app"),
  title: "cruda",
  description: "fotografía en estado puro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sourceSerif.variable} h-full antialiased`}>
      <body className="min-h-full font-serif">
        <QueryProvider>
          <AuthProvider>
            <ScrollBackground />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
