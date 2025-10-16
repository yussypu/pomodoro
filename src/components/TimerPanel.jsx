import React, { useMemo } from "react";

const pad = n => n.toString().padStart(2,"0");
const fmt = s => `${pad(Math.floor(s/60))}:${pad(s%60)}`;

export default function TimerPanel({ mode, remaining, isRunning, setIsRunning, reset, onComplete }) {
  const orbClasses = useMemo(()=> {
    const base = "timer-orb mx-auto";
    return base;
  }, [mode, isRunning]);

  return (
    <section className="mx-auto max-w-3xl mt-6 text-center p-6 card">
      <div className="relative flex items-center justify-center">
        <div
          className="rounded-full"
          style={{
            width: "clamp(220px, 40vw, 420px)",
            aspectRatio: "1 / 1",
            background: "radial-gradient(60% 60% at 50% 40%, rgba(198,183,255,.35), rgba(122,209,255,.12) 70%, transparent)",
            boxShadow:"var(--shadow-glow)",
            animation: `breathe var(--anim-breathe), hue var(--anim-hue)`,
            opacity: isRunning ? 1 : .95
          }}
          aria-hidden
        />
        <div className="absolute">
          <div style={{fontFamily:"var(--font-display)", letterSpacing:"-0.02em"}} className="text-[64px] md:text-[108px] font-bold leading-none">
            {fmt(remaining)}
          </div>
          <div className="mt-2 text-sm text-[color:var(--color-text-dim)]">{label(mode)}</div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button onClick={()=>setIsRunning(v=>!v)} className="px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/5">
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/5">Reset</button>
        <button onClick={onComplete} className="px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/5">Skip</button>
      </div>
      <p className="mt-3 text-xs text-[color:var(--color-text-dim)]">Space: Start/Pause • R: Reset • 1/2/3: Mode • M: Mute</p>
    </section>
  );
}

function label(m){ return m==="focus" ? "Focus" : m==="shortBreak" ? "Short Break" : "Long Break"; }
