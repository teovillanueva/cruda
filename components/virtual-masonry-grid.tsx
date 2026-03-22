"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { ViewTransition } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { BlurImage } from "@/components/blur-image";
import { PhotoLink } from "@/components/photo-link";
import type { PhotoWithUser } from "@/lib/types";

const GAP = 4; // matches gap-1 / mb-1 (0.25rem)

function VirtualColumn({
  photos,
  columnWidth,
}: {
  photos: PhotoWithUser[];
  columnWidth: number;
}) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    if (columnRef.current) {
      setScrollMargin(columnRef.current.offsetTop);
    }
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: photos.length,
    estimateSize: (i) => {
      const p = photos[i];
      return Math.round((p.height / p.width) * columnWidth) + GAP;
    },
    overscan: 5,
    scrollMargin,
  });

  return (
    <div ref={columnRef} className="flex-1 min-w-0">
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const photo = photos[virtualItem.index];
          return (
            <div
              key={photo.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start - scrollMargin}px)`,
                paddingBottom: GAP,
              }}
            >
              <PhotoLink
                photo={photo}
                className="block group"
                transitionTypes={["from-home"]}
              >
                <ViewTransition
                  name={`photo-${photo.id}`}
                  share="image-expand"
                  exit="vt-fade"
                  enter="vt-fade"
                >
                  <BlurImage
                    src={photo.url}
                    alt={photo.title ?? "sin titulo"}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
                  />
                </ViewTransition>
              </PhotoLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VirtualMasonryGrid({
  photos,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: {
  photos: PhotoWithUser[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(2);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(width);
      if (width >= 1024) setColumnCount(4);
      else if (width >= 640) setColumnCount(3);
      else setColumnCount(2);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const columnWidth =
    containerWidth > 0
      ? (containerWidth - GAP * (columnCount - 1)) / columnCount
      : 0;

  const columns = useMemo(() => {
    if (columnWidth === 0) return [];
    const cols: PhotoWithUser[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    const heights = new Array(columnCount).fill(0);

    for (const photo of photos) {
      const shortest = heights.indexOf(Math.min(...heights));
      cols[shortest].push(photo);
      heights[shortest] +=
        Math.round((photo.height / photo.width) * columnWidth) + GAP;
    }

    return cols;
  }, [photos, columnCount, columnWidth]);

  // Infinite scroll sentinel
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "600px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (columnWidth === 0) {
    return <div ref={containerRef} className="min-h-screen" />;
  }

  return (
    <div ref={containerRef}>
      <div className="flex" style={{ gap: GAP }}>
        {columns.map((colPhotos, i) => (
          <VirtualColumn
            key={`${i}-${columnCount}`}
            photos={colPhotos}
            columnWidth={columnWidth}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
