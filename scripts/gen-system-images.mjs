// Generates the four "how the system works" images via fal.ai / Nano Banana.
// Requires FAL_KEY in the environment. Run:
//   export FAL_KEY="$(grep -E '^FAL_KEY=' ../../.env | cut -d= -f2-)"   # or your key
//   node scripts/gen-system-images.mjs
import { fal } from "@fal-ai/client";
import { writeFile, mkdir } from "node:fs/promises";

const STYLE =
  "Rendered as a clean stylized 3D illustration with soft matte clay-like surfaces, a warm gold-and-amber palette on a soft cream background, gentle studio softbox lighting, shallow depth of field, premium and friendly, with clean label-free surfaces.";

const PROMPTS = [
  {
    name: "step-1",
    prompt: `A relaxed homeowner sitting on a cozy living-room couch, looking down at the phone in their hands with a delighted, surprised smile as a glowing solar-offer card lights up on the screen. Warm home interior with a plant and soft cushions, composed slightly from the side so the screen casts a warm glow on their face. ${STYLE}`,
  },
  {
    name: "step-2",
    prompt: `A friendly character cheerfully sliding down the inside of a large smooth funnel, small glowing home and lead icons swirling down with them toward a bright point at the funnel's narrow base. Centered composition with the wide funnel mouth at the top. ${STYLE}`,
  },
  {
    name: "step-3",
    prompt: `A glowing AI voice-assistant orb at the center with soft concentric sound-wave rings, dotted call-lines reaching out to several smartphones held by different friendly homeowner characters arranged in an arc, the agent calling many people at once. Centered composition. ${STYLE}`,
  },
  {
    name: "step-4",
    prompt: `A clean monthly calendar with several time slots filling up with glowing booked appointment chips gently dropping into place and a soft checkmark badge in the corner, viewed slightly top-down. ${STYLE}`,
  },
];

const OUT = "public/solar/system";
await mkdir(OUT, { recursive: true });

for (const { name, prompt } of PROMPTS) {
  process.stdout.write(`generating ${name}... `);
  const res = await fal.subscribe("fal-ai/nano-banana", {
    input: { prompt, aspect_ratio: "3:2", num_images: 1, output_format: "png" },
  });
  const url = res.data.images[0].url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(`${OUT}/${name}.png`, buf);
  console.log(`saved (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log("done");
