import Image from "next/image";

// A dimmed, radially-masked illustrative backdrop for a deck slide. Sits behind the content
// (-z-10); the mask fades the edges so slide copy stays readable over it.
export default function SlideBackdrop({
  src,
  opacity = 0.3,
  focus = "object-center",
}: {
  src: string;
  opacity?: number;
  focus?: string;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className={`object-cover ${focus}`}
        style={{
          opacity,
          maskImage: "radial-gradient(ellipse 92% 88% at 50% 46%, black 20%, transparent 74%)",
          WebkitMaskImage: "radial-gradient(ellipse 92% 88% at 50% 46%, black 20%, transparent 74%)",
        }}
      />
    </div>
  );
}
