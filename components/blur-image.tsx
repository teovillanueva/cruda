"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useCallback } from "react";

export function BlurImage({ quality = 60, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <Image
      {...props}
      quality={quality}
      ref={imgRef}
      className={`${props.className ?? ""} transition-[filter,opacity] duration-700 ease-out ${
        loaded ? "blur-0 opacity-100" : "blur-sm opacity-30"
      }`}
      onLoad={(e) => {
        setLoaded(true);
        props.onLoad?.(e);
      }}
    />
  );
}
