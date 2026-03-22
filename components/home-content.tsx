"use client";

import { useState, useEffect } from "react";
import { HomeBar, type HomeTab } from "@/components/home-bar";
import { VirtualMasonryGrid } from "@/components/virtual-masonry-grid";
import { EmptyState } from "@/components/empty-state";
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
      <div className="px-1 pt-1 pb-24">
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
