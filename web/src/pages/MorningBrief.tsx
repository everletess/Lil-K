import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "../components/Shell";
import { Rum } from "../components/marks";
import { BRIEF_EVENTS, BRIEF_PENDING, CURATED_LINE, MY_DEALS, deal } from "../data/data";
import { TODAY, ageLabel, dayMonth, isOverdue, longDate } from "../data/format";
import { useViewer } from "../viewer";

type LeadState = { soft: boolean; intro: "open" | "made" | "later" };

function useLeadState() {
  return useState<LeadState>({ soft: false, intro: "open" });
}

export default function MorningBrief() {
  const { viewer } = useViewer();
  const [state, setState] = useLeadState();
  const navigate = useNavigate();

  const myDeals = MY_DEALS.map((m) => ({ ...m, deal: deal(m.dealId)! }));

  return (
    <Shell railClassName="desktop-only">
      <main className="main desktop-only">
        <div className="page page--reading gap-44">
          <header className="stack gap-8">
            <div className="eyebrow">{longDate(TODAY)}</div>
            <h1 className="serif-40">Good morning, {viewer.firstName}.</h1>
            <p className="t15 sec" style={{ margin: 0 }}>Three things today. One needs a decision this month.</p>
          </header>

          <section aria-label="Three things for you today" style={{ borderTop: "1px solid var(--cc-hairline)" }}>
            <article className="lead-item">
              <h2 className="eyebrow">A deal for you</h2>
              <div className="stack gap-10">
                <Link to="/deals/northfield" className="serif-22">Northfield Water Rights Portfolio</Link>
                <p className="t14 ink lh16" style={{ margin: 0, maxWidth: 560 }}>
                  Matches your Land, Water &amp; Power thesis; introduced via Milken. The Whitcombe family leads and holds $18M of $30M.
                </p>
                <div className="eyebrow">Assets · Direct · Ring 1</div>
                <div className="curated">{CURATED_LINE}</div>
              </div>
              <div className="stack gap-12 start">
                <div className="num-14 ox">Decision 26 Sep</div>
                {state.soft ? (
                  <p className="notice" style={{ margin: 0 }}>Soft-circle of $2.5M sent to the Whitcombe office.</p>
                ) : (
                  <button type="button" className="btn btn-primary btn--sm" onClick={() => setState({ ...state, soft: true })}>
                    Soft-circle $2.5M
                  </button>
                )}
                <Link to="/deals/northfield" className="text-ctl text-ctl--ink">Open the deal room</Link>
              </div>
            </article>

            <article className="lead-item">
              <h2 className="eyebrow">An introduction to make</h2>
              <div className="stack gap-10">
                <div className="serif-22">Priya Mehra → Idris Okafor</div>
                <p className="t14 ink lh16" style={{ margin: 0, maxWidth: 560 }}>
                  Priya is recapitalising four hotels and asked for an operator who has run assets in two currencies. You have worked with Idris on the Lagos school trust.
                </p>
                <div className="inline gap-12">
                  <Rum strength={4} />
                  <span className="t13 sec">Both Ring 1 · you are the warmest route</span>
                </div>
              </div>
              <div className="stack gap-12 start">
                <div className="num-14 sec">Asked 11 Sep</div>
                {state.intro === "open" ? (
                  <>
                    <button type="button" className="btn btn-secondary btn--sm" onClick={() => setState({ ...state, intro: "made" })}>
                      Make the introduction
                    </button>
                    <button type="button" className="text-ctl text-ctl--quiet" onClick={() => setState({ ...state, intro: "later" })}>
                      Not now
                    </button>
                  </>
                ) : (
                  <p className="notice" style={{ margin: 0 }}>
                    {state.intro === "made"
                      ? "Both sides have been asked. Contact details follow when each agrees."
                      : "Set aside. It will come back next week."}
                  </p>
                )}
              </div>
            </article>

            <article className="lead-item">
              <h2 className="eyebrow">From the archive</h2>
              <div className="stack gap-10">
                <Link to="/archive/lwp-thesis-call" className="serif-22">Land, Water &amp; Power thesis call with operators</Link>
                <p className="t14 ink lh16" style={{ margin: 0, maxWidth: 560 }}>
                  Jun 2026. Two operators describe how water rights transfer in drought years — the question your CIO raised on Northfield.
                </p>
                <div className="eyebrow">Assets · Ring 1 · Rights cleared</div>
              </div>
              <div className="stack gap-12 start">
                <div className="num-14 sec">18 min read</div>
                <Link to="/archive/lwp-thesis-call" className="text-ctl text-ctl--ink">Read in system</Link>
              </div>
            </article>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
            <section className="stack gap-14">
              <h2 className="eyebrow" style={{ paddingBottom: 6, borderBottom: "1px solid var(--cc-hairline)" }}>Deals you are in</h2>
              {myDeals.map((m) => (
                <Link
                  key={m.dealId}
                  to={`/deals/${m.dealId}`}
                  className="row row--flush row--link inline between gap-16"
                  style={{ display: "flex" }}
                >
                  <span className="stack gap-2">
                    <span className="serif-17">{m.deal.name}</span>
                    <span className="t14 sec">{m.note}</span>
                  </span>
                  <span className="mono nowrap">{m.stage}</span>
                </Link>
              ))}
            </section>

            <section className="stack gap-14">
              <h2 className="eyebrow" style={{ paddingBottom: 6, borderBottom: "1px solid var(--cc-hairline)" }}>Introductions pending your reply</h2>
              {BRIEF_PENDING.map((p) => (
                <Link
                  key={p.who}
                  to="/introductions"
                  className="baseline between gap-16"
                  style={{ paddingBottom: 12, borderBottom: "1px solid var(--cc-hairline)" }}
                >
                  <span className="stack" style={{ gap: 3 }}>
                    <span className="t15 w500">{p.who}</span>
                    <span className="t14 sec">{p.why}</span>
                  </span>
                  <span className={`mono nowrap${isOverdue(p.askedOn) ? " ox" : ""}`}>{ageLabel(p.askedOn)}</span>
                </Link>
              ))}

              <h2 className="eyebrow" style={{ marginTop: 18, paddingBottom: 6, borderBottom: "1px solid var(--cc-hairline)" }}>Events this month</h2>
              {BRIEF_EVENTS.map((e) => (
                <div
                  key={e.name}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate("/events")}
                  onKeyDown={(ev) => ev.key === "Enter" && navigate("/events")}
                  className="baseline gap-16"
                  style={{ paddingBottom: 12, borderBottom: "1px solid var(--cc-hairline)", cursor: "pointer" }}
                >
                  <span className="num-14 sec" style={{ width: 52, flex: "none" }}>{dayMonth(e.date)}</span>
                  <span className="stack" style={{ gap: 3 }}>
                    <span className="t15 w500">{e.name}</span>
                    <span className="t14 sec">{e.note}</span>
                  </span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      <MobileBrief state={state} setState={setState} />
    </Shell>
  );
}

/** Screen 12 — the one screen a principal reads in a car. No rail, no tab bar, no icons. */
function MobileBrief({ state, setState }: { state: LeadState; setState: (s: LeadState) => void }) {
  const { viewer } = useViewer();
  const myDeals = MY_DEALS.map((m) => ({ ...m, deal: deal(m.dealId)! }));
  const item = { padding: "24px 20px", borderBottom: "1px solid var(--cc-hairline)" };
  const band = { padding: "10px 20px" };
  const compact = {
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
    padding: "14px 20px", minHeight: 64, borderBottom: "1px solid var(--cc-hairline)",
  } as const;

  return (
    <main className="mobile-only" style={{ width: "100%" }}>
      <header className="baseline between gap-16" style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--cc-hairline)" }}>
        <div className="serif-17" style={{ lineHeight: 1.2 }}>Collaboration Circle</div>
        <div className="mono">14 SEP 2026</div>
      </header>
      <div style={{ padding: "24px 20px 8px" }}>
        <h1 className="serif-28">Good morning, {viewer.firstName}.</h1>
      </div>

      <div className="stack">
        <article className="stack gap-12" style={item}>
          <Link to="/deals/northfield" className="serif-20">Northfield Water Rights Portfolio</Link>
          <p className="t15 ink" style={{ margin: 0 }}>Matches your Land, Water &amp; Power thesis; introduced via Milken. The Whitcombe family holds $18M of $30M.</p>
          <div className="mono ox">DECISION 26 SEP · RING 1</div>
          {state.soft ? (
            <p className="notice" style={{ margin: "4px 0 0" }}>Soft-circle of $2.5M sent to the Whitcombe office.</p>
          ) : (
            <button type="button" className="btn btn-primary btn--block" style={{ marginTop: 4 }} onClick={() => setState({ ...state, soft: true })}>
              Soft-circle $2.5M
            </button>
          )}
        </article>

        <article className="stack gap-12" style={item}>
          <div className="serif-20">Priya Mehra → Idris Okafor</div>
          <p className="t15 ink" style={{ margin: 0 }}>Priya needs an operator who has run hotels in two currencies. You worked with Idris on the Lagos school trust.</p>
          <div className="mono">ASKED 11 SEP · BOTH RING 1</div>
          {state.intro === "made" ? (
            <p className="notice" style={{ margin: "4px 0 0" }}>Both sides have been asked.</p>
          ) : (
            <button type="button" className="btn btn-secondary btn--block" style={{ marginTop: 4 }} onClick={() => setState({ ...state, intro: "made" })}>
              Make the introduction
            </button>
          )}
        </article>

        <article className="stack gap-12" style={item}>
          <div className="serif-20">Land, Water &amp; Power thesis call</div>
          <p className="t15 ink" style={{ margin: 0 }}>Two operators on how water rights transfer in drought years — the question your CIO raised on Northfield.</p>
          <div className="mono">JUN 2026 · ASSETS · 18 MIN</div>
          <Link to="/archive/lwp-thesis-call" className="btn btn-secondary btn--block" style={{ marginTop: 4 }}>Read in system</Link>
        </article>
      </div>

      <div className="stack" style={{ paddingTop: 8 }}>
        <h2 className="band" style={band}>Deals you are in</h2>
        {myDeals.map((m) => (
          <Link key={m.dealId} to={`/deals/${m.dealId}`} style={compact}>
            <span className="stack gap-2">
              <span className="serif-17" style={{ lineHeight: 1.3 }}>{m.deal.name}</span>
              <span className="t14 sec">{m.note}</span>
            </span>
            <span className="mono nowrap">{m.stage}</span>
          </Link>
        ))}
        <h2 className="band" style={{ ...band, marginTop: 16 }}>Introductions pending</h2>
        {BRIEF_PENDING.map((p) => (
          <Link key={p.who} to="/introductions" style={compact}>
            <span className="stack gap-2">
              <span className="t15 w500" style={{ lineHeight: 1.4 }}>{p.who}</span>
              <span className="t14 sec">{p.why}</span>
            </span>
            <span className={`mono nowrap${isOverdue(p.askedOn) ? " ox" : ""}`}>{ageLabel(p.askedOn)}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
