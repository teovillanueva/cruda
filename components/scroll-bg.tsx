"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const disabledPaths = ["/login", "/register", "/recover", "/confirm-email", "/philosophy"];

export function ScrollBackground() {
  const pathname = usePathname();
  const disabled = disabledPaths.includes(pathname);

  useEffect(() => {
    if (disabled) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, [disabled]);

  return null;
}
