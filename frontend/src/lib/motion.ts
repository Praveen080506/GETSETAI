import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers GSAP plugins exactly once, browser-only. */
export function ensureGsap() {
  if (typeof window === "undefined") return gsap;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "expo.out", duration: 1.1 });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };

export const EASE = {
  cine: [0.16, 1, 0.3, 1] as const,
  soft: [0.33, 1, 0.68, 1] as const,
};

/** Splits a string into word/char tokens for masked reveals. */
export function splitWords(text: string) {
  return text.split(" ").filter(Boolean);
}

export function splitChars(text: string) {
  return Array.from(text);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
