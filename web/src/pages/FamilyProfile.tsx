import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NotForThisRing, Shell } from "../components/Shell";
import { TextChoice } from "../components/controls";
import { Rum } from "../components/marks";
import {
  PROFILES, RUM_FROM, archiveItem, deal, family as findFamily, type ArchiveControl, type FamilyProfileData,
} from "../data/data";
import { rightsLabel, ringVisible } from "../data/access";
import { RING_NAMES, dayMonth, dayMonthYear, monthYear } from "../data/format";
import type { Family } from "../data/types";
import { useViewer } from "../viewer";
import { interestsLine } from "./Circle";

const CONTROLS = ["Attributed", "Anonymise", "Withhold"] as const;

function Section({ title, right, children }: { title: string; right?: string; children: React.ReactNode }) {
  return (
    <section className="stack gap-16">
      {right ? (
        <div className="baseline between gap-20" style={{ paddingBottom: 10, borderBottom: "1px solid var(--cc-hairline)" }}>
          <h2 className="eyebrow">{title}</h2>
          <span className="t14 sec">{right}</span>
        </div>
      ) : (
        <h2 className="section-rule">{title}</h2>
      )}
      <div className="stack">{children}</div>
    </section>
  );
}

export default function FamilyProfile() {
  const { id } = useParams();
  const { viewer } = useViewer();
  const f = findFamily(id);
  if (!f) return <NotForThisRing sentence="There is no family at this address." />;
  if (!ringVisible(f.ring, viewer)) return <NotForThisRing sentence="This family is not visible at your ring." />;
  return <Profile f={f} />;
}

