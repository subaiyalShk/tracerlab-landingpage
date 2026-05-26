import { SectionHead } from "./primitives";
import ProblemVideo from "./ProblemVideo";

export default function Problem() {
  return (
    <section id="problem" className="relative border-t border-line/60 py-20 sm:py-28">
      {/* Heading stays in the readable container and is read first */}
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-10">
        <SectionHead
          kicker="The old way is breaking"
          title="Door-to-door still works — until it doesn't."
          sub="Canvassing can fill a calendar, but it ties your growth to an expensive, commission-hungry team — and today's homeowners just shop for the best offer. Here's what the old model quietly costs you:"
        />
      </div>

      {/* Full-bleed explainer that plays once it scrolls into view */}
      <ProblemVideo />
    </section>
  );
}
