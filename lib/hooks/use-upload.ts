import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upload } from "@vercel/blob/client";
import imageCompression from "browser-image-compression";
import type { PhotoWithUser } from "@/lib/types";

const MAX_SIZE_MB = 7.5;

interface UploadInput {
  file: File;
  width: number;
  height: number;
}

async function compressIfNeeded(file: File): Promise<File> {
  if (file.size <= MAX_SIZE_MB * 1024 * 1024) return file;

  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
  });

  return new File([compressed], file.name, { type: compressed.type });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, width, height }: UploadInput): Promise<PhotoWithUser> => {
      const processed = await compressIfNeeded(file);

      const blob = await upload(processed.name, processed, {
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
