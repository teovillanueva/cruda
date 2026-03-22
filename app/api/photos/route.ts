import { NextRequest, NextResponse } from "next/server";
import { getRecentPhotos, getPhotoById } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { photo } from "@/schema/platform";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "20");

  const user = await getSessionUser();
  const data = await getRecentPhotos(user?.id, cursor, limit);

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { url, width, height, title, description } = body as {
    url: string;
    width: number;
    height: number;
    title?: string;
    description?: string;
  };

  if (!url || !width || !height) {
    return NextResponse.json(
      { error: "Missing required fields: url, width, height" },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();

  await db.insert(photo).values({
    id,
    title: title ?? null,
    description: description ?? null,
    url,
    width,
    height,
    userId: user.id,
  });

  const created = await getPhotoById(id, user.id);

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: user.id,
    event: "photo_created",
    properties: { photo_id: id, has_title: !!title, has_description: !!description },
  });

  return NextResponse.json(created, { status: 201 });
}
