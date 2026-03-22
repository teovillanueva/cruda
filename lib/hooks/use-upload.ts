import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upload } from "@vercel/blob/client";
import type { PhotoWithUser } from "@/lib/types";

interface UploadInput {
  file: File;
  width: number;
  height: number;
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, width, height }: UploadInput): Promise<PhotoWithUser> => {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url, width, height }),
      });

      if (!res.ok) throw new Error("Failed to create photo");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}
