import Slide from "./Slide";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

export default function ProblemSlide() {
  return (
    <Slide id="tl-solrite-problem">
      <div className="max-w-[46rem]">
        <Eyebrow>The problem</Eyebrow>
        <Kinetic
          segments={[
            { text: "Meta only ever learns that a " },
            { text: "form was submitted.", gradient: true },
          ]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-[43rem] text-[1.02rem] leading-relaxed text-ink/55">
            With Meta Instant Forms, the conversion event being optimised against is the form submission
            itself. It is the only outcome Meta is told about, so it is the only outcome Meta can buy.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-4 max-w-[43rem] text-[1.02rem] leading-relaxed text-ink/55">
            Every delivery decision — which audiences to chase, which creative to favour, where to push
            budget — is Meta answering a single question:{" "}
            <span className="text-ink/85">who is most likely to complete this form?</span> Not who is likely
            to become a Solrite customer.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.35}>
        <div className="mt-10 max-w-[43rem] border-l-2 border-brand-pink/70 pl-6">
          <p className="text-[1.02rem] leading-relaxed text-ink/70">
            Instant Forms pre-fill name, email and phone from the user&apos;s profile, so submitting one costs
            the user almost nothing. That is why they produce volume so reliably — and why volume is a weak
            signal of intent.
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/70">
            As budget increases, Meta widens the net looking for more of what it has been rewarded for: cheap
            form fills. Cost per lead holds, the dashboard looks healthy, and cost per{" "}
            <span className="text-ink">signed deal</span> quietly climbs. The metric that is visible and the
            metric that pays the bills move in opposite directions.
          </p>
        </div>
      </Reveal>
    </Slide>
  );
}
