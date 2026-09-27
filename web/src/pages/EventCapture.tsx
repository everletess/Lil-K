import { useState } from "react";
import { useParams } from "react-router-dom";
import { NotForThisRing, Shell } from "../components/Shell";
import { CAPTURE_PREFILL, DEALS, EVENTS, FAMILIES, family } from "../data/data";
import { visibleDeals } from "../data/access";
import { CENTERS, CENTER_LONG, parseDate, monthYearLong } from "../data/format";
import { useViewer } from "../viewer";

type Need = { center: string; familyId: string; need: string };
type Intro = { pair: string; why: string };

export default function EventCapture() {
  const { id } = useParams();
  const event = EVENTS.find((e) => e.id === id);
  if (!event) return <NotForThisRing sentence="There is no event at this address." />;
  return <CaptureForm key={event.id} eventId={event.id} />;
}

function CaptureForm({ eventId }: { eventId: string }) {
  const { viewer } = useViewer();
  const event = EVENTS.find((e) => e.id === eventId)!;
  const prefill = CAPTURE_PREFILL[eventId];
  const [came, setCame] = useState<string[]>(prefill?.came ?? []);
  const [discussed, setDiscussed] = useState(prefill?.discussed ?? "");
  const [needs, setNeeds] = useState<Need[]>(prefill?.needs ?? []);
  const [intros, setIntros] = useState<Intro[]>(prefill?.intros ?? []);
  const [deals, setDeals] = useState<string[]>(prefill?.deals ?? []);
  const [captured, setCaptured] = useState(false);

  const d = parseDate(event.date);
  const dealOptions = visibleDeals(DEALS, viewer).filter((x) => ["northfield", "helsingor", "cascais"].includes(x.id) || deals.includes(x.id));
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <form
          className="stack gap-36"
          style={{ maxWidth: 888 }}
          onSubmit={(e) => { e.preventDefault(); setCaptured(true); }}
        >
          <header className="page-header">
            <h1 className="serif-28">After the event</h1>
            <p className="t15 sec" style={{ margin: 0 }}>
              {event.name} · {event.city} · {d.getDate()} {monthYearLong(event.date)} · hosted by {event.host}
            </p>
          </header>

          <fieldset className="stack gap-12" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="eyebrow" style={{ marginBottom: 12 }}>Who came</legend>
            <div className="inline wrap gap-12">
              {FAMILIES.map((f) => (
                <button key={f.id} type="button" className="chip" aria-pressed={came.includes(f.id)} onClick={() => setCame(toggle(came, f.id))}>
                  {f.name}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="stack gap-12">
            <span className="eyebrow">What was discussed</span>
            <textarea
              className="textarea t15"
              style={{ minHeight: 120, padding: "14px 16px", lineHeight: 1.7, fontSize: 15 }}
              value={discussed}
              onChange={(e) => setDiscussed(e.target.value)}
            />
          </label>

          <div className="table">
            <div className="row-head" style={{ gridTemplateColumns: "1.6fr 1.6fr 3fr" }}>
              <div>Center</div><div>Family</div><div>Need raised</div>
            </div>
            {needs.map((n, i) => (
              <div key={i} className="row" style={{ gridTemplateColumns: "1.6fr 1.6fr 3fr" }}>
                {n.need && prefill?.needs.includes(n) ? (
                  <>
                    <div className="t14 ink">{n.center}</div>
                    <div className="serif-17">{family(n.familyId)?.name}</div>
                    <div className="t15 ink">{n.need}</div>
                  </>
                ) : (
                  <>
                    <select className="input" aria-label="Center" value={n.center} onChange={(e) => setNeeds(needs.map((x, j) => (j === i ? { ...x, center: e.target.value } : x)))}>
                      {CENTERS.map((c) => <option key={c}>{CENTER_LONG[c]}</option>)}
                    </select>
                    <select className="input" aria-label="Family" value={n.familyId} onChange={(e) => setNeeds(needs.map((x, j) => (j === i ? { ...x, familyId: e.target.value } : x)))}>
                      {FAMILIES.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <input className="input" aria-label="Need raised" placeholder="One line, in their words" value={n.need} onChange={(e) => setNeeds(needs.map((x, j) => (j === i ? { ...x, need: e.target.value } : x)))} />
                  </>
                )}
              </div>
            ))}
            <button
              type="button"
              className="t14 ink"
              style={{ textAlign: "left", background: "none", border: 0, padding: "16px 12px", borderBottom: "1px solid var(--cc-hairline)", cursor: "pointer" }}
              onClick={() => setNeeds([...needs, { center: CENTER_LONG.People, familyId: FAMILIES[0].id, need: "" }])}
            >
              Add a need
            </button>
          </div>

          <div className="table">
            <div className="row-head" style={{ gridTemplateColumns: "2.4fr 3fr" }}>
              <div>Introduction to make</div><div>Why now</div>
            </div>
            {intros.map((it, i) => (
              <div key={i} className="row" style={{ gridTemplateColumns: "2.4fr 3fr" }}>
                {prefill?.intros.includes(it) ? (
                  <>
                    <div className="t15 w500">{it.pair}</div>
                    <div className="t15 ink">{it.why}</div>
                  </>
                ) : (
                  <>
                    <input className="input" aria-label="Introduction" placeholder="Name → name" value={it.pair} onChange={(e) => setIntros(intros.map((x, j) => (j === i ? { ...x, pair: e.target.value } : x)))} />
                    <input className="input" aria-label="Why now" placeholder="Why now" value={it.why} onChange={(e) => setIntros(intros.map((x, j) => (j === i ? { ...x, why: e.target.value } : x)))} />
                  </>
                )}
              </div>
            ))}
            <button
              type="button"
              className="t14 ink"
              style={{ textAlign: "left", background: "none", border: 0, padding: "16px 12px", borderBottom: "1px solid var(--cc-hairline)", cursor: "pointer" }}
              onClick={() => setIntros([...intros, { pair: "", why: "" }])}
            >
              Add an introduction
            </button>
          </div>

          <fieldset className="stack gap-12" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="eyebrow" style={{ marginBottom: 12 }}>Deals mentioned</legend>
            <div className="inline wrap gap-12">
              {dealOptions.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={deals.includes(x.id)} onClick={() => setDeals(toggle(deals, x.id))}>
                  {x.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="inline gap-24" style={{ paddingTop: 8 }}>
            {captured ? (
              <p className="notice" style={{ margin: 0 }}>Captured. {came.length} families, {needs.filter((n) => n.need).length} needs, {intros.filter((i) => i.pair).length} introductions.</p>
            ) : (
              <button type="submit" className="btn btn-primary">Capture</button>
            )}
            <span className="t14 sec">Needs and introductions update the circle within the hour.</span>
          </div>
        </form>
      </main>
    </Shell>
  );
}
