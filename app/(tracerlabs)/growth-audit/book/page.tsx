import type { Metadata } from "next";
import Link from "next/link";
import { read } from "../_lib/bookingToken";
import BookClient from "./BookClient";

// Step 2 of the Growth Audit funnel: pick a time. Reached only by redirect from
// the form, carrying an encrypted token — never indexed, never linked.
export const metadata: Metadata = {
  // The (tracerlabs) layout appends " | Tracerlabs" via its title template.
  title: "Pick your Growth Audit time",
  robots: { index: false, follow: false },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const lead = t ? read(t) : null;

  return (
    <main className="font-body relative isolate min-h-[100dvh] w-full overflow-clip bg-page text-ink">
      <div aria-hidden className="nt-horizon -z-10" />
      <div aria-hidden className="nt-gridfloor -z-10" />
      <div className="mx-auto w-full max-w-[640px] px-5 py-12 sm:py-16">
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[64px] w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[64px] w-auto" />
        </div>
        {lead ? (
          <BookClient token={t as string} firstName={lead.name.split(" ")[0] || "there"} />
        ) : (
          <div className="text-center">
            <h1 className="text-[1.6rem] font-extrabold tracking-tight">This booking link has expired.</h1>
            <p className="mt-3 text-ink/60">
              No problem — we still have your details and will reach out. If you would rather pick a time now,{" "}
              <Link href="/growth-audit" className="underline">
                start again
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
