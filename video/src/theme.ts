import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadBody } from "@remotion/google-fonts/PlusJakartaSans";

export const display = loadDisplay("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const body = loadBody("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

// Warm-light solar palette (matches the /solar page)
export const C = {
  cream: "#faf5ec",
  ink: "#211a11",
  sand: "#6b6053",
  faint: "#9a9083",
  line: "#ebe1d0",
  surface: "#ffffff",
  inset: "#efe6d6",
  solar: "#b9790a",
  amber: "#f59e0b",
  ember: "#f97316",
  emberDeep: "#ea580c",
  emerald: "#059669",
  red: "#dc2626",
};

export const emberGrad = `linear-gradient(180deg, ${C.ember}, ${C.emberDeep})`;
export const goldGrad = `linear-gradient(180deg, ${C.amber}, ${C.solar})`;
export const textGrad = `linear-gradient(100deg, ${C.solar}, ${C.emberDeep})`;
