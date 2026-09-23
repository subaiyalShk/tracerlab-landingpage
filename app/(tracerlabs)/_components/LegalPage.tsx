import type { ReactNode } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

// Shared chrome for the two legal pages. Plain prose on the site's dark theme —
// these exist to be read and to satisfy ad-platform policy (Meta requires a
// reachable privacy policy on lead-generation landing pages), so they get the
// nav and footer rather than the funnel's stripped-down treatment.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="font-body w-full bg-page text-ink">
        <div className="mx-auto w-full max-w-[46rem] px-6 py-16 sm:px-10 sm:py-24">
          <h1
            className="text-[clamp(2rem,5vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-archivo), system-ui, sans-serif" }}
          >
            {title}
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink/45">Last updated {updated}</p>
          <div className="nt-legal mt-10 text-[1rem] leading-[1.75] text-ink/70">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
