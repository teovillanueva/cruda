import { NextRequest, NextResponse } from "next/server";
import { getSavedPhotos } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "20");

  const data = await getSavedPhotos(user.id, cursor, limit);

  return NextResponse.json(data);
}
