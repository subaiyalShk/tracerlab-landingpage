import { useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, DURATION, funnelBottom, layoutFor, worldSize, type Pt } from "./config";

export type Cam = { zoom: number; target: Pt; anchor: Pt };
export type CameraKey = Cam & { frame: number };

// Smoothstep-style ease in/out cubic — every camera move uses the same curve.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// The whole film is ONE camera path. Keys sit on beat boundaries (spec §1);
// the last key equals the first so the loop closes (tested).
// The map is gone (and the phone scene begins) shortly before the Attention
// beat; the cut happens on black.
export const MAP_OUT = BEATS.attention.from - 12;

// The Attention beat's pose: the phone at 8×, anchored on the legibility frame.
export const phonePose = (portrait: boolean): Cam => {
  const L = layoutFor(portrait);
  return { zoom: 8, target: { x: L.phone.x, y: L.phone.y }, anchor: L.anchorZoom };
};

export const cameraKeys = (portrait: boolean): CameraKey[] => {
  const { w, h } = worldSize(portrait);
  const L = layoutFor(portrait);
  const center = { x: w / 2, y: h / 2 };
  const mid = { x: 0.5, y: 0.5 };
  const fn = L.funnel;
  const funnelMidY = (fn.top + funnelBottom(fn)) / 2;
  // Funnel framing: mouth + ports above + a little below the spout. Portrait
  // has less width to spare, so it sits slightly closer.
  const FUNNEL_ZOOM = portrait ? 1.15 : 1.3;
  const funnelFocus = { x: fn.cx, y: funnelMidY - 20 };
  const OUTPUT_ZOOM = portrait ? 1.5 : 1.7;
  const outputFocus = { x: fn.cx, y: (funnelBottom(fn) + L.output.y + L.output.h) / 2 - 10 };
  // Zoom-out over the phone cloud: the hero phone drifts from the legibility
  // anchor to the frame's center while the cloud fills the frame.
  const cloud = { zoom: portrait ? 2 : 2.4, target: { x: L.cluster.x, y: L.cluster.y }, anchor: mid };
  return [
    { frame: 0, zoom: 1, target: center, anchor: mid },
    // One slow dolly-in on the map while the opening stats play. The map has
    // faded out by MAP_OUT; the phone scene runs on its own fixed camera
    // (PhoneLayer) so the main camera can move UNSEEN to the phone pose by
    // the reveal, where the layers hand over pixel-for-pixel.
    { frame: MAP_OUT, zoom: 1.4, target: center, anchor: mid },
    { frame: BEATS.reveal.from, ...phonePose(portrait) },
    // Reveal: pull back to the phone cloud, then dive down the cables to the funnel.
    { frame: BEATS.reveal.from + 70, ...cloud },
    { frame: BEATS.reveal.to, zoom: FUNNEL_ZOOM, target: funnelFocus, anchor: mid },
    { frame: BEATS.mechanism.to, zoom: FUNNEL_ZOOM, target: funnelFocus, anchor: mid },
    // Output: down to the spout and the revenue under it.
    { frame: BEATS.output.from + 30, zoom: OUTPUT_ZOOM, target: outputFocus, anchor: mid },
    { frame: BEATS.output.to, zoom: OUTPUT_ZOOM, target: outputFocus, anchor: mid },
    // Flywheel: the only pull-out to the wide world — revenue → attention, and
    // frame 900 must equal frame 0.
    { frame: DURATION, zoom: 1, target: center, anchor: mid },
  ];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const cameraAt = (frame: number, keys: CameraKey[]): Cam => {
  if (frame <= keys[0].frame) return strip(keys[0]);
  const last = keys[keys.length - 1];
  if (frame >= last.frame) return strip(last);
  let i = 0;
  while (keys[i + 1].frame < frame) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = ease((frame - a.frame) / (b.frame - a.frame));
  return {
    zoom: lerp(a.zoom, b.zoom, t),
    target: { x: lerp(a.target.x, b.target.x, t), y: lerp(a.target.y, b.target.y, t) },
    anchor: { x: lerp(a.anchor.x, b.anchor.x, t), y: lerp(a.anchor.y, b.anchor.y, t) },
  };
};

const strip = ({ zoom, target, anchor }: CameraKey): Cam => ({ zoom, target, anchor });

// World point `target` lands at viewport fraction `anchor`. Applied to a div
// with transform-origin 0 0 whose children are in world coordinates.
export const cameraTransform = (cam: Cam, viewport: { w: number; h: number }) => {
  const tx = cam.anchor.x * viewport.w - cam.target.x * cam.zoom;
  const ty = cam.anchor.y * viewport.h - cam.target.y * cam.zoom;
  return `translate(${tx}px, ${ty}px) scale(${cam.zoom})`;
};

export const useCamera = (): Cam => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return cameraAt(f, cameraKeys(height > width));
};
