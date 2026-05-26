export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <span className="font-display text-base font-bold tracking-tight text-cream">
          tracer<span className="text-solar">labs</span>
        </span>
        <p className="text-[0.8rem] text-faint">
          © {new Date().getFullYear()} Tracerlabs. Solar growth systems, built &amp; managed for you.
        </p>
        <a
          href="#book"
          className="text-[0.85rem] font-semibold text-solar transition-colors hover:text-ember"
        >
          Book a strategy call →
        </a>
      </div>
    </footer>
  );
}
