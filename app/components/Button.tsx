import type { ReactNode } from "react";

// The brand "angular" button — single source of truth for every CTA on the site:
// chamfered top-right + bottom-left corners (clip-path), Archivo semibold in
// sentence case (Telemetry redesign — Duborics lives only in the logo now),
// hover lift + red glow.
//   primary   → solid brand-red #e21949, white text.
//   secondary → angular ghost: thin border + dark interior (clip-path can't render a clean
//               border directly, so the border is the outer layer showing through an inset
//               inner layer).
function clip(corner: number) {
  return `polygon(0 0, calc(100% - ${corner}px) 0, 100% ${corner}px, 100% 100%, ${corner}px 100%, 0 calc(100% - ${corner}px))`;
}

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "sm" | "lg";
  href?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  "aria-label"?: string;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external,
  onClick,
  type = "button",
  className = "",
  ...rest
}: Props) {
  const primary = variant === "primary";
  const CLIP = clip(size === "sm" ? 10 : size === "lg" ? 14 : 12);
  const sizeCls =
    size === "sm" ? "px-4 py-2.5 text-[0.88rem]" : size === "lg" ? "px-9 py-4 text-[1.05rem]" : "px-7 py-3 text-[0.98rem]";

  const base = `group/btn relative inline-flex shrink-0 items-center justify-center gap-2 ${sizeCls} font-semibold leading-none whitespace-nowrap outline-none transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5`;

  const font = { fontFamily: "var(--font-archivo), system-ui, sans-serif" };
  const style = primary
    ? { ...font, clipPath: CLIP, backgroundColor: "#e21949", boxShadow: "0 8px 26px -10px rgba(226,2,73,0.55)" }
    : { ...font, clipPath: CLIP, backgroundColor: "var(--tl-btn-ghost-border)" };

  const tone = primary
    ? "text-white opacity-90 hover:opacity-100 hover:shadow-[0_12px_34px_-8px_rgba(226,25,73,0.7)]"
    : "text-ink/85 hover:text-ink";

  const content = (
    <>
      {!primary && (
        <span aria-hidden className="absolute inset-[1.5px] z-0" style={{ clipPath: CLIP, backgroundColor: "var(--tl-btn-ghost-fill)" }} />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  const cls = `${base} ${tone} ${className}`;

  if (href) {
    return (
      <a href={href} style={style} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} style={style} className={cls} {...rest}>
      {content}
    </button>
  );
}
