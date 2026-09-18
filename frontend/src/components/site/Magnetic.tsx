import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCursorProps } from "@/components/site/CursorProvider";
import { cn } from "@/lib/utils";

type BaseProps = {
  children: ReactNode;
  className?: string;
  cursorLabel?: string;
  strength?: number;
};

const shell =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-border px-8 py-4 text-sm text-foreground transition-colors duration-500";

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
      />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-background">
        {children}
      </span>
    </>
  );
}

export function MagneticLink({
  to,
  children,
  className,
  cursorLabel = "Open",
  strength = 0.3,
}: BaseProps & { to: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(strength);
  const cursor = useCursorProps(cursorLabel);
  return (
    <Link ref={ref} to={to} className={cn(shell, className)} {...cursor}>
      <Inner>{children}</Inner>
    </Link>
  );
}

export function MagneticButton({
  children,
  className,
  cursorLabel = "Click",
  strength = 0.3,
  type = "button",
  disabled,
}: BaseProps & { type?: "button" | "submit"; disabled?: boolean }) {
  const ref = useMagnetic<HTMLButtonElement>(strength);
  const cursor = useCursorProps(cursorLabel);
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(shell, "disabled:opacity-50", className)}
      {...cursor}
    >
      <Inner>{children}</Inner>
    </button>
  );
}

export function MagneticAnchor({
  href,
  children,
  className,
  cursorLabel = "Open",
  strength = 0.3,
}: BaseProps & { href: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(strength);
  const cursor = useCursorProps(cursorLabel);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(shell, className)}
      {...cursor}
    >
      <Inner>{children}</Inner>
    </a>
  );
}
