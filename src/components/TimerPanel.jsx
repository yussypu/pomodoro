import React from "react";
const pad = n => n.toString().padStart(2,"0");
const fmt = s => `${pad(Math.floor(s/60))}:${pad(s%60)}`;
const label = m => (m==="focus" ? "Focus" : m==="shortBreak" ? "Short Break" : "Long Break");

export default function TimerPanel({ mode, remaining, isRunning, setIsRunning, reset, onComplete }) {
  const warmRim =
    mode === "focus"
      ? "0 0 60px rgba(122,209,255,.35), 0 0 120px rgba(198,183,255,.25)"
      : mode === "shortBreak"
      ? "0 0 60px rgba(255,214,150,.35), 0 0 120px rgba(255,170,200,.25)"
      : "0 0 60px rgba(198,183,255,.45), 0 0 120px rgba(122,209,255,.25)";

  return (
    <section className="mx-auto max-w-3xl mt-6 text-center p-6 card">
      <div className="relative flex items-center justify-center">
        <div
          aria-hidden
          className="rounded-full"
          style={{
            width: "clamp(220px, 40vw, 420px)",
            aspectRatio: "1 / 1",
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(198,183,255,.32), rgba(122,209,255,.12) 70%, transparent)",
            boxShadow: warmRim,
            animation: `breathe var(--anim-breathe), hue var(--anim-hue)`,
            opacity: isRunning ? 1 : .95,
          }}
        />
        <div className="absolute flex flex-col items-center">
          <div
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
            }}
            className="text-[64px] md:text-[108px] font-bold leading-none"
          >
            {fmt(remaining)}
          </div>
          <div className="mt-2 text-sm text-[color:var(--color-text-dim)]">{label(mode)}</div>
          <div className="mt-2 text-xs opacity-80">
            {isRunning ? "Breathe in." : "Breathe in. Focus begins."}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setIsRunning((v) => !v)}
          className="px-5 py-2 rounded-xl text-sm font-semibold border border-white/15 bg-white/10 hover:bg-white/20 transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-xl text-sm border border-white/15 hover:bg-white/10"
        >
          Reset
        </button>
        <button
          onClick={onComplete}
          className="px-5 py-2 rounded-xl text-sm border border-white/15 hover:bg-white/10"
        >
          Skip
        </button>
      </div>
      <p className="mt-3 text-xs text-[color:var(--color-text-dim)]">Space: Start/Pause • R: Reset • 1/2/3: Mode • M: Mute</p>
    </section>
  );
}
