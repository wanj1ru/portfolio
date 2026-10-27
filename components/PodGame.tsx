"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type PodState = "ok" | "bad" | "boot";
type Game = { t: number; score: number; combo: number; lastFix: number; last: number; roll: number; tick: number; over: boolean; age: number[] };

const SLO = 70;

export default function PodGame({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [count, setCount] = useState(50);
  const [pods, setPods] = useState<PodState[]>(() => Array(50).fill("ok"));
  const [, force] = useState(0);
  const [msg, setMsg] = useState<React.ReactNode>(<><b>Click a red pod to restart it.</b> Quick restarts build a combo. Press <kbd>Space</kbd> for a rollout restart that heals every pod near your last click (recharges in 8s). Restarting a healthy pod costs 30 points. Keep uptime above {SLO}% for 60 seconds.</>);
  const g = useRef<Game | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const podsRef = useRef(pods);
  podsRef.current = pods;

  useEffect(() => {
    const n = window.innerWidth < 520 ? 48 : 50;
    setCount(n);
    setPods(Array(n).fill("ok"));
  }, []);

  const cols = () => (grid.current ? getComputedStyle(grid.current).gridTemplateColumns.split(" ").length : 10);
  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  useEffect(() => () => stop(), []);
  useEffect(() => { if (!open) stop(); }, [open]);

  const end = (win: boolean, up: number) => {
    stop();
    const s = g.current!;
    s.over = true;
    setMsg(win
      ? <><b>Shift survived with {up}% uptime and {s.score} points.</b> That&apos;s roughly what my on-call weeks felt like. Want the real thing? <a href="#contact" onClick={onClose}>Get in touch</a>.</>
      : <><b>SLO breached at {s.t}s left.</b> Uptime fell under {SLO}%. Score: {s.score}. Write the postmortem and try again.</>);
  };

  const step = () => {
    const s = g.current!;
    s.tick++;
    if (s.tick % 10 === 0) { s.t--; if (s.roll > 0) s.roll--; }
    const level = 1 + Math.floor((60 - s.t) / 15);
    const next = [...podsRef.current];
    if (Math.random() < 0.12 + level * 0.07) {
      const healthy = next.map((p, i) => (p === "ok" ? i : -1)).filter((i) => i >= 0);
      if (healthy.length) next[healthy[Math.floor(Math.random() * healthy.length)]] = "bad";
    }
    const c = cols();
    next.forEach((p, i) => {
      if (p !== "bad") { s.age[i] = 0; return; }
      s.age[i] = (s.age[i] || 0) + 1;
      if (s.age[i] > 45 && Math.random() < 0.03 * level) {
        const nb = [i - 1, i + 1, i - c, i + c].filter((j) => j >= 0 && j < next.length);
        const j = nb[Math.floor(Math.random() * nb.length)];
        if (next[j] === "ok") next[j] = "bad";
      }
    });
    setPods(next);
    const up = Math.round(100 * (1 - next.filter((p) => p === "bad").length / next.length));
    force((n) => n + 1);
    if (up < SLO) return end(false, up);
    if (s.t <= 0) return end(true, up);
  };

  const start = () => {
    stop();
    setPods(Array(count).fill("ok"));
    g.current = { t: 60, score: 0, combo: 0, lastFix: 0, last: 0, roll: 0, tick: 0, over: false, age: [] };
    setMsg(<><b>Shift started.</b> Watch for red pods.</>);
    timer.current = setInterval(step, 100);
  };

  const restart = (i: number) => {
    setPods((p) => { const n = [...p]; n[i] = "boot"; return n; });
    setTimeout(() => setPods((p) => { const n = [...p]; if (n[i] === "boot") n[i] = "ok"; return n; }), 500);
  };

  const click = (i: number) => {
    const s = g.current;
    if (!s || s.over) return;
    s.last = i;
    if (pods[i] === "bad") {
      const now = performance.now();
      s.combo = now - s.lastFix < 900 ? s.combo + 1 : 1;
      s.lastFix = now;
      s.score += 100 * Math.min(s.combo, 5);
      restart(i);
    } else if (pods[i] === "ok") s.score = Math.max(0, s.score - 30);
    force((n) => n + 1);
  };

  const rollout = useCallback(() => {
    const s = g.current;
    if (!s || s.over || s.roll > 0) return;
    const c = cols(), r0 = Math.floor(s.last / c), c0 = s.last % c;
    podsRef.current.forEach((p, i) => {
      if (p === "bad" && Math.abs(Math.floor(i / c) - r0) <= 1 && Math.abs((i % c) - c0) <= 2) { restart(i); s.score += 50; }
    });
    s.roll = 8;
    force((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.code === "Space" && g.current && !g.current.over) { e.preventDefault(); rollout(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, rollout]);

  if (!open) return null;
  const s = g.current;
  const up = Math.round(100 * (1 - pods.filter((p) => p === "bad").length / pods.length));
  const meter = up < 80 ? (up < SLO ? "var(--crash)" : "var(--accent)") : "var(--ok)";
  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="game" role="dialog" aria-modal="true" aria-label="CrashLoopBackOff game">
        <div className="game-top">
          <h3>CrashLoopBackOff</h3>
          <div className="game-stats">
            <span>time <b>{s ? s.t : 60}</b>s</span>
            <span>uptime <b>{up}</b>%</span>
            <span>score <b>{s ? s.score : 0}</b></span>
          </div>
        </div>
        <div className="meter" aria-hidden="true"><i style={{ width: `${up}%`, background: meter }} /></div>
        <div className="pods" ref={grid}>
          {pods.map((p, i) => (
            <button key={i} type="button" className={`pod ${p === "ok" ? "" : p}`} aria-label={`Pod ${i + 1}, ${p === "bad" ? "crashing" : "healthy"}`} onClick={() => click(i)} />
          ))}
        </div>
        <p className="game-msg">{msg}</p>
        <div className="game-actions">
          <button className="btn primary" type="button" onClick={start}>{s ? "Restart shift" : "Start shift"}</button>
          <button className="btn" type="button" onClick={rollout} disabled={!s || s.over || s.roll > 0}>Rollout restart{s && s.roll > 0 ? ` (${s.roll}s)` : ""}</button>
          <button className="btn" type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
