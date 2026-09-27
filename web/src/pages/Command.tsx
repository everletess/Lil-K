import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotForThisRing, PageHeader, Shell } from "../components/Shell";
import { Rum } from "../components/marks";
import { COMMAND, deal } from "../data/data";
import { ageLabel, dayMonthYear } from "../data/format";
import { useViewer } from "../viewer";

type Curation = "In" | "Park" | "Declined";

export default function Command() {
  const { viewer } = useViewer();
  const navigate = useNavigate();
  const [curation, setCuration] = useState<Record<string, Curation>>({});
  const [declining, setDeclining] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [nudged, setNudged] = useState<Record<string, boolean>>({});
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  if (viewer.ring !== 0) return <NotForThisRing sentence="Command is for the Advanced Team." />;

  const decliningDeal = COMMAND.intake.find((i) => i.id === declining);
  const confirmDecline = () => {
    if (!declining || !reason.trim()) return;
    setCuration({ ...curation, [declining]: "Declined" });
    setDeclining(null);
    setReason("");
  };

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="with-aside">
          <div className="grow stack gap-40">
            <PageHeader title="Command" subline="Tuesday. Four things need a decision; the rest is running." />

            <section className="table" aria-label="Intake awaiting curation">
              <h2 className="band">Intake awaiting curation · {COMMAND.intake.filter((i) => !curation[i.id]).length}</h2>
              {COMMAND.intake.map((i) => (
                <div key={i.id} className="row" style={{ gridTemplateColumns: "2.4fr 1.4fr 1.4fr .8fr 1.4fr" }}>
                  <div className="stack gap-2">
                    <div className="serif-17">{i.deal}</div>
                    <div className="t14 sec">{i.center}</div>
                  </div>
                  <div className="t14 ink">{i.source}</div>
                  <div className="t14 sec">{i.introducer}</div>
                  <div className="mono">{ageLabel(i.submitted)}</div>
                  {curation[i.id] ? (
                    <div className="t14 ink">{curation[i.id] === "Declined" ? "Declined; the family has the reason." : curation[i.id] === "In" ? "In the Deal Book." : "Parked."}</div>
                  ) : (
                    <div className="inline gap-16">
                      <button type="button" className="text-ctl text-ctl--affirm text-ctl--in" onClick={() => setCuration({ ...curation, [i.id]: "In" })}>In</button>
                      <button type="button" className="text-ctl" onClick={() => setCuration({ ...curation, [i.id]: "Park" })}>Park</button>
                      <button type="button" className="text-ctl" aria-pressed={declining === i.id} onClick={() => setDeclining(i.id)}>Decline</button>
                    </div>
                  )}
                </div>
              ))}
              <form
                className="inline gap-16"
                style={{ padding: "16px 12px", borderBottom: "1px solid var(--cc-hairline)" }}
                onSubmit={(e) => { e.preventDefault(); confirmDecline(); }}
              >
                <label htmlFor="decline-reason" className="eyebrow nowrap">
                  {decliningDeal ? `Reason for declining ${decliningDeal.deal}` : "Reason, required on decline"}
                </label>
                <input
                  id="decline-reason"
                  className="input grow"
                  style={{ height: 40 }}
                  placeholder="One line the family will read"
                  value={reason}
                  required={!!declining}
                  disabled={!declining}
                  onChange={(e) => setReason(e.target.value)}
                />
                {declining && (
                  <button type="submit" className="text-ctl text-ctl--affirm nowrap" disabled={!reason.trim()}>Decline with reason</button>
                )}
              </form>
            </section>

            <section className="table" aria-label="Deals without a lead">
              <h2 className="band">Deals without a lead · {COMMAND.noLead.length}</h2>
              {COMMAND.noLead.map((d) => (
                <div key={d.dealId} className="row" style={{ gridTemplateColumns: "2.4fr 2fr 2.4fr 1fr" }}>
                  <div className="serif-17">{deal(d.dealId)!.name}</div>
                  <div className="t14 sec">{d.meta}</div>
                  <div className="t14 ink">{d.note}</div>
                  <button type="button" className="text-ctl text-ctl--affirm" style={{ justifySelf: "start" }} onClick={() => navigate(`/deals/${d.dealId}`)}>
                    Find a lead
                  </button>
                </div>
              ))}
            </section>

            <section className="table" aria-label="Introductions unacknowledged 72 hours">
              <h2 className="band">Introductions unacknowledged 72 hours · {COMMAND.unack.length}</h2>
              {COMMAND.unack.map((u) => (
                <div key={u.pair} className="row" style={{ gridTemplateColumns: "3fr 2fr .8fr 1.2fr" }}>
                  <div className="t15 w500">{u.pair}</div>
                  <div className="t14 sec">Waiting on {u.late}</div>
                  <div className="mono ox">{u.days}</div>
                  {nudged[u.pair] ? (
                    <div className="t14 sec">Nudged today</div>
                  ) : (
                    <button type="button" className="text-ctl text-ctl--affirm" style={{ justifySelf: "start" }} onClick={() => setNudged({ ...nudged, [u.pair]: true })}>
                      Nudge
                    </button>
                  )}
                </div>
              ))}
            </section>

            <section className="table" aria-label="Relationships gone quiet 90 days">
              <h2 className="band">Relationships gone quiet 90 days · {COMMAND.quiet.length}</h2>
              {COMMAND.quiet.map((q) => (
                <div key={q.parties} className="row" style={{ gridTemplateColumns: "2.6fr 1.6fr 1fr .8fr" }}>
                  <div className="t15 w500">{q.parties}</div>
                  <div className="t14 sec">{q.owner}</div>
                  <div className="num sec">{dayMonthYear(q.last)}</div>
                  <div><Rum strength={q.rum} /></div>
                </div>
              ))}
            </section>

            <section className="table" aria-label="Rights reviews pending">
              <h2 className="band">Rights reviews pending · {COMMAND.rightsReviews.length}</h2>
              {COMMAND.rightsReviews.map((r) => (
                <div key={r.title} className="row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1fr" }}>
                  <div className="serif-17">{r.title}</div>
                  <div className="num sec">{r.date}</div>
                  <div className="t14 ink">{r.reviewer}</div>
                  <div className="mono">{r.waiting}</div>
                </div>
              ))}
            </section>

            <section className="table" aria-label="Founder escalations">
              <h2 className="band">Founder escalations · {COMMAND.escalations.length}</h2>
              {COMMAND.escalations.map((e, idx) => (
                <div key={e.id} className="row" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="t15 ink">{e.note}</div>
                  {taken[e.id] ? (
                    <div className="t14 sec nowrap">Yours</div>
                  ) : (
                    <button
                      type="button"
                      className={`btn ${idx === COMMAND.escalations.findIndex((x) => !taken[x.id]) ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setTaken({ ...taken, [e.id]: true })}
                    >
                      Take it
                    </button>
                  )}
                </div>
              ))}
            </section>
          </div>

          <aside className="aside" style={{ gap: 14 }} aria-label="Graph health">
            <h2 className="eyebrow">Graph health</h2>
            {COMMAND.graphHealth.map((g) => (
              <div key={g.label} className="aside-figure">
                <span className="t14 sec">{g.label}</span>
                <span className="num">{g.value}</span>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </Shell>
  );
}
