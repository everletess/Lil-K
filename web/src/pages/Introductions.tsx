import { useState } from "react";
import { PageHeader, Shell } from "../components/Shell";
import { Rum } from "../components/marks";
import { AWAITING, OUTCOMES, TO_MAKE } from "../data/data";
import { ageLabel, dayMonth, dayMonthYear, isOverdue } from "../data/format";

const OUTCOME_COLS = "2.4fr .9fr 1.4fr 1.1fr 2fr";

export default function Introductions() {
  const [made, setMade] = useState<Record<string, "made" | "later">>({});
  const [replies, setReplies] = useState<Record<string, "agreed" | "declined">>({});

  const pending = TO_MAKE.filter((t) => !made[t.id]);
  // The oxblood belongs to the first introduction still waiting.
  const primaryId = pending[0]?.id;

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="with-aside">
          <div className="grow stack gap-40">
            <PageHeader title="Introductions" subline="Every introduction is asked for, agreed by both sides, and followed to an outcome." />

            <section className="table" aria-label="To make">
              <h2 className="band">To make · you are the warmest route · {pending.length}</h2>
              {TO_MAKE.map((t) => (
                <div key={t.id} className="row row--top" style={{ gridTemplateColumns: "1.6fr 2.4fr 1.2fr", gap: 28 }}>
                  <div className="stack gap-8">
                    <div className="t15 w500" style={{ lineHeight: 1.4 }}>{t.pair}</div>
                    <div className="ring-label">RING {t.rings[0]} · RING {t.rings[1]}</div>
                    <div className="inline gap-12">
                      <Rum strength={t.rumA} />
                      <Rum strength={t.rumB} />
                    </div>
                  </div>
                  <p className="t14 ink lh16" style={{ margin: 0 }}>{t.whyNow}</p>
                  <div className="stack gap-12 start">
                    <div className="mono">Asked {dayMonth(t.asked)}</div>
                    {made[t.id] ? (
                      <p className="notice" style={{ margin: 0 }}>
                        {made[t.id] === "made" ? "Both sides have been asked." : "Set aside for now."}
                      </p>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={`btn ${t.id === primaryId ? "btn-primary" : "btn-secondary"}`}
                          onClick={() => setMade({ ...made, [t.id]: "made" })}
                        >
                          Make the introduction
                        </button>
                        <button type="button" className="text-ctl" onClick={() => setMade({ ...made, [t.id]: "later" })}>
                          Not now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <section className="table" aria-label="Awaiting your reply">
              <h2 className="band">Awaiting your reply · {AWAITING.filter((a) => !replies[a.id]).length}</h2>
              {AWAITING.map((a) => (
                <div key={a.id} className="row" style={{ gridTemplateColumns: "1.6fr 2.6fr .7fr 1fr", gap: 24, paddingTop: 20, paddingBottom: 20 }}>
                  <div className="serif-17">{a.who}</div>
                  <p className="t14 ink lh16" style={{ margin: 0 }}>{a.context}</p>
                  <div className={`mono${isOverdue(a.askedOn) ? " ox" : ""}`}>{ageLabel(a.askedOn)}</div>
                  {replies[a.id] ? (
                    <div className="t14 ink">{replies[a.id] === "agreed" ? "Agreed. Waiting on the other side." : "Declined, with thanks."}</div>
                  ) : (
                    <div className="inline gap-20">
                      <button type="button" className="text-ctl text-ctl--affirm" onClick={() => setReplies({ ...replies, [a.id]: "agreed" })}>Agree</button>
                      <button type="button" className="text-ctl" onClick={() => setReplies({ ...replies, [a.id]: "declined" })}>Decline</button>
                    </div>
                  )}
                </div>
              ))}
            </section>

            <section className="table table-scroll" aria-label="Outcomes">
              <div className="row-head" style={{ gridTemplateColumns: OUTCOME_COLS }}>
                <div>Introduction</div><div>Date</div><div>Asked by</div><div>Outcome</div><div>Deal it led to</div>
              </div>
              {OUTCOMES.map((o) => (
                <div key={o.pair + o.date} className="row row--link" style={{ gridTemplateColumns: OUTCOME_COLS }} tabIndex={0}>
                  <div className="t15 w500" style={{ lineHeight: 1.4 }}>{o.pair}</div>
                  <div className="num sec">{dayMonthYear(o.date)}</div>
                  <div className="t14 sec">{o.asked}</div>
                  <div className="t14 ink">{o.outcome}</div>
                  <div className="t14 sec">{o.deal}</div>
                </div>
              ))}
            </section>
          </div>

          <aside className="aside" style={{ gap: 14 }} aria-label="This year">
            <h2 className="eyebrow">This year</h2>
            {[["Made", "14"], ["Led to a meeting", "11"], ["Led to a deal", "3"]].map(([k, v]) => (
              <div key={k} className="aside-figure">
                <span className="t14 sec">{k}</span>
                <span className="num">{v}</span>
              </div>
            ))}
            <p className="t14 sec" style={{ margin: 0 }}>Both sides agree before an introduction is made. Nothing is forwarded without a reply.</p>
          </aside>
        </div>
      </main>
    </Shell>
  );
}
