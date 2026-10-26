import { Noto_Sans_SC, Poppins } from "next/font/google";
import localFont from "next/font/local";

/* The site's typefaces, shared by both root layouts (the site and /admin). */

// Primary display face from the brand guideline (licensed for web use, per the client).
const moderniz = localFont({
  src: "./fonts/Moderniz.otf",
  variable: "--font-moderniz",
  weight: "400",
  display: "swap",
});

// Secondary face from the guideline: body copy and interface.
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Chinese glyphs. Split by unicode-range, so slices only download where Chinese text appears.
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-cjk",
  display: "swap",
  preload: false,
});

/** Class names that define --font-moderniz, --font-poppins and --font-cjk on <html>. */
export const fontVariables = `${moderniz.variable} ${poppins.variable} ${notoSansSC.variable}`;
