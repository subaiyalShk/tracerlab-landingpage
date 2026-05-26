import { SectionHead } from "./primitives";

export default function Problem() {
  return (
    <section id="problem" className="relative border-t border-line/60 py-20 sm:py-28">
      {/* Heading stays in the readable container */}
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-10">
        <SectionHead
          kicker="The old way is breaking"
          title="Door-to-door still works — until it doesn't."
          sub="Canvassing can fill a calendar, but it ties your growth to an expensive, commission-hungry team — and today's homeowners just shop for the best offer. Here's what the old model quietly costs you:"
        />
      </div>

      {/* Video is full-bleed and frameless — its cream background matches the page, so
          it blends in seamlessly and reads large on mobile. */}
      <ProblemVideo />
    </section>
  );
}

/* The full "problem" story as one animated explainer (rendered with Remotion,
   source in /video). Covers all four pains: commission tax, the retention
   treadmill, pushed-deal cancellations, and being invisible to online buyers. */
function ProblemVideo() {
  return (
    <video
      className="mt-10 block w-full"
      src="/solar/problem.mp4"
      poster="/solar/problem-poster.png"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Animated explainer: four ways door-to-door selling costs solar companies — rep commissions inflating the price, the retention treadmill where reps you fund leave to compete, high-pressure deals that cancel, and being invisible to homeowners searching online."
    />
  );
}
