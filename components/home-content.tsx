"use client";

import { useState, useMemo, useEffect } from "react";
import { ViewTransition } from "react";
import { photos, getPhotoUrl } from "@/lib/mock-data";
import { BlurImage } from "@/components/blur-image";
import { PhotoLink } from "@/components/photo-link";
import { HomeBar, type HomeTab } from "@/components/home-bar";
import { useSocial } from "@/lib/social-context";

export function HomeContent() {
  const [tab, setTab] = useState<HomeTab>("recientes");
  const { savedPhotoIds } = useSocial();

  const filteredPhotos = useMemo(() => {
    if (tab === "guardadas") {
      return photos.filter((p) => savedPhotoIds.has(p.id));
    }
    return photos;
  }, [tab, savedPhotoIds]);

  useEffect(() => {
    if (tab === "guardadas" && savedPhotoIds.size === 0) {
      setTab("recientes");
    }
  }, [tab, savedPhotoIds.size]);

  return (
    <>
      <div className="px-1 pt-1 pb-24">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-1">
          {filteredPhotos.map((photo) => (
            <PhotoLink
              key={photo.id}
              photo={photo}
              className="block mb-1 break-inside-avoid group"
              transitionTypes={["from-home"]}
            >
              <ViewTransition
                name={`photo-${photo.id}`}
                share="image-expand"
                exit="vt-fade"
                enter="vt-fade"
              >
                <BlurImage
                  src={getPhotoUrl(photo)}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
                />
              </ViewTransition>
            </PhotoLink>
          ))}
        </div>
      </div>

      <HomeBar tab={tab} onTabChange={setTab} />
    </>
  );
}
