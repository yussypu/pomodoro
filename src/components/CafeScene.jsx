import React from "react";

export default function CafeScene({ mode }) {
  // mode: focus | shortBreak | longBreak => change window/weather tint
  const tint = mode === "focus" ? "from-cyan-500/20 to-fuchsia-500/10"
             : mode === "shortBreak" ? "from-amber-400/20 to-pink-400/10"
             : "from-violet-300/20 to-cyan-300/10";

  return (
    <div className="w-full mx-auto max-w-5xl mt-6">
      <div className="card relative overflow-hidden p-4 md:p-6">
        {/* Window */}
        <div className={`h-40 md:h-52 rounded-[18px] bg-gradient-to-br ${tint} border border-white/10`} />
        {/* Desk line + mug placeholder */}
        <div className="mt-4 flex items-center justify-between">
          <div className="h-[2px] w-full bg-white/10 rounded" />
          <div className="ml-4 w-10 h-10 rounded-full bg-white/8" style={{boxShadow:"var(--shadow-glow)"}} />
        </div>
      </div>
    </div>
  );
}
