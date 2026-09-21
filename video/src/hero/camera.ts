import { useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, DURATION, layoutFor, worldSize, type Pt } from "./config";

export type Cam = { zoom: number; target: Pt; anchor: Pt };
export type CameraKey = Cam & { frame: number };

// Smoothstep-style ease in/out cubic — every camera move uses the same curve.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// The whole film is ONE camera path. Keys sit on beat boundaries (spec §1);
// the last key equals the first so the loop closes (tested).
export const cameraKeys = (portrait: boolean): CameraKey[] => {
  const { w, h } = worldSize(portrait);
  const L = layoutFor(portrait);
  const center = { x: w / 2, y: h / 2 };
  const mid = { x: 0.5, y: 0.5 };
  // After the phone, the camera never returns to the wide world view until the
  // loop closes: it rides the cables down from the phone (mid-reveal key) and
  // lands on the floor pipeline (ports → machine → output), which spans nearly
  // the full world width, so FLOOR_ZOOM is the tightest framing that keeps both
  // ends on screen with a margin for the output-beat drift (landscape: 1642
  // world px × 1.12 ≈ 1839 of 1920). The pipeline's midpoint is the target and
  // target.y puts the machine in the lower-middle of the frame.
  const FLOOR_ZOOM = portrait ? 1.1 : 1.12;
  const machineMidY = L.machine.y + L.machine.h / 2;
  const PORT_HALF = 22; // Reveal.PORT_SIZE / 2 — the pipeline's left edge is the first port's edge
  const floorFocus = {
    x: (L.ports[0].x - PORT_HALF + L.output.x + L.output.w) / 2,
    y: machineMidY - (portrait ? 470 : 340) / FLOOR_ZOOM,
  };
  // Reveal in two moves: first pull back on the pinned phone (it shrinks into
  // one thread among many), THEN slide down the cables — panning at zoom 8
  // would throw the phone off the top of the frame in a handful of frames.
  const phoneShrink = { zoom: 3.5, target: { x: L.phone.x, y: L.phone.y }, anchor: L.anchorZoom };
  // Mid-reveal: halfway down the cables, ports entering from the bottom.
  const cableRide = portrait
    ? { zoom: 2.2, target: { x: L.cluster.x, y: L.ports[0].y - 250 }, anchor: mid }
    : { zoom: 2.6, target: { x: (L.ports[0].x + L.ports[3].x) / 2, y: L.ports[0].y - 160 }, anchor: { x: 0.35, y: 0.5 } };
  const drift = portrait ? 0 : 24; // output-beat drift right (inside the ~40 px margin at FLOOR_ZOOM); portrait has no slack
  return [
    { frame: 0, zoom: 1, target: center, anchor: mid },
    { frame: BEATS.world.to, zoom: 1.12, target: center, anchor: mid },
    { frame: BEATS.people.to, zoom: 3.2, target: { x: L.cluster.x, y: L.cluster.y }, anchor: L.anchorZoom },
    // Arrive on the phone early in the Attention beat and HOLD, so all five
    // platform screens play at full size (the last key just repeats the pose).
    { frame: BEATS.attention.from + 50, zoom: 8, target: { x: L.phone.x, y: L.phone.y }, anchor: L.anchorZoom },
    { frame: BEATS.attention.to, zoom: 8, target: { x: L.phone.x, y: L.phone.y }, anchor: L.anchorZoom },
    { frame: BEATS.reveal.from + 30, ...phoneShrink },
    { frame: BEATS.reveal.from + 90, ...cableRide },
    { frame: BEATS.reveal.to, zoom: FLOOR_ZOOM, target: floorFocus, anchor: mid },
    { frame: BEATS.mechanism.to, zoom: FLOOR_ZOOM, target: floorFocus, anchor: mid },
    { frame: BEATS.output.to, zoom: FLOOR_ZOOM, target: { x: floorFocus.x + drift, y: floorFocus.y }, anchor: mid },
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
