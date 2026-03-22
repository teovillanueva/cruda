import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { UserProfile, PhotoPage } from "@/lib/types";

export function useUser(username: string) {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async (): Promise<UserProfile> => {
      const res = await fetch(`/api/users/${username}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });
}

export function useUserPhotos(username: string) {
  return useInfiniteQuery({
    queryKey: ["user", username, "photos"],
    queryFn: async ({ pageParam }): Promise<PhotoPage> => {
      const url = new URL(
        `/api/users/${username}/photos`,
        window.location.origin,
      );
      if (pageParam) url.searchParams.set("cursor", pageParam);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch user photos");
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
