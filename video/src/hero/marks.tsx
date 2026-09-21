type P = { size: number; color: string };

export const InstagramMark: React.FC<P> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <rect x={3} y={3} width={18} height={18} rx={5} />
    <circle cx={12} cy={12} r={4} />
    <circle cx={17.3} cy={6.7} r={0.9} fill={color} stroke="none" />
  </svg>
);

export const FacebookMark: React.FC<P> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13.5 21v-7.2h2.4l.4-2.9h-2.8V9.1c0-.8.3-1.4 1.4-1.4h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.9h2.5V21h3Z" />
  </svg>
);

export const GoogleMark: React.FC<P> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <path d="M20 12.5A8 8 0 1 1 17.7 6.6" />
    <path d="M12 12.5h8" />
  </svg>
);

export const ChatGPTMark: React.FC<P> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <rect key={a} x={10.2} y={2.5} width={3.6} height={9.5} rx={1.8} transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);

// Stylized musical-note glyph (stem + hook + head) — reads as TikTok without
// reproducing the mark.
export const TikTokMark: React.FC<P> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 4v11.5" />
    <path d="M13 4c.6 2.4 2.4 4 5 4.2" />
    <circle cx={9.5} cy={16.5} r={3.5} />
  </svg>
);

// Platform roster, in the order the phone shows them and the ports take them.
export const PLATFORMS = [
  { name: "Instagram", surface: "Reels", Mark: InstagramMark },
  { name: "TikTok", surface: "For You", Mark: TikTokMark },
  { name: "Facebook", surface: "Feed", Mark: FacebookMark },
  { name: "Google", surface: "Search", Mark: GoogleMark },
  { name: "ChatGPT", surface: "Ask", Mark: ChatGPTMark },
] as const;
