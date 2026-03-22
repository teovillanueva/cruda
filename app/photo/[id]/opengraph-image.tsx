import { ImageResponse } from "next/og";
import { getPhotoById } from "@/lib/mock-data";

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
  const photo = getPhotoById(Number(id));

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
            }}
          >
            {photo.title}
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#ededed",
              opacity: 0.6,
              fontStyle: "italic",
            }}
          >
            {photo.photographer}
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
        <span
          style={{
            fontSize: 28,
            color: "#ededed",
            opacity: 0.3,
            fontStyle: "italic",
          }}
        >
          cruda
        </span>
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
