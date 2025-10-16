import React from "react";
export default function SessionStats({ stats }) {
  return (
    <div className="card p-4">
      <div className="text-sm opacity-80">Today</div>
      <div className="mt-2 grid grid-cols-3 gap-3 text-center">
        <Stat label="Sessions" value={stats.today}/>
        <Stat label="Focused (min)" value={stats.focusedMin}/>
        <Stat label="Streak" value={stats.streak}/>
      </div>
    </div>
  );
}
function Stat({label, value}) {
  return (
    <div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}
