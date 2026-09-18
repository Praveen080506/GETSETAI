import { createFileRoute } from "@tanstack/react-router";
import { contact, locations } from "@/data/siteContent";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Getsetai Innovations" },
      {
        name: "description",
        content:
          "Contact Getsetai Innovations for AI integrations, software solutions, or robotics partnerships.",
      },
      { property: "og:title", content: "Contact — Getsetai Innovations" },
      {
        property: "og:description",
        content: "Reach the Getsetai Innovations team in Bhilai and Bengaluru.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});
function Contact() {
  const [activeMap, setActiveMap] = useState<"Bhilai" | "Bengaluru">("Bhilai");

  const mapSrc =
    activeMap === "Bhilai"
      ? "https://www.google.com/maps?q=Vivekananda+Nagar+Kohka+Bhilai+Chhattisgarh+490023&z=13&output=embed"
      : "https://www.google.com/maps?q=Kodigehalli+Ayappa+Nagar+Bengaluru+Karnataka+560067&z=13&output=embed";

  return (
    <div className="grid-field min-h-dvh px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-360">
        <h1 className="text-huge">Contact</h1>

        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <div className="space-y-12 text-sm text-muted-foreground">
            <div className="space-y-2">
              <a
                href={`mailto:${contact.email}`}
                className="link-underline block text-lg text-foreground"
              >
                {contact.email}
              </a>
              <a href={contact.phoneHref} className="link-underline block text-lg text-foreground">
                {contact.phone}
              </a>
              <p>Available {contact.hours}</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {locations.map((l) => (
                <div key={l.city}>
                  <p className="text-foreground">{l.label}</p>
                  {l.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
            <p className="max-w-sm leading-relaxed">{contact.intro}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-paper/40">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <button
                type="button"
                onClick={() => setActiveMap("Bhilai")}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  activeMap === "Bhilai" ? "bg-foreground text-background" : "bg-transparent"
                }`}
              >
                Bhilai
              </button>
              <button
                type="button"
                onClick={() => setActiveMap("Bengaluru")}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  activeMap === "Bengaluru" ? "bg-foreground text-background" : "bg-transparent"
                }`}
              >
                Bengaluru
              </button>
            </div>
            <iframe
              title="Getsetai location map"
              src={mapSrc}
              className="h-[420px] w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
