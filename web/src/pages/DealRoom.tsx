import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { NotForThisRing, Shell } from "../components/Shell";
import { Tabs } from "../components/controls";
import { RingLabel, Rum, StageGate } from "../components/marks";
import { CURATED_LINE, DEAL_ROOMS, deal as findDeal, family } from "../data/data";
import { ringVisible } from "../data/access";
import { STAGES, dayMonth, daysFromToday, isDecisionSoon, money } from "../data/format";
import type { Deal } from "../data/types";
import { useViewer } from "../viewer";

const TABS = ["Memo", "Data Room", "Diligence", "Syndicate", "Decision", "History"] as const;
type Tab = (typeof TABS)[number];

function tabFromParam(p: string | null): Tab {
  return TABS.find((t) => t.toLowerCase().replace(" ", "-") === p) ?? "Memo";
}

export default function DealRoom() {
  const { id } = useParams();
  const { viewer } = useViewer();
  const d = findDeal(id);
  if (!d) return <NotForThisRing sentence="There is no deal at this address." />;
  if (!ringVisible(d.ring, viewer)) return <NotForThisRing sentence="This deal is held closer to the centre of the circle than your ring." />;
  return <Room d={d} />;
}

function Room({ d }: { d: Deal }) {
  const [params, setParams] = useSearchParams();
  const tab = tabFromParam(params.get("tab"));
  const setTab = (t: Tab) => setParams({ tab: t.toLowerCase().replace(" ", "-") }, { replace: true });
  const [acted, setActed] = useState(false);
  const room = DEAL_ROOMS[d.id];
  const lead = family(d.leadFamilyId);
  const stage = STAGES.find((s) => s.id === d.stage)!;
  const days = d.decisionDate ? daysFromToday(d.decisionDate) : null;
  const primaryLabel = !lead ? "Take the lead" : room?.primary ?? "Ask to join the syndicate";

  return (
    <Shell>
      <main className="main" style={{ padding: "40px 48px 64px", display: "block" }}>
        <div className="stack gap-32">
          <header className="stack gap-20" style={{ borderBottom: "1px solid var(--cc-divider)", paddingBottom: 28 }}>
            <div className="eyebrow">
              <Link to="/deals">Deal Book</Link> · {stage.label}
            </div>
            <div className="inline between start gap-40 wrap">
              <div className="stack gap-12">
                <h1 className="serif-40">{d.name}</h1>
                <div className="inline wrap t14 sec" style={{ gap: 28 }}>
                  <span>{d.center} · {d.structure}{d.corridor ? ` · ${d.corridor}` : ""}</span>
                  <span>Lead: {lead ? lead.name : "sought"}</span>
                  <span>Owner: {d.owner}</span>
                  <RingLabel ring={d.ring} />
                </div>
              </div>
              <div className="stack gap-12 end">
                {d.decisionDate && (
                  <div className={`num-14 ${isDecisionSoon(d.decisionDate) ? "ox" : "ink"}`}>
                    Decision {dayMonth(d.decisionDate)} · {days} days
                  </div>
                )}
                {acted ? (
                  <p className="notice" style={{ margin: 0 }}>
                    {lead && room?.primary
                      ? `${room.primary.replace("Soft-circle", "Soft-circle of")} sent to the lead family's office.`
                      : "Sent to the gate owner. You will hear within two days."}
                  </p>
                ) : (
                  <button type="button" className="btn btn-primary btn--sm" onClick={() => setActed(true)}>{primaryLabel}</button>
                )}
              </div>
            </div>
            <div style={{ maxWidth: 640 }}>
              <StageGate current={d.stage} dates={room?.stageDates} width={156} />
            </div>
          </header>

          <div className="with-aside">
            <div className="grow stack gap-28">
              <Tabs tabs={TABS} value={tab} onChange={setTab} label="Deal room" size={14} />
              <div role="tabpanel" aria-label={tab}>
                <TabBody tab={tab} d={d} />
              </div>
            </div>

            <aside className="aside aside--300" aria-label="Who we know here">
              <h2 className="eyebrow">Who we know here</h2>
              {room && room.knowHere.length > 0 ? (
                <>
                  {room.knowHere.map((k) => (
                    <div key={k.name} className="stack gap-6" style={{ paddingBottom: 16, borderBottom: "1px solid var(--cc-hairline)" }}>
                      <div className="baseline between gap-12">
                        <div className="serif-20">{k.name}</div>
                        <Rum strength={k.rum} />
                      </div>
                      <div className="t14 sec">{k.note}</div>
                    </div>
                  ))}
                  <div className="stack gap-8" style={{ paddingTop: 4 }}>
                    <h3 className="eyebrow">Warmest route</h3>
                    <p className="t14 lh16" style={{ margin: 0 }}>{room.warmestRoute}</p>
                    <button type="button" className="btn btn-secondary btn--sm" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                      Request the introduction
                    </button>
                  </div>
                </>
              ) : (
                <p className="t14 sec" style={{ margin: 0 }}>Nobody in your circle has been mapped to this deal yet.</p>
              )}
            </aside>
          </div>
        </div>
      </main>
    </Shell>
  );
}

