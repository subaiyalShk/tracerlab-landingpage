// Generate a deck image via fal.ai nano-banana. Reads FAL_KEY from env.
//   node scripts/gen-deck-image.mjs <outfile> <aspect_ratio> "<prompt>"
import { fal } from "@fal-ai/client";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const [out, aspect = "3:2", prompt] = process.argv.slice(2);
if (!out || !prompt) {
  console.error('usage: node scripts/gen-deck-image.mjs <outfile> <aspect_ratio> "<prompt>"');
  process.exit(1);
}

const result = await fal.subscribe("fal-ai/nano-banana", {
  input: { prompt, aspect_ratio: aspect, num_images: 1, output_format: "png" },
});
const url = result.data?.images?.[0]?.url;
if (!url) {
  console.error("No image returned:", JSON.stringify(result.data).slice(0, 500));
  process.exit(1);
}
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
await mkdir(dirname(out), { recursive: true });
await writeFile(out, buf);
console.log(`SAVED ${out} (${buf.length} bytes)`);
