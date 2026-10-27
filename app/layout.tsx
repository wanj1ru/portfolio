import type { Metadata, Viewport } from "next";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/schibsted-grotesk/400";
import "@fontsource/schibsted-grotesk/600";
import "@fontsource/schibsted-grotesk/700";
import "@fontsource/martian-mono/400";
import "@fontsource/martian-mono/500";
import "@fontsource/martian-mono/600";
import "@fontsource/martian-mono/700";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esther Kung'u · Full Stack Engineer",
  description:
    "Esther Wanjiru Kung'u, full stack engineer in Nairobi. Next.js and TypeScript frontends, Go and Python services, and Kubernetes across 200+ servers and 50+ clusters.",
  openGraph: {
    title: "Esther Wanjiru Kung'u · Full Stack Engineer",
    description: "One server becomes a fleet. A scroll-through portfolio of full stack work: Next.js, Go, Python and Kubernetes.",
    type: "website",
  },
  twitter: { card: "summary" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#121415",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
