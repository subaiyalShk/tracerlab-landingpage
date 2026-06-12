// Generates the /agents page imagery via fal.ai / Nano Banana.
// Requires FAL_KEY in the environment. Run:
//   export FAL_KEY="$(grep -E '^FAL_KEY=' ../../.env | cut -d= -f2-)"   # tracerlabs/.env
//   node scripts/gen-agents-images.mjs
//
// Brand: "sharp technical dark" — near-black, magenta-pink (#e7028d) → electric-blue
// (#056afc) accents, chamfered 45° geometry. Backdrops are used at LOW opacity behind
// content, so they're prompted deliberately dark and atmospheric.
import { fal } from "@fal-ai/client";
import { writeFile, mkdir } from "node:fs/promises";

// One shared plate recipe so the six emblems read as a set.
const PLATE =
  "A square dark gunmetal metal plate with its top-right and bottom-left corners cut at a 45-degree chamfer, centered on a pure black background, brushed-metal surface with a soft top sheen.";
const PLATE_STYLE =
  "The icon's neon edge-light fades from magenta-pink on the left to electric blue on the right. Macro product photography, straight-on, the plate filling most of the frame, dramatic low-key studio lighting, a faint reflection beneath the plate. Shot on Hasselblad medium format with 100mm macro lens at f/8, crushed blacks, neutral grading. For a dark technical SaaS landing-page icon set, label-free.";

const IMAGES = [
  {
    name: "team-lineup",
    aspect_ratio: "16:9",
    prompt:
      "A lineup of seven sleek matte-black humanoid AI agent figures standing in a shallow V-formation on a polished black floor, the central figure a half-step forward. Their smooth featureless faceplates and shoulder seams catch a thin rim light — magenta-pink from the left, electric blue from the right — with soft mirror reflections under their feet and fine dust drifting in the air. Wide cinematic shot at chest height. Dramatic low-key studio lighting, deep black background with a faint cool haze far behind. Shot on ARRI Alexa with 35mm lens at f/2.8, crushed blacks, magenta-and-teal cinematic grade. Hero visual for a dark, premium AI-agents landing page.",
  },
  {
    name: "backdrop-console",
    aspect_ratio: "21:9",
    prompt:
      "A vast dark mission-control room seen from the back of the hall, rows of empty operator consoles glowing faintly with magenta-pink and electric-blue interface light, a huge dim data wall far at the front. Everything deliberately dark, soft and out of focus — atmosphere over detail — with light haze in the air. Wide establishing shot from standing height. Low-key lighting, crushed blacks, desaturated cool shadows. Shot on ARRI Alexa with 24mm wide-angle lens at f/2.0. A subtle low-opacity background texture for a dark landing-page section.",
  },
  {
    // v3: no glowing horizon feature at all — any bright spot there competed with the
    // voice-orb CTA button sitting directly above it on the page. Just the trace plane
    // fading into darkness. NOTE: regenerations need a NEW versioned filename (and src
    // update in AgentsCta) — the Next/Vercel image cache is keyed by source URL.
    name: "backdrop-cta-v3",
    aspect_ratio: "21:9",
    prompt:
      "An abstract night scene of a flat plane of fine circuit traces glowing faintly in magenta-pink and electric-blue, stretching away from the camera and fading into complete darkness well before a distant flat horizon, a whisper of haze low over the plane. Symmetrical wide composition with deep, empty black sky filling the upper half, the far distance dissolving to pure black. The traces are dim and get dimmer with distance, crushed blacks everywhere. Shot on ARRI Alexa with 24mm lens at f/4, cinematic grade. A subtle low-opacity background for a dark call-to-action section.",
  },
  {
    name: "emblem-front-end",
    aspect_ratio: "1:1",
    prompt: `${PLATE} Embossed into the surface is a glowing broadcast antenna emitting three concentric signal arcs. ${PLATE_STYLE}`,
  },
  {
    name: "emblem-sales",
    aspect_ratio: "1:1",
    prompt: `${PLATE} Embossed into the surface is a glowing arrow striking the center of a circular target reticle. ${PLATE_STYLE}`,
  },
  {
    name: "emblem-operations",
    aspect_ratio: "1:1",
    prompt: `${PLATE} Embossed into the surface are three glowing interlocking hexagonal gears. ${PLATE_STYLE}`,
  },
  {
    name: "emblem-support",
    aspect_ratio: "1:1",
    prompt: `${PLATE} Embossed into the surface is a glowing communication headset with a small microphone boom. ${PLATE_STYLE}`,
  },
  {
    name: "emblem-growth",
    aspect_ratio: "1:1",
    prompt: `${PLATE} Embossed into the surface is a glowing ascending bar chart with an arrow curving up and to the right above it. ${PLATE_STYLE}`,
  },
  {
    name: "emblem-finance",
    aspect_ratio: "1:1",
    prompt: `${PLATE} Embossed into the surface is a glowing document sheet engraved with a rising line graph. ${PLATE_STYLE}`,
  },
];

const OUT = "public/assets/agents/gen";
await mkdir(OUT, { recursive: true });

const only = process.argv.slice(2); // optionally pass names to regenerate selectively
for (const { name, prompt, aspect_ratio } of IMAGES) {
  if (only.length && !only.includes(name)) continue;
  process.stdout.write(`generating ${name} (${aspect_ratio})... `);
  const res = await fal.subscribe("fal-ai/nano-banana", {
    input: { prompt, aspect_ratio, num_images: 1, output_format: "png" },
  });
  const url = res.data.images[0].url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(`${OUT}/${name}.png`, buf);
  console.log(`saved (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log("done");
