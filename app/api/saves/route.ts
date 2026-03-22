import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { save } from "@/schema/platform";
import { and, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { photoId } = (await request.json()) as { photoId: string };
  if (!photoId) {
    return NextResponse.json({ error: "photoId required" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(save)
    .where(and(eq(save.userId, user.id), eq(save.photoId, photoId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(save)
      .where(and(eq(save.userId, user.id), eq(save.photoId, photoId)));
    return NextResponse.json({ saved: false });
  }

  await db.insert(save).values({ userId: user.id, photoId });
  return NextResponse.json({ saved: true });
}
