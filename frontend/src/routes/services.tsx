import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

type ServiceTag = "Technology" | "Growth" | "Education";

type Service = {
  tag: ServiceTag;
  title: string;
  description: string;
};

const ACCENT_BY_TAG: Record<ServiceTag, string> = {
  Technology: "var(--color-foreground)",
  Growth: "var(--muted-foreground)",
  Education: "var(--muted-foreground)",
};

const SERVICES: Service[] = [
  {
    tag: "Education",
    title: "Technical Seminar",
    description:
      "Hands-on sessions that translate complex technology into practical, usable knowledge for your team.",
  },
  {
    tag: "Technology",
    title: "AI Driven Software Solutions",
    description:
      "Custom software powered by machine learning, built to automate work and surface better decisions.",
  },
  {
    tag: "Technology",
    title: "Website Development — Full Stack",
    description:
      "End-to-end web builds, from interface to infrastructure, engineered for speed and scale.",
  },
  {
    tag: "Growth",
    title: "Digital Marketing",
    description:
      "Channel strategy, campaigns and analytics that turn attention into measurable growth.",
  },
  {
    tag: "Growth",
    title: "Social Media Management",
    description:
      "Consistent, on-brand presence across platforms — planned, published and tracked for you.",
  },
  {
    tag: "Technology",
    title: "Robotics",
    description:
      "Robotic systems design and automation engineering for real-world operational challenges.",
  },
  {
    tag: "Education",
    title: "Enhanced Courses",
    description:
      "Structured learning tracks designed to build in-demand technical skills from the ground up.",
  },
];

const LEGEND: { label: ServiceTag; color: string }[] = [
  { label: "Technology", color: "var(--foreground)" },
  { label: "Growth", color: "var(--muted-foreground)" },
  { label: "Education", color: "var(--muted-foreground)" },
];

