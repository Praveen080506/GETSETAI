/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type CursorState = { label: string; variant: "default" | "hover" | "view" | "drag" };

type CursorApi = {
  set: (state: Partial<CursorState>) => void;
  reset: () => void;
};

const CursorContext = createContext<CursorApi>({ set: () => {}, reset: () => {} });

export const useCursor = () => useContext(CursorContext);

/** Convenience props spread onto any interactive element. */
export function useCursorProps(label = "", variant: CursorState["variant"] = "hover") {
  const { set, reset } = useCursor();
  return {
    onPointerEnter: () => set({ label, variant }),
    onPointerLeave: () => reset(),
  };
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorState>({ label: "", variant: "default" });
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const set = useCallback((next: Partial<CursorState>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);
  const reset = useCallback(() => setState({ label: "", variant: "default" }), []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!ring || !dot || !trail) return;

    const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "expo.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "expo.out" });
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const tx = gsap.quickTo(trail, "x", { duration: 1.1, ease: "expo.out" });
    const ty = gsap.quickTo(trail, "y", { duration: 1.1, ease: "expo.out" });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([ring, dot, trail], { opacity: 1, duration: 0.4 });
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      tx(e.clientX);
      ty(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || prefersReducedMotion()) return;
    const scale = state.variant === "default" ? 1 : state.variant === "view" ? 3.4 : 2.1;
    gsap.to(ring, { scale, duration: 0.7, ease: "expo.out" });
  }, [state.variant]);

  const api = useMemo(() => ({ set, reset }), [set, reset]);

  return (
    <CursorContext.Provider value={api}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
        <div
          ref={trailRef}
          className="absolute -left-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl"
          style={{ background: "color-mix(in oklab, var(--paper) 30%, transparent)" }}
        />
        <div
          ref={ringRef}
          className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/60 opacity-0 mix-blend-difference"
        >
          <span className="text-[3.2px] font-medium uppercase tracking-[0.18em] text-foreground">
            {state.label}
          </span>
        </div>
        <div
          ref={dotRef}
          className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-paper opacity-0"
        />
      </div>
    </CursorContext.Provider>
  );
}
