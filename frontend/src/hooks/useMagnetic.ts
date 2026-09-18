import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Attaches inertial magnetic pull to any element. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.7, ease: "expo.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.7, ease: "expo.out" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      quickX((e.clientX - (rect.left + rect.width / 2)) * strength);
      quickY((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return ref;
}
