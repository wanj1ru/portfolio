// To add a project, copy one entry, fill it in, and push. The newest can go first.
export type Project = {
  kind: string;
  title: string;
  summary: string;
  did: string[];
  stack: string[];
  result: string;
  highlights?: [string, string][];
  link?: { href: string; label: string };
};

export const projects: Project[] = [
  {
    kind: "Billing · full stack",
    title: "Obmondo Invoicing Service",
    summary: "A usage-based billing platform for managed infrastructure customers. It calculates costs across disk consumption, Kubernetes workers, developer support hours and custom feature requests, then generates and sends invoices automatically.",
    did: [
      "Took part in architecture and sprint planning, and in daily coordination with the team.",
      "Designed the frontend and backend architecture for the billing pipeline.",
      "Built a reusable component library with Next.js and TypeScript.",
      "Added Mattermost notifications that alert developers when an invoicing run fails.",
    ],
    stack: ["Go", "PostgreSQL", "Next.js", "TypeScript", "Tailwind CSS", "Kubernetes API", "AWS", "Mattermost"],
    result: "Billing is fully automated, with costs calculated from actual usage.",
    highlights: [["100%", "billing automated"], ["Usage-based", "cost calculation"]],
    link: { href: "https://obmondo.com", label: "obmondo.com ↗" },
  },
  {
    kind: "Team automation",
    title: "Errbot for distributed teams",
    summary: "An engineering team automation platform. It sends notifications for missed stand-ups, meetings, thread mentions, repository activity and monitoring incidents, and shows who on the team is available.",
    did: [
      "Developed automation plugins for leave notifications and thread mentions.",
      "Improved communication and visibility across development teams.",
      "Built and maintained unit and integration tests.",
      "Added test-coverage tracking across plugins to improve code quality and reliability.",
    ],
    stack: ["Python", "Errbot", "Mattermost", "Git", "Monitoring APIs", "pytest", "Coverage.py"],
    result: "Team notifications are automated and test coverage is tracked across every plugin.",
    highlights: [["Automated", "team notifications"], ["Tracked", "test coverage"]],
  },
  {
    kind: "Platform migration",
    title: "AKS to Cluster API on Hetzner",
    summary: "Moved production Kubernetes off a managed cloud service onto self-hosted bare metal.",
    did: [
      "Helped plan and run the move from Azure Kubernetes Service to Cluster API (CAPI) on Hetzner bare metal.",
      "Kept workloads running through the cutover with GitOps-managed manifests.",
      "Handled the alerts and follow-ups while clusters settled on new hardware.",
    ],
    stack: ["Kubernetes", "Cluster API", "AKS", "Hetzner", "ArgoCD"],
    result: "Lower monthly cloud cost and better compute performance for the same workloads.",
  },
  {
    kind: "Supply chain security",
    title: "Harbor image proxy with Kyverno",
    summary: "An internal registry and policy layer between the clusters and Docker Hub.",
    did: [
      "Deployed Harbor as a pull-through proxy for public images.",
      "Wrote Kyverno policies so only approved images could run.",
      "Rolled out Keycloak SSO to centralise identity and access across tools.",
    ],
    stack: ["Harbor", "Kyverno", "Keycloak", "Helm"],
    result: "Docker Hub rate limits stopped breaking deploys, and every running image passes policy.",
  },
  {
    kind: "Backend · Go",
    title: "Monitoring and alert management service",
    summary: "The internal service that takes Prometheus alerts and turns them into work for the on-call team.",
    did: [
      "Built backend features in Go and Python with PostgreSQL.",
      "Improved how alerts from customer and internal infrastructure are tracked and resolved.",
      "Wrote tests and runbooks alongside the code.",
    ],
    stack: ["Go", "Python", "PostgreSQL", "Prometheus"],
    result: "Better observability across servers and clusters, with alerts that end in a fix.",
  },
  {
    kind: "Delivery",
    title: "Zero-downtime GitOps pipeline",
    summary: "Standard CI/CD from a git push to a synced cluster.",
    did: [
      "Built pipelines on GitHub Actions and Gitea Actions.",
      "Wired them into ArgoCD and Helm for automated, zero-downtime releases.",
      "Replaced hand-kept Terraform state with Crossplane Compositions for Kops and AKS.",
    ],
    stack: ["GitHub Actions", "Gitea Actions", "ArgoCD", "Crossplane"],
    result: "Faster deployments and configuration drift that corrects itself.",
  },
  {
    kind: "Backend · reporting",
    title: "Cost and billable reporting",
    summary: "A feature comparing team cost with billable income per person.",
    did: [
      "Built a bulk endpoint so the report avoids N+1 queries.",
      "Kept missing data as null instead of zero, so a gap never reads as a real number.",
      "Fixed a bug where people with failed upstream calls silently vanished from reports.",
      "Caught a validation tag mismatch before it could panic in production, and raised end-to-end coverage to 89.1%.",
    ],
    stack: ["Go", "PostgreSQL", "REST", "Testing"],
    result: "Reports that are fast to load and honest about what they don't know.",
  },
  {
    kind: "Open source",
    title: "KubeAid and LinuxAid",
    summary: "Obmondo's open-source toolkits for running Kubernetes and Linux in production.",
    did: [
      "Designed and implemented new capabilities as part of the features team.",
      "Handled the alerts raised by the Prometheus rules and mixins the toolkits ship with.",
    ],
    stack: ["Kubernetes", "Helm", "Prometheus", "Puppet"],
    result: "Tooling used to run customer fleets, maintained in the open.",
    link: { href: "https://github.com/Obmondo/KubeAid", label: "KubeAid on GitHub ↗" },
  },
];
