import React from "react";
export default function HeaderBar({ onOpenSettings, muted, setMuted }) {
  return (
    <header className="mx-auto max-w-5xl py-4 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full" style={{boxShadow:"var(--shadow-glow)", background:"radial-gradient(45% 45% at 50% 40%, rgba(122,209,255,.8), rgba(198,183,255,.4))"}} />
        <h1 className="text-lg md:text-xl font-semibold tracking-tight" style={{fontFamily:"var(--font-display)"}}>
          Flow State Café
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button aria-label={muted ? "Unmute ambient" : "Mute ambient"} onClick={()=>setMuted(!muted)}
          className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-sm">
          {muted ? "Sound Off" : "Sound On"}
        </button>
        <button onClick={onOpenSettings} className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-sm">Settings</button>
      </div>
    </header>
  );
}
