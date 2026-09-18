import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CursorProvider } from "@/components/site/CursorProvider";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { EASE } from "@/lib/motion";
import { AuthProvider } from "@/contexts/AuthContext";

function NotFoundComponent() {
  return (
    <div className="grid-field flex min-h-dvh items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <h1 className="text-huge">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          That frame never made the edit. Try the index instead.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full border border-border px-8 py-4 text-sm transition-colors hover:bg-paper hover:text-ink"
        >
          Back to index
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="grid-field flex min-h-dvh items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <h1 className="text-3xl">This page didn&apos;t load</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Something went wrong on our end. Try again or head back to the index.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full border border-border px-8 py-4 text-sm transition-colors hover:bg-paper hover:text-ink"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-8 py-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Getsetai Innovations — Digital Innovation with AI & Tech" },
      {
        name: "description",
        content:
          "Getsetai Innovations delivers AI-driven software, full-stack development, and enterprise solutions to clients throughout India.",
      },
      { name: "author", content: "Getsetai Innovations" },
      { name: "theme-color", content: "#111111" },
      { property: "og:site_name", content: "Getsetai Innovations" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Getsetai Innovations",
          description: "AI-driven software, full-stack development, and enterprise solutions.",
          email: "innovationsgetsetai@gmail.com",
          telephone: "+91 92028 93485",
          areaServed: "IN",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Vivekananda Nagar, Kohka",
            addressLocality: "Bhilai Nagar",
            addressRegion: "Chhattisgarh",
            postalCode: "490023",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const ready = true;

  useSmoothScroll();

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [pathname]);

  // Check if current route is an auth page or the spiral roll page
  const isAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/auth";
  const isSpiralRollRoute = pathname === "/" || pathname === "";
  const shouldShowFooter = !isAuthRoute && !isSpiralRollRoute;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CursorProvider>
          <Nav />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: ready ? 1 : 0, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease: EASE.cine }}
            >
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
            </motion.main>
          </AnimatePresence>
          {shouldShowFooter && <Footer />}
          <Toaster position="bottom-right" />
        </CursorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
