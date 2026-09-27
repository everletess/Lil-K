import type { ReactNode } from "react";

export function Tabs<T extends string>({
  tabs, value, onChange, label, size,
}: { tabs: readonly T[]; value: T; onChange: (t: T) => void; label: string; size?: 14 }) {
  return (
    <div className={size === 14 ? "tabs tabs--14" : "tabs"} role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          className="tab"
          aria-selected={t === value}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** Filters are plain text: a mono label and an underlined value. Never chips. */
export function Filter<T extends string>({
  label, value, options, onChange,
}: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <label className="filter">
      <span className="eyebrow">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

/** A set of mutually exclusive text controls, the chosen one in ink with an ink rule. */
export function TextChoice<T extends string>({
  options, value, onChange, label, gap = 20,
}: { options: readonly T[]; value: T | null; onChange: (v: T) => void; label: string; gap?: number }) {
  return (
    <div className="inline" role="group" aria-label={label} style={{ gap }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="text-ctl text-ctl--quiet"
          style={o === value ? undefined : { borderBottomColor: "transparent" }}
          aria-pressed={o === value}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Aside({ children, wide, label }: { children: ReactNode; wide?: boolean; label: string }) {
  return (
    <aside className={wide ? "aside aside--300" : "aside"} aria-label={label}>
      {children}
    </aside>
  );
}
