import { useEffect, useMemo, useState } from "react";
import { load, save } from "./storage";

const DEFAULTS = {
  focusMin: 25, shortMin: 5, longMin: 15, longEvery: 4,
  soundOn: true, volume: 0.6, chime: true, particles: true, reducedMotion: false
};

export function usePomodoroState() {
  const [settings, setSettings] = useState(() => load("app:v1:settings", DEFAULTS));
  const [mode, setMode] = useState(() => load("app:v1:mode", "focus")); // focus | shortBreak | longBreak
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState(() => load("app:v1:stats", { today: 0, focusedMin: 0, streak: 0, day: todayKey() }));
  const [journal, setJournal] = useState(() => load("app:v1:journal", {})); // { "YYYY-M-D": "text" }

  const durations = useMemo(() => ({
    focus: settings.focusMin * 60,
    shortBreak: settings.shortMin * 60,
    longBreak: settings.longMin * 60,
  }), [settings]);

  useEffect(() => { setRemaining(durations[modeKey(mode)]); }, [mode, durations]);
  useEffect(() => { save("app:v1:settings", settings); }, [settings]);
  useEffect(() => { save("app:v1:mode", mode); }, [mode]);
  useEffect(() => { save("app:v1:stats", stats); }, [stats]);
  useEffect(() => { save("app:v1:journal", journal); }, [journal]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); completeSession(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  function completeSession() {
    const k = todayKey();
    setStats(s => {
      const sameDay = s.day === k;
      const next = {
        day: k,
        today: (sameDay ? s.today : 0) + 1,
        focusedMin: (sameDay ? s.focusedMin : 0) + (mode === "focus" ? Math.round(settings.focusMin) : 0),
        streak: sameDay ? s.streak + 1 : 1
      };
      return next;
    });
    // rotate mode
    if (mode === "focus") {
      const totalFocus = load("app:v1:__focusCount", 0) + 1;
      save("app:v1:__focusCount", totalFocus);
      setMode(totalFocus % settings.longEvery === 0 ? "longBreak" : "shortBreak");
    } else {
      setMode("focus");
    }
    setIsRunning(false);
  }

  return {
    settings, setSettings,
    mode, setMode,
    remaining, setRemaining,
    isRunning, setIsRunning,
    durations,
    stats, setStats,
    journal, setJournal,
  };
}

const modeKey = (m) => (m === "focus" ? "focus" : m === "shortBreak" ? "shortBreak" : "longBreak");
function todayKey(){ const d=new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
