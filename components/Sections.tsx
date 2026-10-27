"use client";
import { useState } from "react";
import { projects } from "@/content/projects";
import { certs, experience, resumes, tools } from "@/content/profile";
import { building, site } from "@/content/site";
import GlobeScene from "./GlobeScene";
import SceneFrame from "./SceneFrame";
import { usePalette, useReducedMotion } from "./hooks";

export function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Selected work</p>
          <h2>What I&apos;ve <em>shipped.</em></h2>
          <p className="lede">Most of this ran in customer environments, so client names stay private. Open a card for what I did on it.</p>
        </div>
        <div className="work-grid">
          {projects.map((p) => (
            <article key={p.title} className="card">
              <span className="kind">{p.kind}</span>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <div className="tags">{p.stack.map((s) => <span key={s} className="tag">{s}</span>)}</div>
              <details>
                <summary>What I did</summary>
                <ul>{p.did.map((d) => <li key={d}>{d}</li>)}</ul>
              </details>
              {p.link && <a className="ext" href={p.link.href} target="_blank" rel="noopener noreferrer">{p.link.label}</a>}
              <p className="result"><b>Outcome</b>{p.result}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Team() {
  const palette = usePalette();
  const reduced = useReducedMotion();
  return (
    <section className="team band" id="team">
      <div className="wrap">
        <div>
          <p className="eyebrow">Distributed team</p>
          <h2 style={{ marginTop: 14 }}>One team, <em>four countries.</em></h2>
          <p className="lede" style={{ marginTop: 18 }}>
            I worked from Nairobi with engineers in Denmark, Argentina and India. Code review crossed time zones every day, and the fleet never slept, so I learned to write things down: tickets, runbooks and pull requests anyone could pick up.
          </p>
          <div className="team-stats">
            <div><b>4</b><span>countries</span></div>
            <div><b>4</b><span>continents</span></div>
            <div><b>1</b><span>shared on-call</span></div>
          </div>
        </div>
        <SceneFrame
          className="globe-stage"
          camera={{ position: [0, 0.6, 6.2], fov: 38 }}
          fallback="A globe linking Kenya, Denmark, Argentina and India. Your browser has 3D turned off."
          overlay={<span className="globe-hint">Drag to spin the globe</span>}
        >
          <GlobeScene palette={palette} reduced={reduced} />
        </SceneFrame>
      </div>
    </section>
  );
}

export function Building() {
  const [run, setRun] = useState(0);
  const s = building.sample;
  return (
    <section id="building">
      <div className="wrap build">
        <div>
          <p className="eyebrow">Now building</p>
          <h2 style={{ marginTop: 14 }}>{building.name}. <em>{building.tagline}</em></h2>
          <p className="lede" style={{ marginTop: 18 }}>{building.body}</p>
          <div className="hero-cta">
            <a className="btn primary" href={building.url} target="_blank" rel="noopener noreferrer">Visit niatalent.com ↗</a>
            <button className="btn" type="button" onClick={() => { const next = run + 1; setRun(0); setTimeout(() => setRun(next), 120); }}>{run ? "Run it again" : "Run a sample simulation"}</button>
          </div>
        </div>
        <div className={`report ${run ? "ran" : ""}`} aria-live="polite">
          <div className="report-head">
            <span className="eyebrow">Example report</span>
            <span className="report-state">{run ? "Scored" : "Ready to run"}</span>
          </div>
          <h3>{s.candidate}</h3>
          <p className="report-task">Task: {s.task}</p>
          <div className="scores">
            {s.scores.map(([label, v], i) => (
              <div key={label} className="score">
                <span>{label}</span>
                <span className="bar"><i style={{ width: run ? `${v}%` : "0%", transitionDelay: `${i * 0.15}s` }} /></span>
                <b>{run ? v : "–"}</b>
              </div>
            ))}
          </div>
          <p className="report-foot">{run ? "Evidence attached: commits, test runs and the written handover." : "Press “Run a sample simulation” to score it."}</p>
        </div>
      </div>
    </section>
  );
}

export function Toolbox() {
  const [picked, setPicked] = useState<Record<number, string>>(() => Object.fromEntries(tools.map((b, i) => [i, Object.keys(b.items)[0]])));
  return (
    <section id="toolbox" className="band">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Toolbox</p>
          <h2>What I <em>reach for.</em></h2>
          <p className="lede">Tap any tool to see where I&apos;ve used it.</p>
        </div>
        <div className="tool-grid">
          {tools.map((b, i) => (
            <div key={b.name} className="bucket">
              <h3>{b.name}<span>{Object.keys(b.items).length} tools</span></h3>
              <div className="chips">
                {Object.keys(b.items).map((k) => (
                  <button key={k} type="button" className="chip" aria-pressed={picked[i] === k} onClick={() => setPicked((p) => ({ ...p, [i]: k }))}>{k}</button>
                ))}
              </div>
              <p className="where"><b>{picked[i]}:</b> {b.items[picked[i]]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  return (
    <section id="experience">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Experience</p>
          <h2>Where I&apos;ve <em>been on call.</em></h2>
        </div>
        <div className="exp">
          <ol className="timeline">
            {experience.map((r) => (
              <li key={r.title}>
                <div className="when">{r.when}{r.current && <><br /><span className="state">Current</span></>}</div>
                <div>
                  <h3>{r.title}</h3>
                  <p className="org">{r.org}</p>
                  {r.body && <p>{r.body}</p>}
                </div>
              </li>
            ))}
          </ol>
          <div className="certs">
            <h3>Certifications</h3>
            {certs.map((c) => (
              <button key={c.name} type="button" className={`flip ${flipped[c.name] ? "on" : ""}`} aria-label={`${c.name}, flip for details`} onClick={() => setFlipped((f) => ({ ...f, [c.name]: !f[c.name] }))}>
                <span className="flip-in">
                  <span className="face"><span className="badge">{c.badge}</span><strong>{c.name}</strong><span className={c.pending ? "pending" : ""}>{c.issuer}</span><span className="hint">flip ↻</span></span>
                  <span className="face back"><span className="p">{c.covers}</span><span className="hint">flip ↻</span></span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Resumes() {
  return (
    <section id="resumes" className="band">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Resumes</p>
          <h2>Pick the one <em>for your role.</em></h2>
          <p className="lede">Same experience, three angles. Each is one page and ready for an applicant tracking system.</p>
        </div>
        <div className="cv-grid">
          {resumes.map((r) => (
            <article key={r.key} className={`cv ${r.featured ? "rec" : ""}`}>
              <a className="cv-thumb" href={`/resumes/${r.file}.pdf`} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${r.title} resume`}>
                {r.featured && <span className="rec-pill">Most requested</span>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/resumes/${r.file}.png`} alt={`First page of the ${r.title} resume`} loading="lazy" />
              </a>
              <div className="cv-body">
                <h3>{r.title}</h3>
                <p>{r.blurb}</p>
                <div className="cv-actions">
                  <a className="btn small primary" href={`/resumes/${r.file}.pdf`} download>Download PDF</a>
                  <a className="btn small" href={`/resumes/${r.file}.pdf`} target="_blank" rel="noopener noreferrer">View ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Play({ onShell, onGame }: { onShell: () => void; onGame: () => void }) {
  return (
    <section id="play">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Play</p>
          <h2>Want to <em>break something?</em></h2>
          <p className="lede">Both run in your browser. Nothing you type leaves this page.</p>
        </div>
        <div className="play-grid">
          <div className="play-card">
            <span className="eyebrow">Shell</span>
            <h3>Poke around my terminal</h3>
            <p>Run <span className="mono">kubectl get pods</span>, read my files, or try <span className="mono">sudo hire esther</span>. Press <kbd>`</kbd> anywhere on the page.</p>
            <button className="btn primary" type="button" onClick={onShell}>Open shell</button>
          </div>
          <div className="play-card">
            <span className="eyebrow">Game · 60 seconds</span>
            <h3>CrashLoopBackOff</h3>
            <div className="mini-pods" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => <i key={i} className={[5, 13, 18].includes(i) ? "bad" : ""} />)}
            </div>
            <p>Pods keep crashing. Restart them before uptime falls under the SLO.</p>
            <button className="btn primary" type="button" onClick={onGame}>Start the on-call shift</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact({ toast }: { toast: (m: string) => void }) {
  const copy = () => {
    const fallback = () => toast("Select the address and copy it");
    try { navigator.clipboard.writeText(site.email).then(() => toast("Email copied"), fallback); } catch { fallback(); }
  };
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <p className="eyebrow">Contact</p>
        <h2>Let&apos;s keep <em>something running</em> together.</h2>
        <p className="lede">{site.lookingFor}</p>
        <div className="mail-row">
          <a className="mail" href={`mailto:${site.email}`}>{site.email}</a>
          <button className="btn" type="button" onClick={copy}>Copy email</button>
          <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>
    </section>
  );
}
