import StrikeList from "./StrikeList";

// Server component — copy ships as HTML; the animated strike-through list is the client leaf.
const REPLACES = ["10–15 employees", "Manual processes", "Missed follow-ups", "Operational inefficiencies"];

export default function WhatThisReplaces() {
  return (
    <section id="tl-ag-replaces" className="w-full bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-8 sm:px-10">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink/35">What this replaces</div>
        <StrikeList items={REPLACES} />
      </div>
    </section>
  );
}
