import { Link, useRouterState } from "@tanstack/react-router";
import { BrandIdentity } from "@/components/site/Nav";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { company, footerNav, socialLinks } from "@/data/siteContent";

export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm px-5 py-12 md:px-10 mt-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start">
          {/* Left Section - Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <BrandIdentity theme="dark" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {company.description}
            </p>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerNav.company.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerNav.resources.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Bottom - Social Icons & Copyright */}
          <div className="flex flex-col md:items-end justify-end h-full pt-4 md:pt-0 self-end space-y-3">
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon =
                  social.label === "Instagram"
                    ? Instagram
                    : social.label === "LinkedIn"
                      ? Linkedin
                      : social.label === "WhatsApp"
                        ? MessageCircle
                        : Instagram;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/30 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* Copyright text under social icons */}
            <p className="text-xs text-muted-foreground md:text-right">
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
