"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HomeBar, type HomeTab } from "@/components/home-bar";
import { VirtualMasonryGrid } from "@/components/virtual-masonry-grid";
import { EmptyState } from "@/components/empty-state";
import { Logo } from "@/components/logo";
import {
  usePhotos,
  useRandomPhotos,
  useFeedPhotos,
} from "@/lib/hooks/use-photos";
import { useAuth } from "@/lib/auth-context";

function useActivePhotos(tab: HomeTab) {
  const recent = usePhotos();
  const random = useRandomPhotos();
  const feed = useFeedPhotos();

  const queries = { recientes: recent, random, feed } as const;
  const q = queries[tab];

  return {
    photos: q.data?.pages.flatMap((p) => p.photos) ?? [],
    fetchNextPage: q.fetchNextPage,
    hasNextPage: q.hasNextPage ?? false,
    isFetchingNextPage: q.isFetchingNextPage,
  };
}

export function HomeContent() {
  const [tab, setTab] = useState<HomeTab>("recientes");
  const { user } = useAuth();
  const { photos, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useActivePhotos(tab);

  useEffect(() => {
    if (!user && tab === "feed") {
      setTab("recientes");
    }
  }, [user, tab]);

  return (
    <>
      <header className="flex items-center justify-between px-4 h-12">
        <Link href="/">
          <Logo size={16} />
        </Link>
        <Link
          href="/mas"
          className="text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          más
        </Link>
      </header>
      <div className="px-1 pb-24">
        {photos.length === 0 && !isFetchingNextPage ? (
          <EmptyState message="no hay fotos todavía" />
        ) : (
          <VirtualMasonryGrid
            photos={photos}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>

      <HomeBar tab={tab} onTabChange={setTab} />
    </>
  );
}
