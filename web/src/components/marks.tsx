import type { Ring, RumStrength, Stage } from "../data/types";
import { STAGES, dayMonth, ringLabel } from "../data/format";

const RUM_WORDS: Record<RumStrength, string> = {
  1: "one degree away",
  2: "known, needs a route",
  3: "warm, recent contact",
  4: "working together now",
};

/** RUM™ mark: four 6×3px segments, 2px gap, brass when filled. */
export function Rum({ strength }: { strength: RumStrength }) {
  return (
    <span className="rum" role="img" aria-label={`Relationship strength ${strength} of 4, ${RUM_WORDS[strength]}`}>
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className={i <= strength ? "on" : undefined} />
      ))}
    </span>
  );
}

export function RingLabel({ ring, plain, boxed }: { ring: Ring; plain?: boolean; boxed?: boolean }) {
  const cls = ["ring-label", plain && "ring-label--plain", boxed && "ring-label--boxed"].filter(Boolean).join(" ");
  return <span className={cls}>{ringLabel(ring)}</span>;
}

/** Four hairline segments. Completed stages ink, current oxblood, future hairline. */
export function StageGate({
  current, dates, width = 150,
}: { current: Stage; dates?: Partial<Record<Stage, string>>; width?: number }) {
  const idx = STAGES.findIndex((s) => s.id === current);
  return (
    <div className="gate" aria-label={`Stage: ${STAGES[idx].label}`}>
      <div className="gate-bars" aria-hidden="true">
        {STAGES.map((s, i) => (
          <i key={s.id} style={{ width }} className={i < idx ? "done" : i === idx ? "current" : undefined} />
        ))}
      </div>
      <div className="gate-labels">
        {STAGES.map((s, i) => (
          <span key={s.id} style={{ width }} className={i === idx ? "current" : undefined}>
            {s.label}
            {dates?.[s.id] && i < idx ? ` · ${dayMonth(dates[s.id]!)}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
