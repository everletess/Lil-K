import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shell } from "../components/Shell";
import { Filter, SortHead, sortRows, type SortState } from "../components/controls";
import { Rum } from "../components/marks";
import { DEALS, STAGE_OWNERS, family } from "../data/data";
import { visibleDeals } from "../data/access";
import { CENTERS, STAGES, dayMonth, daysFromToday, isDecisionSoon } from "../data/format";
import type { Center, Deal } from "../data/types";
import { useViewer } from "../viewer";

export const DEAL_COLS = "2.2fr 1fr 1.1fr 3.4fr .6fr .8fr .5fr";

const CENTER_OPTS = ["All five", ...CENTERS] as const;
const STRUCTURE_OPTS = ["Any", "Direct", "SPV", "Fund"] as const;
const RING_OPTS = ["1 and closer", "Ring 1 only", "Ring 2 only"] as const;
const DECISION_OPTS = ["Next 90 days", "Next 30 days", "Any"] as const;

type DealSortKey = "name" | "center" | "lead" | "ring" | "decision" | "rum";
const DEAL_SORT: Record<DealSortKey, (d: Deal) => string | number> = {
  name: (d) => d.name,
  center: (d) => `${d.center} ${d.structure}`,
  lead: (d) => family(d.leadFamilyId)?.name.replace(/^the /, "") ?? "~",
  ring: (d) => d.ring,
  decision: (d) => d.decisionDate ?? "9999",
  rum: (d) => d.rum,
};
const DEAL_SORT_LABEL: Record<DealSortKey, string> = {
  name: "Deal", center: "Center", lead: "Lead family", ring: "Ring", decision: "Decision date", rum: "RUM",
};

function structureLine(d: Deal) {
  return d.corridor ? `${d.structure} · ${d.corridor}` : d.structure;
}

export function DealRow({ d, onOpen }: { d: Deal; onOpen: () => void }) {
  const lead = family(d.leadFamilyId);
  return (
    <div
      className="row row--link"
      style={{ gridTemplateColumns: DEAL_COLS }}
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      <div className="serif-17">{d.name}</div>
      <div className="stack gap-2 t13 sec">
        <span>{d.center}</span>
        <span>{structureLine(d)}</span>
      </div>
      <div className="t14 ink">{lead ? lead.name : <span className="tag">Lead sought</span>}</div>
      <div className="t14 ink clamp2">{d.fit}</div>
      <div className="mono">RING {d.ring}</div>
      <div className={`num ${isDecisionSoon(d.decisionDate) ? "ox" : "ink"}`}>
        {d.decisionDate ? dayMonth(d.decisionDate) : "—"}
      </div>
      <div><Rum strength={d.rum} /></div>
    </div>
  );
}

export default function DealBook() {
  const { viewer } = useViewer();
  const navigate = useNavigate();
  const [center, setCenter] = useState<(typeof CENTER_OPTS)[number]>("All five");
  const [structure, setStructure] = useState<(typeof STRUCTURE_OPTS)[number]>("Any");
  const [ring, setRing] = useState<(typeof RING_OPTS)[number]>("1 and closer");
  const [decision, setDecision] = useState<(typeof DECISION_OPTS)[number]>("Next 90 days");

  const deals = useMemo(() => {
    return visibleDeals(DEALS, viewer)
      .filter((d) => center === "All five" || d.center === (center as Center))
      .filter((d) => structure === "Any" || d.structure === structure)
      .filter((d) => ring === "1 and closer" || (ring === "Ring 1 only" ? d.ring <= 1 : d.ring === 2))
      .filter((d) => {
        if (decision === "Any" || !d.decisionDate) return true;
        const days = daysFromToday(d.decisionDate);
        return days <= (decision === "Next 30 days" ? 30 : 90);
      })
      .sort((a, b) => (a.decisionDate ?? "9999").localeCompare(b.decisionDate ?? "9999"));
  }, [viewer, center, structure, ring, decision]);

  const [sort, setSort] = useState<SortState<DealSortKey> | null>(null);
  const sortedDeals = useMemo(() => sortRows(deals, sort, DEAL_SORT), [deals, sort]);

  const groups = STAGES.map((s) => ({ ...s, deals: sortedDeals.filter((d) => d.stage === s.id) })).filter((g) => g.deals.length);

  return (
    <Shell>
      <main className="main">
        <div className="page gap-28">
          <div className="inline between end gap-32" style={{ alignItems: "flex-end" }}>
            <div className="stack gap-6">
              <h1 className="serif-28">Deal Book</h1>
              <p className="t14 sec" style={{ margin: 0 }}>Ten live deals. Five you can act on at Ring 1.</p>
            </div>
            <button type="button" className="btn btn-secondary btn--sm">Submit a deal</button>
          </div>

          <div className="filters filters--ruled">
            <Filter label="Center" value={center} options={CENTER_OPTS} onChange={setCenter} />
            <Filter label="Structure" value={structure} options={STRUCTURE_OPTS} onChange={setStructure} />
            <Filter label="Ring" value={ring} options={RING_OPTS} onChange={setRing} />
            <Filter label="Decision" value={decision} options={DECISION_OPTS} onChange={setDecision} />
            <div className="sec" style={{ marginLeft: "auto" }}>{sort ? `Sorted by ${DEAL_SORT_LABEL[sort.key].toLowerCase()}` : "Sorted by decision date"}</div>
          </div>

          <div className="table-scroll stack gap-28">
            <SortHead
              cols={DEAL_COLS}
              sort={sort}
              onSort={setSort}
              columns={[
                { label: "Deal", key: "name" }, { label: "Center · Structure", key: "center" }, { label: "Lead family", key: "lead" },
                { label: "Why it is in front of you" }, { label: "Ring", key: "ring" }, { label: "Decision", key: "decision" }, { label: "RUM", key: "rum" },
              ]}
            />

            {groups.length === 0 && <p className="empty">No deals match these filters.</p>}

            {groups.map((g) => (
              <section key={g.id} className="table" style={{ marginBottom: 32 }} aria-label={g.label}>
                <div className="group-head">
                  <h2 className="eyebrow ink">{g.label}</h2>
                  <span className="mono">{g.deals.length === 1 ? "1 deal" : `${g.deals.length} deals`}</span>
                  <span className="fill" />
                  <span className="t14 sec">Gate owner {STAGE_OWNERS[g.id]}</span>
                </div>
                {g.deals.map((d) => (
                  <DealRow key={d.id} d={d} onOpen={() => navigate(`/deals/${d.id}`)} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
    </Shell>
  );
}
