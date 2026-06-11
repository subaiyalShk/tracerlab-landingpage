const REPLACES = ["10–15 employees", "Manual processes", "Missed follow-ups", "Operational inefficiencies"];

export default function WhatThisReplaces() {
  return (
    <section id="tl-ag-replaces" className="w-full bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-8 sm:px-10">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink/35">What this replaces</div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {REPLACES.map((r) => (
            <li key={r} className="flex items-center gap-2 text-[0.95rem] text-ink/45">
              <span aria-hidden className="text-brand-red">✕</span>
              <span className="line-through decoration-ink/30">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
