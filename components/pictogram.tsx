import type { ReactNode } from "react";
import type { Pictogram as PictogramKey } from "@/lib/products";

/*
 * Placeholder product art: flat pictograms in the brand's black and orange,
 * in the spirit of site safety signage. They stand in until real product
 * photos replace them; cut-outs use --pict-bg so they read on any tile.
 */

const INK = "currentColor";
const ORANGE = "var(--pict-accent, var(--color-orange))";
const BG = "var(--pict-bg, #fff)";
const WHITE = "#ffffff";

/** Upper + toe cap + sole shared by the three leather shoe/boot shapes. */
function Footwear({ upper, children }: { upper: string; children?: ReactNode }) {
  return (
    <>
      <path d={upper} fill={INK} />
      <path d="M115 62c7 3 13 5 19 5 14 3 16 9 16 13v4h-38c-2-8-1-16 3-22z" fill={ORANGE} />
      <path d="M18 87h132c3 0 4 2 4 4v3c0 4-3 6-7 6H24c-4 0-6-3-6-6z" fill={INK} />
      {[32, 48, 64, 80, 96, 112, 128].map((x) => (
        <rect key={x} x={x} y={97} width={7} height={3} fill={BG} />
      ))}
      {children}
    </>
  );
}

function netLines() {
  // Diagonal mesh clipped to the panel x 26..134, y 30..88 (no clipPath ids needed).
  const [x0, x1, y0, y1] = [26, 134, 30, 88];
  const h = y1 - y0;
  const lines: string[] = [];
  for (let k = -h; k <= x1 - x0; k += 13) {
    for (const dir of [1, -1]) {
      // Line y = y0 + t, x = x0 + k + t (dir 1) or x = x1 - k - t (dir -1)
      let tStart = 0;
      let tEnd = h;
      if (dir === 1) {
        tStart = Math.max(0, -k);
        tEnd = Math.min(h, x1 - x0 - k);
      } else {
        tStart = Math.max(0, -k);
        tEnd = Math.min(h, x1 - x0 - k);
      }
      if (tEnd <= tStart) continue;
      const xa = dir === 1 ? x0 + k + tStart : x1 - k - tStart;
      const xb = dir === 1 ? x0 + k + tEnd : x1 - k - tEnd;
      lines.push(`M${xa} ${y0 + tStart}L${xb} ${y0 + tEnd}`);
    }
  }
  return lines.join("");
}

