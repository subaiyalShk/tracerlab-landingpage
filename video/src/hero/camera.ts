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
  // Mechanism/output beats frame the WHOLE floor pipeline (ports → machine → output),
  // not the machine's center — in portrait the machine sits left of frame center and
  // centering it pushed the output block off the right edge.
  const floorFocus = {
    x: (L.ports[0].x + L.output.x + L.output.w) / 2,
    y: center.y + (portrait ? 120 : 60),
  };
  const drift = portrait ? 0 : 40; // output-beat drift right; portrait has no slack
  return [
    { frame: 0, zoom: 1, target: center, anchor: mid },
    { frame: BEATS.world.to, zoom: 1.12, target: center, anchor: mid },
    { frame: BEATS.people.to, zoom: 3.2, target: { x: L.cluster.x, y: L.cluster.y }, anchor: L.anchorZoom },
    { frame: BEATS.attention.to, zoom: 8, target: { x: L.phone.x, y: L.phone.y }, anchor: L.anchorZoom },
    // Pins the phone to its own screen position for the whole pull-out: target
    // = phone, anchor = the phone's own viewport fraction ⇒ at zoom 1 this is
    // the identity transform. Easing target/anchor toward the world center on
    // the same curve as zoom (8→1) would otherwise swing the cluster off the
    // left edge of frame mid-beat (measured screenX ≈ -522 at frame 470).
    { frame: BEATS.reveal.to, zoom: 1, target: { x: L.phone.x, y: L.phone.y }, anchor: { x: L.phone.x / w, y: L.phone.y / h } },
    { frame: BEATS.mechanism.to, zoom: 1.06, target: floorFocus, anchor: mid },
    { frame: BEATS.output.to, zoom: 1.06, target: { x: floorFocus.x + drift, y: floorFocus.y }, anchor: mid },
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
