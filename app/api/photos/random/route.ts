import { NextRequest, NextResponse } from "next/server";
import { getRandomPhotos } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "20");

  let seed: string | undefined;
  let offset = 0;

  if (cursor) {
    const lastUnderscore = cursor.lastIndexOf("_");
    seed = cursor.substring(0, lastUnderscore);
    offset = Number(cursor.substring(lastUnderscore + 1));
  }

  const user = await getSessionUser();
  const data = await getRandomPhotos(user?.id, seed, offset, limit);

  return NextResponse.json(data);
}
