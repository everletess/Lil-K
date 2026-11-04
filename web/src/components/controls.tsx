import type { ReactNode } from "react";
import { CENTERS } from "../data/format";
import type { Center } from "../data/types";

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

/* ------------------------------------------------------------ sortable tables */

export type SortState<K extends string> = { key: K; dir: "asc" | "desc" };

/** Sorts rows by the chosen column. Each column supplies the value to compare. */
export function sortRows<T, K extends string>(
  rows: readonly T[], sort: SortState<K> | null, value: Record<K, (row: T) => string | number>,
): T[] {
  if (!sort) return [...rows];
  const get = value[sort.key];
  const sign = sort.dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = get(a), y = get(b);
    const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
    return c * sign;
  });
}

/** A table header whose columns sort when clicked. A column with no key does not sort. */
export function SortHead<K extends string>({
  columns, sort, onSort, cols, gap,
}: {
  columns: { label: string; key?: K }[];
  sort: SortState<K> | null;
  onSort: (s: SortState<K>) => void;
  cols: string;
  gap?: number;
}) {
  return (
    <div className="row-head" style={{ gridTemplateColumns: cols, gap }}>
      {columns.map((c) =>
        c.key ? (
          <button
            key={c.label}
            type="button"
            className="sort-ctl"
            aria-sort={sort && sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
            onClick={() => onSort({ key: c.key!, dir: sort && sort.key === c.key && sort.dir === "asc" ? "desc" : "asc" })}
          >
            {c.label}
            <span aria-hidden="true">{sort && sort.key === c.key ? (sort.dir === "asc" ? " ↑" : " ↓") : ""}</span>
          </button>
        ) : (
          <div key={c.label}>{c.label}</div>
        ),
      )}
    </div>
  );
}

/** The five Centers of Excellence as text toggles. At least one stays chosen. */
export function CenterPicker({ value, onChange, label }: { value: Center[]; onChange: (v: Center[]) => void; label: string }) {
  return (
    <div className="inline wrap" role="group" aria-label={label} style={{ gap: "6px 16px" }}>
      {CENTERS.map((c) => {
        const on = value.includes(c);
        return (
          <button
            key={c}
            type="button"
            className="text-ctl text-ctl--quiet"
            style={on ? undefined : { borderBottomColor: "transparent" }}
            aria-pressed={on}
            onClick={() => {
              if (on && value.length === 1) return;
              onChange(on ? value.filter((v) => v !== c) : CENTERS.filter((x) => x === c || value.includes(x)));
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
