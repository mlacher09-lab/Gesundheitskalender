import { phaseColors, phaseOf, type CycleInfo } from "@/lib/cycle";

/** Ring mit einem Segment pro Zyklustag; der heutige Tag ist hervorgehoben. */
export default function CycleRing({ info, size = 200 }: { info: CycleInfo; size?: number }) {
  const r = 84;
  const c = 2 * Math.PI * r;
  const n = info.length;
  const seg = c / n;
  const day = Math.min(info.day, n);
  const angle = ((day - 0.5) / n) * 2 * Math.PI - Math.PI / 2;

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Zyklustag ${info.day} von ${n}`}>
      <g transform="rotate(-90 100 100)">
        {Array.from({ length: n }, (_, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={phaseColors[phaseOf(i + 1, info)]}
            strokeWidth={i + 1 === day ? 0 : 10}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(seg - 7, 1)} ${c}`}
            strokeDashoffset={-(i * seg + 3.5)}
            opacity={i + 1 < day ? 0.45 : 1}
          />
        ))}
      </g>
      <circle
        cx={100 + r * Math.cos(angle)}
        cy={100 + r * Math.sin(angle)}
        r="10"
        fill="var(--card)"
        stroke={phaseColors[info.phase]}
        strokeWidth="5"
      />
      <text x="100" y="92" textAnchor="middle" className="fill-muted" style={{ fontSize: 12, fontWeight: 500 }}>
        Zyklustag
      </text>
      <text x="100" y="130" textAnchor="middle" className="fill-ink" style={{ fontSize: 44, fontFamily: "var(--font-fraunces)" }}>
        {info.day}
      </text>
    </svg>
  );
}
