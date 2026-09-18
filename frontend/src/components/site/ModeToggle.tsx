import { cn } from "@/lib/utils";

export type IndexMode = "spiral" | "list";

/** Centred spiral / list switch that sits above the index canvas. */
export function ModeToggle({
  mode,
  onChange,
}: {
  mode: IndexMode;
  onChange: (mode: IndexMode) => void;
}) {
  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-auto">
      <div className="flex items-center gap-3 rounded-full border border-border/40 bg-background/60 px-4 py-1.5 backdrop-blur-md text-sm shadow-sm">
        {(["spiral", "list"] as const).map((value, i) => (
          <span key={value} className="flex items-center gap-3">
            {i === 1 && <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />}
            <button
              type="button"
              onClick={() => onChange(value)}
              className={cn(
                "transition-all duration-300 font-medium capitalize tracking-wider text-xs",
                mode === value
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground/80",
              )}
              aria-pressed={mode === value}
            >
              {value}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
