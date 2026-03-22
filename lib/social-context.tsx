"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface SocialContextValue {
  toggleLike: (photoId: number) => void;
  toggleSave: (photoId: number) => void;
  toggleFollow: (username: string) => void;
  isLiked: (photoId: number) => boolean;
  isSaved: (photoId: number) => boolean;
  isFollowed: (username: string) => boolean;
  savedPhotoIds: Set<number>;
}

const SocialContext = createContext<SocialContextValue | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<Set<number>>(() => new Set());
  const [saves, setSaves] = useState<Set<number>>(() => new Set());
  const [follows, setFollows] = useState<Set<string>>(() => new Set());

  const toggleLike = useCallback((photoId: number) => {
    setLikes((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  }, []);

  const toggleSave = useCallback((photoId: number) => {
    setSaves((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  }, []);

  const toggleFollow = useCallback((username: string) => {
    setFollows((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  }, []);

  const isLiked = useCallback((photoId: number) => likes.has(photoId), [likes]);
  const isSaved = useCallback((photoId: number) => saves.has(photoId), [saves]);
  const isFollowed = useCallback(
    (username: string) => follows.has(username),
    [follows]
  );

  return (
    <SocialContext
      value={{
        toggleLike,
        toggleSave,
        toggleFollow,
        isLiked,
        isSaved,
        isFollowed,
        savedPhotoIds: saves,
      }}
    >
      {children}
    </SocialContext>
  );
}

export function useSocial() {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error("useSocial must be used within SocialProvider");
  return ctx;
}
