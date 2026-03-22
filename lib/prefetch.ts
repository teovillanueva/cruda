import "server-only";

import type { QueryClient } from "@tanstack/react-query";
import type { PhotoPage } from "@/lib/types";
import { getRecentPhotos } from "@/lib/queries";

export async function prefetchRecentPhotos(
  queryClient: QueryClient,
  userId?: string,
) {
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["photos", "recent"],
    queryFn: () => getRecentPhotos(userId),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PhotoPage) => lastPage.nextCursor ?? undefined,
  });
}
