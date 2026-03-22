import { useQuery } from "@tanstack/react-query";
import type { PhotoWithUser } from "@/lib/types";

export function usePhoto(id: string) {
  return useQuery({
    queryKey: ["photo", id],
    queryFn: async (): Promise<PhotoWithUser> => {
      const res = await fetch(`/api/photos/${id}`);
      if (!res.ok) throw new Error("Failed to fetch photo");
      return res.json();
    },
  });
}
