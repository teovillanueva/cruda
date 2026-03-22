import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  users,
  getUserByUsername,
  getPhotosByUsername,
  getPhotoUrl,
} from "@/lib/mock-data";
import { BlurImage } from "@/components/blur-image";
import { ProfileBar } from "@/components/profile-bar";

export function generateStaticParams() {
  return users.map((user) => ({
    username: user.username,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) return {};

  const photos = getPhotosByUsername(username);
  const title = `${user.name} (@${user.username})`;
  const description = `${photos.length} fotos en cruda`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const userPhotos = getPhotosByUsername(username);

  return (
    <>
      <div className="px-4 pt-8 pb-24">
        <div className="mb-8">
          <h1 className="text-xl font-light">{user.name}</h1>
          <p className="text-sm italic text-muted">@{user.username}</p>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-1">
          {userPhotos.map((photo) => (
            <Link
              key={photo.id}
              href={`/photo/${photo.id}`}
              className="block mb-1 break-inside-avoid group"
            >
              <ViewTransition name={`photo-${photo.id}`} share="image-expand" exit="vt-fade" enter="vt-fade">
                <BlurImage
                  src={getPhotoUrl(photo)}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
                />
              </ViewTransition>
            </Link>
          ))}
        </div>
      </div>

      <ProfileBar username={user.username} />
    </>
  );
}
