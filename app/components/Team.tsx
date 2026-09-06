// The team — two co-founders, one card each: portrait flush to the card top,
// name/role/bio below, LinkedIn as a quiet text link. The two portraits were
// shot in very different light, so they render monochrome (unified, like the
// tech marquee) and lift to full color on hover/focus.
import Image from "next/image";
import Card from "./Card";

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

type Member = {
  name: string;
  role: string;
  bio: string;
  img: string;
  objectPosition: string;
  // Extra transform for when object-position runs out of room (a source photo
  // with no headroom above the face): a slight anchored zoom shifts the face
  // without exposing gaps. Pair with the origin the zoom should hang from.
  imgTransform?: string;
  imgOrigin?: string;
  linkedin: string;
};

const TEAM: Member[] = [
  {
    name: "Sufyan Sheikh",
    role: "Co-founder — sales & marketing",
    bio: "Millions in revenue closed the hard way — years of door-to-door sales. Sufyan runs sales and marketing: the offers, the ads, and the field-tested instinct for what actually makes a lead say yes.",
    img: "/assets/team-sufyan.jpg",
    objectPosition: "50% 25%",
    imgTransform: "scale(1.1)",
    imgOrigin: "center bottom",
    linkedin: "https://www.linkedin.com/in/sufyan-sheikh-b258a7141/",
  },
  {
    name: "Subaiyal Sheikh",
    role: "Co-founder — engineering",
    bio: "Full-stack architect who has shipped for Fortune 5 companies and startups — production AI, payment systems moving millions. Subaiyal maps how a business actually runs, finds where it leaks, and builds the agentic systems that fix it.",
    img: "/assets/team-subaiyal.jpg",
    objectPosition: "50% 0%",
    imgTransform: "scale(1.07)",
    imgOrigin: "center top",
    linkedin: "https://www.linkedin.com/in/subaiyalshk/",
  },
];

const LinkedInIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.28 2.37 4.28 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

export default function Team() {
  return (
    <section id="tl-team" className="font-body relative isolate w-full overflow-hidden bg-page text-ink">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10"><div className="nt-hairline" /></div>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="max-w-[44rem]">
          <span aria-hidden className="nt-kicker" />
          <p className="text-[0.98rem] text-ink/50">The team</p>
          <h2
            className="mt-4 text-[clamp(2.1rem,4.6vw,3.3rem)] font-extrabold leading-[1.06] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            Two people. The whole machine.
          </h2>
          <p className="mt-5 max-w-[40rem] text-[1.05rem] leading-[1.7] text-ink/60">
            Sales and software under one roof — the reason everything we ship
            works end to end, from the first ad dollar to the booked job.
          </p>
        </div>

        <div className="mt-10 grid max-w-[58rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {TEAM.map((m) => (
            <article key={m.name} className="group h-full">
              <Card bevel={12} className="h-full" contentClassName="h-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0b0b0f]">
                  <Image
                    src={m.img}
                    alt={`Portrait of ${m.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 28rem"
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0"
                    style={{
                      objectPosition: m.objectPosition,
                      ...(m.imgTransform ? { transform: m.imgTransform, transformOrigin: m.imgOrigin } : {}),
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[1.2rem] font-bold tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
                    {m.name}
                  </h3>
                  <p className="mt-1 text-[0.88rem] text-ink/50">{m.role}</p>
                  <p className="mt-3 text-[0.92rem] leading-[1.65] text-ink/60">{m.bio}</p>
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.92rem] font-semibold text-ink/75 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
                  >
                    {LinkedInIcon}
                    LinkedIn
                  </a>
                </div>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
