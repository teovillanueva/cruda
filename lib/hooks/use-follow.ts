import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "@/lib/types";

export function useFollowToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to toggle follow");
      return res.json() as Promise<{ followed: boolean }>;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      // Optimistic update on user profile cache
      queryClient.setQueriesData<UserProfile>(
        { queryKey: ["user"] },
        (old) => {
          if (!old || old.id !== userId) return old;
          return { ...old, isFollowed: !old.isFollowed };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["photos", "feed"] });
    },
  });
}
