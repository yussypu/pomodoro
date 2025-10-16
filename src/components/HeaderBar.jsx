import React from "react";

export default function HeaderBar({ onOpenSettings, muted, setMuted }) {
  return (
    <header className="mx-auto max-w-5xl px-4 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="w-5 h-5 rounded-full"
          style={{
            boxShadow: "var(--shadow-glow)",
            background:
              "radial-gradient(45% 45% at 50% 40%, rgba(122,209,255,.9), rgba(198,183,255,.5))",
          }}
        />
        <h1
          className="text-[20px] md:text-[24px] font-bold tracking-[0.08em] uppercase"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            textShadow:
              "0 0 18px rgba(122,209,255,.35), 0 0 30px rgba(198,183,255,.2)",
            letterSpacing: "0.12em",
          }}
        >
          Flow State Café
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label={muted ? "Unmute ambient" : "Mute ambient"}
          onClick={() => setMuted(!muted)}
          className={`px-3 py-1.5 rounded-full text-sm backdrop-blur border ${
            muted
              ? "border-white/20 hover:bg-white/5"
              : "border-white/30 bg-white/10"
          }`}
        >
          {muted ? "Sound Off" : "Sound On"}
        </button>
        <button
          onClick={onOpenSettings}
          className="px-3 py-1.5 rounded-full text-sm border border-white/20 hover:bg-white/5"
        >
          Settings
        </button>
      </div>
    </header>
  );
}
