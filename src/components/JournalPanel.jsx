import React from "react";
export default function JournalPanel({ value, onChange }) {
  return (
    <div className="card p-4">
      <div className="text-sm opacity-80 mb-2">Journal</div>
      <textarea
        className="w-full h-36 rounded-lg bg-white/5 border border-white/10 p-3 outline-none"
        placeholder="Notes from this session..."
        value={value} onChange={e=>onChange(e.target.value)}
      />
    </div>
  );
}
