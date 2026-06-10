// Technology marquee — replaces the legacy .tech-scroll (grayscale logos that lit to full
// color on hover). Here they stay monochrome/dimmed (on-system, restrained), gently scrolling.
const LOGOS = [
  { src: "/assets/aws.png", alt: "AWS" },
  { src: "/assets/google.jpg", alt: "Google Cloud" },
  { src: "/assets/firebase.png", alt: "Firebase" },
  { src: "/assets/flutter.png", alt: "Flutter" },
  { src: "/assets/next.jpeg", alt: "Next.js" },
  { src: "/assets/anthropic.png", alt: "Anthropic" },
  { src: "/assets/gemini.png", alt: "Gemini" },
  { src: "/assets/ethereum.png", alt: "Ethereum" },
  { src: "/assets/crew-ai.png", alt: "CrewAI" },
];

export default function TechBar() {
  return (
    <div className="relative w-full overflow-hidden border-y border-ink/[0.07] bg-page py-7">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-page to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-page to-transparent sm:w-28" />
      <div className="animate-marquee flex w-max items-center gap-14 sm:gap-20">
        {[...LOGOS, ...LOGOS].map((l, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={l.src}
            alt={l.alt}
            loading="lazy"
            className="h-6 w-auto shrink-0 opacity-40 transition-opacity duration-300 hover:opacity-70 sm:h-7"
            style={{ filter: "var(--tl-logo-filter)" }}
          />
        ))}
      </div>
    </div>
  );
}
