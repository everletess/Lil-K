import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Shell } from "../components/Shell";
import { EVENTS } from "../data/data";
import { dayMonth, monthYearLong } from "../data/format";
import type { CircleEvent } from "../data/types";

const COLS = ".6fr 2.4fr 2.2fr 2.4fr 1.1fr";

export default function Events() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const months: { month: string; events: CircleEvent[] }[] = [];
  for (const e of EVENTS) {
    const m = monthYearLong(e.date);
    const group = months.find((g) => g.month === m);
    if (group) group.events.push(e);
    else months.push({ month: m, events: [e] });
  }

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="stack gap-32">
          <PageHeader title="Events & Salons" subline="Small rooms, real agendas, intelligence captured after." />
          {months.map((m) => (
            <section key={m.month} className="table table-scroll" aria-label={m.month}>
              <h2 className="band">{m.month}</h2>
              {m.events.map((e) => {
                const attending = e.viewerStatus === "attending" || accepted[e.id];
                const open = () => navigate(`/events/${e.id}/after`);
                return (
                  <div
                    key={e.id}
                    className="row row--link"
                    style={{ gridTemplateColumns: COLS }}
                    role="link"
                    tabIndex={0}
                    onClick={open}
                    onKeyDown={(ev) => ev.key === "Enter" && ev.target === ev.currentTarget && open()}
                  >
                    <div className="num ink">{dayMonth(e.date)}</div>
                    <div className="stack gap-2">
                      <div className="serif-17">{e.name}</div>
                      <div className="t14 sec">{e.city} · {e.format}</div>
                    </div>
                    <div className="stack gap-2">
                      <div className="t14 ink">{e.serves}</div>
                      <div className="t14 sec">Host: {e.host}</div>
                    </div>
                    <div className="t14 sec">{e.familiesAttending} families attending · {e.named}</div>
                    <div className="stack gap-8 start">
                      {attending ? (
                        <span className="t15 w500 ink">Attending</span>
                      ) : (
                        <>
                          <span className="t14 sec">Invited</span>
                          <button
                            type="button"
                            className="text-ctl text-ctl--affirm"
                            onClick={(ev) => { ev.stopPropagation(); setAccepted({ ...accepted, [e.id]: true }); }}
                          >
                            Accept
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </main>
    </Shell>
  );
}
