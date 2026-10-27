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

  // On touch screens the plug is hard to grab, so plug it in for them once the rack has been on screen a moment.
  useEffect(() => {
    if (plugged || !matchMedia("(pointer: coarse)").matches) return;
    const t = setTimeout(() => setPlugRequest((n) => n + 1), 2600);
    return () => clearTimeout(t);
  }, [plugged]);

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
          <span className="tape">U01 · {site.role} · {site.location}</span>
          <h1><span className="first">{site.first}</span> <em>{site.last}</em></h1>
          <p className="lede">{site.headline}</p>
          <div className="hero-cta">
            <a className="btn primary" href="#story">Scroll the fleet ↓</a>
            <a className="btn" href="#resumes">Get my resume</a>
            <button className="btn mono" type="button" onClick={onOpenShell}>Open a shell <kbd>`</kbd></button>
          </div>
          <div className="asset" aria-label="Asset tag">
            <span className="bar" aria-hidden="true" />
            <b>Asset EWK-01 · Next.js · Go · Kubernetes</b>
            <span>2 yrs in production · open to remote roles</span>
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
