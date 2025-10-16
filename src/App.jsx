import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Settings, Moon, Sun, Plus, Trash2, Bell, Timer, CheckCircle2, ListTodo, Volume2 } from "lucide-react";

// ————————————————————————————————
// Pomodoro Pro — Single-file React Component
// Design: sleek, minimal, keyboard-friendly, with progress ring, tasks, stats, sounds & notifications.
// TailwindCSS required. Works best with a dark background. Default export below.
// ————————————————————————————————

// Helpers
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const pad = (n) => n.toString().padStart(2, "0");
const fmt = (secs) => `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;

const defaultSettings = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  longEvery: 4,
  autoStartNext: true,
  soundOn: true,
  volume: 0.6,
  tickSound: false,
  theme: "system", // "light" | "dark" | "system"
};

const useLocalStorage = (key, init) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
};

const useSound = (url, { volume = 0.5 } = {}) => {
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio(url);
  }, [url]);
  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = clamp(volume, 0, 1);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };
  return play;
};

const END_DING =
  "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAALAAACc2FtcGxlAAAAAA..."; // tiny placeholder (silent) — replace with your own for full effect.

export default function PomodoroPro() {
  // Settings & state
  const [settings, setSettings] = useLocalStorage("pomopro_settings_v2", defaultSettings);
  const [mode, setMode] = useLocalStorage("pomopro_mode", "focus"); // focus | short | long
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useLocalStorage("pomopro_cycles", { focus: 0, short: 0, long: 0, completedSets: 0 });
  const [streak, setStreak] = useLocalStorage("pomopro_streak", { day: todayKey(), count: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [tasks, setTasks] = useLocalStorage("pomopro_tasks_v2", []);
  const [activeTaskId, setActiveTaskId] = useLocalStorage("pomopro_active_task", null);
  const [notifPerm, setNotifPerm] = useState(Notification?.permission ?? "default");

  const endBeep = useSound(END_DING, { volume: settings.volume });

  // Derived durations
  const durations = useMemo(() => ({
    focus: settings.focusMin * 60,
    short: settings.shortMin * 60,
    long: settings.longMin * 60,
  }), [settings.focusMin, settings.shortMin, settings.longMin]);

  // Initialize remaining when mode or durations change
  useEffect(() => {
    setRemaining(durations[mode]);
  }, [mode, durations]);

  // Theme handling
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && prefersDark);
    root.classList.toggle('dark', dark);
  }, [settings.theme]);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          onFinish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Optional tick sound
  useEffect(() => {
    if (!settings.tickSound || !isRunning) return;
    const id = setInterval(() => {
      // extremely subtle tick via WebAudio could go here — omitted for brevity
    }, 1000);
    return () => clearInterval(id);
  }, [settings.tickSound, isRunning]);

  function onFinish() {
    // Stats
    setCycles((c) => ({ ...c, [mode]: c[mode] + 1, completedSets: mode === 'long' ? c.completedSets + 1 : c.completedSets }));

    // Task tomato count
    if (mode === 'focus' && activeTaskId) {
      setTasks((ts) => ts.map(t => t.id === activeTaskId ? { ...t, tomatoes: (t.tomatoes || 0) + 1 } : t));
    }

    // Streak (per-calendar-day)
    const k = todayKey();
    setStreak((s) => ({ day: k, count: s.day === k ? s.count + 1 : 1 }));

    // Sound & notifications
    if (settings.soundOn) endBeep();
    if (Notification && notifPerm === "granted") {
      const nextLabel = nextModeLabel();
      new Notification(labelFor(mode) + " finished", {
        body: settings.autoStartNext ? `Starting ${nextLabel}…` : `Ready for ${nextLabel}.`,
        icon: undefined,
      });
    }

    // Auto-advance
    if (settings.autoStartNext) {
      const next = nextMode();
      setMode(next);
      setRemaining(durations[next]);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }

  function nextMode() {
    if (mode === "focus") {
      const totalFocus = cycles.focus + 1; // include the just-completed one
      return totalFocus % settings.longEvery === 0 ? "long" : "short";
    }
    return "focus";
  }
  function nextModeLabel() { return labelFor(nextMode()); }
  function labelFor(m) { return m === 'focus' ? 'Focus' : m === 'short' ? 'Short Break' : 'Long Break'; }

  // Progress computed from current mode duration
  const progress = useMemo(() => {
    const total = durations[mode] || 1;
    return clamp(1 - remaining / total, 0, 1);
  }, [remaining, durations, mode]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      if (e.key.toLowerCase() === 'r') reset();
      if (e.key.toLowerCase() === 'n') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Notification permission snapshot
  useEffect(() => {
    setNotifPerm(Notification?.permission ?? "default");
  }, []);

  function requestNotifications() {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then(setNotifPerm);
  }

  // Controls
  const toggle = () => setIsRunning((v) => !v);
  const reset = () => { setIsRunning(false); setRemaining(durations[mode]); };
  const skip = () => { setIsRunning(false); setRemaining(0); onFinish(); };

  // Tasks
  const [taskInput, setTaskInput] = useState("");
  function addTask() {
    const name = taskInput.trim();
    if (!name) return;
    const t = { id: crypto.randomUUID(), name, tomatoes: 0, done: false };
    setTasks((ts) => [t, ...ts]);
    setTaskInput("");
    if (!activeTaskId) setActiveTaskId(t.id);
  }
  function removeTask(id) { setTasks((ts) => ts.filter((t) => t.id !== id)); if (activeTaskId === id) setActiveTaskId(null); }
  function toggleDone(id) { setTasks((ts) => ts.map(t => t.id === id ? { ...t, done: !t.done } : t)); }

  // Ring geometry
  const R = 120;
  const C = 2 * Math.PI * R;
  const dash = C * progress;

  const themeIcon = settings.theme === 'dark' ? <Moon size={16}/> : settings.theme === 'light' ? <Sun size={16}/> : <Sun size={16}/>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 antialiased p-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Timer className="opacity-80"/>
            <h1 className="text-xl font-semibold tracking-tight">Pomodoro Pro</h1>
            <span className="ml-2 rounded-full bg-slate-800/60 px-2 py-0.5 text-xs text-slate-300">v2</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSettings((s)=>({ ...s, theme: cycleTheme(s.theme) }))} className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-xs hover:bg-slate-700/60 transition">
              <div className="flex items-center gap-2">{settings.theme === 'dark' ? <Moon size={16}/> : settings.theme === 'light' ? <Sun size={16}/> : <Sun size={16}/>}<span className="hidden sm:inline">Theme</span></div>
            </button>
            <button onClick={() => setShowSettings(true)} className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-xs hover:bg-slate-700/60 transition">
              <div className="flex items-center gap-2"><Settings size={16}/><span className="hidden sm:inline">Settings</span></div>
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr]">
          {/* Timer Card */}
          <motion.section layout className="rounded-3xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            {/* Mode Tabs */}
            <div className="mb-4 flex gap-2">
              {(["focus","short","long"]).map((m) => (
                <button key={m} onClick={() => { setMode(m); setIsRunning(false); setRemaining(durations[m]); }}
                  className={`rounded-full px-3 py-2 text-sm transition border ${mode===m?"bg-white text-black border-white":"border-slate-700/60 bg-slate-800/50 hover:bg-slate-700/50"}`}>
                  {labelFor(m)}
                </button>
              ))}
            </div>

            {/* Progress Ring */}
            <div className="relative mx-auto my-6 flex h-[320px] w-[320px] items-center justify-center">
              <svg className="absolute inset-0" viewBox="0 0 300 300" width={320} height={320}>
                <circle cx="150" cy="150" r={R} stroke="currentColor" strokeWidth="14" className="text-slate-800/80" fill="none" />
                <motion.circle
                  cx="150" cy="150" r={R} stroke="currentColor" strokeWidth="14" fill="none"
                  className="text-white"
                  strokeDasharray={`${C} ${C}`} strokeDashoffset={C - dash}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: C }}
                  animate={{ strokeDashoffset: C - dash }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </svg>
              <div className="z-10 text-center">
                <div className="text-[72px] leading-none font-bold tabular-nums">{fmt(remaining)}</div>
                <div className="mt-1 text-sm text-slate-400">{labelFor(mode)}</div>
              </div>

              {/* Ambient glow */}
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.15),transparent_70%)]" />
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <ControlButton onClick={toggle} icon={isRunning ? <Pause/> : <Play/>} label={isRunning ? "Pause" : "Start"} primary />
              <ControlButton onClick={reset} icon={<RotateCcw/>} label="Reset" />
              <ControlButton onClick={skip} icon={<SkipForward/>} label="Skip" />
              <ControlButton onClick={requestNotifications} icon={<Bell/>} label={notifPerm === 'granted' ? 'Notifications On' : 'Enable Alerts'} />
            </div>

            {/* Helper text */}
            <p className="mt-4 text-center text-xs text-slate-400">Space: Start/Pause • R: Reset • N: Next</p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <StatCard label="Focus" value={cycles.focus} />
              <StatCard label="Breaks" value={cycles.short + cycles.long} />
              <StatCard label="Streak" value={streak.count} />
            </div>
          </motion.section>

          {/* Tasks / Queue */}
          <motion.section layout className="rounded-3xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <ListTodo className="opacity-80"/>
              <h2 className="text-lg font-semibold">Tasks</h2>
            </div>
            <div className="mb-3 flex gap-2">
              <input value={taskInput} onChange={(e)=>setTaskInput(e.target.value)} onKeyDown={(e)=> e.key==='Enter'&&addTask()}
                     placeholder="Add a task and press Enter"
                     className="flex-1 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-slate-500"/>
              <button onClick={addTask} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:opacity-90">
                <div className="flex items-center gap-2"><Plus size={16}/>Add</div>
              </button>
            </div>

            <ul className="space-y-2">
              {tasks.length === 0 && (
                <li className="rounded-xl border border-dashed border-slate-700/60 p-4 text-sm text-slate-400">No tasks yet. Add your first focus target ✨</li>
              )}
              {tasks.map((t) => (
                <li key={t.id} className={`group flex items-center justify-between rounded-xl border ${activeTaskId===t.id?"border-white/70 bg-white/5":"border-slate-800/60 bg-slate-900/40"} px-3 py-2 transition`}>
                  <div className="flex items-center gap-3 truncate">
                    <button onClick={()=>toggleDone(t.id)} className={`rounded-full border ${t.done?"bg-emerald-500 border-emerald-400":"border-slate-600"} p-1 transition`}>
                      <CheckCircle2 size={18} className={t.done?"text-black":"text-slate-300"}/>
                    </button>
                    <button onClick={()=>setActiveTaskId(t.id)} className={`truncate text-left text-sm ${t.done?"line-through text-slate-500":""}`}>
                      {t.name}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span title="Pomodoros" className="rounded-full bg-slate-800/60 px-2 py-0.5 text-xs tabular-nums">🍅 {t.tomatoes || 0}</span>
                    <button onClick={()=>removeTask(t.id)} className="opacity-60 hover:opacity-100"><Trash2 size={16}/></button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="mx-auto mt-8 flex max-w-3xl items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2"><Volume2 size={14}/> {settings.soundOn?`Sound ${Math.round(settings.volume*100)}%`:'Muted'} • Auto-next {settings.autoStartNext? 'On' : 'Off'}</div>
          <div className="opacity-70">Made for deep focus — ⌘/Ctrl+D to bookmark</div>
        </footer>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-xl rounded-3xl border border-slate-800/60 bg-slate-900 p-6 shadow-2xl"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Settings</h3>
                <button onClick={()=>setShowSettings(false)} className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs">Close</button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Focus (minutes)">
                  <NumberField value={settings.focusMin} setValue={(v)=>setSettings(s=>({ ...s, focusMin: clamp(v, 1, 180) }))} />
                </Field>
                <Field label="Short Break (minutes)">
                  <NumberField value={settings.shortMin} setValue={(v)=>setSettings(s=>({ ...s, shortMin: clamp(v, 1, 60) }))} />
                </Field>
                <Field label="Long Break (minutes)">
                  <NumberField value={settings.longMin} setValue={(v)=>setSettings(s=>({ ...s, longMin: clamp(v, 5, 120) }))} />
                </Field>
                <Field label="Long Break Every">
                  <NumberField value={settings.longEvery} setValue={(v)=>setSettings(s=>({ ...s, longEvery: clamp(v, 2, 12) }))} />
                </Field>

                <Field label="Auto-start next">
                  <Toggle value={settings.autoStartNext} onChange={(v)=>setSettings(s=>({ ...s, autoStartNext: v }))} />
                </Field>
                <Field label="Sound">
                  <Toggle value={settings.soundOn} onChange={(v)=>setSettings(s=>({ ...s, soundOn: v }))} />
                </Field>
                <Field label="Volume">
                  <Range value={settings.volume} onChange={(v)=>setSettings(s=>({ ...s, volume: v }))} />
                </Field>

                <Field label="Theme">
                  <select value={settings.theme} onChange={(e)=>setSettings(s=>({...s, theme: e.target.value}))}
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-sm">
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div>
                  <p>Tip: use keyboard shortcuts — Space to start/pause, R to reset, N to skip.</p>
                  <p>Notifications: {notifPerm}. {notifPerm!=="granted" && (<button onClick={requestNotifications} className="underline">Enable</button>)}
                  </p>
                </div>
                <button onClick={()=>{ localStorage.clear(); location.reload(); }} className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-xs">Reset All Data</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ——— UI primitives ——————————————————————————
function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <div className="text-sm text-slate-300">{label}</div>
      {children}
    </label>
  );
}
function NumberField({ value, setValue }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={()=>setValue(value-1)} className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2">-</button>
      <input type="number" value={value} onChange={(e)=>setValue(parseInt(e.target.value||"0"))}
             className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-sm" />
      <button onClick={()=>setValue(value+1)} className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2">+</button>
    </div>
  );
}
function Toggle({ value, onChange }) {
  return (
    <button onClick={()=>onChange(!value)} className={`relative h-8 w-14 rounded-full border transition ${value?"bg-white border-white":"bg-slate-800/60 border-slate-700/60"}`}>
      <span className={`absolute top-1 left-1 inline-block h-6 w-6 rounded-full bg-black transition ${value?"translate-x-6 bg-black":""}`}></span>
    </button>
  );
}
function Range({ value, onChange }) {
  return (
    <input type="range" min={0} max={1} step={0.01} value={value} onChange={(e)=>onChange(parseFloat(e.target.value))}
           className="w-full" />
  );
}

function ControlButton({ onClick, icon, label, primary }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition border ${primary?"bg-white text-black border-white hover:opacity-90":"border-slate-700/60 bg-slate-800/50 hover:bg-slate-700/50 text-slate-100"}`}>
      {icon}{label}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function cycleTheme(t){
  return t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system';
}
