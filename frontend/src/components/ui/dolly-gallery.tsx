import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";
import { getLenis } from "@/hooks/useSmoothScroll";

export interface DollyGalleryItem {
  src?: string;
  alt?: string;
  [key: string]: any;
}

export interface DollyGalleryHandle {
  scrollToIndex: (index: number, immediate?: boolean) => void;
  next: () => void;
  prev: () => void;
  getCurrentIndex: () => number;
}

export interface DollyGalleryProps<T = any> {
  items: T[];
  infinite?: boolean;
  itemWidth?: number;
  aspectRatio?: number;
  borderRadius?: number;
  grayscale?: number;
  perspective?: number;
  spacing?: number;
  spread?: number;
  scatter?: number;
  revealRange?: number;
  passRange?: number;
  parallaxX?: number;
  parallaxY?: number;
  parallaxSmooth?: number;
  tilt?: number;
  pulse?: number;
  drift?: number;
  smooth?: number;
  wheelSpeed?: number;
  dragSpeed?: number;
  autoScroll?: number;
  pauseOnHover?: boolean;
  backgroundColor?: string;
  onIndexChange?: (index: number) => void;
  className?: string;
  children?: React.ReactNode;
  renderItem?: (item: T, index: number, isFocused: boolean) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

const modulo = (n: number, m: number) => ((n % m) + m) % m;

const pseudoRandom = (x: number, y: number) => {
  const sin = 43758.5453 * Math.sin(12.9898 * x + 78.233 * y);
  return sin - Math.floor(sin);
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getReducedMotion = () =>
  typeof window !== "undefined"
    ? window.matchMedia(REDUCED_MOTION_QUERY).matches
    : false;

export const DollyGallery = forwardRef<DollyGalleryHandle, DollyGalleryProps>(
  function DollyGallery(
    {
      items = [],
      infinite = true,
      itemWidth = 340,
      aspectRatio = 0.8,
      borderRadius = 24,
      grayscale = 0,
      perspective = 1000,
      spacing = 700,
      spread = 0.75,
      scatter = 0.08,
      revealRange = 2.4,
      passRange = 0.9,
      parallaxX = 0.12,
      parallaxY = 0.06,
      parallaxSmooth = 0.85,
      tilt = 5,
      pulse = 0.03,
      drift = 0.06,
      smooth = 0.85,
      wheelSpeed = 1,
      dragSpeed = 1.2,
      autoScroll = 0,
      pauseOnHover = true,
      backgroundColor = "transparent",
      onIndexChange,
      className,
      children,
      renderItem,
      onItemClick,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const targetScroll = useRef<number>(0);
    const currentScroll = useRef<number>(0);
    const scrollVelocity = useRef<number>(0);
    const driftOffset = useRef<number>(0);
    const animFrameId = useRef<number>(0);
    const isAnimating = useRef<boolean>(false);
    const lastTimestamp = useRef<number>(0);
    const isHovered = useRef<boolean>(false);
    const isIntersecting = useRef<boolean>(true);
    const pointerDrag = useRef<{ y: number; at: number } | null>(null);
    const flingVelocity = useRef<number>(0);
    const targetPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const currentPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const activeIndexRef = useRef<number>(0);
    const [activeStateIndex, setActiveStateIndex] = useState<number>(0);
    const atEndTimestamp = useRef<number>(0);
    const isHoveredCard = useRef<boolean>(false);
    const onIndexChangeRef = useRef(onIndexChange);
    onIndexChangeRef.current = onIndexChange;

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const prefersReducedMotion = useSyncExternalStore(
      subscribeReducedMotion,
      getReducedMotion,
      () => false
    );

    const maxAvailableWidth = Math.max(
      40,
      (dimensions.width || 1200) - 40
    );
    const maxAvailableHeight = Math.max(
      40,
      (dimensions.height || 700) - 40
    );

    let calcWidth = Math.min(itemWidth, maxAvailableWidth);
    let calcHeight = calcWidth / Math.max(0.1, aspectRatio);

    if (dimensions.height > 0 && calcHeight > maxAvailableHeight) {
      calcHeight = maxAvailableHeight;
      calcWidth = Math.min(calcHeight * aspectRatio, maxAvailableWidth);
    }

    const safeItemWidth = Math.max(40, Math.round(calcWidth));
    const safeItemHeight = Math.max(40, Math.round(calcHeight));
    const safeSpacing = Math.max(40, spacing);

    // Expand items for smooth looping if infinite
    const renderedItems = useMemo(() => {
      if (!items.length) return [];
      if (!infinite) {
        return items.map((item, index) => ({ item, originalIndex: index }));
      }
      const repeatCount = Math.max(
        1,
        Math.ceil((Math.ceil(revealRange + passRange) + 3) / items.length)
      );
      const list: { item: any; originalIndex: number }[] = [];
      for (let r = 0; r < repeatCount; r++) {
        items.forEach((item, idx) => {
          list.push({ item, originalIndex: idx });
        });
      }
      return list;
    }, [items, infinite, revealRange, passRange]);

    const totalTrackLength = renderedItems.length * safeSpacing;
    const maxFiniteScroll = Math.max(0, (items.length - 1) * safeSpacing);

    const clampScroll = useCallback(
      (pos: number) => {
        return infinite ? pos : clamp(pos, 0, maxFiniteScroll);
      },
      [infinite, maxFiniteScroll]
    );

    // Resize observer
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const measure = () => {
        const w = el.clientWidth || window.innerWidth || 1200;
        const h = el.clientHeight || 700;
        setDimensions({ width: w, height: h });
      };
      measure();
      const ro = new ResizeObserver(() => {
        measure();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // Intersection observer
    useEffect(() => {
      const el = containerRef.current;
      if (!el || typeof IntersectionObserver === "undefined") return;
      const io = new IntersectionObserver(([entry]) => {
        if (entry) isIntersecting.current = entry.isIntersecting;
      });
      io.observe(el);
      return () => io.disconnect();
    }, []);

    // Render items at calculated positions
    const updateItems = useCallback(
      (scrollVal: number) => {
        if (!renderedItems.length) return;
        const halfLength = totalTrackLength / 2;
        const normalizedVel = clamp(
          Math.abs(scrollVelocity.current) / 2500,
          0,
          1
        );
        const px = currentPointerPos.current.x;
        const py = currentPointerPos.current.y;

        let closestIndex = -1;
        let minDistance = Infinity;

        for (let s = 0; s < renderedItems.length; s++) {
          const cardEl = itemRefs.current[s];
          if (!cardEl) continue;

          const rawPos = s * safeSpacing - scrollVal;
          const pos = infinite
            ? modulo(rawPos + halfLength, totalTrackLength) - halfLength
            : rawPos;
          const step = pos / safeSpacing;

          // Compute opacity / visibility
          const opacity =
            step >= 0
              ? 1 - clamp(step / Math.max(0.01, revealRange), 0, 1)
              : 1 - clamp(-step / Math.max(0.01, passRange), 0, 1);

          if (opacity <= 0.002 || -pos >= 0.95 * perspective) {
            cardEl.style.visibility = "hidden";
            cardEl.style.pointerEvents = "none";
            continue;
          }

          cardEl.style.visibility = "visible";
          const dist = Math.abs(pos);
          const currentCard = renderedItems[s];
          if (dist < minDistance && currentCard) {
            minDistance = dist;
            closestIndex = currentCard.originalIndex;
          }

          // Focused item has pointer-events; background items can still be clicked
          cardEl.style.pointerEvents = opacity > 0.3 ? "auto" : "none";

          // Calculate staggered positioning
          const sign = s % 2 === 0 ? -1 : 1;
          const randSeed = pseudoRandom(s, 1);
          const randY = pseudoRandom(s, 2);

          // Center the focused card, while background cards spread outwards in 3D
          const focusFactor = clamp(Math.abs(pos) / safeSpacing, 0, 1);
          const spreadX = sign * spread * (0.7 + 0.3 * randSeed) * safeItemWidth * focusFactor;
          const scatterY = (2 * randY - 1) * scatter * safeItemHeight * focusFactor;

          const finalX = spreadX + px * parallaxX * safeItemWidth * opacity;
          const finalY =
            scatterY +
            py * parallaxY * safeItemHeight * opacity +
            driftOffset.current * drift * safeItemHeight;

          const scale = 1 + pulse * normalizedVel * opacity;
          const rotX = -py * tilt * normalizedVel * opacity;
          const rotY = px * tilt * normalizedVel * opacity;

          cardEl.style.opacity = opacity.toFixed(3);
          cardEl.style.transform = `translate3d(${finalX.toFixed(
            2
          )}px, ${finalY.toFixed(2)}px, ${(-pos).toFixed(1)}px) rotateX(${rotX.toFixed(
            2
          )}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

          // Dynamic z-index so closer cards sit on top
          const zIndex = Math.round(1000 - pos);
          cardEl.style.zIndex = `${zIndex}`;
        }

        if (
          closestIndex >= 0 &&
          closestIndex !== activeIndexRef.current
        ) {
          activeIndexRef.current = closestIndex;
          setActiveStateIndex(closestIndex);
          onIndexChangeRef.current?.(closestIndex);
        }
      },
      [
        dimensions.height,
        renderedItems,
        totalTrackLength,
        safeSpacing,
        infinite,
        revealRange,
        passRange,
        perspective,
        safeItemWidth,
        safeItemHeight,
        spread,
        scatter,
        parallaxX,
        parallaxY,
        drift,
        pulse,
        tilt,
      ]
    );

    // Main animation loop
    const triggerLoop = useCallback(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      lastTimestamp.current = 0;

      const loop = (timestamp: number) => {
        const dt = lastTimestamp.current
          ? Math.min(0.05, (timestamp - lastTimestamp.current) / 1000)
          : 1 / 60;
        lastTimestamp.current = timestamp;

        const isAutoScrolling =
          autoScroll !== 0 &&
          isIntersecting.current &&
          !(pauseOnHover && isHovered.current) &&
          !pointerDrag.current;

        if (isAutoScrolling) {
          targetScroll.current = clampScroll(
            targetScroll.current + autoScroll * dt
          );
        }

        // Apply fling inertia
        if (Math.abs(flingVelocity.current) > 1) {
          targetScroll.current = clampScroll(
            targetScroll.current + flingVelocity.current * dt
          );
          flingVelocity.current *= Math.pow(0.02, dt);
        } else {
          flingVelocity.current = 0;
        }

        // Lerp scroll
        const scrollRate = 1.5 + (1 - clamp(smooth, 0, 1)) * 30;
        const scrollFactor = prefersReducedMotion
          ? 1
          : 1 - Math.exp(-dt * scrollRate);
        const nextScroll =
          currentScroll.current +
          (targetScroll.current - currentScroll.current) * scrollFactor;
        const delta = nextScroll - currentScroll.current;
        currentScroll.current = nextScroll;

        const speed = prefersReducedMotion ? 0 : delta / dt;
        const velDecay = 1 - Math.exp(-8 * dt);
        scrollVelocity.current += (speed - scrollVelocity.current) * velDecay;
        driftOffset.current +=
          (clamp(-speed / 2500, -1, 1) - driftOffset.current) *
          velDecay *
          0.6;

        // Pointer parallax damping
        const pointerRate = 2 + (1 - clamp(parallaxSmooth, 0, 1)) * 40;
        const pointerFactor = prefersReducedMotion
          ? 1
          : 1 - Math.exp(-dt * pointerRate);
        currentPointerPos.current.x +=
          (targetPointerPos.current.x - currentPointerPos.current.x) *
          pointerFactor;
        currentPointerPos.current.y +=
          (targetPointerPos.current.y - currentPointerPos.current.y) *
          pointerFactor;

        updateItems(currentScroll.current);

        const isStillMoving =
          Math.abs(targetScroll.current - currentScroll.current) > 0.05 ||
          Math.abs(scrollVelocity.current) > 1 ||
          Math.abs(driftOffset.current) > 0.001 ||
          Math.abs(targetPointerPos.current.x - currentPointerPos.current.x) >
            0.001 ||
          Math.abs(targetPointerPos.current.y - currentPointerPos.current.y) >
            0.001 ||
          isAutoScrolling ||
          flingVelocity.current !== 0;

        if (isStillMoving) {
          animFrameId.current = requestAnimationFrame(loop);
        } else {
          currentScroll.current = targetScroll.current;
          scrollVelocity.current = 0;
          driftOffset.current = 0;
          updateItems(currentScroll.current);
          isAnimating.current = false;
        }
      };

      animFrameId.current = requestAnimationFrame(loop);
    }, [
      autoScroll,
      pauseOnHover,
      clampScroll,
      smooth,
      prefersReducedMotion,
      parallaxSmooth,
      updateItems,
    ]);

    // Initial setup
    useEffect(() => {
      targetScroll.current = clampScroll(targetScroll.current);
      currentScroll.current = clampScroll(currentScroll.current);
      updateItems(currentScroll.current);
      triggerLoop();
      return () => {
        cancelAnimationFrame(animFrameId.current);
        isAnimating.current = false;
      };
    }, [clampScroll, updateItems, triggerLoop]);

    // Wheel & Touch event handler to completely isolate gallery scroll from page scroll
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null;
        const isOverCard =
          Boolean(target?.closest?.('[data-dolly-card="true"]')) ||
          isHoveredCard.current;

        // Cards should move ONLY when cursor is hovered over them
        if (!isOverCard) {
          return;
        }

        const factor =
          e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? dimensions.height : 1;
        const prev = targetScroll.current;
        const delta = e.deltaY * factor * wheelSpeed;

        // While cursor is on team members, always isolate scroll and dolly through 3D cards.
        // Even after reaching the start or end member, prevent main page scroll so the box doesn't move.
        e.preventDefault();
        e.stopPropagation();

        targetScroll.current = clampScroll(prev + delta);
        flingVelocity.current = 0;
        triggerLoop();
      };

      const onTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        const isOverCard =
          Boolean(target?.closest?.('[data-dolly-card="true"]')) ||
          isHoveredCard.current;
        if (!isOverCard) return;

        // Lock main page scroll when touching on team cards
        e.preventDefault();
        e.stopPropagation();
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("touchmove", onTouchMove, { passive: false });

      return () => {
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("touchmove", onTouchMove);
      };
    }, [dimensions.height, wheelSpeed, clampScroll, triggerLoop]);

    // Pointer handlers
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const isOverCard =
        Boolean(target?.closest?.('[data-dolly-card="true"]')) ||
        isHoveredCard.current;
      if (!isOverCard) return;

      pointerDrag.current = { y: e.clientY, at: performance.now() };
      flingVelocity.current = 0;
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      targetPointerPos.current.x = clamp(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -1,
        1
      );
      targetPointerPos.current.y = clamp(
        ((e.clientY - rect.top) / rect.height) * 2 - 1,
        -1,
        1
      );

      const drag = pointerDrag.current;
      if (!drag) {
        triggerLoop();
        return;
      }

      const dy = e.clientY - drag.y;
      const now = performance.now();
      const dt = Math.max(1, now - drag.at) / 1000;
      drag.y = e.clientY;
      drag.at = now;

      targetScroll.current = clampScroll(targetScroll.current - dy * dragSpeed);
      flingVelocity.current = (-dy * dragSpeed) / dt;
      triggerLoop();
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerDrag.current) {
        pointerDrag.current = null;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        flingVelocity.current = clamp(flingVelocity.current, -4000, 4000);
        triggerLoop();
      }
    };

    // Keyboard navigation
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const stepMap: Record<string, number> = {
        ArrowDown: safeSpacing,
        ArrowUp: -safeSpacing,
        ArrowRight: safeSpacing,
        ArrowLeft: -safeSpacing,
        PageDown: safeSpacing * 2,
        PageUp: -safeSpacing * 2,
        " ": safeSpacing,
      };
      const delta = stepMap[e.key];
      if (delta !== undefined) {
        e.preventDefault();
        targetScroll.current = clampScroll(targetScroll.current + delta);
        triggerLoop();
      }
    };

    // Public imperative API
    useImperativeHandle(
      ref,
      () => ({
        scrollToIndex: (index: number, immediate: boolean = false) => {
          if (!items.length) return;
          const target = index * safeSpacing;
          targetScroll.current = clampScroll(target);
          if (immediate) {
            currentScroll.current = targetScroll.current;
            flingVelocity.current = 0;
            updateItems(currentScroll.current);
          }
          triggerLoop();
        },
        next: () => {
          targetScroll.current = clampScroll(
            targetScroll.current + safeSpacing
          );
          triggerLoop();
        },
        prev: () => {
          targetScroll.current = clampScroll(
            targetScroll.current - safeSpacing
          );
          triggerLoop();
        },
        getCurrentIndex: () => activeIndexRef.current,
      }),
      [items.length, safeSpacing, clampScroll, updateItems, triggerLoop]
    );

    const cardContainerStyle: React.CSSProperties = {
      width: safeItemWidth,
      height: safeItemHeight,
      left: "50%",
      top: "50%",
      marginLeft: -safeItemWidth / 2,
      marginTop: -safeItemHeight / 2,
      borderRadius,
    };

    return (
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Dolly 3D Gallery"
        tabIndex={0}
        className={cn(
          "relative h-full w-full cursor-default select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50",
          className
        )}
        style={{ backgroundColor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={() => {
          isHovered.current = true;
        }}
        onPointerLeave={() => {
          isHovered.current = false;
          targetPointerPos.current.x = 0;
          targetPointerPos.current.y = 0;
          triggerLoop();
        }}
        onKeyDown={onKeyDown}
      >
        {/* 3D Depth Stage */}
        <div
          className="absolute inset-0 [transform-style:preserve-3d] pointer-events-none"
          style={{ perspective: `${perspective}px` }}
        >
          {renderedItems.map(({ item, originalIndex }, idx) => {
            const isFocused = originalIndex === activeStateIndex;
            return (
              <div
                key={`${originalIndex}-${idx}`}
                data-dolly-card="true"
                ref={(el) => {
                  if (el) itemRefs.current[idx] = el;
                  else delete itemRefs.current[idx];
                }}
                className="invisible absolute overflow-hidden will-change-[transform,opacity] [backface-visibility:hidden] transition-shadow duration-300 cursor-grab active:cursor-grabbing pointer-events-auto"
                style={cardContainerStyle}
                onPointerEnter={() => {
                  isHoveredCard.current = true;
                }}
                onPointerLeave={() => {
                  isHoveredCard.current = false;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick?.(item, originalIndex);
                  // Also dolly to clicked item
                  targetScroll.current = clampScroll(originalIndex * safeSpacing);
                  triggerLoop();
                }}
              >
                {renderItem ? (
                  renderItem(item, originalIndex, isFocused)
                ) : (
                  <img
                    src={typeof item === "string" ? item : item?.src}
                    alt={
                      typeof item === "object"
                        ? item?.alt ?? `Gallery item ${originalIndex + 1}`
                        : `Gallery item ${originalIndex + 1}`
                    }
                    draggable={false}
                    loading="lazy"
                    style={{
                      filter:
                        grayscale > 0
                          ? `grayscale(${clamp(grayscale, 0, 1)})`
                          : undefined,
                    }}
                    className="h-full w-full object-cover rounded-[inherit]"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Overlay content / controls */}
        {children && (
          <div className="pointer-events-none relative z-10 h-full w-full">
            {children}
          </div>
        )}
      </div>
    );
  }
);
