import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PhotoWithUser } from "@/lib/types";

interface EditInput {
  id: string;
  title?: string | null;
  description?: string | null;
}

export function useEditPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: EditInput): Promise<PhotoWithUser> => {
      const res = await fetch(`/api/photos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update photo");
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<PhotoWithUser>(["photo", updated.id], updated);
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}
