"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSaveToggle } from "@/lib/hooks/use-save";
import { useDeletePhoto } from "@/lib/hooks/use-delete-photo";
import { usePhoto } from "@/lib/hooks/use-photo";
import { FloatingBar } from "@/components/floating-bar";
import { BackLink } from "@/components/back-link";
import { ConfirmModal } from "@/components/confirm-modal";
import { useAuth } from "@/lib/auth-context";
import posthog from "posthog-js";

export function PhotoBar({ photoId }: { photoId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: photo } = usePhoto(photoId);
  const saveToggle = useSaveToggle();
  const deletePhoto = useDeletePhoto();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const saved = photo?.isSaved ?? false;
  const isOwner = user && photo && user.id === photo.user.id;

  return (
    <>
      <FloatingBar>
        <BackLink />
        <div className="h-3 w-px bg-foreground/10" />
        {user && (
          <>
            {isOwner ? (
              <>
                <Link
                  href={`/photo/${photoId}/edit`}
                  className="text-sm whitespace-nowrap text-foreground/50 hover:text-foreground transition-colors"
                >
                  editar
                </Link>
                <div className="h-3 w-px bg-foreground/10" />
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="text-sm whitespace-nowrap text-foreground/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  eliminar
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  saveToggle.mutate(photoId, {
                    onSuccess: (data) => {
                      posthog.capture(
                        data.saved ? "photo_saved" : "photo_unsaved",
                        { photo_id: photoId },
                      );
                    },
                  });
                }}
                className={`text-sm whitespace-nowrap transition-colors ${
                  saved
                    ? "text-foreground"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {saved ? "guardada" : "guardar"}
              </button>
            )}
            <div className="h-3 w-px bg-foreground/10" />
          </>
        )}
        <Link
          href="/"
          className="text-sm italic tracking-wide whitespace-nowrap text-foreground/80 hover:text-foreground transition-colors"
        >
          home
        </Link>
      </FloatingBar>

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="eliminar foto"
        description="esta accion no se puede deshacer."
        confirmLabel="eliminar"
        onConfirm={() => {
          deletePhoto.mutate(photoId, {
            onSuccess: () => {
              posthog.capture("photo_deleted", { photo_id: photoId });
              setDeleteOpen(false);
              router.push(`/profile/${user!.username}`);
            },
          });
        }}
        loading={deletePhoto.isPending}
      />
    </>
  );
}
