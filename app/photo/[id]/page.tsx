import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhotoById, getRecentPhotos } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";
import { BlurImage } from "@/components/blur-image";
import { PhotoLink } from "@/components/photo-link";
import { PhotoBar } from "@/components/photo-bar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo) return {};

  const displayTitle = photo.title ?? "sin titulo";
  const title = `${displayTitle} por ${photo.user.name}`;

  return {
    title,
    description: photo.description,
    openGraph: {
      title,
      description: photo.description ?? undefined,
    },
  };
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getSessionUser();
  const photo = await getPhotoById(id, currentUser?.id);

  if (!photo) {
    notFound();
  }

  const isPortrait = photo.height > photo.width;
  const { photos: otherPhotos } = await getRecentPhotos(
    currentUser?.id,
    undefined,
    20,
  );
  const filtered = otherPhotos.filter((p) => p.id !== photo.id);

  return (
    <>
      <div className="p-1 pb-24">
        <div
          className={
            isPortrait
              ? "lg:flex lg:justify-center"
              : undefined
          }
        >
          <ViewTransition name={`photo-${photo.id}`} share="image-expand" enter="vt-fade" exit="vt-fade">
            <Image
              src={photo.url}
              alt={photo.title ?? "sin titulo"}
              width={photo.width}
              height={photo.height}
              quality={90}
              sizes={isPortrait ? "(min-width: 1024px) 60vw, 100vw" : "100vw"}
              className={`w-full h-auto block ${
                isPortrait ? "lg:w-auto lg:max-h-[85vh]" : ""
              }`}
              priority
              decoding="sync"
            />
          </ViewTransition>
        </div>

        <ViewTransition enter="vt-fade" exit="vt-fade">
          <div className="px-4 py-8">
            <h1 className="text-xl font-light">
              {photo.title ?? <span className="italic text-muted">sin titulo</span>}
            </h1>
            <Link
              href={`/profile/${photo.user.username}`}
              className="text-sm italic text-muted hover:text-foreground transition-colors"
            >
              {photo.user.name}
            </Link>
            {photo.description && (
              <p className="mt-3 text-sm text-muted">{photo.description}</p>
            )}
          </div>
        </ViewTransition>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-1">
          {filtered.map((p) => (
            <PhotoLink
              key={p.id}
              photo={p}
              className="block mb-1 break-inside-avoid group"
              transitionTypes={["from-detail"]}
            >
              <ViewTransition
                name={`photo-${p.id}`}
                share={{
                  "from-detail": "image-expand",
                  default: "none",
                }}
                enter="vt-fade"
                exit="vt-fade"
              >
                <BlurImage
                  src={p.url}
                  alt={p.title ?? "sin titulo"}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
                />
              </ViewTransition>
            </PhotoLink>
          ))}
        </div>
      </div>

      <PhotoBar photoId={photo.id} />
    </>
  );
}
