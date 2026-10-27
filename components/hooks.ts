"use client";
import { RefObject, useEffect, useState } from "react";

/** True while the element is within `margin` of the viewport. */
export function useInView(ref: RefObject<Element | null>, margin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export type Palette = { fg: string; muted: string; line: string; panel: string; accent: string; ok: string; crash: string; bg2: string; dark: boolean };

const read = (): Palette => {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string) => cs.getPropertyValue(n).trim() || "#888";
  return {
    fg: v("--fg"), muted: v("--muted"), line: v("--line"), panel: v("--panel"), accent: v("--accent"),
    ok: v("--ok"), crash: v("--crash"), bg2: v("--bg-2"), dark: cs.colorScheme.includes("dark"),
  };
};

/** Theme colours from the CSS tokens, updated when the theme changes. */
export function usePalette() {
  const [p, setP] = useState<Palette>({
    fg: "#e8edf4", muted: "#8e9cb1", line: "#253244", panel: "#16202d", accent: "#f2a53a", ok: "#45d1a7", crash: "#ff6b5d", bg2: "#121924", dark: true,
  });
  useEffect(() => {
    setP(read());
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => setP(read());
    mq.addEventListener("change", on);
    const mo = new MutationObserver(on);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { mq.removeEventListener("change", on); mo.disconnect(); };
  }, []);
  return p;
}

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
