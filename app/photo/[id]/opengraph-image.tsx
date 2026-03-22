import { ImageResponse } from "next/og";
import { getPhotoById } from "@/lib/queries";

export const alt = "cruda";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#0a0a0a",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 72, color: "#ededed", fontStyle: "italic" }}>cruda</span>
        </div>
      ),
      { ...size }
    );
  }

  const font = await fetch(
    "https://fonts.gstatic.com/s/sourceserif4/v14/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjiklqrhw.ttf"
  ).then((res) => res.arrayBuffer());

  const fontItalic = await fetch(
    "https://fonts.gstatic.com/s/sourceserif4/v14/vEF02_tTDB4M7-auWDN0ahZJW1ge6NmXpVAHV83Bfb_US2D2QYxoUKIkn98pGF9dCw.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Source Serif 4",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 52,
              color: "#ededed",
              lineClamp: 2,
              fontStyle: photo.title ? "normal" : "italic",
              opacity: photo.title ? 1 : 0.5,
            }}
          >
            {photo.title ?? "sin titulo"}
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#ededed",
              opacity: 0.6,
              fontStyle: "italic",
            }}
          >
            {photo.user.name}
          </span>
          <span
            style={{
              fontSize: 24,
              color: "#ededed",
              opacity: 0.4,
              lineClamp: 2,
            }}
          >
            {photo.description}
          </span>
        </div>
        <svg
          width={21}
          height={30}
          viewBox="0 0 70 100"
          fill="#ededed"
          opacity={0.3}
        >
          <path d="M35 0 C36 36, 44 46, 70 50 C44 54, 36 64, 35 100 C34 64, 26 54, 0 50 C26 46, 34 36, 35 0Z" />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Source Serif 4",
          data: font,
          style: "normal",
          weight: 300,
        },
        {
          name: "Source Serif 4",
          data: fontItalic,
          style: "italic",
          weight: 300,
        },
      ],
    }
  );
}
