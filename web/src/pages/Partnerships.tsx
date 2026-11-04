import { useState } from "react";
import { PageHeader, Shell } from "../components/Shell";
import { TextChoice } from "../components/controls";
import { RingLabel, Rum } from "../components/marks";
import { PARTNER, family } from "../data/data";
import { ringVisible } from "../data/access";
import { dayMonth } from "../data/format";
import {
  CONTRIBUTING, NEEDS, OUTCOMES, PARTICIPATION, PARTNER_INTROS, PROGRAMMING, RESOURCES, RESOURCE_TYPES,
  type PartnerResource, type ResourceType,
} from "../data/partnerships";
import type { Ring } from "../data/types";
import { useViewer } from "../viewer";

export default function Partnerships() {
  const { viewer } = useViewer();
  if (viewer.kind === "partner" || viewer.ring === 0) return <PartnerView asTeam={viewer.kind === "team"} />;
  return <MemberView />;
}

/* --------------------------------------------------------------- partner */

const RES_COLS = "1.1fr 3fr 1fr 1.6fr .9fr";
const NEED_COLS = "1.5fr 3.2fr .7fr 1.1fr";
const PROG_COLS = ".6fr 2.4fr 1fr 1fr 1.8fr";
const INTRO_COLS = "1.6fr 2.2fr 1.2fr .6fr 1.5fr";

