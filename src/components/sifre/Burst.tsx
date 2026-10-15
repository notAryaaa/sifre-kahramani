const SPARKS = 10;

// A one-shot ring of sparks. Remount it (change its key) to play it again.
export function Burst({ distance = 64, className = "" }: { distance?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}>
      {Array.from({ length: SPARKS }, (_, i) => (
        <span
          key={i}
          className={`animate-burst absolute h-2 w-2 rounded-full ${i % 3 === 0 ? "bg-amber" : i % 3 === 1 ? "bg-cyan" : "bg-violet"}`}
          style={
            {
              "--a": `${(360 / SPARKS) * i}deg`,
              "--d": `-${distance + (i % 2) * 14}px`,
              animationDelay: `${(i % 4) * 25}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
