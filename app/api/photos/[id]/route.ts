import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getPhotoById } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { photo } from "@/schema/platform";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();
  const data = await getPhotoById(id, user?.id);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const existing = await getPhotoById(id, user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.user.id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description } = body as {
    title?: string | null;
    description?: string | null;
  };

  const updates: Record<string, string | null> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;

  if (Object.keys(updates).length > 0) {
    await db
      .update(photo)
      .set(updates)
      .where(and(eq(photo.id, id), eq(photo.userId, user.id)));
  }

  const updated = await getPhotoById(id, user.id);

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: user.id,
    event: "photo_metadata_updated",
    properties: { photo_id: id, updated_fields: Object.keys(updates) },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const existing = await getPhotoById(id, user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.user.id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db
    .delete(photo)
    .where(and(eq(photo.id, id), eq(photo.userId, user.id)));

  return NextResponse.json({ deleted: true });
}
