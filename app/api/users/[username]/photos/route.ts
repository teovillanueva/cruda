import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername, getPhotosByUser } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "20");

  const profile = await getUserByUsername(username);
  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const currentUser = await getSessionUser();
  const data = await getPhotosByUser(profile.id, currentUser?.id, cursor, limit);

  return NextResponse.json(data);
}
