import type { ReactNode } from "react";

// The brand "angular" button — single source of truth so every CTA matches the legacy
// CONTACT US nav button: chamfered top-right + bottom-left corners (clip-path), Duborics
// (font-display) uppercase, hover lift + red glow.
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
  size?: "md" | "sm";
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
  const CLIP = clip(size === "sm" ? 11 : 14);
  const sizeCls = size === "sm" ? "px-5 py-2.5 text-[0.78rem]" : "px-8 py-3 text-[0.95rem]";

  const base = `font-display group/btn relative inline-flex items-center justify-center gap-2 ${sizeCls} font-bold uppercase leading-none tracking-[0.04em] text-white outline-none transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5`;

  const style = primary
    ? { clipPath: CLIP, backgroundColor: "#e21949", boxShadow: "0 8px 26px -10px rgba(226,2,73,0.55)" }
    : { clipPath: CLIP, backgroundColor: "rgba(255,255,255,0.22)" };

  const tone = primary
    ? "opacity-90 hover:opacity-100 hover:shadow-[0_12px_34px_-8px_rgba(226,25,73,0.7)]"
    : "text-white/85 hover:text-white";

  const content = (
    <>
      {!primary && (
        <span aria-hidden className="absolute inset-[1.5px] z-0" style={{ clipPath: CLIP, backgroundColor: "#0a0a0c" }} />
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
