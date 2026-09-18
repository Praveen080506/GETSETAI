import { motion } from "motion/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { courses } from "@/data/siteContent";
import { EASE } from "@/lib/motion";
import { Button3D } from "@/components/ui/Button3D";
import { ArrowLeft, Clock, GraduationCap, List, MessageCircle, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const Route = createFileRoute("/courses/$slug")({
  component: CourseDetailsPage,
});

function CourseDetailsPage() {
  const { slug } = Route.useParams();
  const { isAuthenticated, enrollInCourse } = useAuth();
  const navigate = useNavigate();
  const course = courses.find((c) => c.slug === slug);

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/auth" });
    return null;
  }

  // Auto-enroll user when they visit course details
  useEffect(() => {
    if (course) {
      enrollInCourse(course.slug, course.title);
    }
  }, [course, enrollInCourse]);

  if (!course) {
    return (
      <div className="grid-field min-h-dvh flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Course Not Found</h1>
          <Link to="/courses" className="mt-4 inline-block text-blue-400 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Hi, I'm interested in enrolling in the ${course.title} course. Please provide more details about enrollment and pricing.`;
  const whatsappNumber = "919202893485"; // Company phone number from contact info
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.cine }}
        >
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="rounded-3xl border border-border bg-card p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
                  {course.category.toLowerCase()}
                </p>
                <h1 className="mt-3 text-4xl tracking-[-0.04em]">{course.title}</h1>
                <p className="mt-4 text-2xl font-bold text-cyan-400">{course.price}</p>
              </div>
              
              <div className="flex gap-4">
                {course.duration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    {course.level}
                  </div>
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE.cine }}
              className="mt-8"
            >
              <h2 className="text-xl font-bold mb-4">About This Course</h2>
              <p className="text-muted-foreground leading-relaxed">
                {course.detailedDescription || course.description}
              </p>
            </motion.div>

            {course.prerequisites && course.prerequisites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE.cine }}
                className="mt-8"
              >
                <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-cyan-400 mt-1">•</span>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {course.curriculum && course.curriculum.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: EASE.cine }}
                className="mt-8"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Curriculum
                </h2>
                <div className="space-y-3">
                  {course.curriculum.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.05, ease: EASE.cine }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE.cine }}
              className="mt-12 pt-8 border-t border-border"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Contact us directly on WhatsApp to enroll in this course and get started on your learning journey. Our team will guide you through the enrollment process.
                </p>
                <Button3D 
                  onClick={() => window.open(whatsappLink, '_blank', 'noopener,noreferrer')}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                  Enroll via WhatsApp
                </Button3D>
                <p className="text-xs text-muted-foreground mt-4">
                  Clicking will open WhatsApp with a pre-filled message about this course
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
