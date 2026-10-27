export type ToolBucket = { name: string; items: Record<string, string> };

export const tools: ToolBucket[] = [
  {
    name: "Frontend",
    items: {
      "Next.js": "Reusable component library and frontend architecture for the Obmondo Invoicing Service, and this site.",
      TypeScript: "Typed frontends and tooling alongside the Go services, including this site.",
      React: "The components behind the Next.js invoicing frontend.",
      "Tailwind CSS": "Styling for the invoicing service's component library.",
      JavaScript: "Enhancements to the Obmondo website and frontend integration.",
      "HTML & CSS": "Page layouts, and the work behind 40% faster page loads.",
      "Three.js": "The 3D rack, fleet and globe on this site.",
    },
  },
  {
    name: "Languages",
    items: {
      Go: "Backend services and the alert management service at Obmondo.",
      Python: "Backend services and automation scripts for Linux and Kubernetes tasks.",
      Java: "Spring Boot microservices at OneKitty.",
      Bash: "Day-to-day Linux automation across the server fleet.",
      SQL: "PostgreSQL and MySQL queries, schemas and reporting.",
    },
  },
  {
    name: "Backend & data",
    items: {
      "REST APIs": "Designed APIs and integrations with internal systems and third parties.",
      PostgreSQL: "Primary database behind the Go and Python services.",
      MySQL: "Schemas and data access for production apps.",
      Redis: "Caching that cut API response times by 35%.",
      Memcached: "Caching layer in the performance work.",
      RBAC: "Designed the auth layer securing 10,000+ user sessions.",
      "Spring Boot": "Microservices at OneKitty, +25% reliability.",
    },
  },
  {
    name: "Kubernetes",
    items: {
      Kubernetes: "50+ production clusters, customer and internal.",
      Docker: "Containerised every service I shipped.",
      Helm: "Packaging releases for ArgoCD.",
      "Cluster API": "Self-hosted clusters on Hetzner after leaving AKS.",
      Harbor: "Internal image proxy in front of Docker Hub.",
      Kyverno: "Policies that decide which images may run.",
    },
  },
  {
    name: "Delivery & IaC",
    items: {
      ArgoCD: "GitOps sync for zero-downtime releases.",
      "GitHub Actions": "CI/CD pipelines for services and charts.",
      "Gitea Actions": "CI/CD on the self-hosted Gitea.",
      Crossplane: "Compositions for Kops and AKS that remove drift.",
      Terraform: "Infrastructure as code before and alongside Crossplane.",
      Puppet: "OS patching and configuration for 200+ servers.",
      Git: "Daily code review and release flow.",
      pytest: "Unit and integration tests for the Errbot plugins, with coverage tracking.",
    },
  },
  {
    name: "Observe & secure",
    items: {
      Prometheus: "Metrics and alert rules for the whole fleet.",
      Alerting: "Alert routing into the on-call flow.",
      "Incident response": "From first page to root cause and runbook.",
      Keycloak: "SSO rolled out to centralise access.",
      Mattermost: "Errbot notifications, and alerts when an invoicing run fails.",
      Cloudflare: "CDN caching behind the 40% faster page loads.",
    },
  },
  {
    name: "Cloud & analysis",
    items: {
      Linux: "The ground floor of everything above.",
      Hetzner: "Bare metal for self-hosted Kubernetes.",
      Azure: "AKS clusters before the migration.",
      AWS: "EC2, S3 and VPC basics; Solutions Architect in progress.",
      "Power BI": "Enterprise reporting at Airtel Africa.",
      Tableau: "Dashboards at Airtel Africa and in the Google Data Analytics certificate.",
    },
  },
];

export type Role = { when: string; current?: boolean; title: string; org: string; body?: string };

export const experience: Role[] = [
  {
    when: "Now",
    current: true,
    title: "Founder, NiaTalent",
    org: "niatalent.com",
    body: "Building a platform that assesses African talent through real work simulations and places them with companies worldwide.",
  },
  {
    when: "Aug 2024 – Aug 2026",
    title: "Software Engineer",
    org: "Obmondo, Denmark · remote",
    body: "Built across the stack: a Next.js and TypeScript frontend and component library for the usage-based invoicing service, Go and Python services with PostgreSQL, and Errbot automation for the team. On the features team for LinuxAid and KubeAid, I ran alerts for 200+ servers and 50+ clusters and took part in daily code review and testing with a team across Denmark, Argentina, India and Kenya.",
  },
  {
    when: "Aug 2025 – now",
    current: true,
    title: "Chair, Youth Innovation & Future Technologies Council",
    org: "Marketers Accelerating Trade in Africa (MATA) · volunteer",
    body: "Lead the council's work on youth-focused digital innovation and technology strategy for trade across Africa.",
  },
  {
    when: "May – Jul 2024",
    title: "Presales Solutions Architect (Intern)",
    org: "Airtel Africa · Enterprise Business (B2B)",
    body: "Analysed data and built reports and dashboards in Power BI and Tableau for Airtel Kenya's enterprise team.",
  },
  {
    when: "Jan – Dec 2023",
    title: "Software Engineering Intern",
    org: "OneKitty · hybrid",
    body: "Built Spring Boot microservices for a contribution and fundraising platform and improved service reliability by 25%. Worked on PHP services alongside Java and added regression tests.",
  },
];

export type School = { when: string; title: string; org: string };

export const education: School[] = [
  { when: "2022 – 2024", title: "BSc Computer Science, Software Engineering", org: "St Paul's University · Second Class Upper Honours" },
  { when: "2019 – 2021", title: "Diploma in International Relations", org: "Strathmore University · Merit" },
];

export type Cert = { badge: string; name: string; issuer: string; pending?: boolean; covers: string };

export const certs: Cert[] = [
  { badge: "PM", name: "Project Management", issuer: "Google · Professional Certificate", covers: "Planning, scoping and running projects end to end, with Agile and Scrum practice and stakeholder communication." },
  { badge: "DA", name: "Data Analytics", issuer: "Google · Professional Certificate", covers: "Cleaning, analysing and visualising data with SQL, spreadsheets, R and Tableau." },
  { badge: "SAA", name: "Solutions Architect, Associate", issuer: "AWS · in progress", pending: true, covers: "Designing resilient, secure and cost-aware architectures on AWS. Currently studying for the exam." },
];

export type Resume = { key: "backend" | "devops" | "fullstack"; file: string; title: string; blurb: string; featured?: boolean };

export const resumes: Resume[] = [
  { key: "fullstack", file: "Esther_Kungu_Full_Stack_Engineer_Resume", title: "Full Stack Engineer", blurb: "Next.js and TypeScript frontends, Go and Python APIs, PostgreSQL, and Docker and CI/CD to ship it.", featured: true },
  { key: "backend", file: "Esther_Kungu_Backend_Engineer_Resume", title: "Backend Engineer", blurb: "Go and Python services, REST APIs, PostgreSQL, RBAC and performance work." },
  { key: "devops", file: "Esther_Kungu_DevOps_Platform_Engineer_Resume", title: "DevOps & Platform Engineer", blurb: "Linux fleet, Kubernetes in production, GitOps, infrastructure as code and incident response." },
];

// Where the team sat. Used by the globe.
export const team = [
  { name: "Kenya", note: "me, Nairobi", lat: -1.29, lon: 36.82, home: true },
  { name: "Denmark", note: "HQ", lat: 56.0, lon: 10.0 },
  { name: "Argentina", note: "team", lat: -34.6, lon: -60.0 },
  { name: "India", note: "team", lat: 20.6, lon: 78.9 },
];