function PartnerView({ asTeam }: { asTeam: boolean }) {
  const [resources, setResources] = useState<PartnerResource[]>(RESOURCES);
  const [adding, setAdding] = useState(false);
  const [draftType, setDraftType] = useState<ResourceType>("Research");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftRing, setDraftRing] = useState<Ring>(1);
  const [responded, setResponded] = useState<Record<string, boolean>>({});
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const openNeeds = NEEDS.filter((n) => !n.responded && !responded[n.familyId]).length;
  const counts: Record<string, string> = {
    contribute: `${resources.length} items`,
    needs: `${openNeeds} open`,
    convene: `${PROGRAMMING.length} this season`,
    introductions: `${PARTNER_INTROS.length} in motion`,
    contributing: `${CONTRIBUTING.length} priorities`,
    outcomes: `${OUTCOMES[0].value} relationships`,
  };

  function submitDraft() {
    if (!draftTitle.trim()) return;
    setResources([
      {
        id: `draft-${resources.length}`, partnerId: "northgate", type: draftType, title: draftTitle.trim(),
        center: "Awaiting review", ring: draftRing, status: "In review", date: "2026-09-14", reach: "With the Advanced Team",
      },
      ...resources,
    ]);
    setDraftTitle("");
    setAdding(false);
  }

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="stack gap-40">
          <PageHeader title="Partnerships & Resources" subline={`${PARTNER.name} · ${PARTNER.subline}`} />

          {asTeam && (
            <p className="t14 sec" style={{ margin: "-20px 0 0" }}>Shown as {PARTNER.name} sees it.</p>
          )}

          <section className="stack gap-20" aria-label="How you take part">
            <p className="t20 ink" style={{ margin: 0, maxWidth: 760 }}>
              Your expertise reaches families where they have asked for it. Relationships, opportunities and pipeline
              come back, and every one is counted.
            </p>
            <ol className="participation">
              {PARTICIPATION.map((p) => (
                <li key={p.id}>
                  <a href={`#${p.id}`}>
                    <span className="eyebrow">{p.n}</span>
                    <span className="t15 ink w500">{p.label}</span>
                    <span className="t14 sec lh16">{p.line}</span>
                    <span className="num ink">{counts[p.id]}</span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="t14 sec" style={{ margin: 0 }}>
              Each outcome traces back to the resource, need, session or introduction that produced it.
            </p>
          </section>

          {/* 01 Contribute */}
          <section id="contribute" className="table table-scroll" aria-label="Your resources in the circle">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>01 · Your resources in the circle · {resources.length}</h2>
              <span className="inline gap-20">
                <span className="note">The Advanced Team reviews every item before a family sees it.</span>
                {!adding && (
                  <button type="button" className="btn btn-primary btn--sm" onClick={() => setAdding(true)}>Add a resource</button>
                )}
              </span>
            </div>
            {adding && (
              <form
                className="row row--top"
                style={{ gridTemplateColumns: "1.1fr 3fr 1fr 2.5fr" }}
                onSubmit={(e) => { e.preventDefault(); submitDraft(); }}
              >
                <label className="stack gap-6">
                  <span className="eyebrow">Type</span>
                  <select className="input" style={{ height: 40, padding: "0 10px" }} value={draftType} onChange={(e) => setDraftType(e.target.value as ResourceType)}>
                    {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="stack gap-6">
                  <span className="eyebrow">Title</span>
                  <input
                    className="input" style={{ height: 40, padding: "0 12px" }} autoFocus value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)} placeholder="What families will see"
                  />
                </label>
                <label className="stack gap-6">
                  <span className="eyebrow">Share with</span>
                  <select className="input" style={{ height: 40, padding: "0 10px" }} value={draftRing} onChange={(e) => setDraftRing(Number(e.target.value) as Ring)}>
                    <option value={1}>Close Circle</option>
                    <option value={2}>Larger Network</option>
                  </select>
                </label>
                <div className="inline gap-20" style={{ alignSelf: "end", minHeight: 40 }}>
                  <button type="submit" className="btn btn-secondary btn--sm" disabled={!draftTitle.trim()}>Send for review</button>
                  <button type="button" className="text-ctl" onClick={() => setAdding(false)}>Cancel</button>
                </div>
              </form>
            )}
            <div className="row-head" style={{ gridTemplateColumns: RES_COLS }}>
              <div>Type</div><div>Title</div><div>Shared with</div><div>Reach</div><div>Status</div>
            </div>
            {resources.map((r) => (
              <div key={r.id} className="row" style={{ gridTemplateColumns: RES_COLS }}>
                <div className="t14 sec">{r.type}</div>
                <div className="stack gap-2">
                  <span className="serif-17">{r.title}</span>
                  <span className="t13 sec">{r.center} · {dayMonth(r.date)}</span>
                </div>
                <div><RingLabel ring={r.ring} /></div>
                <div className="t14 ink">{r.reach}</div>
                <div className={r.status === "Published" ? "t14 ink" : "t14 sec"}>{r.status}</div>
              </div>
            ))}
          </section>

          {/* 02 Respond */}
          <section id="needs" className="table table-scroll" aria-label="Family needs open to you">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>02 · Family needs open to you · {openNeeds} open</h2>
              <span className="note">Shown only where a family has opted in to hear from your firm.</span>
            </div>
            <div className="row-head" style={{ gridTemplateColumns: NEED_COLS }}>
              <div>Family</div><div>What they asked</div><div>Asked</div><div></div>
            </div>
            {NEEDS.map((n) => {
              const done = n.responded || responded[n.familyId];
              return (
                <div key={n.familyId} className="row" style={{ gridTemplateColumns: NEED_COLS }}>
                  <div className="stack gap-2">
                    <span className="serif-17">{family(n.familyId)!.name}</span>
                    <span className="t13 sec">{n.center}</span>
                  </div>
                  <div className="t15 ink">{n.need}</div>
                  <div className="num sec">{dayMonth(n.asked)}</div>
                  <div>
                    {done ? (
                      <span className="t14 sec">{n.responded ? `Answered ${dayMonth(n.responded)}` : "Answer sent"}</span>
                    ) : (
                      <button type="button" className="text-ctl text-ctl--affirm" onClick={() => setResponded({ ...responded, [n.familyId]: true })}>
                        Answer this need
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* 03 Convene */}
          <section id="convene" className="table table-scroll" aria-label="Conversations, working groups and programming">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>03 · Conversations, working groups and programming</h2>
              <span className="note">Chosen for your expertise. Families attend because the room is worth it.</span>
            </div>
            <div className="row-head" style={{ gridTemplateColumns: PROG_COLS }}>
              <div>Date</div><div>Programme</div><div>Format</div><div>Families</div><div>Your part</div>
            </div>
            {PROGRAMMING.map((p) => (
              <div key={p.name} className="row" style={{ gridTemplateColumns: PROG_COLS }}>
                <div className="num sec">{dayMonth(p.date)}</div>
                <div className="serif-17">{p.name}</div>
                <div className="t14 sec">{p.kind}</div>
                <div className="t14 ink">{p.families}</div>
                <div className="t14 ink">{p.role}</div>
              </div>
            ))}
          </section>

          {/* 04 Introductions */}
          <section id="introductions" className="table table-scroll" aria-label="Warm introductions">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>04 · Introductions · {PARTNER_INTROS.length}</h2>
              <span className="note">Double opt-in. A family sees your name only after saying yes.</span>
            </div>
            <div className="row-head" style={{ gridTemplateColumns: INTRO_COLS }}>
              <div>With</div><div>Why</div><div>Stage</div><div>Since</div><div>Next</div>
            </div>
            {PARTNER_INTROS.map((i) => {
              const isAccepted = accepted[i.familyId];
              const stage = isAccepted ? "Both agreed" : i.stage;
              return (
                <div key={i.familyId} className="row" style={{ gridTemplateColumns: INTRO_COLS }}>
                  <div className="stack gap-2">
                    <span className="serif-17">{family(i.familyId)!.name}</span>
                    <span className="t13 sec">{i.person}</span>
                  </div>
                  <div className="t15 ink">{i.why}</div>
                  <div className={stage === "Asked for you" ? "t14 ink w500" : "t14 ink"}>{stage}</div>
                  <div className="num sec">{dayMonth(i.date)}</div>
                  <div>
                    {i.stage === "Asked for you" && !isAccepted ? (
                      <button type="button" className="btn btn-secondary btn--sm" onClick={() => setAccepted({ ...accepted, [i.familyId]: true })}>
                        {i.next}
                      </button>
                    ) : (
                      <span className="t14 sec">{isAccepted ? "Samira will make the introduction" : i.next}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* 05 Contributing to */}
          <section id="contributing" className="table table-scroll" aria-label="What you are contributing to">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>05 · What you are contributing to</h2>
              <span className="note">Your priorities for 2026–27, and the relationships each one is building.</span>
            </div>
            <div className="row-head" style={{ gridTemplateColumns: "2.4fr 2.4fr 1.6fr" }}>
              <div>Priority or initiative</div><div>Contributing through</div><div>Families · RUM</div>
            </div>
            {CONTRIBUTING.map((c) => (
              <div key={c.priority} className="row row--top" style={{ gridTemplateColumns: "2.4fr 2.4fr 1.6fr" }}>
                <p className="t15 ink" style={{ margin: 0 }}>{c.priority}</p>
                <p className="t14 sec lh16" style={{ margin: 0 }}>{c.through}</p>
                <div className="stack gap-6">
                  {c.families.map((f) => (
                    <span key={f.familyId} className="inline gap-10 t14 ink">
                      <Rum strength={f.rum} />
                      {family(f.familyId)!.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* 06 Outcomes */}
          <section id="outcomes" className="table table-scroll" aria-label="Outcomes">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>06 · Outcomes since joining</h2>
              <span className="note">Every figure names where it came from.</span>
            </div>
            {OUTCOMES.map((o) => (
              <div key={o.label} className="row" style={{ gridTemplateColumns: "1.4fr .6fr 3.4fr" }}>
                <div className="t15 ink">{o.label}</div>
                <div className="num-20 ink">{o.value}</div>
                <div className="t14 ink">{o.source}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </Shell>
  );
}

/* ---------------------------------------------------------------- member */

function MemberView() {
  const { viewer } = useViewer();
  const ownOptIn = PARTNER.optedIn.find((o) => o.familyId === viewer.familyId)?.optedIn ?? false;
  const [optIn, setOptIn] = useState<"Opted in" | "Not opted in">(ownOptIn ? "Opted in" : "Not opted in");
  const published = RESOURCES.filter((r) => r.status === "Published" && ringVisible(r.ring, viewer));

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="stack gap-40">
          <PageHeader
            title="Partnerships & Resources"
            subline="Firms the circle has chosen to work with, what they bring, and whether they hear from your family."
          />

          <section className="table table-scroll" aria-label="Partners in the circle">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>Partners in the circle · 1</h2>
              <span className="note">A partner sees your family's needs only after you opt in. You can withdraw at any time.</span>
            </div>
            <div className="row" style={{ gridTemplateColumns: "2fr 2.6fr 1.6fr" }}>
              <div className="stack gap-2">
                <span className="serif-17">{PARTNER.name}</span>
                <span className="t13 sec">Founding Partner · The Business of Families · The Assets of Families</span>
              </div>
              <div className="t15 ink">Corridor banking, succession and carve-outs, cross-border custody.</div>
              <TextChoice options={["Opted in", "Not opted in"] as const} value={optIn} onChange={setOptIn} label="Your family's engagement" />
            </div>
          </section>

          <section className="table table-scroll" aria-label="Resources from partners">
            <div className="band band--split">
              <h2 className="eyebrow" style={{ margin: 0 }}>Resources from partners · {published.length}</h2>
              <span className="note">Reviewed by the Advanced Team before they reach you.</span>
            </div>
            {published.map((r) => (
              <div key={r.id} className="row" style={{ gridTemplateColumns: "1.1fr 3.4fr 1.4fr .8fr" }}>
                <div className="t14 sec">{r.type}</div>
                <div className="stack gap-2">
                  <span className="serif-17">{r.title}</span>
                  <span className="t13 sec">{PARTNER.name} · {r.center}</span>
                </div>
                <div><RingLabel ring={r.ring} /></div>
                <div className="num sec">{dayMonth(r.date)}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </Shell>
  );
}
