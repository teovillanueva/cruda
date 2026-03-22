import { db } from "./db";
import { photo, save, follow } from "@/schema/platform";
import { user } from "@/schema/auth";
import { eq, desc, and, lt, or, sql } from "drizzle-orm";
import type { PhotoWithUser, PhotoPage, UserProfile } from "./types";

export async function getPhotoById(
  id: string,
  currentUserId?: string,
): Promise<(PhotoWithUser & { user: PhotoWithUser["user"] }) | null> {
  const row = await db
    .select({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      url: photo.url,
      width: photo.width,
      height: photo.height,
      createdAt: photo.createdAt,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
    })
    .from(photo)
    .innerJoin(user, eq(photo.userId, user.id))
    .where(eq(photo.id, id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!row) return null;

  let isSaved = false;
  if (currentUserId) {
    const savedRow = await db
      .select({ photoId: save.photoId })
      .from(save)
      .where(and(eq(save.userId, currentUserId), eq(save.photoId, id)))
      .limit(1);
    isSaved = savedRow.length > 0;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    width: row.width,
    height: row.height,
    createdAt: row.createdAt.toISOString(),
    user: {
      id: row.userId,
      name: row.userName,
      username: row.userUsername!,
    },
    isSaved,
  };
}

export async function getUserByUsername(
  username: string,
  currentUserId?: string,
): Promise<UserProfile | null> {
  const row = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
    })
    .from(user)
    .where(eq(user.username, username))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!row) return null;

  let isFollowed = false;
  if (currentUserId && currentUserId !== row.id) {
    const followRow = await db
      .select({ followerId: follow.followerId })
      .from(follow)
      .where(
        and(
          eq(follow.followerId, currentUserId),
          eq(follow.followingId, row.id),
        ),
      )
      .limit(1);
    isFollowed = followRow.length > 0;
  }

  return {
    id: row.id,
    name: row.name,
    username: row.username!,
    image: row.image,
    isFollowed,
  };
}

export async function getPhotosByUser(
  userId: string,
  currentUserId?: string,
  cursor?: string,
  limit = 20,
): Promise<PhotoPage> {
  const conditions = [eq(photo.userId, userId)];

  if (cursor) {
    const [cursorDate, cursorId] = cursor.split("_");
    conditions.push(
      or(
        lt(photo.createdAt, new Date(cursorDate)),
        and(eq(photo.createdAt, new Date(cursorDate)), lt(photo.id, cursorId)),
      )!,
    );
  }

  const rows = await db
    .select({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      url: photo.url,
      width: photo.width,
      height: photo.height,
      createdAt: photo.createdAt,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
    })
    .from(photo)
    .innerJoin(user, eq(photo.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(photo.createdAt), desc(photo.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  let savedIds = new Set<string>();
  if (currentUserId && items.length > 0) {
    const savedRows = await db
      .select({ photoId: save.photoId })
      .from(save)
      .where(
        and(
          eq(save.userId, currentUserId),
          sql`${save.photoId} IN (${sql.join(
            items.map((r) => sql`${r.id}`),
            sql`, `,
          )})`,
        ),
      );
    savedIds = new Set(savedRows.map((r) => r.photoId));
  }

  const photos: PhotoWithUser[] = items.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    width: row.width,
    height: row.height,
    createdAt: row.createdAt.toISOString(),
    user: {
      id: row.userId,
      name: row.userName,
      username: row.userUsername!,
    },
    isSaved: savedIds.has(row.id),
  }));

  const last = items[items.length - 1];
  const nextCursor = hasMore && last
    ? `${last.createdAt.toISOString()}_${last.id}`
    : null;

  return { photos, nextCursor };
}

export async function getRecentPhotos(
  currentUserId?: string,
  cursor?: string,
  limit = 20,
): Promise<PhotoPage> {
  const conditions = [];

  if (cursor) {
    const [cursorDate, cursorId] = cursor.split("_");
    conditions.push(
      or(
        lt(photo.createdAt, new Date(cursorDate)),
        and(eq(photo.createdAt, new Date(cursorDate)), lt(photo.id, cursorId)),
      )!,
    );
  }

  const rows = await db
    .select({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      url: photo.url,
      width: photo.width,
      height: photo.height,
      createdAt: photo.createdAt,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
    })
    .from(photo)
    .innerJoin(user, eq(photo.userId, user.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(photo.createdAt), desc(photo.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  let savedIds = new Set<string>();
  if (currentUserId && items.length > 0) {
    const savedRows = await db
      .select({ photoId: save.photoId })
      .from(save)
      .where(
        and(
          eq(save.userId, currentUserId),
          sql`${save.photoId} IN (${sql.join(
            items.map((r) => sql`${r.id}`),
            sql`, `,
          )})`,
        ),
      );
    savedIds = new Set(savedRows.map((r) => r.photoId));
  }

  const photos: PhotoWithUser[] = items.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    width: row.width,
    height: row.height,
    createdAt: row.createdAt.toISOString(),
    user: {
      id: row.userId,
      name: row.userName,
      username: row.userUsername!,
    },
    isSaved: savedIds.has(row.id),
  }));

  const last = items[items.length - 1];
  const nextCursor = hasMore && last
    ? `${last.createdAt.toISOString()}_${last.id}`
    : null;

  return { photos, nextCursor };
}

