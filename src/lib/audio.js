export function createAudio(src, volume=0.6){
  const a = new Audio(src);
  a.loop = true;
  a.volume = volume;
  let ready = false;
  a.addEventListener("canplay", ()=> ready=true, { once:true });
  return {
    play: () => a.play().catch(()=>{}),
    pause: () => a.pause(),
    setVolume: (v)=> a.volume = Math.max(0, Math.min(1, v)),
    ready: () => ready,
    el: a
  };
}
