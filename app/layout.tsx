import type { Metadata, Viewport } from "next";
import "@fontsource/bricolage-grotesque/500.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esther Kung'u · Backend & DevOps Engineer",
  description:
    "Esther Wanjiru Kung'u, backend and DevOps engineer in Nairobi. Go, Python and Kubernetes across 200+ servers and 50+ production clusters.",
  openGraph: {
    title: "Esther Wanjiru Kung'u · Backend & DevOps Engineer",
    description: "One server becomes a fleet. A scroll-through portfolio of Go, Python, Kubernetes and GitOps work.",
    type: "website",
  },
  twitter: { card: "summary" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d1219",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