function TabBody({ tab, d }: { tab: Tab; d: Deal }) {
  const room = DEAL_ROOMS[d.id];
  if (!room) {
    const lead = family(d.leadFamilyId);
    return (
      <div className="stack gap-24" style={{ maxWidth: 660 }}>
        <p className="t15 lh175" style={{ margin: 0 }}>{d.fit}</p>
        <p className="t14 sec" style={{ margin: 0 }}>
          {lead ? `${capitalise(lead.name)} has not published this section yet.` : "This section opens once a family takes the lead."}
        </p>
        <div className="curated">{CURATED_LINE}</div>
      </div>
    );
  }

  switch (tab) {
    case "Memo":
      return (
        <div className="stack gap-24" style={{ maxWidth: 660 }}>
          <div className="eyebrow">{room.memoRevised}</div>
          <p className="t20" style={{ margin: 0, maxWidth: 620 }}>{room.lead}</p>
          {room.memo.map((p) => (
            <p key={p.slice(0, 20)} className="t15 lh175" style={{ margin: 0 }}>{p}</p>
          ))}
          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, padding: "20px 0",
              borderTop: "1px solid var(--cc-hairline)", borderBottom: "1px solid var(--cc-hairline)",
            }}
          >
            {room.figures.map(([k, v]) => (
              <div key={k} className="stack gap-5">
                <span className="eyebrow">{k}</span>
                <span className="num-20">{money(v)}</span>
              </div>
            ))}
          </div>
          <div className="curated">{CURATED_LINE}</div>
        </div>
      );

    case "Data Room":
      return (
        <div className="stack gap-16" style={{ maxWidth: 760 }}>
          <div className="table">
            <div className="row-head" style={{ gridTemplateColumns: "2.4fr 1fr .8fr 1.6fr .6fr" }}>
              <div>Document</div><div>Kind</div><div>Added</div><div>By</div><div>Ring</div>
            </div>
            {room.dataRoom.length === 0 && <p className="empty">Nothing in the data room yet. The founders' materials arrive once a family takes the lead.</p>}
            {room.dataRoom.map((doc) => (
              <div key={doc.name} className="row row--link" style={{ gridTemplateColumns: "2.4fr 1fr .8fr 1.6fr .6fr" }} tabIndex={0}>
                <div className="t15 w500">{doc.name}</div>
                <div className="t14 sec">{doc.kind}</div>
                <div className="num sec">{dayMonth(doc.added)}</div>
                <div className="t14 ink">{doc.by}</div>
                <div className="mono">RING {doc.ring}</div>
              </div>
            ))}
          </div>
          <p className="t14 sec" style={{ margin: 0 }}>Documents open in the system and are not downloaded. Every opening is logged.</p>
        </div>
      );

    case "Diligence":
      return (
        <div className="stack" style={{ maxWidth: 660 }}>
          {room.threads.length === 0 && <p className="t14 sec" style={{ margin: 0 }}>No diligence threads yet. They open when the lead family invites experts from the circle.</p>}
          {room.threads.map((t) => (
            <article key={t.name} className="stack gap-10" style={{ padding: "22px 0", borderBottom: "1px solid var(--cc-hairline)" }}>
              <div className="baseline between gap-20">
                <h3 className="serif-20">{t.name}</h3>
                <span className="mono">{dayMonth(t.date)}</span>
              </div>
              <div className="t14 sec">{t.role}</div>
              <p className="t15" style={{ margin: 0, lineHeight: 1.7 }}>{t.body}</p>
              {t.open && <div className="t14 ox">Open question for the lead family</div>}
            </article>
          ))}
        </div>
      );

    case "Syndicate":
      return (
        <div className="table" style={{ maxWidth: 700 }}>
          <div className="row-head" style={{ gridTemplateColumns: "2fr 1fr 1fr .8fr" }}>
            <div>Family</div><div>Soft-circled</div><div>Allocation</div><div>Status</div>
          </div>
          {room.syndicate.length === 0 && <p className="empty">No family has soft-circled yet.</p>}
          {room.syndicate.map((s) => (
            <Link key={s.familyId} to={`/families/${s.familyId}`} className="row row--link" style={{ gridTemplateColumns: "2fr 1fr 1fr .8fr" }}>
              <div className="serif-17">{family(s.familyId)!.name}</div>
              <div className="num ink">{money(s.soft)}</div>
              <div className="num sec">{s.alloc === null ? "Pending" : money(s.alloc)}</div>
              <div className="t14 ink">{s.status}</div>
            </Link>
          ))}
        </div>
      );

    case "Decision":
      return (
        <div className="stack gap-20" style={{ maxWidth: 760 }}>
          <div className="stack gap-6">
            <p className="t15" style={{ margin: 0 }}>{room.decision.meets}</p>
            <p className="t14 sec" style={{ margin: 0 }}>{room.decision.quorum}</p>
          </div>
          <div className="table">
            <div className="row-head" style={{ gridTemplateColumns: "2fr 1fr .8fr 2fr" }}>
              <div>Investment committee</div><div>Role</div><div>Vote</div><div>Note</div>
            </div>
            {room.decision.votes.length === 0 && <p className="empty">The committee forms once a family leads.</p>}
            {room.decision.votes.map((v) => (
              <div key={v.member} className="row" style={{ gridTemplateColumns: "2fr 1fr .8fr 2fr" }}>
                <div className="serif-17">{v.member}</div>
                <div className="t14 sec">{v.role}</div>
                <div className={`t15 ${v.vote === "Pending" ? "sec" : "w500"}`}>{v.vote}</div>
                <div className="t14 ink">{v.note}</div>
              </div>
            ))}
          </div>
          <div className="curated">{CURATED_LINE}</div>
        </div>
      );

    case "History":
      return (
        <div className="table" style={{ maxWidth: 760 }}>
          {room.history.map((h) => (
            <div key={h.date + h.event} className="row row--flush" style={{ gridTemplateColumns: ".6fr 3fr 1.4fr" }}>
              <div className="num sec">{dayMonth(h.date)}</div>
              <div className="t15 ink">{h.event}</div>
              <div className="t14 sec">{h.by}</div>
            </div>
          ))}
        </div>
      );
  }
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
