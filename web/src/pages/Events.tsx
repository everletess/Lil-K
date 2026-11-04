import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Shell } from "../components/Shell";
import { TextChoice } from "../components/controls";
import { EVENTS, family } from "../data/data";
import { SUGGESTIONS, SUGGESTION_KINDS, type Suggestion, type SuggestionKind } from "../data/phase2";
import { useViewer } from "../viewer";
import { CENTERS, CENTER_LONG, dayMonth, monthYearLong } from "../data/format";
import type { Center, CircleEvent } from "../data/types";

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
          <Suggestions />
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

/* ------------------------------------------------------------ suggestions */

const SUG_COLS = "1fr 3.2fr 1.4fr 1.4fr 1fr";

const PROMPTS: Record<SuggestionKind, string> = {
  Topic: "A subject you want the circle to take on",
  Question: "A question you want answered in the room",
  "Guest speaker": "Who, and why they are worth an evening",
  Event: "What kind of room, where, and for whom",
};

function Suggestions() {
  const { viewer } = useViewer();
  const [rows, setRows] = useState<Suggestion[]>(SUGGESTIONS);
  const [writing, setWriting] = useState(false);
  const [kind, setKind] = useState<SuggestionKind>("Topic");
  const [text, setText] = useState("");
  const [center, setCenter] = useState<Center>("People");
  const [going, setGoing] = useState<Record<string, boolean>>({});

  const from = family(viewer.familyId)?.name ?? viewer.name;

  function send() {
    if (!text.trim()) return;
    setRows([
      { id: `new-${rows.length}`, kind, text: text.trim(), center, from, date: "2026-09-14", attending: 1, status: "New" },
      ...rows,
    ]);
    setGoing({ ...going, [`new-${rows.length}`]: true });
    setText("");
    setWriting(false);
  }

  return (
    <section className="table table-scroll" aria-label="Suggestions from families">
      <div className="band band--split">
        <h2 className="eyebrow" style={{ margin: 0 }}>Suggestions from families · {rows.length}</h2>
        <span className="inline gap-20">
          <span className="note">Topics, questions and guest speakers. The Advanced Team reads every one.</span>
          {!writing && (
            <button type="button" className="btn btn-primary btn--sm" onClick={() => setWriting(true)}>Suggest something</button>
          )}
        </span>
      </div>

      {writing && (
        <form className="stack gap-16" style={{ padding: "20px 12px", borderBottom: "1px solid var(--cc-hairline)" }} onSubmit={(e) => { e.preventDefault(); send(); }}>
          <TextChoice options={SUGGESTION_KINDS} value={kind} onChange={setKind} label="What you are suggesting" />
          <textarea
            className="textarea"
            style={{ minHeight: 80, padding: "10px 12px" }}
            autoFocus
            value={text}
            placeholder={PROMPTS[kind]}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="inline wrap gap-20">
            <label className="filter">
              <span className="eyebrow">Center</span>
              <select value={center} onChange={(e) => setCenter(e.target.value as Center)}>
                {CENTERS.map((c) => <option key={c} value={c}>{CENTER_LONG[c]}</option>)}
              </select>
            </label>
            <span className="grow" />
            <button type="button" className="text-ctl" onClick={() => setWriting(false)}>Cancel</button>
            <button type="submit" className="btn btn-secondary btn--sm" disabled={!text.trim()}>Send to the Advanced Team</button>
          </div>
        </form>
      )}

      <div className="row-head" style={{ gridTemplateColumns: SUG_COLS }}>
        <div>Kind</div><div>Suggestion</div><div>From</div><div>Status</div><div>Interest</div>
      </div>
      {rows.map((r) => {
        const mine = going[r.id];
        return (
          <div key={r.id} className="row" style={{ gridTemplateColumns: SUG_COLS }}>
            <div className="t14 sec">{r.kind}</div>
            <div className="stack gap-2">
              <span className="t15 ink">{r.text}</span>
              <span className="t13 sec">{CENTER_LONG[r.center]}</span>
            </div>
            <div className="stack gap-2">
              <span className="t14 ink">{r.from}</span>
              <span className="num sec">{dayMonth(r.date)}</span>
            </div>
            <div className="t14 sec">{r.status}</div>
            <div className="stack gap-4 start">
              <span className="num ink">{r.attending + (mine && !r.id.startsWith("new") ? 1 : 0)} would attend</span>
              <button
                type="button"
                className="text-ctl text-ctl--quiet"
                aria-pressed={!!mine}
                onClick={() => setGoing({ ...going, [r.id]: !mine })}
              >
                {mine ? "You would attend" : "I would attend"}
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
