import { useInfiniteQuery } from "@tanstack/react-query";
import type { PhotoPage } from "@/lib/types";

async function fetchPhotoPage(
  endpoint: string,
  cursor?: string,
): Promise<PhotoPage> {
  const url = new URL(endpoint, window.location.origin);
  if (cursor) url.searchParams.set("cursor", cursor);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch photos");
  return res.json();
}

export function usePhotos() {
  return useInfiniteQuery({
    queryKey: ["photos", "recent"],
    queryFn: ({ pageParam }) => fetchPhotoPage("/api/photos", pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useRandomPhotos() {
  return useInfiniteQuery({
    queryKey: ["photos", "random"],
    queryFn: ({ pageParam }) =>
      fetchPhotoPage("/api/photos/random", pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useFeedPhotos() {
  return useInfiniteQuery({
    queryKey: ["photos", "feed"],
    queryFn: ({ pageParam }) => fetchPhotoPage("/api/photos/feed", pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useSavedPhotos() {
  return useInfiniteQuery({
    queryKey: ["photos", "saved"],
    queryFn: ({ pageParam }) => fetchPhotoPage("/api/photos/saved", pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
