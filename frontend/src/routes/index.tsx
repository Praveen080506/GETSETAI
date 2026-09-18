import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ShowreelBadge } from "@/components/site/ShowreelBadge";
import { useHydrated } from "@/hooks/useHydrated";
import { EASE } from "@/lib/motion";

const SpiralGallery = lazy(() => import("@/components/site/SpiralGallery"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Getsetai Innovations — Digital Innovation with AI & Tech" },
      {
        name: "description",
        content:
          "AI-driven software, full-stack development, digital marketing, robotics and premium tech courses from Getsetai Innovations.",
      },
      { property: "og:title", content: "Getsetai Innovations — Digital Innovation with AI & Tech" },
      {
        property: "og:description",
        content: "AI-driven software, enterprise solutions and premium tech courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const hydrated = useHydrated();

  return (
    <div className="grid-field relative min-h-dvh">
      <ShowreelBadge />

      <h1 className="sr-only">Getsetai Innovations — Services and Courses</h1>

      <motion.div
        key="spiral"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE.cine }}
      >
        <div className="relative h-dvh w-full overflow-hidden">
          {hydrated && (
            <Suspense fallback={null}>
              <SpiralGallery />
            </Suspense>
          )}
        </div>
      </motion.div>

      <p className="pointer-events-none fixed bottom-6 right-5 z-40 hidden text-sm text-muted-foreground md:block">
        AI &amp; Tech — services and courses
      </p>
    </div>
  );
}
