import Image from "next/image";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

type Deployment = { img: string; title: string; category: string; desc: string; result: string };

const DEPLOYMENTS: Deployment[] = [
  {
    img: "/assets/agents/solar-growth-system.png",
    title: "Solar Growth System",
    category: "Solar & Energy",
    desc: "Full-funnel marketing system for a solar installer — our AI voice agent books and qualifies appointments with follow-ups that drive an 83% show-up rate, plus AI CAD designs, inventory tracking, install scheduling, and customer service.",
    result: "$11.28M revenue generated",
  },
  {
    img: "/assets/agents/agriculture-operations.png",
    title: "Agriculture Operations Platform",
    category: "Agriculture",
    desc: "End-to-end operations platform for a working farm — a centralized dashboard, integrated scheduling, marketing pipeline, SMS automations, and digital cutsheets, replacing paper trails with one unified workspace.",
    result: "Paper trails → one workspace",
  },
  {
    img: "/assets/agents/gis-mapping-tool.jpg",
    title: "GIS Mapping Tool",
    category: "Geospatial Intelligence",
    desc: "A mapping tool for door-to-door, service-based companies to prospect smarter and gather buyer intent at scale.",
    result: "500+ active users",
  },
  {
    img: "/assets/agents/ecommerce-ai-marketing.jpg",
    title: "E-Commerce Brand & AI Marketing",
    category: "E-Commerce",
    desc: "Built an entire e-commerce brand from the ground up — storefront, a frictionless checkout that lifts conversion, and always-on AI ad campaigns.",
    result: "Brand built end-to-end",
  },
  {
    img: "/assets/agents/roofing-marketing.jpg",
    title: "Roofing Marketing",
    category: "Field Sales",
    desc: "High-converting Meta and Google ad campaigns paired with click funnels for a roofing company.",
    result: "$6.6M revenue generated",
  },
];

export default function Deployments() {
  return (
    <section id="tl-ag-deployments" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>Proven in production</Eyebrow>
          <Kinetic
            segments={[{ text: "Real systems. Real " }, { text: "results.", gradient: true }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
              A selection of production systems powering real-world outcomes for our partners.
            </p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {DEPLOYMENTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.12} y={34} amount={0.15} className="group h-full">
              <Bevel
                bevel={16}
                border={GLASS_BORDER}
                bg={GLASS_BG}
                className="h-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-1"
              >
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-ink/10">
                    <Image
                      src={p.img}
                      alt={`${p.title} — Tracerlabs deployment`}
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    {/* sheen sweep on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-1/3 z-10 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink/40">
                      <span className="inline-flex items-center gap-1.5 text-brand-pink">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                        Live
                      </span>
                      <span className="text-ink/25">·</span>
                      {p.category}
                    </div>
                    <h3 className="font-display mt-3 text-[1.25rem] font-normal leading-tight tracking-tight">{p.title}</h3>
                    <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink/55">{p.desc}</p>
                    <div className="bv-6 mt-5 inline-flex w-fit items-center gap-2 bg-ink/[0.05] px-3 py-1.5 text-[0.8rem] font-medium text-ink/80">
                      <span aria-hidden className="h-3 w-px bg-gradient-to-b from-brand-pink to-brand-blue" />
                      {p.result}
                    </div>
                  </div>
                </article>
              </Bevel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
