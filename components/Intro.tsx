"use client";
import { useEffect, useRef, useState } from "react";

const BOOT: [string, string?][] = [
  ["[  OK  ] Reached target Network.", "ok"],
  ["[  OK  ] Started Kubernetes node agent (kubelet).", "ok"],
  ["[  OK  ] Started Prometheus node exporter.", "ok"],
  ["[  OK  ] Synced 50 clusters from git main.", "ok"],
  ["[  OK  ] Mounted /home/esther.", "ok"],
  [""],
  ["esther-portfolio login: recruiter"],
  ["Welcome. 200+ servers, 50+ clusters, one engineer to talk to.", "acc"],
];

/** A short boot log on first visit. Click or press any key to skip. Shown once per session. */
export default function Intro() {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDone(false);
    BOOT.forEach((_, i) => timers.current.push(setTimeout(() => setShown(i + 1), 180 + i * 260)));
    timers.current.push(setTimeout(() => finish(), 180 + BOOT.length * 260 + 900));
    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    return () => { timers.current.forEach(clearTimeout); window.removeEventListener("keydown", skip); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    timers.current.forEach(clearTimeout);
    setDone(true);
    try { sessionStorage.setItem("booted", "1"); } catch {}
  }

  return (
    <div className={`intro ${done ? "done" : ""}`} onClick={finish} aria-hidden={done}>
      <span className="intro-skip">Click or press any key to skip</span>
      <div className="intro-log">
        {BOOT.slice(0, shown).map(([t, c], i) => <div key={i} className={c}>{t || " "}</div>)}
      </div>
    </div>
  );
}
