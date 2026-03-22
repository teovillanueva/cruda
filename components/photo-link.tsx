"use client";

import Link from "next/link";
import { useCallback, useRef, type ReactNode } from "react";
import { getImageProps } from "next/image";
import type { PhotoWithUser } from "@/lib/types";

export function PhotoLink({
  photo,
  children,
  className,
  transitionTypes,
}: {
  photo: PhotoWithUser;
  children: ReactNode;
  className?: string;
  transitionTypes?: string[];
}) {
  const prefetched = useRef(false);

  const handlePointerEnter = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;

    const isPortrait = photo.height > photo.width;
    const { props: imgProps } = getImageProps({
      alt: "",
      src: photo.url,
      width: photo.width,
      height: photo.height,
      sizes: isPortrait ? "(min-width: 1024px) 60vw, 100vw" : "100vw",
    });

    const img = new window.Image();
    if (imgProps.srcSet) {
      img.srcset = imgProps.srcSet;
      img.sizes = imgProps.sizes ?? "100vw";
    } else {
      img.src = imgProps.src;
    }
  }, [photo]);

  return (
    <Link
      href={`/photo/${photo.id}`}
      className={className}
      onMouseEnter={handlePointerEnter}
      transitionTypes={transitionTypes}
    >
      {children}
    </Link>
  );
}
