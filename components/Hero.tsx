"use client";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import SceneFrame from "./SceneFrame";
import RackScene from "./RackScene";
import { usePalette, useReducedMotion } from "./hooks";


export default function Hero({ onOpenShell }: { onOpenShell: () => void }) {
  const palette = usePalette();
  const reduced = useReducedMotion();
  const [plugged, setPlugged] = useState(false);
  const [plugRequest, setPlugRequest] = useState(0);

  // Scrolling past the hero plugs the cable in for anyone who didn't drag it.
  useEffect(() => {
    if (plugged) return;
    const on = () => { if (window.scrollY > 260) setPlugRequest((n) => n + 1); };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [plugged]);

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div>
          <p className="eyebrow">{site.role} · {site.location}</p>
          <h1>{site.first} <span className="last">{site.last}</span></h1>
          <p className="lede">{site.headline}</p>
          <div className="hero-cta">
            <a className="btn primary" href="#story">Scroll the fleet ↓</a>
            <a className="btn" href="#resumes">Get my resume</a>
            <button className="btn mono" type="button" onClick={onOpenShell}>Open a shell <kbd>`</kbd></button>
          </div>
          <div className="hero-meta">
            <span><b>2 yrs</b> production ops</span>
            <span><b>Go · Python · Kubernetes</b></span>
            <span>Open to <b>remote</b> roles</span>
          </div>
        </div>
        <SceneFrame
          className="rack-stage"
          camera={{ position: [3.4, 1.3, 5.2], fov: 34 }}
          fallback="A server rack with a yellow network cable. Your browser has 3D turned off."
          overlay={
            <>
              {!plugged && (
                <button className="btn small plug-btn" type="button" onClick={() => setPlugRequest((n) => n + 1)}>Plug it in</button>
              )}
              <div className="rack-hint">
                <span>{plugged ? "Drag to spin the rack" : "Drag the yellow cable into the port"}</span>
                <span className={`link-state ${plugged ? "up" : ""}`}><i />eth0: {plugged ? "link up · 10Gb/s" : "link down"}</span>
              </div>
            </>
          }
        >
          <RackScene palette={palette} plugged={plugged} plugRequest={plugRequest} onPlugged={() => setPlugged(true)} reduced={reduced} />
        </SceneFrame>
      </div>
    </section>
  );
}
