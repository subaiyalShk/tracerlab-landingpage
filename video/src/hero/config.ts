import { createContext, useContext } from "react";
import { useVideoConfig } from "remotion";

export const FPS = 30;
export const DURATION = 900; // 30 s

// Beat boundaries in frames. Contiguous; last ends at DURATION. The openers are
// short and the Mechanism beat is the longest (7 s): the machine is the
// explainer — four labelled stages the camera holds on, centered.
export const BEATS = {
  world: { from: 0, to: 90 },
  people: { from: 90, to: 180 },
  attention: { from: 180, to: 330 },
  reveal: { from: 330, to: 450 },
  mechanism: { from: 450, to: 660 },
  output: { from: 660, to: 780 },
  flywheel: { from: 780, to: 900 },
} as const;

// The four chambers of the machine — the service-business stack, in the
// order a lead flows through it (mirrors the site's Services stages).
export const STAGES = [
  { title: "Lead capture", sub: "Ads & forms → qualified leads" },
  { title: "AI follow-up", sub: "Every lead nurtured in seconds" },
  { title: "Booking & reminders", sub: "Set, confirmed, reminded" },
  { title: "Payments & invoicing", sub: "Deposits, invoices, paid" },
] as const;

export const COLORS = {
  bg: "#000000",
  blue: "#056AFC",
  pink: "#e7028d",
  amber: "#f59e0b",
  ink: "#ffffff",
} as const;

// The film ships in both site themes. Brand blue/pink/amber are shared; bg,
// ink and `surface` (phone body, silhouettes) flip. Light values are the
// page's own tokens (globals.css html[data-theme="light"]: --tl-page /
// --tl-ink / --tl-surface) so the film dissolves into the page in either theme.
export type Theme = "dark" | "light";
export type Palette = { bg: string; blue: string; pink: string; amber: string; ink: string; surface: string };

const PALETTES: Record<Theme, Palette> = {
  dark: { ...COLORS, surface: "#05060a" },
  light: { bg: "#eef0f4", blue: COLORS.blue, pink: COLORS.pink, amber: COLORS.amber, ink: "#0b0d12", surface: "#ffffff" },
};

export const palette = (theme: Theme): Palette => PALETTES[theme];

// HeroLoop provides the theme (from the composition's props); scenes read
// their colors through usePalette() so no scene knows which theme it is in.
export const ThemeContext = createContext<Theme>("dark");
export const usePalette = (): Palette => palette(useContext(ThemeContext));

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export type Rect = { x: number; y: number; w: number; h: number };
export type Pt = { x: number; y: number };

export type Funnel = {
  cx: number; // center x of the funnel
  top: number; // y of the mouth (first tier's top edge)
  tierH: number;
  gap: number;
  widths: readonly [number, number, number, number]; // mouth → spout
};

export type Layout = {
  map: Rect; // where the equirectangular dot map is drawn
  cluster: Pt & { r: number }; // the phone cloud: center (= the hero phone) + radius
  phone: Pt & { w: number; h: number };
  funnel: Funnel; // THE MACHINE: four narrowing tiers, pulses fall through the center
  ports: Pt[]; // 5 intake ports across the funnel's mouth (Instagram, TikTok, Facebook, Google, ChatGPT)
  output: Rect; // revenue block under the spout
  anchorZoom: Pt; // viewport-fraction where the phone lands (legibility frame)
};

export const worldSize = (portrait: boolean) =>
  portrait ? { w: 1080, h: 1920 } : { w: 1920, h: 1080 };

// The funnel's tier k as a rect (top edge width = widths[k]).
export const tierRect = (fn: Funnel, k: number): Rect => ({
  x: fn.cx - fn.widths[k] / 2,
  y: fn.top + k * (fn.tierH + fn.gap),
  w: fn.widths[k],
  h: fn.tierH,
});
export const funnelBottom = (fn: Funnel) => fn.top + 4 * fn.tierH + 3 * fn.gap;

// The world extends BELOW the map: the funnel and its output live under it and
// the camera pans down to them; the flywheel pulls back up to the map.
const build = (portrait: boolean): Layout => {
  const { w, h } = worldSize(portrait);
  const phone = portrait ? { x: 310, y: 340, w: 40, h: 84 } : { x: 430, y: 410, w: 40, h: 84 };
  const funnel: Funnel = portrait
    ? { cx: w / 2, top: 1250, tierH: 104, gap: 14, widths: [820, 640, 470, 320] }
    : { cx: w / 2, top: 1250, tierH: 92, gap: 14, widths: [900, 700, 500, 330] };
  const mouth = funnel.widths[0];
  const ports = [0, 1, 2, 3, 4].map((k) => ({ x: funnel.cx + (k - 2) * (mouth / 5.6), y: funnel.top - 60 }));
  const bottom = funnelBottom(funnel);
  return {
    map: portrait ? { x: 0, y: 60, w: 1080, h: 540 } : { x: 0, y: 60, w: 1920, h: 960 },
    cluster: { x: phone.x, y: phone.y, r: portrait ? 260 : 320 },
    phone,
    funnel,
    ports,
    output: { x: funnel.cx - 180, y: bottom + 50, w: 360, h: 170 },
    anchorZoom: portrait ? { x: 0.5, y: 0.24 } : { x: 0.2, y: 0.5 },
  };
};
const LAYOUTS = { landscape: build(false), portrait: build(true) };
export const layoutFor = (portrait: boolean): Layout => (portrait ? LAYOUTS.portrait : LAYOUTS.landscape);

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  return layoutFor(height > width);
};

export const usePortraitFilm = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};
