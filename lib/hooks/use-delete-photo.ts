import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete photo");
      return res.json() as Promise<{ deleted: boolean }>;
    },
    onSuccess: (_data, photoId) => {
      queryClient.removeQueries({ queryKey: ["photo", photoId] });
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}
