"use client";
import { useState } from "react";
import { projects } from "@/content/projects";
import { certs, education, experience, resumes, tools } from "@/content/profile";
import { building, site } from "@/content/site";
import GlobeScene from "./GlobeScene";
import SceneFrame from "./SceneFrame";
import { usePalette, useReducedMotion } from "./hooks";

const pad = (n: number) => String(n).padStart(2, "0");

export function Work() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head">
          <span className="tape">U03 · Selected work</span>
          <h2>What I&apos;ve <em>shipped</em></h2>
          <p className="lede">Each unit is a piece of work. Pull one out to see what I did on it. Client names stay private.</p>
        </div>
        <div className="rack">
          {projects.map((p, i) => {
            const isOpen = open === i;
            return (
              <div key={p.title} className={`unit ${isOpen ? "open" : ""}`} data-reveal="rack" style={{ ["--i" as string]: i }}>
                <button type="button" className="plate" aria-expanded={isOpen} aria-controls={`drawer-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="led" aria-hidden="true" />
                  <span className="vents" aria-hidden="true" />
                  <span className="t"><strong>{p.title}</strong><span>{pad(i + 1)}U · {p.stack.slice(0, 3).join(" · ")}</span></span>
                  <span className="tape y kind">{p.kind}</span>
                  <span className="handle">{isOpen ? "Push in ◂" : "Pull out ▸"}</span>
                </button>
                <div className="drawer" id={`drawer-${i}`}>
                  <div>
                    <div className="drawer-in">
                      <div>
                        <h4>What I did</h4>
                        <ul>{p.did.map((d) => <li key={d}>{d}</li>)}</ul>
                      </div>
                      <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
                        <div><h4>Summary</h4><p>{p.summary}</p></div>
                        {p.highlights && (
                          <div className="hl">{p.highlights.map(([big, small]) => <div key={small}><b>{big}</b><span>{small}</span></div>)}</div>
                        )}
                        <div><h4>Outcome</h4><p className="result">{p.result}</p></div>
                        <div className="tags">{p.stack.map((s) => <span key={s} className="tag">{s}</span>)}</div>
                        {p.link && <a href={p.link.href} target="_blank" rel="noopener noreferrer">{p.link.label}</a>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
        <div className="head">
          <span className="tape">U04 · Distributed team</span>
          <h2>One team, <em>four countries</em></h2>
          <p className="lede">
            I worked from Nairobi with engineers in Denmark, Argentina and India. Code review crossed time zones every day, and the fleet never slept, so I learned to write things down: tickets, runbooks and pull requests anyone could pick up.
          </p>
          <div className="stats">
            <div><b>4</b><span>countries</span></div>
            <div><b>4</b><span>continents</span></div>
            <div><b>1</b><span>shared on-call</span></div>
          </div>
        </div>
        <SceneFrame
          className="globe-stage"
          camera={{ position: [0, 0.6, 8.6], fov: 38 }}
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
  const again = () => { const next = run + 1; setRun(0); setTimeout(() => setRun(next), 120); };
  return (
    <section id="building">
      <div className="wrap build">
        <div className="head">
          <span className="tape y">U05 · Now building · Founder</span>
          <h2>{building.name}. <em>{building.tagline.replace(/\.$/, "")}</em></h2>
          <p className="lede">{building.body}</p>
          <div className="hero-cta">
            <a className="btn primary" href={building.url} target="_blank" rel="noopener noreferrer">Visit niatalent.com ↗</a>
            <button className="btn" type="button" onClick={again}>{run ? "Run it again" : "Run a sample simulation"}</button>
          </div>
        </div>
        <div className="sheet" aria-live="polite" data-reveal="up">
          <span className={`stamp ${run ? "ok" : ""}`}>{run ? "Scored" : "Example"}</span>
          <span style={{ font: "600 .64rem var(--mono)", letterSpacing: ".12em", textTransform: "uppercase" }}>Simulation report · sample</span>
          <h3>{s.candidate}</h3>
          <p className="task">Task: {s.task}</p>
          <div className="scores">
            {s.scores.map(([label, v], i) => (
              <div key={label} className="score">
                <span>{label}</span>
                <span className="bar"><i style={{ width: run ? `${v}%` : "0%", transitionDelay: `${i * 0.15}s` }} /></span>
                <b>{run ? v : "··"}</b>
              </div>
            ))}
          </div>
          <p className="foot">{run ? "Evidence attached: commits, test runs and the written handover." : "Press “Run a sample simulation” to score it."}</p>
        </div>
      </div>
    </section>
  );
}

export function Toolbox() {
  const [picked, setPicked] = useState<Record<number, string>>(() => Object.fromEntries(tools.map((b, i) => [i, Object.keys(b.items)[0]])));
  let port = 0;
  return (
    <section id="toolbox" className="band perf">
      <div className="wrap">
        <div className="sec-head">
          <span className="tape">U06 · Patch panel</span>
          <h2>What I <em>reach for</em></h2>
          <p className="lede">Every tool is a port. Plug one in to see where I&apos;ve used it.</p>
        </div>
        <div className="panels">
          {tools.map((b, i) => (
            <div key={b.name} className="panel" data-reveal="rack" style={{ ["--i" as string]: i }}>
              <div className="panel-name"><strong>{b.name}</strong><span>{Object.keys(b.items).length} ports</span></div>
              <div className="ports">
                {Object.keys(b.items).map((k) => {
                  port++;
                  return (
                    <button key={k} type="button" className="port" aria-pressed={picked[i] === k} onClick={() => setPicked((p) => ({ ...p, [i]: k }))}>
                      <span className="num">{pad(port)}</span>
                      <span className="pl">{k}</span>
                      <span className="jack" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <p className="lcd" aria-live="polite"><b>{picked[i]}</b> › {b.items[picked[i]]}</p>
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
          <span className="tape">U07 · Maintenance log</span>
          <h2>Where I&apos;ve <em>been on call</em></h2>
        </div>
        <div className="exp">
          <div className="log" data-reveal="up">
            <div className="log-head"><span>Maintenance log · E. W. Kung&apos;u</span><span>Newest first</span></div>
            <ol>
              {experience.map((r) => (
                <li key={r.title}>
                  <div className="when">{r.when}{r.current && <><br /><span className="state">IN SERVICE</span></>}</div>
                  <div>
                    <h3>{r.title}</h3>
                    <p className="org">{r.org}</p>
                    {r.body && <p>{r.body}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="certs">
            <span className="tape">Education</span>
            <div className="log edu">
              <ol>
                {education.map((e) => (
                  <li key={e.title}>
                    <div className="when">{e.when}</div>
                    <div><h3>{e.title}</h3><p className="org">{e.org}</p></div>
                  </li>
                ))}
              </ol>
            </div>
            <span className="tape y" style={{ marginTop: 18 }}>Certifications</span>
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
          <span className="tape">U08 · Resumes</span>
          <h2>Pick the one <em>for your role</em></h2>
          <p className="lede">Same experience, three angles. Each is one page and ready for an applicant tracking system.</p>
        </div>
        <div className="cv-grid">
          {resumes.map((r) => (
            <article key={r.key} className="cv" data-reveal="up" style={{ ["--i" as string]: resumes.indexOf(r) }}>
              <a className="cv-thumb" href={`/resumes/${r.file}.pdf`} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${r.title} resume`}>
                {r.featured && <span className="tape y">Most requested</span>}
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
          <span className="tape">U09 · Play</span>
          <h2>Want to <em>break something?</em></h2>
          <p className="lede">Both run in your browser. Nothing you type leaves this page.</p>
        </div>
        <div className="play-grid">
          <div className="play-card">
            <span className="tape y">Shell</span>
            <h3>Poke around my terminal</h3>
            <p>Run <span className="mono">kubectl get pods</span>, read my files, or try <span className="mono">sudo hire esther</span>. Press <kbd>`</kbd> anywhere on the page.</p>
            <button className="btn primary" type="button" onClick={onShell}>Open shell</button>
          </div>
          <div className="play-card">
            <span className="tape y">Game · 60 seconds</span>
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
        <span className="tape">U10 · Contact</span>
        <h2>Let&apos;s keep <em>something running</em></h2>
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
