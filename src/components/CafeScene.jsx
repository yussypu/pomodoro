import React from "react";

export default function CafeScene({ mode }) {
  const tint =
    mode === "focus"
      ? "from-cyan-400/25 to-fuchsia-300/10"
      : mode === "shortBreak"
      ? "from-amber-300/25 to-pink-300/12"
      : "from-violet-300/25 to-cyan-300/12";

  return (
    <div className="w-full mx-auto max-w-5xl px-4">
      <div className="card relative overflow-hidden p-4 md:p-6">
        {/* Window glass + tint */}
        <div
          className={`relative h-44 md:h-60 rounded-[18px] bg-gradient-to-br ${tint} border border-white/10 overflow-hidden`}
          style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,.35)" }}
        >
          {/* Stars (very subtle) */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(2px 2px at 20% 30%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 70% 60%, #fff 50%, transparent 51%)",
              }}
            />
          </div>

          {/* INLINE skyline */}
          <svg
            viewBox="0 0 1200 360"
            className="absolute inset-x-0 bottom-0 w-full opacity-80"
            style={{ mixBlendMode: "screen" }}
            aria-hidden
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7ad1ff" stopOpacity="0.25" />
                <stop offset="1" stopColor="#c6b7ff" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <rect width="1200" height="360" fill="url(#g)" />
            <g fill="#9fb7ff" opacity="0.35">
              <rect x="60" y="180" width="28" height="140" rx="4" />
              <rect x="110" y="160" width="40" height="160" rx="6" />
              <rect x="170" y="120" width="50" height="200" rx="6" />
              <rect x="250" y="200" width="36" height="120" rx="6" />
              <rect x="310" y="150" width="42" height="170" rx="6" />
              <rect x="390" y="100" width="60" height="220" rx="8" />
              <rect x="480" y="140" width="46" height="180" rx="6" />
              <rect x="550" y="80" width="70" height="240" rx="8" />
              <rect x="640" y="190" width="36" height="130" rx="6" />
              <rect x="700" y="120" width="52" height="200" rx="6" />
              <rect x="770" y="150" width="44" height="170" rx="6" />
              <rect x="840" y="90" width="64" height="230" rx="8" />
              <rect x="930" y="180" width="38" height="140" rx="6" />
              <rect x="990" y="150" width="44" height="170" rx="6" />
              <rect x="1060" y="130" width="50" height="190" rx="6" />
            </g>
            <g stroke="#bcd1ff" strokeOpacity="0.35" strokeLinecap="round">
              <path d="M200 40c60 20 120 20 180 0" />
              <path d="M860 60c50 15 100 15 150 0" />
            </g>
          </svg>

          {/* Weather layer by mode */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              mode === "focus" ? "opacity-70" : mode === "shortBreak" ? "opacity-90" : "opacity-80"
            }`}
            style={{
              background:
                mode === "focus"
                  ? "radial-gradient(120% 80% at 50% 20%, rgba(122,209,255,.08), transparent 60%)"
                  : mode === "shortBreak"
                  ? "repeating-linear-gradient(180deg, rgba(198,183,255,.12) 0 2px, transparent 2px 8px)"
                  : "radial-gradient(80% 80% at 60% 0%, rgba(198,183,255,.14), transparent 60%)",
            }}
          />
        </div>

        {/* Desk + mug with steam */}
        <div className="mt-5 relative">
          <div className="h-[2px] w-full bg-white/12 rounded" />
          <div className="absolute right-4 -top-6">
            <div className="relative w-12 h-12 rounded-full bg-white/6 border border-white/12" />
            {/* steam */}
            <div
              aria-hidden
              className="absolute -left-2 -top-5 w-3 h-10"
              style={{
                background:
                  "radial-gradient(50% 60% at 50% 30%, rgba(255,255,255,.45), transparent 70%)",
                filter: "blur(2px)",
                animation: "breathe var(--anim-breathe)",
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
