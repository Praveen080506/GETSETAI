import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { JobListing } from "@/data/careers";

export function MagneticJobCard({ job, index }: { job: JobListing; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);
  const translateX = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  const translateY = useSpring(useTransform(y, [-0.5, 0.5], [-8, 8]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="perspective-[1000px]"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, x: translateX, y: translateY, transformStyle: "preserve-3d" }}
        className="pill flex flex-col gap-5 border border-white/15 bg-white/10 p-7 text-white shadow-2xl backdrop-blur-xl backdrop-saturate-150 sm:flex-row sm:items-center sm:justify-between"
      >
        <div style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-lg font-medium tracking-tight sm:text-xl">{job.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="pill border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/70">
              {job.type}
            </span>
            <span className="pill border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/70">
              {job.location}
            </span>
          </div>
        </div>

        <a
          href={job.applyHref}
          target="_blank"
          rel="noreferrer"
          style={{ transform: "translateZ(40px)" }}
          className="pill shrink-0 border border-white/30 bg-white px-6 py-2.5 text-center text-sm font-medium text-black hover:opacity-80"
        >
          Apply Now
        </a>
      </motion.div>
    </motion.div>
  );
}
