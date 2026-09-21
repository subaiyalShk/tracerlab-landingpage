import { useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, DURATION, layoutFor, worldSize, type Pt } from "./config";

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
  // After the phone, the camera never returns to the wide world view until the
  // loop closes: it rides the cables down from the phone, then settles on the
  // MACHINE, centered and filling the width — the explainer shot the labelled
  // stages play on. The output beat pans right to the machine's second half
  // plus the revenue block; the flywheel is the only pull-out to the world.
  // Target sits a little above the machine's center so the title + label row
  // above it and the block itself read as one centered group.
  const machineCenter = { x: L.machine.x + L.machine.w / 2, y: L.machine.y + L.machine.h / 2 + (portrait ? 50 : -40) };
  const MACHINE_ZOOM = portrait ? 1.8 : 2.2; // 780 × 2.2 = 1716 of 1920; 560 × 1.8 = 1008 of 1080
  const outputSpanL = L.machine.x + L.machine.w * 0.5;
  const outputSpanR = L.output.x + L.output.w;
  const OUTPUT_ZOOM = portrait ? 1.6 : 1.7;
  const outputFocus = { x: (outputSpanL + outputSpanR) / 2, y: machineCenter.y - (portrait ? 40 : 20) };
  // Reveal in two moves: first pull back on the pinned phone (it shrinks into
  // one thread among many), THEN slide down the cables — panning at zoom 8
  // would throw the phone off the top of the frame in a handful of frames.
  const phoneShrink = { zoom: 3.5, target: { x: L.phone.x, y: L.phone.y }, anchor: L.anchorZoom };
  // Mid-reveal: halfway down the cables, ports entering from the bottom.
  const cableRide = portrait
    ? { zoom: 2.2, target: { x: L.cluster.x, y: L.ports[0].y - 250 }, anchor: mid }
    : { zoom: 2.6, target: { x: (L.ports[0].x + L.ports[3].x) / 2, y: L.ports[0].y - 160 }, anchor: { x: 0.35, y: 0.5 } };
  return [
    { frame: 0, zoom: 1, target: center, anchor: mid },
    // One slow dolly-in on the map while the opening stats play. The map has
    // faded out by MAP_OUT; the phone scene runs on its own fixed camera
    // (PhoneLayer) so the main camera can move UNSEEN to the phone pose by
    // the reveal, where the layers hand over pixel-for-pixel.
    { frame: MAP_OUT, zoom: 1.4, target: center, anchor: mid },
    { frame: BEATS.reveal.from, ...phonePose(portrait) },
    { frame: BEATS.reveal.from + 30, ...phoneShrink },
    { frame: BEATS.reveal.from + 75, ...cableRide },
    { frame: BEATS.reveal.to, zoom: MACHINE_ZOOM, target: machineCenter, anchor: mid },
    { frame: BEATS.mechanism.to, zoom: MACHINE_ZOOM, target: machineCenter, anchor: mid },
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