function ServicesPage() {
  const revealRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const targets = revealRefs.current.filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add("in-view"), i * 60);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  return (
    <div className="services-page">
      <style>{`
        .services-page {
          --bg: var(--background);
          --card: rgba(255, 255, 255, 0.02);
          --line: var(--border);
          --text: var(--foreground);
          --dim: var(--muted-foreground);
          --bg-alt: rgba(255, 255, 255, 0.015);

          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-sans);
        }

        .services-page * {
          box-sizing: border-box;
        }

        .services-page .grid-backdrop {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
          background-size: var(--grid-size) var(--grid-size);
          opacity: 0.7;
          pointer-events: none;
        }

        .services-page .glow-orb {
          position: fixed;
          inset: auto auto 0 50%;
          width: min(70vw, 820px);
          height: min(70vw, 820px);
          border-radius: 50%;
          transform: translateX(-50%) translateY(40%);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 60%);
          filter: blur(72px);
          opacity: 0.5;
          z-index: 0;
          pointer-events: none;
        }

        .services-page .services-main {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 96px 32px 120px;
        }

        .services-page .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          opacity: 0;
          animation: rise 0.7s ease forwards 0.05s;
        }

        .services-page .eyebrow .pulse-line {
          position: relative;
          width: 42px;
          height: 1px;
          background: var(--border);
          overflow: hidden;
        }

        .services-page .eyebrow .pulse-line::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--foreground), transparent);
          transform: translateX(-100%);
          animation: travel 2.4s linear infinite;
        }

        @keyframes travel {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .services-page h1 {
          margin: 26px 0 0;
          font-family: var(--font-display);
          font-weight: 400;
          letter-spacing: -0.04em;
          line-height: 0.98;
          font-size: clamp(2.7rem, 7vw, 5.5rem);
          opacity: 0;
          animation: rise 0.8s ease forwards 0.15s;
        }

        .services-page h1 span {
          color: var(--foreground);
        }

        .services-page .subhead {
          margin-top: 22px;
          max-width: 620px;
          font-size: 1.06rem;
          line-height: 1.65;
          color: var(--muted-foreground);
          opacity: 0;
          animation: rise 0.8s ease forwards 0.3s;
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .services-page .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
          margin-top: 40px;
          padding-top: 28px;
          border-top: 1px solid var(--border);
          opacity: 0;
          animation: rise 0.8s ease forwards 0.42s;
        }

        .services-page .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }

        .services-page .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--foreground);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
        }

        .services-page .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 22px;
          margin-top: 64px;
        }

        .services-page .card {
          position: relative;
          padding: 28px 24px 24px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
          opacity: 0;
          transform: translateY(28px);
          transition:
            transform 0.45s var(--ease-cine),
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            filter 0.35s ease;
          animation: cardFloat 6s ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }

        .services-page .card.in-view {
          animation: cardRise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, cardFloat 6s ease-in-out infinite;
          animation-delay: 0s, calc(var(--delay, 0s) + 0.8s);
        }

        @keyframes cardRise {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        .services-page .card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow: 0 20px 32px -30px rgba(0, 0, 0, 0.7);
          filter: brightness(1.04);
          animation-play-state: paused;
        }

        .services-page .card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 30%, transparent 70%, rgba(255, 255, 255, 0.04));
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .services-page .card:hover::before {
          opacity: 1;
        }

        .services-page .card-top {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          margin-bottom: 22px;
        }

        .services-page .tag {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.01);
          color: var(--muted-foreground);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }

        .services-page .card:hover .tag {
          color: var(--foreground);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }

        .services-page .card h3 {
          margin: 0 0 10px;
          font-size: 1.22rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
          font-weight: 500;
          color: var(--foreground);
        }

        .services-page .card p {
          margin: 0;
          color: var(--muted-foreground);
          line-height: 1.7;
          font-size: 0.94rem;
        }

        .services-page .cta-wrap {
          display: flex;
          justify-content: center;
          margin-top: 72px;
          opacity: 0;
        }

        .services-page .cta-wrap.in-view {
          animation: rise 0.8s ease forwards;
        }

        .services-page .cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 190px;
          padding: 16px 28px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.02);
          color: var(--foreground);
          font-size: 0.95rem;
          font-weight: 500;
          transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 0 rgba(255, 255, 255, 0);
        }

        .services-page .cta-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.12) 50%, transparent 100%);
          transform: translateX(-130%);
          transition: transform 0.7s ease;
        }

        .services-page .cta-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 16px 28px -20px rgba(255, 255, 255, 0.2);
        }

        .services-page .cta-btn:hover::before {
          transform: translateX(130%);
        }

        @media (max-width: 640px) {
          .services-page .services-main {
            padding: 64px 20px 88px;
          }

          .services-page .services-grid {
            margin-top: 48px;
          }
        }
      `}</style>

      <div className="grid-backdrop" />
      <div className="glow-orb" />

      <main className="services-main">
        <div className="eyebrow">
          <span className="pulse-line" />
          What we do
        </div>

        <h1>
          Our <span>Services</span>
        </h1>

        <p className="subhead">
          We provide cutting-edge technological solutions to propel your business forward —
          across technology, growth and education.
        </p>

        <div className="legend">
          {LEGEND.map((item) => (
            <div className="legend-item" key={item.label}>
              <span className="legend-dot" style={{ background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>

        <section className="services-grid">
          {SERVICES.map((service, i) => (
            <article
              className="card"
              key={service.title}
              ref={setRevealRef(i)}
              style={{
                ["--accent" as string]: ACCENT_BY_TAG[service.tag],
                ["--delay" as string]: `${i * 0.08}s`,
              }}
            >
              <div className="card-top">
                <span className="tag">{service.tag}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </section>

        <div className="cta-wrap" ref={setRevealRef(SERVICES.length)}>
          <button className="cta-btn" type="button">
            Discover More <span aria-hidden="true">→</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Getsetai Innovations" },
      {
        name: "description",
        content:
          "Explore the full range of AI, software, marketing, robotics, and seminar services from Getsetai Innovations.",
      },
      { property: "og:title", content: "Services — Getsetai Innovations" },
      {
        property: "og:description",
        content: "AI-driven software, digital marketing, social media, robotics and tech services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});
