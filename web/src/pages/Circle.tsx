import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, Shell } from "../components/Shell";
import { Filter, Tabs } from "../components/controls";
import { Rum } from "../components/marks";
import { DIRECTORY_RUM, FAMILIES, NEAR_YOU, RUM_FROM, WORKING_GROUPS, family } from "../data/data";
import { ringVisible } from "../data/access";
import { CENTERS, dayMonth } from "../data/format";
import type { Center, Family } from "../data/types";
import { useViewer } from "../viewer";

const FAMILY_COLS = "2.2fr 1fr 2.6fr .6fr 1.1fr .5fr";
const GROUP_COLS = "2.4fr 1.6fr 1fr .8fr";
const VIEWS = ["Families", "Working groups"] as const;

const CENTER_OPTS = ["All five", ...CENTERS] as const;
const CITY_OPTS = ["Any", "New York", "London", "Mumbai", "Stockholm", "Dubai", "Lagos", "Denver", "Munich"] as const;
const GEN_OPTS = ["Any", "G1", "G2", "G3", "G4"] as const;
const INTEREST_OPTS = ["Any", "Water rights", "Hospitality", "Education", "Forestry", "Succession"] as const;
const RING_OPTS = ["1 and closer", "Ring 1 only", "Ring 2 only"] as const;

export function interestsLine(f: Family) {
  const shown = f.interests.slice(0, 3).map((s, i) => (i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s)).join("; ");
  const extra = f.interests.length - 3;
  return extra > 0 ? `${shown}  +${extra}` : shown;
}

export function familyMeta(f: Family) {
  return `${f.cities.join(" / ")} · ${f.generations}`;
}

export default function Circle() {
  const { viewer } = useViewer();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "groups" ? "Working groups" : "Families";
  const [center, setCenter] = useState<(typeof CENTER_OPTS)[number]>("All five");
  const [city, setCity] = useState<(typeof CITY_OPTS)[number]>("Any");
  const [gen, setGen] = useState<(typeof GEN_OPTS)[number]>("Any");
  const [interest, setInterest] = useState<(typeof INTEREST_OPTS)[number]>("Any");
  const [ring, setRing] = useState<(typeof RING_OPTS)[number]>("1 and closer");

  const rumFrom = viewer.familyId ? RUM_FROM[viewer.familyId] : undefined;
  const rumFor = (f: Family) => (viewer.familyId === "whitcombe" ? DIRECTORY_RUM[f.id] : rumFrom?.[f.id] ?? 1);

  const families = useMemo(
    () =>
      FAMILIES.filter((f) => ringVisible(f.ring, viewer))
        .filter((f) => center === "All five" || f.centersOfNeed.includes(center as Center))
        .filter((f) => city === "Any" || f.cities.includes(city))
        .filter((f) => gen === "Any" || f.generations.includes(gen))
        .filter((f) => interest === "Any" || f.interests.some((i) => i.toLowerCase().includes(interest.toLowerCase().split(" ")[0])))
        .filter((f) => ring === "1 and closer" || (ring === "Ring 1 only" ? f.ring <= 1 : f.ring === 2)),
    [viewer, center, city, gen, interest, ring],
  );

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="stack gap-28">
          <PageHeader title="The Circle" subline="Fifty-two families. Nineteen in your city or your Centers." />
          <div className="filters">
            <Filter label="Center" value={center} options={CENTER_OPTS} onChange={setCenter} />
            <Filter label="City" value={city} options={CITY_OPTS} onChange={setCity} />
            <Filter label="Generation" value={gen} options={GEN_OPTS} onChange={setGen} />
            <Filter label="Interest" value={interest} options={INTEREST_OPTS} onChange={setInterest} />
            <Filter label="Ring" value={ring} options={RING_OPTS} onChange={setRing} />
          </div>
          <Tabs
            tabs={VIEWS}
            value={view}
            onChange={(v) => setParams(v === "Families" ? {} : { view: "groups" }, { replace: true })}
            label="Circle view"
          />

          <div className="with-aside with-aside--40">
            <div className="grow table-scroll">
              {view === "Families" ? (
                <div className="table">
                  <div className="row-head" style={{ gridTemplateColumns: FAMILY_COLS }}>
                    <div>Family</div><div>Centers of need</div><div>Investment interests</div><div>Ring</div>
                    <div>Relationship owner</div><div>RUM</div>
                  </div>
                  {families.length === 0 && <p className="empty">No families match these filters.</p>}
                  {families.map((f) => (
                    <div
                      key={f.id}
                      className="row row--link"
                      style={{ gridTemplateColumns: FAMILY_COLS }}
                      role="link"
                      tabIndex={0}
                      onClick={() => navigate(`/families/${f.id}`)}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/families/${f.id}`)}
                    >
                      <div className="stack gap-2">
                        <div className="serif-17">{f.name}</div>
                        <div className="t14 sec">{familyMeta(f)}</div>
                      </div>
                      <div className="t14 ink">{f.centersOfNeed.join(" · ")}</div>
                      <div className="t14 ink" style={{ whiteSpace: "pre-wrap" }}>{interestsLine(f)}</div>
                      <div className="ring-label">RING {f.ring}</div>
                      <div className="t14 sec">{f.relationshipOwner}</div>
                      <div><Rum strength={rumFor(f)} /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="table">
                  <div className="row-head" style={{ gridTemplateColumns: GROUP_COLS }}>
                    <div>Working group</div><div>Center</div><div>Members</div><div>Next session</div>
                  </div>
                  {WORKING_GROUPS.map((w) => (
                    <div key={w.name} className="row row--link" style={{ gridTemplateColumns: GROUP_COLS }} tabIndex={0}>
                      <div className="stack gap-2">
                        <div className="serif-17">{w.name}</div>
                        <div className="t14 sec">{w.conveners}</div>
                      </div>
                      <div className="t14 ink">{w.center}</div>
                      <div className="t14 ink">{w.count}</div>
                      <div className="num ink">{dayMonth(w.next)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="aside" aria-label="Near you this month">
              <h2 className="eyebrow">Near you this month</h2>
              {NEAR_YOU.map((n) => {
                const f = family(n.familyId)!;
                return (
                  <div key={n.familyId} className="aside-item">
                    <Link to={`/families/${f.id}`} className="serif-17">{f.name}</Link>
                    <div className="t14 sec">{n.note}</div>
                  </div>
                );
              })}
            </aside>
          </div>
        </div>
      </main>
    </Shell>
  );
}
