import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { follow } from "@/schema/platform";
import { and, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = (await request.json()) as { userId: string };
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  if (userId === user.id) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 },
    );
  }

  const existing = await db
    .select()
    .from(follow)
    .where(
      and(eq(follow.followerId, user.id), eq(follow.followingId, userId)),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(follow)
      .where(
        and(eq(follow.followerId, user.id), eq(follow.followingId, userId)),
      );
    return NextResponse.json({ followed: false });
  }

  await db
    .insert(follow)
    .values({ followerId: user.id, followingId: userId });
  return NextResponse.json({ followed: true });
}
