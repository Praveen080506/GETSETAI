import { motion } from "motion/react";
import { createFileRoute } from "@tanstack/react-router";
import { EASE } from "@/lib/motion";
import { careersHero, jobs } from "@/data/careers";
import { MagneticJobCard } from "@/components/careers/MagneticJobCard";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Getsetai Innovations" },
      {
        name: "description",
        content:
          "Join Getsetai Innovations and help build AI, software, digital products, and next-generation solutions.",
      },
      { property: "og:title", content: "Careers — Getsetai Innovations" },
      {
        property: "og:description",
        content:
          "Work with Getsetai Innovations on AI, software, robotics, and digital product initiatives.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <div className="relative min-h-screen bg-background px-5 pb-32 pt-32 text-foreground md:px-12">
      <section className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE.cine }}
          className="pill inline-block border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-tight text-white/80 backdrop-blur-xl"
        >
          {careersHero.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE.cine }}
          className="mt-6 text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.04em]"
        >
          {careersHero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE.cine }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
        >
          {careersHero.description}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE.cine }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {careersHero.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE.cine }}
          className="mt-8"
        >
          <a
            href={careersHero.applyFormHref}
            target="_blank"
            rel="noreferrer"
            className="pill inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper hover:opacity-80"
          >
            <span>✦</span> Apply via Form
          </a>
        </motion.div>
      </section>

      <section className="mx-auto mt-24 flex max-w-3xl flex-col gap-6">
        {jobs.map((job, i) => (
          <MagneticJobCard key={job.title} job={job} index={i} />
        ))}
      </section>
    </div>
  );
}
