import { useVideoConfig } from "remotion";

export const FPS = 30;
export const DURATION = 900; // 30 s

// Beat boundaries in frames (spec §1). Contiguous; last ends at DURATION.
export const BEATS = {
  world: { from: 0, to: 120 },
  people: { from: 120, to: 240 },
  attention: { from: 240, to: 390 },
  reveal: { from: 390, to: 540 },
  mechanism: { from: 540, to: 660 },
  output: { from: 660, to: 780 },
  flywheel: { from: 780, to: 900 },
} as const;

export const COLORS = {
  bg: "#000000",
  blue: "#056AFC",
  pink: "#e7028d",
  amber: "#f59e0b",
  ink: "#ffffff",
} as const;

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
  ports: Pt[]; // 4 intake ports, left → right
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
        ports: [
          { x: 150, y: 1700 },
          { x: 250, y: 1700 },
          { x: 350, y: 1700 },
          { x: 450, y: 1700 },
        ],
        machine: { x: 90, y: 1650, w: 560, h: 110 },
        output: { x: 700, y: 1580, w: 320, h: 220 },
        anchorZoom: { x: 0.5, y: 0.24 },
      }
    : {
        map: { x: 0, y: 60, w: 1920, h: 960 },
        cluster: { x: 420, y: 400, r: 120 },
        phone: { x: 430, y: 410, w: 40, h: 84 },
        ports: [
          { x: 240, y: 960 },
          { x: 330, y: 960 },
          { x: 420, y: 960 },
          { x: 510, y: 960 },
        ],
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
