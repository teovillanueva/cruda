"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { FloatingBar } from "@/components/floating-bar";
import { BackLink } from "@/components/back-link";
import { UploadZone } from "@/components/upload-zone";
import { useUploadPhoto } from "@/lib/hooks/use-upload";
import { useAuth } from "@/lib/auth-context";
import posthog from "posthog-js";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const removeEntry = (index: number) => {
    setEntries((prev) => {
      const entry = prev[index];
      URL.revokeObjectURL(entry.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    posthog.capture("photo_upload_started", { photo_count: entries.length });
    setUploading(true);

    // Mark all pending as uploading
    setEntries((prev) =>
      prev.map((e) => (e.status === "pending" ? { ...e, status: "uploading" } : e)),
    );

    const promises = entries.map(async (entry, i) => {
      if (entry.status === "done") return null;

      try {
        const photo = await upload.mutateAsync({
          file: entry.file,
          width: entry.width,
          height: entry.height,
        });
        setEntries((prev) =>
          prev.map((e, idx) =>
            idx === i ? { ...e, status: "done", photoId: photo.id } : e,
          ),
        );
        return photo.id;
      } catch {
        setEntries((prev) =>
          prev.map((e, idx) => (idx === i ? { ...e, status: "error" } : e)),
        );
        return null;
      }
    });

    const results = await Promise.all(promises);

    setUploading(false);

    const uploadedIds = results.filter((id): id is string => id !== null);
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
  const lightboxEntry = lightboxIndex !== null ? entries[lightboxIndex] : null;

  return (
    <>
      <div className="p-1 pb-24">
        {!hasFiles ? (
          <div className="px-3 pt-7">
            <UploadZone onFiles={handleFiles} disabled={uploading} />
          </div>
        ) : (
          <>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-1">
              {entries.map((entry, i) => (
                <div
                  key={i}
                  className="relative mb-1 break-inside-avoid group cursor-pointer"
                  onClick={() => setLightboxIndex(i)}
                >
                  <Image
                    src={entry.preview}
                    alt=""
                    width={entry.width}
                    height={entry.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
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
                  {entry.status === "pending" && !uploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntry(i);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="px-3 mt-6 flex flex-col gap-6">
              {!allDone && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="text-sm text-muted hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {uploading ? "subiendo..." : `subir ${entries.length} ${entries.length === 1 ? "foto" : "fotos"}`}
                  </button>
                  {!uploading && (
                    <button
                      onClick={() => {
                        entries.forEach((e) => URL.revokeObjectURL(e.preview));
                        setEntries([]);
                      }}
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
          </>
        )}
      </div>

      <Dialog.Root
        open={lightboxIndex !== null}
        onOpenChange={(open) => { if (!open) setLightboxIndex(null); }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm data-[state=open]:animate-[modal-overlay-in_200ms_ease-out] data-[state=closed]:animate-[modal-overlay-out_150ms_ease-in]" />
          <Dialog.Content className="fixed inset-0 z-[101] flex items-center justify-center p-4 data-[state=open]:animate-[modal-overlay-in_200ms_ease-out] data-[state=closed]:animate-[modal-overlay-out_150ms_ease-in]">
            <Dialog.Title className="sr-only">Vista previa</Dialog.Title>
            {lightboxEntry && (
              <Image
                src={lightboxEntry.preview}
                alt=""
                width={lightboxEntry.width}
                height={lightboxEntry.height}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                sizes="100vw"
              />
            )}
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors text-lg">
                &times;
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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
