import React, { useEffect, useState } from "react";
import AmbientBackground from "./components/AmbientBackground";
import CafeScene from "./components/CafeScene";
import HeaderBar from "./components/HeaderBar";
import TimerPanel from "./components/TimerPanel";
import ModeTabs from "./components/ModeTabs";
import SoundBar from "./components/SoundBar";
import SessionStats from "./components/SessionStats";
import JournalPanel from "./components/JournalPanel";
import SettingsModal from "./components/SettingsModal";
import FooterMinimal from "./components/FooterMinimal";
import { usePomodoroState } from "./lib/state";
import { load, save } from "./lib/storage";

export default function App(){
  const {
    settings, setSettings,
    mode, setMode,
    remaining, setRemaining,
    isRunning, setIsRunning,
    durations,
    stats, setStats,
    journal, setJournal
  } = usePomodoroState();

  const [openSettings, setOpenSettings] = useState(false);
  const [muted, setMuted] = useState(() => load("app:v1:muted", true));

  useEffect(()=>{ save("app:v1:muted", muted); }, [muted]);

  // Keyboard shortcuts
  useEffect(()=>{
    const onKey = (e)=>{
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space"){ e.preventDefault(); setIsRunning(v=>!v); }
      if (e.key.toLowerCase() === "r") setRemaining(durations[mode==="focus"?"focus":mode]);
      if (e.key === "1") setMode("focus");
      if (e.key === "2") setMode("shortBreak");
      if (e.key === "3") setMode("longBreak");
      if (e.key.toLowerCase() === "m") setMuted(m=>!m);
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  }, [durations, mode]);

  // Journal bound to today
  const dayKey = (()=>{ const d=new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; })();
  const note = journal[dayKey] || "";
  const setNote = (v)=> setJournal(j=>({...j, [dayKey]: v}));

  const reset = ()=> { setIsRunning(false); setRemaining(durations[mode==="focus"?"focus":mode]); };
  const onComplete = ()=> { setIsRunning(false); setRemaining(0); /* state.js handles rotation */ };

  return (
    <div className="min-h-screen">
      <AmbientBackground particles={settings.particles}/>
      <HeaderBar onOpenSettings={()=>setOpenSettings(true)} muted={muted} setMuted={setMuted}/>
      <CafeScene mode={mode}/>

      <main className="mx-auto max-w-5xl grid gap-6 md:grid-cols-[1.2fr,0.8fr] px-4">
        <div>
          <TimerPanel mode={mode} remaining={remaining} isRunning={isRunning}
            setIsRunning={setIsRunning} reset={reset} onComplete={onComplete}/>
          <ModeTabs mode={mode} setMode={setMode}/>
          <SoundBar muted={muted} setMuted={setMuted}/>
        </div>

        <div className="grid gap-6">
          <SessionStats stats={stats}/>
          <JournalPanel value={note} onChange={setNote}/>
        </div>
      </main>

      <FooterMinimal/>

      <SettingsModal
        open={openSettings}
        onClose={()=>setOpenSettings(false)}
        settings={settings}
        setSettings={setSettings}
        onReset={()=>setSettings({ ...settings, ...{ focusMin:25, shortMin:5, longMin:15, longEvery:4, chime:true, particles:true } })}
      />
    </div>
  );
}
