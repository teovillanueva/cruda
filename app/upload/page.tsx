"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FloatingBar } from "@/components/floating-bar";
import { BackLink } from "@/components/back-link";
import { UploadZone } from "@/components/upload-zone";
import { useUploadPhoto } from "@/lib/hooks/use-upload";
import { useAuth } from "@/lib/auth-context";

interface FileEntry {
  file: File;
  preview: string;
  width: number;
  height: number;
  status: "pending" | "uploading" | "done" | "error";
  photoId?: string;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const upload = useUploadPhoto();
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    router.replace("/login");
    return null;
  }

  const handleFiles = useCallback(async (files: File[]) => {
    const newEntries: FileEntry[] = await Promise.all(
      files.map(async (file) => {
        const { width, height } = await getImageDimensions(file);
        return {
          file,
          preview: URL.createObjectURL(file),
          width,
          height,
          status: "pending" as const,
        };
      }),
    );
    setEntries((prev) => [...prev, ...newEntries]);
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    const results: { index: number; photoId: string }[] = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.status === "done") continue;

      setEntries((prev) =>
        prev.map((e, idx) => (idx === i ? { ...e, status: "uploading" } : e)),
      );

      try {
        const photo = await upload.mutateAsync({
          file: entry.file,
          width: entry.width,
          height: entry.height,
        });
        results.push({ index: i, photoId: photo.id });
        setEntries((prev) =>
          prev.map((e, idx) =>
            idx === i ? { ...e, status: "done", photoId: photo.id } : e,
          ),
        );
      } catch {
        setEntries((prev) =>
          prev.map((e, idx) => (idx === i ? { ...e, status: "error" } : e)),
        );
      }
    }

    setUploading(false);

    const uploadedIds = results.map((r) => r.photoId);
    if (uploadedIds.length === 1) {
      router.push(`/photo/${uploadedIds[0]}/edit`);
    } else if (uploadedIds.length > 1) {
      const [first, ...rest] = uploadedIds;
      const next = rest.length > 0 ? `?next=${rest.join(",")}` : "";
      router.push(`/photo/${first}/edit${next}`);
    }
  };

  const hasFiles = entries.length > 0;
  const allDone = entries.length > 0 && entries.every((e) => e.status === "done");

  return (
    <>
      <div className="px-4 pt-8 pb-24">
        {!hasFiles ? (
          <UploadZone onFiles={handleFiles} disabled={uploading} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1">
              {entries.map((entry, i) => (
                <div key={i} className="relative aspect-square overflow-hidden">
                  <Image
                    src={entry.preview}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 33vw"
                  />
                  {entry.status === "uploading" && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <span className="text-xs text-foreground/60">subiendo...</span>
                    </div>
                  )}
                  {entry.status === "done" && (
                    <div className="absolute inset-0 bg-background/30" />
                  )}
                  {entry.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <span className="text-xs text-red-400">error</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!allDone && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="text-sm text-muted hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {uploading ? "subiendo..." : "subir"}
                </button>
                {!uploading && (
                  <button
                    onClick={() => setEntries([])}
                    className="text-sm text-foreground/30 hover:text-foreground/60 transition-colors"
                  >
                    cancelar
                  </button>
                )}
              </div>
            )}

            {!uploading && !allDone && (
              <UploadZone onFiles={handleFiles} />
            )}
          </div>
        )}
      </div>

      <FloatingBar>
        <BackLink />
        <div className="h-3 w-px bg-foreground/10" />
        <Link
          href="/"
          className="text-sm italic tracking-wide whitespace-nowrap text-foreground/80 hover:text-foreground transition-colors"
        >
          cruda
        </Link>
      </FloatingBar>
    </>
  );
}
