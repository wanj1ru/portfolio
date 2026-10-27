"use client";
import { useEffect, useRef, useState } from "react";
import FleetStory from "./FleetStory";
import Hero from "./Hero";
import Intro from "./Intro";
import Reveal from "./Reveal";
import PodGame from "./PodGame";
import { Building, Contact, Experience, Play, Resumes, Team, Toolbox, Work } from "./Sections";
import Shell from "./Shell";
import { site } from "@/content/site";

export default function Portfolio() {
  const [shell, setShell] = useState(false);
  const [game, setGame] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA/.test((document.activeElement as HTMLElement | null)?.tagName ?? "");
      if (e.key === "`" && !typing && !shell && !game) { e.preventDefault(); setShell(true); }
      if (e.key === "Escape") { setShell(false); setGame(false); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [shell, game]);

  return (
    <>
      <Intro />
      <Reveal />
      <div className="rail l" aria-hidden="true" />
      <div className="rail r" aria-hidden="true" />
      <header className="nav">
        <div className="wrap">
          <span className="screw" aria-hidden="true" />
          <a className="brand" href="#top">Esther K<span>.</span></a>
          <nav className="nav-links" aria-label="Sections">
            <a href="#story">Fleet</a>
            <a href="#work">Work</a>
            <a href="#team">Team</a>
            <a href="#building">NiaTalent</a>
            <a href="#experience">Experience</a>
            <a href="#play">Play</a>
          </nav>
          <button className="btn small mono shell-open" type="button" onClick={() => setShell(true)}>$_ <kbd>`</kbd></button>
          <a className="btn small primary" href="#resumes">Resumes ↓</a>
          <span className="screw" aria-hidden="true" />
        </div>
      </header>
      <main>
        <Hero onOpenShell={() => setShell(true)} />
        <FleetStory />
        <Work />
        <Team />
        <Building />
        <Toolbox />
        <Experience />
        <Resumes />
        <Play onShell={() => setShell(true)} onGame={() => setGame(true)} />
        <Contact toast={showToast} />
      </main>
      <footer>
        <div className="wrap">
          <span>© {new Date().getFullYear()} {site.name} · Nairobi</span>
          <span>Next.js · TypeScript · Three.js · <a href="#top">back to U01 ↑</a></span>
        </div>
      </footer>
      <Shell open={shell} onClose={() => setShell(false)} onPlay={() => setGame(true)} />
      <PodGame open={game} onClose={() => setGame(false)} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
