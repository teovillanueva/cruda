import { put } from "@vercel/blob";

export async function uploadPhoto(file: File) {
  const blob = await put(file.name, file, { access: "public" });
  return blob;
}
