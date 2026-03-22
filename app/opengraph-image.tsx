import { ImageResponse } from "next/og";

export const alt = "cruda";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          gap: 24,
        }}
      >
        <svg
          width={42}
          height={60}
          viewBox="0 0 70 100"
          fill="#ededed"
        >
          <path d="M35 0 C36 36, 44 46, 70 50 C44 54, 36 64, 35 100 C34 64, 26 54, 0 50 C26 46, 34 36, 35 0Z" />
        </svg>
        <span
          style={{
            fontSize: 72,
            color: "#ededed",
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
          data: fontItalic,
          style: "italic",
          weight: 300,
        },
      ],
    }
  );
}
