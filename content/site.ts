// Everything personal about the site lives in /content. Edit these files to update the portfolio.

export const site = {
  name: "Esther Wanjiru Kung'u",
  first: "Esther Wanjiru",
  last: "Kung'u",
  role: "Full stack engineer",
  location: "Nairobi, Kenya",
  email: "wanjirukungu2022@gmail.com",
  linkedin: "https://www.linkedin.com/in/estherkungu2022/",
  github: "https://github.com/wanj1ru",
  headline:
    "I build web products end to end: Next.js and TypeScript on the front, Go and Python services behind them, and the Kubernetes platform they run on, from one server to 200+.",
  lookingFor: "I'm looking for full stack and backend engineering roles, with platform work welcome. Remote anywhere, or on-site in Nairobi.",
};

export type Chapter = {
  step: string;
  fig?: string;
  figNote?: string;
  title: string;
  accent: string;
  body: string;
  tags?: string[];
  hud: [string, string];
};

// The scroll story. Each chapter drives one stage of the 3D fleet scene, in order.
export const chapters: Chapter[] = [
  {
    step: "01 · One server",
    title: "It starts with",
    accent: "one Linux box.",
    body: "Every service I ship ends up on a machine like this one. So I keep machines boring: patched, configured the same way, and described in code instead of in someone's memory.",
    tags: ["Linux", "Bash", "Puppet"],
    hud: ["nodes: 1", "Ready"],
  },
  {
    step: "02 · Fleet",
    fig: "200+",
    figNote: "Linux servers, customer and internal",
    title: "Then",
    accent: "two hundred of them.",
    body: "Puppet handles OS patching and configuration for the whole fleet, so a fix lands on every server at once instead of one SSH session at a time.",
    hud: ["nodes: 200+ · puppet: in sync", "Ready"],
  },
  {
    step: "03 · Clusters",
    fig: "50+",
    figNote: "production Kubernetes clusters",
    title: "Off managed cloud,",
    accent: "onto bare metal.",
    body: "I helped move workloads from Azure Kubernetes Service to self-hosted Cluster API on Hetzner bare metal. Same workloads, a lower monthly cloud bill, and faster compute.",
    tags: ["Kubernetes", "Cluster API", "AKS", "Hetzner"],
    hud: ["clusters: 50+ · capi on hetzner", "Ready"],
  },
  {
    step: "04 · GitOps",
    fig: "0",
    figNote: "minutes of downtime per release",
    title: "Push to git.",
    accent: "Watch it sync.",
    body: "GitHub Actions and Gitea Actions pipelines feed ArgoCD and Helm. Crossplane Compositions for Kops and AKS replaced hand-kept state, so drift gets corrected before anyone has to discover it.",
    tags: ["ArgoCD", "Helm", "Crossplane", "Terraform"],
    hud: ["git push → argocd sync", "Synced"],
  },
  {
    step: "05 · Security",
    fig: "10,000+",
    figNote: "user sessions behind an RBAC layer I designed",
    title: "Only",
    accent: "trusted images get in.",
    body: "Harbor sits in front of Docker Hub as an image proxy, so rate limits stopped breaking deploys. Kyverno policies decide what may run, and Keycloak SSO puts sign-in in one place.",
    tags: ["Harbor", "Kyverno", "Keycloak", "RBAC"],
    hud: ["policy: kyverno enforce", "Secured"],
  },
  {
    step: "06 · Observability",
    fig: "50+",
    figNote: "production issues traced to root cause",
    title: "When it breaks,",
    accent: "I hear first.",
    body: "Prometheus watches the fleet and routes alerts into a monitoring and alert management service I helped build in Go. I take an incident from the first page to root cause, then write the runbook so it doesn't happen twice.",
    tags: ["Prometheus", "Go", "Incident response"],
    hud: ["prometheus: alerts routed", "On call"],
  },
  {
    step: "07 · Full stack",
    fig: "−40%",
    figNote: "page load time, with −35% API response time",
    title: "And the product on top",
    accent: "stays fast.",
    body: "Next.js and TypeScript screens on top of Go and Python APIs with PostgreSQL behind them. Caching with Redis, Memcached and Cloudflare took 40% off page loads and a third off API responses, and tests at 85%+ coverage keep it all correct.",
    tags: ["Next.js", "TypeScript", "Go", "PostgreSQL"],
    hud: ["page load −40% · api −35%", "Serving"],
  },
];

// "Now building" section.
export const building = {
  name: "NiaTalent",
  url: "https://niatalent.com/",
  tagline: "Global work, proven.",
  body: "NiaTalent is the company I founded. It assesses African talent through real work simulations and places people with companies worldwide, so employers hire from evidence instead of CVs.",
  // Shown as a clearly labelled example of a scored simulation report.
  sample: {
    candidate: "Backend engineer · Nairobi",
    task: "Fix a failing payments API under a 90-minute brief",
    scores: [
      ["Correctness", 92],
      ["Code quality", 86],
      ["Communication", 88],
      ["Debugging", 90],
    ] as [string, number][],
  },
};
