import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOCKUP_MARK_PATHS, LOCKUP_VIEWBOX, LOCKUP_WORD_PATHS } from "@/components/brand/logo-paths";
import { company } from "./site";

export const ogSize = { width: 1200, height: 630 };

const fonts = Promise.all([
  readFile(join(process.cwd(), "app/fonts/Moderniz.otf")),
  readFile(join(process.cwd(), "app/fonts/Poppins-SemiBold.ttf")),
]);

const ORANGE = "#fe5200";

/**
 * Link preview card (WhatsApp, Facebook, etc.): the black signboard with the
 * lockup, an optional product line, and the orange tagline band along the bottom.
 * Latin text only: the share card stays in English/Malay in every locale.
 */
export async function ogCard({ title, detail }: { title?: string; detail?: string }) {
  const [moderniz, poppins] = await fonts;
  const [, , vbW, vbH] = LOCKUP_VIEWBOX.split(" ").map(Number);
  const logoWidth = title ? 420 : 820;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#000" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: title ? "space-between" : "center",
            padding: title ? "64px 72px 48px" : "0 72px",
          }}
        >
          <svg width={logoWidth} height={(logoWidth * vbH) / vbW} viewBox={LOCKUP_VIEWBOX}>
            {LOCKUP_MARK_PATHS.map((d) => (
              <path key={d} d={d} fill={ORANGE} />
            ))}
            {LOCKUP_WORD_PATHS.map((d) => (
              <path key={d} d={d} fill="#fff" />
            ))}
          </svg>
          {title && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontFamily: "Poppins", fontSize: 58, lineHeight: 1.12, color: "#fff", maxWidth: 1000 }}>
                {title}
              </div>
              {detail && (
                <div style={{ fontFamily: "Poppins", fontSize: 28, color: "rgba(255,255,255,0.62)" }}>{detail}</div>
              )}
            </div>
          )}
          {!title && (
            <div style={{ fontFamily: "Poppins", fontSize: 30, color: "rgba(255,255,255,0.7)", marginTop: 40 }}>
              Taman Equine · Kota Damansara · Klang
            </div>
          )}
        </div>
        <div
          style={{
            height: 96,
            background: ORANGE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg width={189} height={96} viewBox="0 0 356 181" style={{ position: "absolute", left: 0, top: 0 }}>
            {[0, 128, 253].map((x) => (
              <path key={x} d={`M${x} 0h60l42.5 181h-60z`} fill="#000" />
            ))}
          </svg>
          <div style={{ fontFamily: "Moderniz", fontSize: 34, color: "#000" }}>{company.tagline.toUpperCase()}</div>
          <svg width={189} height={96} viewBox="0 0 356 181" style={{ position: "absolute", right: 0, top: 0 }}>
            {[0, 128, 253].map((x) => (
              <path key={x} d={`M${x} 0h60l42.5 181h-60z`} fill="#000" />
            ))}
          </svg>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Moderniz", data: moderniz, style: "normal", weight: 400 },
        { name: "Poppins", data: poppins, style: "normal", weight: 600 },
      ],
    },
  );
}
