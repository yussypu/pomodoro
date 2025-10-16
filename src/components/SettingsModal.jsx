import React from "react";
export default function SettingsModal({ open, onClose, settings, setSettings, onReset }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="card w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Settings</div>
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-sm">Close</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Num label="Work (min)" v={settings.focusMin} set={v=>setSettings(s=>({...s, focusMin:v}))}/>
          <Num label="Short break (min)" v={settings.shortMin} set={v=>setSettings(s=>({...s, shortMin:v}))}/>
          <Num label="Long break (min)" v={settings.longMin} set={v=>setSettings(s=>({...s, longMin:v}))}/>
          <Num label="Long every" v={settings.longEvery} set={v=>setSettings(s=>({...s, longEvery:v}))}/>
          <Toggle label="Chime" v={settings.chime} set={v=>setSettings(s=>({...s, chime:v}))}/>
          <Toggle label="Particles" v={settings.particles} set={v=>setSettings(s=>({...s, particles:v}))}/>
        </div>
        <div className="mt-4 text-right">
          <button onClick={onReset} className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-sm">Reset to defaults</button>
        </div>
      </div>
    </div>
  );
}
function Num({label,v,set}){ return (
  <label className="text-sm space-y-2">
    <div>{label}</div>
    <input type="number" value={v} onChange={e=>set(parseInt(e.target.value||0))}
      className="w-full rounded-lg bg-white/5 border border-white/10 p-2"/>
  </label>
);}
function Toggle({label,v,set}){ return (
  <label className="text-sm flex items-center justify-between">
    <div>{label}</div>
    <input type="checkbox" checked={!!v} onChange={e=>set(e.target.checked)} />
  </label>
);}
