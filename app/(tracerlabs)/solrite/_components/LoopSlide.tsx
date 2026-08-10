import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Eyebrow from "../../../components/Eyebrow";

const PINK = "#e7028d";

// The thesis visual: acquisition path complete, learning path broken. Node fills use
// --tl-surface and every stroke/label is currentColor, so the whole diagram re-resolves
// when the theme flips. Only the break is brand-pink.
function LoopDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 920 250"
        role="img"
        aria-label="The lead flows from Meta ad to Instant form to Spark to a real outcome. The return path carrying that outcome back to Meta is broken."
        className="h-auto w-full min-w-[720px] text-ink"
      >
        <defs>
          <marker id="tl-sol-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.55" />
          </marker>
          <marker id="tl-sol-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={PINK} />
          </marker>
        </defs>

        <g fontFamily="var(--font-body), system-ui, sans-serif" fontSize="13">
          {/* nodes */}
          <rect x="10" y="52" width="176" height="62" rx="3" fill="var(--tl-surface)" stroke="currentColor" strokeOpacity="0.18" />
          <text x="98" y="79" textAnchor="middle" fill="currentColor">Meta ad</text>
          <text x="98" y="99" textAnchor="middle" fill="currentColor" opacity="0.5" fontSize="11.5">delivery + bidding</text>

          <rect x="248" y="52" width="176" height="62" rx="3" fill="var(--tl-surface)" stroke="currentColor" strokeOpacity="0.18" />
          <text x="336" y="79" textAnchor="middle" fill="currentColor">Instant form</text>
          <text x="336" y="99" textAnchor="middle" fill="currentColor" opacity="0.5" fontSize="11.5">submitted</text>

          <rect x="486" y="52" width="176" height="62" rx="3" fill="var(--tl-surface)" stroke="currentColor" strokeOpacity="0.4" />
          <text x="574" y="79" textAnchor="middle" fill="currentColor">Spark</text>
          <text x="574" y="99" textAnchor="middle" fill="currentColor" opacity="0.5" fontSize="11.5">texts, calls, qualifies</text>

          <rect x="724" y="52" width="186" height="62" rx="3" fill="var(--tl-surface)" stroke="currentColor" strokeOpacity="0.4" />
          <text x="817" y="79" textAnchor="middle" fill="currentColor">Real outcome</text>
          <text x="817" y="99" textAnchor="middle" fill="currentColor" opacity="0.5" fontSize="11.5">qualified · signed · junk</text>

          {/* forward path — intact */}
          <line x1="190" y1="83" x2="242" y2="83" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#tl-sol-ar)" />
          <line x1="428" y1="83" x2="480" y2="83" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#tl-sol-ar)" />
          <line x1="666" y1="83" x2="718" y2="83" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#tl-sol-ar)" />

          <text x="336" y="32" textAnchor="middle" fill="currentColor" opacity="0.45" fontSize="10.5" letterSpacing="1.6">
            THE ONLY EVENT META SEES
          </text>
          <line x1="336" y1="38" x2="336" y2="46" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />

          {/* return path — broken */}
          <path d="M817,122 L817,182 L486,182" fill="none" stroke={PINK} strokeWidth="1.5" strokeDasharray="5 5" />
          <path d="M346,182 L98,182 L98,120" fill="none" stroke={PINK} strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#tl-sol-arp)" />
          <g transform="translate(416,182)">
            <line x1="-13" y1="-10" x2="13" y2="10" stroke={PINK} strokeWidth="2.5" />
            <line x1="13" y1="-10" x2="-13" y2="10" stroke={PINK} strokeWidth="2.5" />
          </g>
          <text x="416" y="218" textAnchor="middle" fill={PINK} fontSize="13">no signal returns</text>
          <text x="416" y="238" textAnchor="middle" fill="currentColor" opacity="0.45" fontSize="11.5">
            Meta never finds out which leads were worth anything
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function LoopSlide() {
  return (
    <Slide id="tl-solrite-loop">
      <div className="max-w-[46rem]">
        <Eyebrow>The open circuit</Eyebrow>
        <KineticHeading
          segments={[{ text: "The lead reaches you. " }, { text: "Nothing goes back.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>

      <SlideReveal delay={0.15}>
        <div className="mt-10">
          <LoopDiagram />
        </div>
      </SlideReveal>

      <SlideReveal delay={0.25}>
        <p className="mt-8 max-w-[46rem] text-[1.02rem] leading-relaxed text-ink/55">
          The acquisition path is complete and working. The learning path is not — which is why the ad account
          cannot get smarter over time, no matter how long it runs.
        </p>
      </SlideReveal>
    </Slide>
  );
}
