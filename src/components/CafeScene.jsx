// src/components/CafeScene.jsx
import React from "react";

export default function CafeScene({ mode }) {
  const tint =
    mode === "focus"
      ? "from-cyan-400/25 to-fuchsia-300/10"
      : mode === "shortBreak"
      ? "from-amber-300/20 to-pink-300/10"
      : "from-violet-300/22 to-cyan-300/10";

  return (
    <div className="w-full mx-auto max-w-5xl px-4">
      <div className="card relative overflow-hidden p-4 md:p-6">
        {/* Window glass + tint */}
        <div
          className={`relative h-44 md:h-60 rounded-[18px] bg-gradient-to-br ${tint} border border-white/10 overflow-hidden`}
          style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,.35)" }}
        >
          {/* Stars (very subtle) */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(2px 2px at 20% 30%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 70% 60%, #fff 50%, transparent 51%)",
            }}
          />

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
          </svg>

          {/* Weather layer (no stripes) */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: mode === "shortBreak" ? 0.85 : 0.7,
              background:
                mode === "focus"
                  ? "radial-gradient(120% 80% at 50% 18%, rgba(122,209,255,.10), transparent 60%)"
                  : mode === "shortBreak"
                  ? "radial-gradient(100% 60% at 20% -10%, rgba(255,220,180,.12), transparent 60%), radial-gradient(120% 80% at 80% -10%, rgba(255,170,220,.10), transparent 60%)"
                  : "radial-gradient(90% 70% at 60% 0%, rgba(198,183,255,.16), transparent 60%)",
            }}
          />
        </div>
        {/* (Removed desk line + mug to kill the circle + line artifacts) */}
      </div>
    </div>
  );
}
