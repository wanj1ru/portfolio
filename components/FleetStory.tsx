"use client";
import { useEffect, useRef, useState } from "react";
import { chapters } from "@/content/site";
import FleetScene from "./FleetScene";
import SceneFrame from "./SceneFrame";
import { usePalette, useReducedMotion } from "./hooks";

export default function FleetStory() {
  const [stage, setStage] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const palette = usePalette();
  const reduced = useReducedMotion();

  useEffect(() => {
    const pick = () => {
      const mid = window.innerHeight * (window.innerWidth < 900 ? 0.72 : 0.55);
      let best = 0;
      refs.current.forEach((el, i) => { if (el && el.getBoundingClientRect().top < mid) best = i; });
      setStage(best);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => { window.removeEventListener("scroll", pick); window.removeEventListener("resize", pick); };
  }, []);

  const hud = chapters[stage].hud;
  return (
    <section className="story band" id="story" aria-label="From one server to a fleet">
      <div className="wrap">
        <div className="stage" aria-hidden="true">
          <SceneFrame
            className="stage-inner"
            camera={{ position: [1.7, 1.4, 2.6], fov: 40 }}
            fallback="A 3D fleet of servers grows here. Your browser has 3D turned off."
            overlay={<div className="stage-hud"><span>{hud[0]}</span><span><b>●</b> {hud[1]}</span></div>}
          >
            <FleetScene stage={stage} palette={palette} reduced={reduced} />
          </SceneFrame>
        </div>
        <div className="chapters">
          {chapters.map((c, i) => (
            <article key={c.step} ref={(el) => { refs.current[i] = el; }} className={`chapter ${i === stage ? "on" : ""}`}>
              <span className="step">{c.step}</span>
              {c.fig && <div className="fig">{c.fig}<small>{c.figNote}</small></div>}
              <h2>{c.title} <em>{c.accent}</em></h2>
              <p>{c.body}</p>
              {c.tags && <div className="tags">{c.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
