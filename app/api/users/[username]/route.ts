import { NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const currentUser = await getSessionUser();
  const profile = await getUserByUsername(username, currentUser?.id);

  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
