import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { prefetchRecentPhotos } from "@/lib/prefetch";
import { getSessionUser } from "@/lib/session";
import { HomeContent } from "@/components/home-content";

export default async function Home() {
  const user = await getSessionUser();
  const queryClient = getQueryClient();

  await prefetchRecentPhotos(queryClient, user?.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent />
    </HydrationBoundary>
  );
}
