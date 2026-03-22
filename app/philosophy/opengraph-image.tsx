import { ImageResponse } from "next/og";

export const alt = "cruda — filosofía";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Source Serif 4",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 72,
            color: "#ededed",
            fontStyle: "italic",
          }}
        >
          cruda
        </span>
        <span
          style={{
            fontSize: 28,
            color: "#ededed",
            opacity: 0.6,
          }}
        >
          filosofía
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
