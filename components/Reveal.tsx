"use client";
import { useEffect } from "react";

/**
 * Marks [data-reveal] elements with data-shown as they scroll into view. Content stays visible without JS.
 * Uses an attribute React doesn't manage, so re-renders (e.g. opening a project) can't wipe it.
 */
export default function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute("data-shown", ""); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    const watch = () => document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    // Safety net: anything someone clicks or focuses is shown immediately, no matter what.
    const show = (e: Event) => (e.target as Element | null)?.closest?.("[data-reveal]")?.setAttribute("data-shown", "");
    document.addEventListener("click", show, true);
    document.addEventListener("focusin", show, true);
    return () => { io.disconnect(); mo.disconnect(); document.removeEventListener("click", show, true); document.removeEventListener("focusin", show, true); };
  }, []);
  return null;
}
