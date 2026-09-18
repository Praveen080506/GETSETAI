import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";
import { useCursorProps } from "@/components/site/CursorProvider";

/** Curved, scroll-reactive title list — the alternate reading of the index. */
export function ListView() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let raf = 0;

    const update = () => {
      raf = requestAnimationFrame(update);
      const rows = host.querySelectorAll<HTMLElement>("[data-row]");
      const mid = window.innerHeight / 2;
      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const d = (rect.top + rect.height / 2 - mid) / mid;
        const clamped = Math.max(-1.4, Math.min(1.4, d));
        const x = Math.sin(clamped * 1.2) * 8;
        const scale = 1 - Math.abs(clamped) * 0.06;
        const opacity = 1 - Math.min(Math.abs(clamped) * 0.55, 0.7);
        row.style.transform = `translate3d(${x}vw,0,0) scale(${scale})`;
        row.style.opacity = `${opacity}`;
      });
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={hostRef} className="relative z-10 py-[45vh]">
      <ul className="flex flex-col items-center gap-2 md:gap-4">
        {projects.map((project) => (
          <li key={project.slug} data-row className="will-change-transform">
            <Row slug={project.slug} title={project.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ slug, title }: { slug: string; title: string }) {
  const cursor = useCursorProps("Open");
  const isCourse = slug.startsWith("course-") || slug.includes("course");
  return isCourse ? (
    <Link
      to="/courses/$slug"
      params={{ slug }}
      className="block whitespace-nowrap text-center text-[clamp(2rem,6.5vw,5.5rem)] font-normal leading-[1.1] tracking-[-0.04em] text-foreground/85 transition-colors duration-500 hover:text-foreground"
      {...cursor}
    >
      {title}
    </Link>
  ) : (
    <Link
      to="/services"
      className="block whitespace-nowrap text-center text-[clamp(2rem,6.5vw,5.5rem)] font-normal leading-[1.1] tracking-[-0.04em] text-foreground/85 transition-colors duration-500 hover:text-foreground"
      {...cursor}
    >
      {title}
    </Link>
  );
}
