"use client";

import { useState } from "react";
import { ViewTransition } from "react";
import { BlurImage } from "@/components/blur-image";
import { PhotoLink } from "@/components/photo-link";
import { ProfileBar, type ProfileTab } from "@/components/profile-bar";
import { VirtualMasonryGrid } from "@/components/virtual-masonry-grid";
import { EmptyState } from "@/components/empty-state";
import { useSavedPhotos } from "@/lib/hooks/use-photos";
import type { PhotoWithUser } from "@/lib/types";

export function ProfileContent({
  profile,
  userPhotos,
  isOwnProfile,
}: {
  profile: { id: string; name: string; username: string };
  userPhotos: PhotoWithUser[];
  isOwnProfile: boolean;
}) {
  const [tab, setTab] = useState<ProfileTab>("fotos");
  const saved = useSavedPhotos();
  const savedPhotos = saved.data?.pages.flatMap((p) => p.photos) ?? [];

  return (
    <>
      <div className="px-4 pt-8 pb-24">
        <div className="mb-8">
          <h1 className="text-xl font-light">{profile.name}</h1>
          <p className="text-sm italic text-muted">@{profile.username}</p>
        </div>

        {tab === "fotos" ? (
          userPhotos.length > 0 ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-1">
              {userPhotos.map((photo) => (
                <PhotoLink
                  key={photo.id}
                  photo={photo}
                  className="block mb-1 break-inside-avoid group"
                >
                  <ViewTransition
                    name={`photo-${photo.id}`}
                    share="image-expand"
                    exit="vt-fade"
                    enter="vt-fade"
                  >
                    <BlurImage
                      src={photo.url}
                      alt={photo.title ?? "sin titulo"}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
                    />
                  </ViewTransition>
                </PhotoLink>
              ))}
            </div>
          ) : (
            <EmptyState message="no hay fotos todavía" className="min-h-[40vh]" />
          )
        ) : savedPhotos.length > 0 ? (
          <VirtualMasonryGrid
            photos={savedPhotos}
            hasNextPage={saved.hasNextPage ?? false}
            fetchNextPage={saved.fetchNextPage}
            isFetchingNextPage={saved.isFetchingNextPage}
          />
        ) : !saved.isFetchingNextPage ? (
          <EmptyState message="no hay fotos guardadas" className="min-h-[40vh]" />
        ) : null}
      </div>

      <ProfileBar
        userId={profile.id}
        username={profile.username}
        tab={isOwnProfile ? tab : undefined}
        onTabChange={isOwnProfile ? setTab : undefined}
      />
    </>
  );
}
