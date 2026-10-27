"use client";
import { FormEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { resumes } from "@/content/profile";
import { site } from "@/content/site";

type Line = { id: number; node: ReactNode; cls?: string };

const FILES: Record<string, string> = {
  "about.txt": `${site.name}. Full stack engineer in Nairobi.
Founder of NiaTalent (niatalent.com).
3+ years of software engineering, two of them at Obmondo (Denmark, remote):
200+ Linux servers, 50+ production Kubernetes clusters, Go and Python services.
Daily code review with a team across four countries.`,
  "stack.yaml": `frontend: [next.js, typescript, react, tailwind, three.js]
languages: [go, python, typescript, java, bash, sql]
data: [postgresql, mysql, redis, memcached]
platform: [kubernetes, docker, helm, cluster-api, harbor, kyverno]
delivery: [argocd, github-actions, gitea-actions, crossplane, terraform, puppet]
observe: [prometheus, alerting, incident-response]
cloud: [hetzner, azure-aks, aws]`,
  "contact.txt": `email:    ${site.email}
linkedin: ${site.linkedin.replace("https://www.", "")}
github:   ${site.github.replace("https://", "")}`,
};

const PODS: [string, string, number][] = [
  ["api-gateway-7d9f", "Running", 0],
  ["alert-manager-svc-5c2b", "Running", 0],
  ["report-worker-8a1e", "Running", 1],
  ["harbor-core-6f4d", "Running", 0],
  ["kyverno-admission-2b7c", "Running", 0],
  ["coffee-maker-0", "CrashLoopBackOff", 42],
];

export default function Shell({ open, onClose, onPlay }: { open: boolean; onClose: () => void; onPlay: () => void }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const hist = useRef<string[]>([]);
  const hi = useRef(0);
  const id = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);

  const print = (node: ReactNode, cls?: string) => setLines((l) => [...l, { id: id.current++, node, cls }]);

  useEffect(() => {
    if (!open) return;
    if (id.current === 0) print(<span className="dim">Welcome to esther&apos;s shell. Type <span className="acc">help</span> to start.</span>);
    setTimeout(() => input.current?.focus(), 0);
  }, [open]);
  useEffect(() => { out.current?.scrollTo({ top: out.current.scrollHeight }); }, [lines]);

  const commands: Record<string, (a: string[]) => void> = {
    help: () => print(<>
      <span className="acc">commands</span>{`
  whoami            who am I
  ls / cat FILE     read my files (try cat about.txt)
  kubectl get pods  see what's running
  kubectl get nodes my roles
  uptime            the numbers
  resume [backend|fullstack]
  contact           how to reach me
  play              start the CrashLoopBackOff game
  neofetch          the usual
  sudo hire esther  you know you want to
  clear, exit`}</>),
    whoami: () => print("esther (full stack · backend · devops · founder of NiaTalent) · Africa/Nairobi"),
    ls: (a) => print(a[0]?.startsWith("resumes") ? "backend.pdf  fullstack.pdf" : <>about.txt  stack.yaml  contact.txt  <span className="acc">resumes/</span></>),
    cat: (a) => {
      const f = FILES[a[0]];
      if (f) print(f);
      else if (a[0]?.startsWith("resumes")) print("cat: resumes/: Is a directory");
      else print(`cat: ${a[0] ?? ""}: No such file. Try ls.`, "bad");
    },
    kubectl: (a) => {
      if (a[0] === "get" && (a[1] === "pods" || a[1] === "po")) {
        print(<>
          <span className="dim">{"NAME                       READY  STATUS             RESTARTS"}</span>{"\n"}
          {PODS.map(([n, s, r]) => (
            <span key={n}>{n.padEnd(27)}{s === "Running" ? "1/1" : "0/1"}{"    "}<span className={s === "Running" ? "ok" : "bad"}>{s.padEnd(19)}</span>{r}{"\n"}</span>
          ))}
          {"\n"}<span className="dim">hint: coffee-maker-0 needs you. run &quot;play&quot;.</span>
        </>);
      } else if (a[0] === "get" && a[1] === "nodes") {
        print(<>
          <span className="dim">{"NAME       STATUS  ROLES"}</span>{"\n"}
          {"frontend   "}<span className="ok">Ready</span>{"   next.js, typescript, react, tailwind\n"}
          {"backend    "}<span className="ok">Ready</span>{"   go, python, postgresql, rest\n"}
          {"platform   "}<span className="ok">Ready</span>{"   kubernetes, argocd, crossplane, helm\n"}
          {"ops        "}<span className="ok">Ready</span>{"   linux, puppet, prometheus, on-call\n"}
          {"founder    "}<span className="ok">Ready</span>{"   niatalent.com"}
        </>);
      } else if (a[0] === "get" && a[1] === "secrets") print("Error from server (Forbidden): you'll have to hire me first.", "bad");
      else if (a[0] === "delete") print('Kyverno says no. Policy "no-deleting-the-portfolio" blocked this request.', "bad");
      else print("try: kubectl get pods | kubectl get nodes");
    },
    uptime: () => print(<>servers <span className="acc">200+</span>  clusters <span className="acc">50+</span>  api latency <span className="ok">−35%</span>  page load <span className="ok">−40%</span>  test coverage <span className="ok">85%+</span></>),
    resume: (a) => {
      const r = resumes.find((x) => x.key === a[0]);
      if (!r) return print("usage: resume backend | fullstack");
      print(<>opening {r.key} resume…  <a href={`/resumes/${r.file}.pdf`} target="_blank" rel="noopener noreferrer">resumes/{r.key}.pdf ↗</a></>);
      window.open(`/resumes/${r.file}.pdf`, "_blank", "noopener");
    },
    contact: () => print(FILES["contact.txt"]),
    neofetch: () => print(<>
      <span className="acc">{"   ___  "}</span>{"  esther@nairobi\n"}
      <span className="acc">{"  |_ _| "}</span>{"  ---------------\n"}
      <span className="acc">{"   | |  "}</span>{"  role:    full stack · devops · founder\n"}
      <span className="acc">{"   | |  "}</span>{"  shell:   bash (and a lot of kubectl)\n"}
      <span className="acc">{"  |___| "}</span>{"  stack:   next.js, typescript, go, python\n"}
      {"          uptime:  3+ years building software\n"}
      {"          tz:      Africa/Nairobi (UTC+3)"}
    </>),
    sudo: (a) => a.join(" ") === "hire esther"
      ? print(<>{"[sudo] password for recruiter: ********\n"}<span className="ok">✔ access granted.</span> Send an offer to {site.email}</>)
      : print("esther is not in the sudoers file. This incident will be reported.", "bad"),
    play: () => { onClose(); onPlay(); },
    clear: () => setLines([]),
    exit: () => onClose(),
    rm: () => print("rm: refusing to remove '/'. Nice try.", "bad"),
    ssh: () => print("ssh: connect to host esther port 22: use LinkedIn instead."),
  };

  const run = (e: FormEvent) => {
    e.preventDefault();
    const line = value;
    setValue("");
    if (line.trim()) { hist.current.push(line); hi.current = hist.current.length; }
    print(<><span className="ok">esther@nairobi:~$</span> {line}</>);
    const [cmd, ...args] = line.trim().split(/\s+/);
    if (!cmd) return;
    (commands[cmd] ?? (() => print(`${cmd}: command not found. Type help.`, "bad")))(args);
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    const h = hist.current;
    if (e.key === "ArrowUp" && h.length) { hi.current = Math.max(0, hi.current - 1); setValue(h[hi.current]); e.preventDefault(); }
    if (e.key === "ArrowDown" && h.length) { hi.current = Math.min(h.length, hi.current + 1); setValue(h[hi.current] ?? ""); e.preventDefault(); }
    if (e.key === "Tab") { e.preventDefault(); const m = Object.keys(commands).filter((c) => c.startsWith(value)); if (m.length === 1) setValue(m[0] + " "); }
    if (e.key === "`") { e.preventDefault(); onClose(); }
  };

  if (!open) return null;
  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="shell" role="dialog" aria-modal="true" aria-label="Interactive shell">
        <div className="term-bar"><i /><i /><i /><span>esther@nairobi: ~ (type help)</span><button type="button" onClick={onClose} aria-label="Close shell">esc ✕</button></div>
        <div className="shell-out" ref={out} aria-live="polite">
          {lines.map((l) => <div key={l.id} className={l.cls}>{l.node}</div>)}
        </div>
        <form onSubmit={run} autoComplete="off">
          <label htmlFor="shell-in">esther@nairobi:~$</label>
          <input id="shell-in" ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={keys} spellCheck={false} autoCapitalize="off" aria-label="Shell command" />
        </form>
      </div>
    </div>
  );
}
