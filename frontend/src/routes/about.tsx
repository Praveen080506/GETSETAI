import { createFileRoute } from "@tanstack/react-router";
import portrait from "@/assets/portrait.jpg";
import { company, contact, courses, services } from "@/data/siteContent";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Getsetai Innovations" },
      {
        name: "description",
        content:
          "Getsetai Innovations delivers AI-driven software, full-stack development, and enterprise solutions to clients throughout India.",
      },
      { property: "og:title", content: "About — Getsetai Innovations" },
      {
        property: "og:description",
        content: "AI-driven software, full-stack development and enterprise solutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const timeline = [
  {
    year: "MSME",
    text: "Officially registered under the Ministry of Micro, Small & Medium Enterprises (MSME), Govt. of India.",
  },
  { year: "Licence", text: "UDYAM-CG-05-0057895" },
  { year: "Bhilai", text: "HQ · Innovation Center — Vivekananda Nagar, Kohka, Chhattisgarh." },
  { year: "Bengaluru", text: "Cloud HQ — Kodigehalli, Ayappa Nagar, Karnataka." },
];

const stats = [
  { value: String(services.length), label: "Services" },
  { value: String(courses.length), label: "Courses" },
  { value: "India", label: "Area served" },
];

function About() {
  return (
    <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-360">
        <h1 className="text-huge">about</h1>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-start">
          <img
            src={portrait}
            alt="Getsetai Innovations team portrait placeholder"
            className="aspect-4/5 w-full rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
            width={1200}
            height={1504}
          />
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p className="text-lg leading-snug text-foreground">{company.tagline}</p>
            <p>{company.description}</p>
            <p>{company.welcome}</p>
            <p>
              Talk to the team at{" "}
              <a href={`mailto:${contact.email}`} className="link-underline text-foreground">
                {contact.email}
              </a>
              . Available {contact.hours}.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl text-foreground">{s.value}</p>
                  <p className="mt-1 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-24 border-t border-border">
          {timeline.map((t) => (
            <li key={t.year} className="flex gap-8 border-b border-border py-7">
              <span className="w-20 shrink-0 text-sm text-muted-foreground">{t.year}</span>
              <span className="text-lg leading-snug">{t.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