function Profile({ f }: { f: Family }) {
  const { viewer } = useViewer();
  const own = viewer.familyId === f.id;
  const p: FamilyProfileData | undefined = PROFILES[f.id];
  const rum = viewer.familyId ? RUM_FROM[viewer.familyId]?.[f.id] : undefined;
  const [asked, setAsked] = useState(false);
  const [controls, setControls] = useState<Record<string, ArchiveControl>>(
    () => Object.fromEntries((p?.archive ?? []).map((a) => [a.archiveId, a.control])),
  );

  const identity = [
    ...f.cities.map((c) => c.toUpperCase()), f.generations, `RING ${f.ring}`,
    f.memberSince ? `${RING_NAMES[f.ring].toUpperCase()} SINCE ${f.memberSince}` : RING_NAMES[f.ring].toUpperCase(),
  ].join(" · ");

  // The route is drawn from the Whitcombe view only.
  const showRoute = !own && viewer.id === "eleanor" && p && p.route.length > 0;

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="with-aside">
          <div className="grow stack gap-40">
            <header className="inline between start gap-32" style={{ paddingBottom: 24, borderBottom: "1px solid var(--cc-divider)" }}>
              <div className="stack gap-10">
                <h1 className="serif-28">{f.name}</h1>
                <div className="mono">{identity}</div>
                <div className="t14 sec">Relationship owner: {f.relationshipOwner}</div>
              </div>
              {!own && (
                <div className="stack gap-8 end">
                  {rum && (
                    <>
                      <div className="mono">RUM FROM YOUR FAMILY</div>
                      <Rum strength={rum} />
                    </>
                  )}
                  {asked ? (
                    <p className="notice" style={{ margin: "8px 0 0" }}>{f.relationshipOwner} will carry the request.</p>
                  ) : (
                    <button type="button" className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setAsked(true)}>
                      Ask for an introduction
                    </button>
                  )}
                </div>
              )}
            </header>

            {p ? (
              <>
                <Section title="Principals">
                  {p.principals.map((pr) => (
                    <div key={pr.name} className="row row--flush" style={{ gridTemplateColumns: "1.4fr 1fr 2.4fr" }}>
                      <div className="serif-17">{pr.name}</div>
                      <div className="t14 sec">{pr.role}</div>
                      <div className="t14 ink">{pr.note}</div>
                    </div>
                  ))}
                </Section>

                <section className="stack gap-16">
                  <h2 className="section-rule">Investment theses</h2>
                  <p className="t15" style={{ margin: 0, lineHeight: 1.7, maxWidth: 660 }}>{p.theses}</p>
                  <div className="inline gap-40">
                    <div className="stack gap-4"><span className="eyebrow">Check size</span><span className="num">{p.checkSize}</span></div>
                    <div className="stack gap-4"><span className="eyebrow">Structures</span><span className="t14">{p.structures}</span></div>
                  </div>
                </section>

                <Section title="Needs by Center · from the Needs Survey">
                  {p.needs.map((n) => (
                    <div key={n.need} className="row row--flush" style={{ gridTemplateColumns: "1.6fr 3fr 1fr" }}>
                      <div className="t14 sec">{n.center}</div>
                      <div className="t15 ink" style={{ lineHeight: 1.5 }}>{n.need}</div>
                      <div className="t14 ink">{n.status}</div>
                    </div>
                  ))}
                </Section>

                <Section title="Deals">
                  {p.deals.map((d) => (
                    <Link key={d.dealId} to={`/deals/${d.dealId}`} className="row row--flush row--link" style={{ gridTemplateColumns: "2.4fr 1.2fr 2fr" }}>
                      <div className="serif-17">{deal(d.dealId)!.name}</div>
                      <div className="t14 ink">{d.role}</div>
                      <div className="t14 sec">{d.meta}</div>
                    </Link>
                  ))}
                </Section>

                <Section title="Introductions made">
                  {p.intros.map((i) => (
                    <div key={i.pair} className="row row--flush" style={{ gridTemplateColumns: "2.6fr 1fr 1.4fr" }}>
                      <div className="t15 w500">{i.pair}</div>
                      <div className="num sec">{dayMonthYear(i.when)}</div>
                      <div className="t14 ink">{i.outcome}</div>
                    </div>
                  ))}
                </Section>

                <Section title="Events attended">
                  {p.events.map((e) => (
                    <div key={e.name + e.date} className="row row--flush" style={{ gridTemplateColumns: ".6fr 2.6fr 2fr" }}>
                      <div className="num sec">{dayMonth(e.date)}</div>
                      <div className="t15 w500">{e.name}</div>
                      <div className="t14 sec">{e.note}</div>
                    </div>
                  ))}
                </Section>

                {own && (
                  <Section
                    title={`In the Archive · conversations attributed to your family · ${p.archiveCount}`}
                    right={`Visible to ${f.name} only.`}
                  >
                    {p.archive.map((a) => {
                      const item = archiveItem(a.archiveId)!;
                      return (
                        <div key={a.archiveId} className="row row--flush" style={{ gridTemplateColumns: "2.8fr .8fr 1.6fr 1.6fr" }}>
                          <div className="serif-17">{item.title}</div>
                          <div className="num sec">{monthYear(item.date)}</div>
                          <div className="mono">{rightsLabel(item)}</div>
                          <TextChoice
                            label={`Attribution for ${item.title}`}
                            options={CONTROLS}
                            value={controls[a.archiveId]}
                            onChange={(v) => setControls({ ...controls, [a.archiveId]: v })}
                            gap={16}
                          />
                        </div>
                      );
                    })}
                  </Section>
                )}
              </>
            ) : (
              <>
                <section className="stack gap-16">
                  <h2 className="section-rule">Investment interests</h2>
                  <p className="t15" style={{ margin: 0, lineHeight: 1.7, maxWidth: 660, whiteSpace: "pre-wrap" }}>{interestsLine(f)}</p>
                </section>
                <section className="stack gap-16">
                  <h2 className="section-rule">Centers of need</h2>
                  <p className="t15" style={{ margin: 0 }}>{f.centersOfNeed.join(" · ")}</p>
                </section>
                <p className="t14 sec" style={{ margin: 0 }}>
                  The rest of this profile is kept by {f.relationshipOwner}; ask them for more.
                </p>
              </>
            )}
          </div>

          {showRoute && (
            <aside className="aside" aria-label="Warmest route">
              <h2 className="eyebrow">Warmest route</h2>
              {p.route.map((h) => (
                <div key={h.name} className="stack gap-6" style={{ paddingBottom: 16, borderBottom: "1px solid var(--cc-hairline)" }}>
                  <div className="serif-17">{h.name}</div>
                  <div className="t14 sec">{h.note}</div>
                  <Rum strength={h.rum} />
                </div>
              ))}
              <p className="t14 sec" style={{ margin: 0 }}>{p.routeNote}</p>
            </aside>
          )}
        </div>
      </main>
    </Shell>
  );
}
