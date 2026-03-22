"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingBar } from "@/components/floating-bar";
import { BackLink } from "@/components/back-link";
import { PhotoEditForm } from "@/components/photo-edit-form";
import { ConfirmModal } from "@/components/confirm-modal";
import { usePhoto } from "@/lib/hooks/use-photo";
import { useEditPhoto } from "@/lib/hooks/use-edit-photo";
import { useDeletePhoto } from "@/lib/hooks/use-delete-photo";
import { useAuth } from "@/lib/auth-context";

export default function EditPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: photo, isLoading } = usePhoto(id);
  const editPhoto = useEditPhoto();
  const deletePhoto = useDeletePhoto();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const nextIds = searchParams.get("next")?.split(",").filter(Boolean) ?? [];
  const totalCount = nextIds.length + 1;
  const currentIndex = totalCount - nextIds.length;

  if (!user) {
    router.replace("/login");
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (!photo) {
    router.replace("/");
    return null;
  }

  if (photo.user.id !== user.id) {
    router.replace(`/photo/${id}`);
    return null;
  }

  const navigateNext = () => {
    if (nextIds.length > 0) {
      const [nextId, ...remaining] = nextIds;
      const next = remaining.length > 0 ? `?next=${remaining.join(",")}` : "";
      router.push(`/photo/${nextId}/edit${next}`);
    } else {
      router.push(`/profile/${user.username}`);
    }
  };

  const handleSave = (title: string | null, description: string | null) => {
    editPhoto.mutate(
      { id, title, description },
      { onSuccess: navigateNext },
    );
  };

  const isPortrait = photo.height > photo.width;

  return (
    <>
      <div className="px-4 pt-8 pb-24">
        <div className="max-w-lg mx-auto space-y-6">
          <div className={`relative ${isPortrait ? "max-h-[40vh]" : ""} overflow-hidden`}>
            <Image
              src={photo.url}
              alt={photo.title ?? "sin titulo"}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 512px, 100vw"
              className={`w-full h-auto block ${isPortrait ? "max-h-[40vh] object-contain" : ""}`}
            />
          </div>

          <PhotoEditForm
            initialTitle={photo.title}
            initialDescription={photo.description}
            onSave={handleSave}
            onSkip={navigateNext}
            saving={editPhoto.isPending}
          />

          <button
            onClick={() => setDeleteOpen(true)}
            className="text-sm text-foreground/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            eliminar foto
          </button>
        </div>
      </div>

      <FloatingBar>
        <BackLink />
        <div className="h-3 w-px bg-foreground/10" />
        {totalCount > 1 && (
          <>
            <span className="text-sm text-foreground/40">
              {currentIndex} de {totalCount}
            </span>
            <div className="h-3 w-px bg-foreground/10" />
          </>
        )}
        <Link
          href="/"
          className="text-sm italic tracking-wide whitespace-nowrap text-foreground/80 hover:text-foreground transition-colors"
        >
          cruda
        </Link>
      </FloatingBar>

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="eliminar foto"
        description="esta accion no se puede deshacer."
        confirmLabel="eliminar"
        onConfirm={() => {
          deletePhoto.mutate(id, {
            onSuccess: () => {
              setDeleteOpen(false);
              router.push(`/profile/${user.username}`);
            },
          });
        }}
        loading={deletePhoto.isPending}
      />
    </>
  );
}
