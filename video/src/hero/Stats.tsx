import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, rgba, usePalette, usePortraitFilm } from "./config";
import { SOFT, enter, pop } from "./springs";
import { display } from "../theme";

// Opening stats, in screen space over the world and people beats: the scale
// (how many people), then the habit (how long they spend on their phone).
// Figures are public, widely cited ones — keep the source next to the number.
const POPULATION = 8_200_000_000; // UN World Population Prospects 2024 (mid-2025 ≈ 8.2 bn)
const PHONE_HOURS = { h: 3, m: 46 }; // DataReportal Digital 2024 — daily time on mobile, global average

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// fade in over `inF`, hold, fade out over `outF`.
const window = (f: number, from: number, to: number, inF = 12, outF = 10) =>
  Math.min(interpolate(f, [from, from + inF], [0, 1], clamp), interpolate(f, [to - outF, to], [1, 0], clamp));

export const Stats: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const portrait = usePortraitFilm();
  const fs = portrait ? { kicker: 22, big: 96, sub: 30 } : { kicker: 22, big: 128, sub: 34 };
  const cx = width / 2;
  const cy = portrait ? height * 0.44 : height * 0.46;

  // Beat 1 — the scale. Counts up (eased) to the population.
  const a1 = window(f, BEATS.world.from + 6, BEATS.people.from + 4);
  const count = Math.round(
    interpolate(f, [BEATS.world.from + 6, BEATS.world.from + 60], [0, POPULATION], { easing: Easing.out(Easing.cubic), ...clamp }),
  );
  // Beat 2 — the habit.
  const a2 = window(f, BEATS.people.from + 10, BEATS.attention.from - 14); // gone with the map

  // spring entrances; the fade-outs keep the linear windows
  const s1 = pop(f, BEATS.world.from + 6, SOFT);
  const s2 = pop(f, BEATS.people.from + 10, SOFT);
  const rule = (a: number) => ({ width: 64 * a, height: 1, background: rgba(P.blue, 0.7), margin: "0 auto" });
  const block = (a: number, sp: number, top: number): React.CSSProperties => {
    const e = enter(sp, 18);
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top,
      opacity: Math.min(a, e.opacity),
      transform: `translateY(${e.dy}px) scale(${e.scale})`,
    };
  };
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: display, textAlign: "center", color: P.ink }}>
      {/* soft backdrop so the figures sit on the map without fighting the dots */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: cy,
          width: portrait ? width * 1.1 : width * 0.6,
          height: portrait ? height * 0.34 : height * 0.5,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, ${rgba(P.bg, 0.85)} 0%, ${rgba(P.bg, 0.55)} 45%, transparent 70%)`,
          opacity: Math.max(a1, a2),
        }}
      />
      <div style={block(a1, s1, cy - fs.big)}>
        <div style={{ fontSize: fs.kicker, letterSpacing: 6, opacity: 0.6 }}>RIGHT NOW ON EARTH</div>
        <div style={{ ...rule(a1), marginTop: 10, marginBottom: 6 }} />
        <div style={{ fontSize: fs.big, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, fontVariantNumeric: "tabular-nums" }}>
          {count.toLocaleString("en-US")}
        </div>
        <div style={{ fontSize: fs.sub, opacity: 0.75 }}>people</div>
      </div>
      <div style={block(a2, s2, cy - fs.big)}>
        <div style={{ fontSize: fs.kicker, letterSpacing: 6, opacity: 0.6 }}>EVERY DAY, EACH OF THEM</div>
        <div style={{ ...rule(a2), marginTop: 10, marginBottom: 6 }} />
        <div style={{ fontSize: fs.big, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>
          {PHONE_HOURS.h}
          <span style={{ fontSize: fs.big * 0.5, opacity: 0.7 }}> h </span>
          {PHONE_HOURS.m}
          <span style={{ fontSize: fs.big * 0.5, opacity: 0.7 }}> min</span>
        </div>
        <div style={{ fontSize: fs.sub, opacity: 0.75 }}>
          on their phone — <span style={{ color: rgba(P.blue, 1) }}>scrolling · searching · asking</span>
        </div>
      </div>
    </div>
  );
};
