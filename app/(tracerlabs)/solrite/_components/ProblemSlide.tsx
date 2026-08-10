import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Illustration from "./Illustration";
import Eyebrow from "../../../components/Eyebrow";

export default function ProblemSlide() {
  return (
    <Slide id="tl-solrite-problem">
      <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <Eyebrow>The problem</Eyebrow>
          <KineticHeading
            segments={[
              { text: "Meta only ever learns that a " },
              { text: "form was submitted.", gradient: true },
            ]}
            className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <SlideReveal delay={0.15}>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/55">
              With Meta Instant Forms, the conversion event being optimised against is the form submission
              itself. It is the only outcome Meta is told about, so it is the only outcome Meta can buy.
            </p>
          </SlideReveal>
          <SlideReveal delay={0.22}>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/55">
              Every delivery decision — which audiences to chase, which creative to favour, where to push
              budget — is Meta answering a single question:{" "}
              <span className="text-ink/85">who is most likely to complete this form?</span> Not who is likely
              to become a Solrite customer.
            </p>
          </SlideReveal>
        </div>

        <div className="flex flex-col gap-5">
          <SlideReveal delay={0.1}>
            <Illustration
              src="/assets/solrite/gen/il-problem-v1.png"
              alt="A sensor aimed at a single lit checkbox, while a long row of identical leads behind it stays in darkness, unseen."
              minH="min-h-[260px]"
            />
          </SlideReveal>
          <SlideReveal delay={0.28}>
            <div className="border-l-2 border-brand-pink/70 pl-5">
              <p className="text-[0.94rem] leading-relaxed text-ink/60">
                Instant Forms pre-fill name, email and phone, so submitting one costs the user almost nothing.
                As budget increases Meta hunts for more of what it is rewarded for — cheap form fills. Cost per
                lead holds, while cost per <span className="text-ink">signed deal</span> quietly climbs.
              </p>
            </div>
          </SlideReveal>
        </div>
      </div>
    </Slide>
  );
}