export async function getRandomPhotos(
  currentUserId?: string,
  seed?: string,
  offset = 0,
  limit = 20,
): Promise<PhotoPage & { seed: string }> {
  const actualSeed = seed ?? crypto.randomUUID();

  const rows = await db
    .select({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      url: photo.url,
      width: photo.width,
      height: photo.height,
      createdAt: photo.createdAt,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
    })
    .from(photo)
    .innerJoin(user, eq(photo.userId, user.id))
    .orderBy(sql`md5(${photo.id} || ${actualSeed})`)
    .limit(limit + 1)
    .offset(offset);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  let savedIds = new Set<string>();
  if (currentUserId && items.length > 0) {
    const savedRows = await db
      .select({ photoId: save.photoId })
      .from(save)
      .where(
        and(
          eq(save.userId, currentUserId),
          sql`${save.photoId} IN (${sql.join(
            items.map((r) => sql`${r.id}`),
            sql`, `,
          )})`,
        ),
      );
    savedIds = new Set(savedRows.map((r) => r.photoId));
  }

  const photos: PhotoWithUser[] = items.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    width: row.width,
    height: row.height,
    createdAt: row.createdAt.toISOString(),
    user: {
      id: row.userId,
      name: row.userName,
      username: row.userUsername!,
    },
    isSaved: savedIds.has(row.id),
  }));

  const nextCursor = hasMore
    ? `${actualSeed}_${offset + limit}`
    : null;

  return { photos, nextCursor, seed: actualSeed };
}

export async function getFeedPhotos(
  currentUserId: string,
  cursor?: string,
  limit = 20,
): Promise<PhotoPage> {
  const followedUsers = db
    .select({ followingId: follow.followingId })
    .from(follow)
    .where(eq(follow.followerId, currentUserId));

  const conditions = [sql`${photo.userId} IN (${followedUsers})`];

  if (cursor) {
    const [cursorDate, cursorId] = cursor.split("_");
    conditions.push(
      or(
        lt(photo.createdAt, new Date(cursorDate)),
        and(eq(photo.createdAt, new Date(cursorDate)), lt(photo.id, cursorId)),
      )!,
    );
  }

  const rows = await db
    .select({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      url: photo.url,
      width: photo.width,
      height: photo.height,
      createdAt: photo.createdAt,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
    })
    .from(photo)
    .innerJoin(user, eq(photo.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(photo.createdAt), desc(photo.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  let savedIds = new Set<string>();
  if (items.length > 0) {
    const savedRows = await db
      .select({ photoId: save.photoId })
      .from(save)
      .where(
        and(
          eq(save.userId, currentUserId),
          sql`${save.photoId} IN (${sql.join(
            items.map((r) => sql`${r.id}`),
            sql`, `,
          )})`,
        ),
      );
    savedIds = new Set(savedRows.map((r) => r.photoId));
  }

  const photos: PhotoWithUser[] = items.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    width: row.width,
    height: row.height,
    createdAt: row.createdAt.toISOString(),
    user: {
      id: row.userId,
      name: row.userName,
      username: row.userUsername!,
    },
    isSaved: savedIds.has(row.id),
  }));

  const last = items[items.length - 1];
  const nextCursor = hasMore && last
    ? `${last.createdAt.toISOString()}_${last.id}`
    : null;

  return { photos, nextCursor };
}

export async function getSavedPhotos(
  currentUserId: string,
  cursor?: string,
  limit = 20,
): Promise<PhotoPage> {
  const conditions = [eq(save.userId, currentUserId)];

  if (cursor) {
    const [cursorDate, cursorId] = cursor.split("_");
    conditions.push(
      or(
        lt(save.createdAt, new Date(cursorDate)),
        and(
          eq(save.createdAt, new Date(cursorDate)),
          lt(save.photoId, cursorId),
        ),
      )!,
    );
  }

  const rows = await db
    .select({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      url: photo.url,
      width: photo.width,
      height: photo.height,
      createdAt: photo.createdAt,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      savedAt: save.createdAt,
    })
    .from(save)
    .innerJoin(photo, eq(save.photoId, photo.id))
    .innerJoin(user, eq(photo.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(save.createdAt), desc(save.photoId))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  const photos: PhotoWithUser[] = items.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    width: row.width,
    height: row.height,
    createdAt: row.createdAt.toISOString(),
    user: {
      id: row.userId,
      name: row.userName,
      username: row.userUsername!,
    },
    isSaved: true,
  }));

  const last = items[items.length - 1];
  const nextCursor = hasMore && last
    ? `${last.savedAt.toISOString()}_${last.id}`
    : null;

  return { photos, nextCursor };
}
