import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PhotoWithUser, PhotoPage } from "@/lib/types";

export function useSaveToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      const res = await fetch("/api/saves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
      if (!res.ok) throw new Error("Failed to toggle save");
      return res.json() as Promise<{ saved: boolean }>;
    },
    onMutate: async (photoId) => {
      // Optimistic update: toggle isSaved on all matching photo entries
      await queryClient.cancelQueries({ queryKey: ["photos"] });
      await queryClient.cancelQueries({ queryKey: ["photo", photoId] });

      const updatePhoto = (photo: PhotoWithUser): PhotoWithUser =>
        photo.id === photoId ? { ...photo, isSaved: !photo.isSaved } : photo;

      const updatePage = (page: PhotoPage): PhotoPage => ({
        ...page,
        photos: page.photos.map(updatePhoto),
      });

      // Update infinite query caches
      queryClient.setQueriesData<{
        pages: PhotoPage[];
        pageParams: (string | undefined)[];
      }>({ queryKey: ["photos"] }, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map(updatePage) };
      });

      // Update single photo cache
      queryClient.setQueryData<PhotoWithUser>(
        ["photo", photoId],
        (old) => old && updatePhoto(old),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}
