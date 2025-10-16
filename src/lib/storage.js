export const load = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
export const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