function tapeBars() {
  const yTop = (x: number) => 90 - (18 * (x - 48)) / 100;
  const bars: string[] = [];
  for (let x = 58; x <= 138; x += 16) {
    const a = [x, yTop(x)];
    const b = [x + 7, yTop(x + 7)];
    const c = [x + 3, yTop(x + 3) + 14];
    const d = [x - 4, yTop(x - 4) + 14];
    bars.push(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}L${d[0]} ${d[1]}Z`);
  }
  return bars.join("");
}

const art: Record<PictogramKey, ReactNode> = {
  shoe: (
    <Footwear upper="M22 84V54q0-6 6-6l20 5q7 2 11 2l7-11q4-5 9-4l23 13q18 10 36 14 14 3 16 13v4z">
      {[
        [70, 48],
        [78, 52],
        [86, 56],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={2} fill={BG} />
      ))}
    </Footwear>
  ),
  "boot-mid": (
    <Footwear upper="M24 84V36q0-6 6-6h26q5 0 5 5l2 13 37 10q18 6 34 9 14 3 16 13v4z">
      <rect x={29} y={36} width={4} height={44} rx={2} fill={ORANGE} />
      {[
        [62, 52],
        [70, 55],
        [78, 57],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={2} fill={BG} />
      ))}
    </Footwear>
  ),
  "boot-high": (
    <Footwear upper="M26 84V14q0-6 6-6h30q5 0 5 5l1 37 32 8q18 6 34 9 14 3 16 13v4z">
      <path d="M38 9V2h9v7" fill="none" stroke={INK} strokeWidth={3} />
      <rect x={26} y={8} width={41} height={7} fill={ORANGE} />
      {[20, 28, 36, 44].map((cy, i) => (
        <circle key={cy} cx={61 + i * 0.6} cy={cy} r={1.8} fill={BG} />
      ))}
    </Footwear>
  ),
  gumboot: (
    <>
      <path d="M32 84V14q0-5 5-5h35q5 0 5 5v42q27 6 55 12 16 4 17 14v2z" fill={INK} />
      <path d="M32 21v-7q0-5 5-5h35q5 0 5 5v7z" fill={ORANGE} />
      <path d="M18 87h132c3 0 4 2 4 4v5c0 4-3 6-7 6H24c-4 0-6-3-6-6z" fill={INK} />
      {[28, 42, 56, 70, 84, 98, 112, 126, 140].map((x) => (
        <path key={x} d={`M${x} 102l3-5h4l-3 5z`} fill={BG} />
      ))}
    </>
  ),
  helmet: (
    <>
      <path d="M28 82q2-52 52-54 50 2 52 54z" fill={ORANGE} />
      <path d="M71 30q9-4 18 0l2 52H69z" fill={INK} />
      <path d="M14 82h132q4 0 4 4v4q0 4-4 4H14q-4 0-4-4v-4q0-4 4-4z" fill={INK} />
      <path d="M44 74q2-24 18-36" fill="none" stroke={WHITE} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  glove: (
    <>
      <rect x={50} y={24} width={13} height={44} rx={6.5} fill={INK} />
      <rect x={65} y={16} width={13} height={52} rx={6.5} fill={INK} />
      <rect x={80} y={20} width={13} height={48} rx={6.5} fill={INK} />
      <rect x={95} y={30} width={12} height={40} rx={6} fill={INK} />
      <rect x={50} y={54} width={57} height={38} rx={10} fill={INK} />
      <rect x={32} y={48} width={13} height={36} rx={6.5} fill={INK} transform="rotate(-36 38.5 66)" />
      <rect x={54} y={90} width={50} height={20} rx={3} fill={ORANGE} />
      {[60, 67, 74, 81, 88, 95].map((x) => (
        <rect key={x} x={x} y={93} width={2} height={14} fill={INK} opacity={0.35} />
      ))}
    </>
  ),
  goggles: (
    <>
      <rect x={6} y={54} width={148} height={10} rx={3} fill={INK} />
      <rect x={28} y={32} width={104} height={54} rx={24} fill={INK} />
      <path d="M40 46q0-4 8-4h64q8 0 8 4v22q0 8-8 8H92q-6 0-9-8l-3-6-3 6q-3 8-9 8H48q-8 0-8-8z" fill={ORANGE} />
      <path d="M54 46h8l-7 26h-8z" fill={WHITE} opacity={0.45} />
      {[60, 70, 80, 90, 100].map((cx) => (
        <circle key={cx} cx={cx} cy={37} r={1.6} fill={BG} />
      ))}
    </>
  ),
  glasses: (
    <>
      <path d="M24 52q24-6 50-2l2 16q-6 14-26 14-20-1-25-14z" fill={ORANGE} />
      <path d="M136 52q-24-6-50-2l-2 16q6 14 26 14 20-1 25-14z" fill={ORANGE} />
      <path d="M20 46q60-10 120 0v7q-60-10-120 0z" fill={INK} />
      <path d="M74 50q6-4 12 0l-2 8q-4-3-8 0z" fill={INK} />
      <path d="M20 46l-8 4v6l8-3zM140 46l8 4v6l-8-3z" fill={INK} />
      <path d="M34 58l6-4M120 58l6-4" stroke={WHITE} strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  earmuff: (
    <>
      <path d="M42 66q0-44 38-44t38 44" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <rect x={36} y={58} width={12} height={10} rx={2} fill={INK} />
      <rect x={112} y={58} width={12} height={10} rx={2} fill={INK} />
      <rect x={24} y={64} width={32} height={44} rx={14} fill={ORANGE} />
      <rect x={104} y={64} width={32} height={44} rx={14} fill={ORANGE} />
      <rect x={52} y={68} width={9} height={36} rx={4.5} fill={INK} />
      <rect x={99} y={68} width={9} height={36} rx={4.5} fill={INK} />
    </>
  ),
  vest: (
    <>
      <path d="M46 14h16l18 34 18-34h16q2 16 16 26v64q0 4-4 4H34q-4 0-4-4V40q14-10 16-26z" fill={ORANGE} />
      <rect x={30} y={70} width={100} height={8} fill={WHITE} />
      <rect x={30} y={88} width={100} height={8} fill={WHITE} />
      <rect x={79} y={48} width={2} height={60} fill={INK} />
    </>
  ),
  sock: (
    <>
      <path d="M56 12h36v56q0 8 7 10l29 8q16 4 16 14t-12 10H76q-20 0-20-20z" fill={INK} />
      <path d="M56 12h36v16H56z" fill={ORANGE} />
      {[62, 70, 78, 86].map((x) => (
        <rect key={x} x={x} y={14} width={2} height={12} fill={INK} opacity={0.35} />
      ))}
      <path d="M56 86q0 24 20 24h6q-2-14-12-22-8-4-14-2z" fill={ORANGE} />
      <path d="M126 86q18 4 18 14t-12 10h-8q6-12 2-24z" fill={ORANGE} />
    </>
  ),
  cone: (
    <>
      <path d="M28 96h104q4 0 4 4v4q0 4-4 4H28q-4 0-4-4v-4q0-4 4-4z" fill={INK} />
      <path d="M60 96l13-76q2-6 7-6t7 6l13 76z" fill={ORANGE} />
      <path d="M67.9 50h24.2l2.4 14H65.5zM63.8 74h32.4l1.7 10H62.1z" fill={WHITE} />
    </>
  ),
  net: (
    <>
      <path d={netLines()} stroke={ORANGE} strokeWidth={3.5} fill="none" />
      <rect x={26} y={27} width={108} height={4} fill={ORANGE} />
      <rect x={26} y={87} width={108} height={4} fill={ORANGE} />
      <rect x={18} y={16} width={8} height={92} rx={2} fill={INK} />
      <rect x={134} y={16} width={8} height={92} rx={2} fill={INK} />
    </>
  ),
  tape: (
    <>
      <path d="M48 90L148 72v14L48 104z" fill={ORANGE} />
      <path d={tapeBars()} fill={INK} />
      <circle cx={48} cy={58} r={32} fill={ORANGE} />
      <circle cx={48} cy={58} r={30.5} fill="none" stroke={INK} strokeWidth={3} />
      <circle cx={48} cy={58} r={20} fill="none" stroke={INK} strokeWidth={1.5} opacity={0.35} />
      <circle cx={48} cy={58} r={12} fill={BG} stroke={INK} strokeWidth={3} />
    </>
  ),
  baton: (
    <>
      <rect x={56} y={50} width={88} height={22} rx={11} fill={ORANGE} />
      <rect x={64} y={56} width={72} height={5} rx={2.5} fill={WHITE} opacity={0.5} />
      <rect x={16} y={52} width={42} height={18} rx={6} fill={INK} />
      {[22, 28, 34, 40].map((x) => (
        <rect key={x} x={x} y={55} width={2} height={12} fill={BG} />
      ))}
      <circle cx={50} cy={61} r={2.6} fill={ORANGE} />
      <path d="M150 46l6-6M152 61h7M150 76l6 6" stroke={ORANGE} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
};

export function Pictogram({ name, className }: { name: PictogramKey; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden>
      {art[name]}
    </svg>
  );
}
