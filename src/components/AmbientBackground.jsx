import React, { useEffect, useRef } from "react";

export default function AmbientBackground({ particles=true }) {
  const ref = useRef(null);

  useEffect(()=> {
    if (!particles || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current; if (!el) return;

    const n = 70, arr = [];
    for (let i=0;i<n;i++){
      const s = document.createElement("span");
      s.style.position="absolute";
      s.style.left = Math.random()*100 + "%";
      s.style.top  = Math.random()*100 + "%";
      s.style.width = s.style.height = (Math.random()*2+1) + "px";
      s.style.borderRadius="999px";
      s.style.background="rgba(198,183,255,.25)";
      s.style.filter="blur(0.5px)";
      s.style.opacity= String(0.2*Math.random()+0.1);
      s.style.transition="transform 20s linear";
      el.appendChild(s); arr.push(s);
      requestAnimationFrame(()=>{ s.style.transform=`translate(${(Math.random()*2-1)*40}px, ${(Math.random()*2-1)*40}px)`; });
    }
    const id = setInterval(()=>{
      arr.forEach(s=>{
        s.style.transform=`translate(${(Math.random()*2-1)*40}px, ${(Math.random()*2-1)*40}px)`;
      });
    }, 20000);
    return ()=>{ clearInterval(id); arr.forEach(s=>s.remove()); };
  }, [particles]);

  return (
    <div aria-hidden ref={ref}
      style={{pointerEvents:"none"}}
      className="fixed inset-0 -z-10"
    />
  );
}
