"use client";

import { useState, useEffect } from "react";

const quotes = [
  "sin algoritmos, sin métricas",
  "compartí arte, no contenido",
  "la foto importa, el número no",
  "un espacio sin ruido",
  "fotografía por amor",
];

export function AuthQuote() {
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <p
      className="text-sm font-serif italic text-muted transition-opacity duration-500"
      style={{ opacity: quote ? 1 : 0 }}
    >
      {quote ?? "\u00A0"}
    </p>
  );
}
