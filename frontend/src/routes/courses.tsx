import { motion } from "motion/react";
import { createFileRoute, Link, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { courses } from "@/data/siteContent";
import { EASE } from "@/lib/motion";
import { Button3D } from "@/components/ui/Button3D";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Getsetai Innovations" },
      {
        name: "description",
        content:
          "Explore hands-on AI, Python, machine learning, and DevOps courses from Getsetai Innovations.",
      },
      { property: "og:title", content: "Courses — Getsetai Innovations" },
      {
        property: "og:description",
        content: "Learn practical AI, software, and tech skills with Getsetai courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/courses" }],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCourseDetailPage = pathname.match(/^\/courses\/[^/]+$/);

  const handleEnrollClick = (courseSlug: string) => {
    if (isAuthenticated) {
      // Navigate to course details page
      navigate({ to: "/courses/$slug", params: { slug: courseSlug } });
    } else {
      // Show login modal
      setShowLoginModal(true);
    }
  };

  const handleAuthClick = () => {
    setShowLoginModal(false);
    setTimeout(() => {
      navigate({ to: "/auth" });
    }, 100);
  };

  return (
    <>
      <Outlet />
      
      {/* Only show course listing when not on a specific course page */}
      {!isCourseDetailPage && (
        <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
          <div className="mx-auto max-w-360">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE.cine }}
              className="text-huge"
            >
              courses
            </motion.h1>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, index) => (
                <motion.article
                  key={course.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: EASE.cine }}
                  className="rounded-3xl border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
                        {course.category.toLowerCase()}
                      </p>
                      <h2 className="mt-3 text-2xl tracking-[-0.04em]">{course.title}</h2>
                    </div>
                    <span className="text-sm font-medium text-foreground">{course.price}</span>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>

                  <div className="mt-8">
                    <Button3D onClick={() => handleEnrollClick(course.slug)} size="sm">
                      Enroll Now
                    </Button3D>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onAuth={handleAuthClick}
      />
    </>
  );
}
