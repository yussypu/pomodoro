import React from "react";
export default function ModeTabs({ mode, setMode }) {
  const tabs = [
    { k:"focus", label:"Focus" },
    { k:"shortBreak", label:"Short Break" },
    { k:"longBreak", label:"Long Break" },
  ];
  return (
    <div className="flex gap-2 justify-center mt-4">
      {tabs.map(t=>(
        <button key={t.k} onClick={()=>setMode(t.k)}
          className={`px-3 py-1.5 rounded-full border text-sm ${mode===t.k ? "bg-white text-black border-white" : "border-white/15 hover:bg-white/5"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
