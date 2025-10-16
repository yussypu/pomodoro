import React, { useEffect, useMemo, useState } from "react";
import { createAudio } from "../lib/audio";
import { load, save } from "../lib/storage";

export default function SoundBar({ muted, setMuted }) {
  const [vol, setVol] = useState(() => load("app:v1:vol", .6));
  const audio = useMemo(()=> createAudio("/src/assets/audio/lofi-loop.mp3", vol), []); // vite dev path

  useEffect(()=> { audio.setVolume(vol); save("app:v1:vol", vol); }, [vol]);
  useEffect(()=> { if (muted) audio.pause(); else audio.play(); }, [muted]);

  return (
    <div className="mx-auto max-w-3xl mt-4 card px-4 py-3 flex items-center justify-between">
      <div className="text-sm">Lo-fi Ambient</div>
      <div className="flex items-center gap-3">
        <button onClick={()=>setMuted(m=>!m)} className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-sm">
          {muted ? "Play" : "Pause"}
        </button>
        <input type="range" min="0" max="1" step="0.01" value={vol} onChange={e=>setVol(parseFloat(e.target.value))}/>
      </div>
    </div>
  );
}
