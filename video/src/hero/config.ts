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

export type Layout = {
  map: Rect; // where the equirectangular dot map is drawn
  cluster: Pt & { r: number }; // people cluster center + radius
  phone: Pt & { w: number; h: number };
  ports: Pt[]; // 5 intake ports, left → right (Instagram, TikTok, Facebook, Google, ChatGPT)
  portsFeed: "side" | "top"; // traces enter the machine from its left end (landscape) or drop in through its top (portrait)
  machine: Rect;
  output: Rect;
  anchorZoom: Pt; // viewport-fraction where the zoom target lands (legibility frame)
};

export const worldSize = (portrait: boolean) =>
  portrait ? { w: 1080, h: 1920 } : { w: 1920, h: 1080 };

export const layoutFor = (portrait: boolean): Layout =>
  portrait
    ? {
        map: { x: 0, y: 60, w: 1080, h: 540 },
        cluster: { x: 300, y: 330, r: 90 },
        phone: { x: 310, y: 340, w: 40, h: 84 },
        // Portrait is too narrow for a single row: the ports sit ABOVE the machine's
        // left half and their traces drop straight down through its top edge.
        ports: [
          { x: 150, y: 1540 },
          { x: 230, y: 1540 },
          { x: 310, y: 1540 },
          { x: 390, y: 1540 },
          { x: 470, y: 1540 },
        ],
        portsFeed: "top",
        machine: { x: 100, y: 1650, w: 560, h: 110 },
        output: { x: 700, y: 1580, w: 300, h: 220 },
        anchorZoom: { x: 0.5, y: 0.24 },
      }
    : {
        map: { x: 0, y: 60, w: 1920, h: 960 },
        cluster: { x: 420, y: 400, r: 120 },
        phone: { x: 430, y: 410, w: 40, h: 84 },
        ports: [
          { x: 200, y: 960 },
          { x: 280, y: 960 },
          { x: 360, y: 960 },
          { x: 440, y: 960 },
          { x: 520, y: 960 },
        ],
        portsFeed: "side",
        machine: { x: 580, y: 905, w: 780, h: 110 },
        output: { x: 1420, y: 860, w: 400, h: 180 },
        anchorZoom: { x: 0.2, y: 0.5 },
      };

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  return layoutFor(height > width);
};

export const usePortraitFilm = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};
