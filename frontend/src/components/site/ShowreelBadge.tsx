import aiImage from "@/assets/ai.png";

const TEXT = "• GETSETAI Innovations • AI & Tech  ";

/** Rotating circular caption anchored to the bottom-left of the index. */
export function ShowreelBadge() {
  const chars = Array.from(TEXT);
  return (
    <div className="pointer-events-none fixed bottom-6 left-5 z-40 hidden md:block">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Rotating circular text */}
        <div
          className="absolute inset-0 text-muted-foreground"
          style={{ animation: "spin-slow 24s linear infinite" }}
          aria-hidden
        >
          {chars.map((char, i) => (
            <span
              key={`${char}-${i}`}
              className="absolute left-1/2 top-1/2 text-[0.7rem]"
              style={{
                transform: `rotate(${(360 / chars.length) * i}deg) translateY(-3.25rem)`,
                transformOrigin: "0 0",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Center image in the empty space */}
        <div className="relative z-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-black/80 shadow-md">
          <img
            src={aiImage}
            alt="AI Innovation"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <span className="sr-only">Getsetai Innovations — AI &amp; Tech</span>
    </div>
  );
}
