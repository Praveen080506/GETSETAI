import { useEffect, useId, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Instagram, Linkedin, MessageCircle, Dribbble, User, LogOut, Mail, X } from "lucide-react";
import { EASE } from "@/lib/motion";
import { useCursorProps } from "@/components/site/CursorProvider";
import { company, contact, socialLinks } from "@/data/siteContent";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:5000';

export function BrandIdentity({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const uniqueId = useId().replace(/:/g, "");
  const gradientId = `logo-g-gradient-${uniqueId}`;
  const glowId = `logo-glow-${uniqueId}`;

  return (
    <div className="group flex shrink-0 select-none items-center gap-3">
      <div className="relative h-9 w-9 shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#0080FF" />
              <stop offset="100%" stopColor="#9D00FF" />
            </linearGradient>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <motion.path
            d="M 76 36 C 70 24 57 16 42 18 C 24 20 12 36 12 55 C 12 74 25 88 44 88 C 61 88 74 76 78 60 C 79 56 76 52 72 52 L 48 52"
            stroke={`url(#${gradientId})`}
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 transition-opacity duration-300 group-hover:opacity-60"
            filter={`url(#${glowId})`}
          />

          <motion.path
            d="M 76 36 C 70 24 57 16 42 18 C 24 20 12 36 12 55 C 12 74 25 88 44 88 C 61 88 74 76 78 60 C 79 56 76 52 72 52 L 48 52"
            stroke={`url(#${gradientId})`}
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0.9 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span
          className={`text-base font-black leading-tight tracking-[0.08em] transition-colors duration-300 ${
            theme === "dark"
              ? "text-white group-hover:text-cyan-400"
              : "text-black group-hover:text-purple-700"
          }`}
        >
          GETSETAI
        </span>
        <span
          className={`mt-0.5 text-[9px] font-bold uppercase leading-none tracking-[0.24em] transition-colors duration-300 ${
            theme === "dark"
              ? "text-zinc-400 group-hover:text-white"
              : "text-zinc-500 group-hover:text-black"
          }`}
        >
          INNOVATIONS
        </span>
      </div>
    </div>
  );
}

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="relative" key="profile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm group"
      >
        <div className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold backdrop-blur-sm border border-white/30 overflow-hidden">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture.startsWith('http') ? user.profilePicture : `${API_URL}${user.profilePicture}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={user.profilePicture ? 'hidden' : ''}>{user.name.charAt(0).toUpperCase()}</span>
        </div>
        <span className="text-white text-sm font-medium hidden sm:block">{user.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              key="dropdown-menu"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 z-50"
            >
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 pb-4 border-b border-white/20 mb-4 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <div className="relative w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm border border-white/30 overflow-hidden">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture.startsWith('http') ? user.profilePicture : `${API_URL}${user.profilePicture}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={user.profilePicture ? 'hidden' : ''}>{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-white/60 text-sm">View Profile</p>
                </div>
              </Link>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <User className="h-4 w-4" />
                  <span>Member since 2026</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors border border-white/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const links = [
  { to: "/courses", label: "Courses" },
  { to: "/team", label: "Team" },
  { to: "/careers", label: "Careers" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

const ICONS = { Instagram, LinkedIn: Linkedin, WhatsApp: MessageCircle, Dribbble } as const;

const socials = socialLinks.map((s) => ({
  ...s,
  Icon: ICONS[s.label as keyof typeof ICONS] ?? Dribbble,
}));

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuCursor = useCursorProps("Menu");
  const { isAuthenticated } = useAuth();
  const theme = "dark";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="fixed left-0 right-0 top-4 z-50 mx-auto w-[95%] max-w-7xl rounded-2xl transition-all duration-500 bg-transparent"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <Link to="/">
            <BrandIdentity theme={theme} />
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated && <ProfileDropdown />}
            
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="pill pointer-events-auto h-11 w-11 bg-paper text-ink hover:opacity-80"
              aria-label="Open menu"
              {...menuCursor}
            >
              <span className="flex flex-col gap-1.25">
                <span className="block h-px w-4 bg-ink" />
                <span className="block h-px w-4 bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-90 bg-background/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="fixed inset-y-2 right-2 z-95 flex w-[min(38rem,calc(100%-1rem))] flex-col justify-between rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl backdrop-saturate-150 md:p-12"
              initial={{ x: "105%" }}
              animate={{ x: 0 }}
              exit={{ x: "105%" }}
              transition={{ duration: 0.85, ease: EASE.cine }}
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-lg"
                >
                  close
                  <span className="pill h-12 w-12 bg-ink text-paper">
                    <X className="h-4 w-4" />
                  </span>
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {links.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: EASE.cine }}
                  >
                    <Link
                      to={link.to}
                      className="block text-[clamp(2.5rem,6vw,4rem)] leading-[1.15] tracking-[-0.04em] transition-opacity hover:opacity-50"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <a href={`mailto:${contact.email}`} className="link-underline text-sm break-all">
                  {contact.email}
                </a>

                <div className="flex items-center gap-3">
                  {socials.map(({ label, href, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
