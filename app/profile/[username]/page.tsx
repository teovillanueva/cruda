import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserByUsername, getPhotosByUser } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";
import { ProfileContent } from "@/components/profile-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getUserByUsername(username);

  if (!profile) return {};

  const title = `${profile.name} (@${profile.username})`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getSessionUser();
  const profile = await getUserByUsername(username, currentUser?.id);

  if (!profile) {
    notFound();
  }

  const { photos: userPhotos } = await getPhotosByUser(
    profile.id,
    currentUser?.id,
  );

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <ProfileContent
      profile={profile}
      userPhotos={userPhotos}
      isOwnProfile={isOwnProfile}
    />
  );
}
