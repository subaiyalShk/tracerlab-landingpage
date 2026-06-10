import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Tracerlabs — we build the AI that runs your business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const duborics = await readFile(
    join(process.cwd(), "public/fonts/DuboricsRegular.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Duborics",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#8a8a93" }}>
          TRACERLABS · AI DEVELOPMENT STUDIO
        </div>
        <div style={{ display: "flex", fontSize: 82, lineHeight: 1.05, marginTop: 28 }}>
          We build the AI that runs your business.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Duborics", data: duborics, style: "normal", weight: 400 }],
    },
  );
}
