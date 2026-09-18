// Generates the AI-agent team portraits (Tracy, Jarvis) via fal.ai / Nano Banana Pro.
// Tracy is anchored to her canonical reference (the LinkedIn poster's
// assets/tracy-reference.png) through the /edit endpoint so she stays the same
// woman as the reels; Jarvis is text-to-image. Both are square head-and-shoulders
// portraits framed like the founders' photos (face high in frame, headroom above).
// Run:
//   export FAL_KEY="$(grep -E '^FAL_KEY=' ../../.env | cut -d= -f2-)"   # tracerlabs/.env
//   node scripts/gen-team-agents.mjs [tracy|jarvis]
// Output: public/assets/team-<name>.jpg (1024px, via sips) — the PNG is removed.
import { fal } from "@fal-ai/client";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const TRACY_REF =
  "../../internal-automations/linkedin-content/assets/tracy-reference.png";

// Shared plate so the two agents read as a pair beside the founders: dark navy
// studio, magenta-left / blue-right rim light (the brand accents), same lens.
const STUDIO =
  "Head-and-shoulders portrait, square framing, eyes on the upper third of the frame with clear headroom above the hair, looking straight into the lens with a warm, confident half-smile. Plain deep navy-black studio backdrop with a soft magenta-pink rim light from the left and an electric-blue rim light from the right, a large soft key light from the front. Shot on Hasselblad medium format with 85mm portrait lens at f/2.8, clean neutral grading with crisp skin detail. A team-page portrait for a dark, premium AI studio website.";

const IMAGES = [
  {
    name: "team-tracy",
    ref: TRACY_REF,
    prompt: `Keep this exact woman — same face, platinum blond bob, holographic choker — and re-photograph her as a professional headshot: she wears her silver holographic bomber jacket zipped up over a black top, hands out of frame, no interface graphics or frame lines. ${STUDIO}`,
  },
  {
    name: "team-jarvis",
    prompt: `A man in his early thirties with short, neatly styled dark hair and light stubble, warm brown eyes, wearing a charcoal knit crew-neck under a matte black bomber jacket with a thin iridescent zipper, a slim wireless earpiece in his right ear. ${STUDIO}`,
  },
];

const only = process.argv.slice(2);
for (const { name, prompt, ref } of IMAGES) {
  if (only.length && !only.includes(name.replace("team-", ""))) continue;
  process.stdout.write(`generating ${name}... `);
  let res;
  if (ref) {
    const png = await readFile(ref);
    res = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
      input: {
        prompt,
        image_urls: [`data:image/png;base64,${png.toString("base64")}`],
        num_images: 1,
        aspect_ratio: "1:1",
        output_format: "png",
      },
    });
  } else {
    res = await fal.subscribe("fal-ai/nano-banana-pro", {
      input: { prompt, num_images: 1, aspect_ratio: "1:1", output_format: "png" },
    });
  }
  const url = res.data.images[0].url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const png = `public/assets/${name}.png`;
  await writeFile(png, buf);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "85", "-Z", "1024", png, "--out", png.replace(/\.png$/, ".jpg")], { stdio: "ignore" });
  await unlink(png);
  console.log(`saved public/assets/${name}.jpg`);
}
console.log("done");
