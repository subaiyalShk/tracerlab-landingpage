import Image from "next/image";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";

// A foreground explanatory illustration, framed in the deck's glass panel and shown at
// full opacity — unlike SlideBackdrop, which dims an image behind the copy. Fills its grid
// cell so it can sit flush beside a text column of any height.
export default function Illustration({
  src,
  alt,
  className = "",
  minH = "min-h-[240px]",
}: {
  src: string;
  alt: string;
  className?: string;
  minH?: string;
}) {
  return (
    <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className={`h-full ${className}`}>
      <div className={`relative h-full w-full overflow-hidden ${minH}`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </div>
    </Bevel>
  );
}
