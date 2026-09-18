import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

/** Lenis inertial smooth scrolling, synced to the GSAP ticker. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
