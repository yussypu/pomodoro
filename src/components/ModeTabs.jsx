import React from "react";
export default function ModeTabs({ mode, setMode }) {
  const tabs = [
    { k:"focus", label:"Focus" },
    { k:"shortBreak", label:"Short Break" },
    { k:"longBreak", label:"Long Break" },
  ];
  return (
    <nav className="mt-4 flex items-center justify-center gap-6 text-sm">
      {tabs.map(t=>(
        <button
          key={t.k}
          onClick={()=>setMode(t.k)}
          className={`pb-1 border-b-2 transition ${
            mode===t.k ? "border-white text-white" : "border-transparent text-white/70 hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
