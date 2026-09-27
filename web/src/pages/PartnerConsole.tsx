import { NotForThisRing, PageHeader, Shell } from "../components/Shell";
import { PARTNER, family } from "../data/data";
import { dayMonth } from "../data/format";
import { useViewer } from "../viewer";

const INIT_COLS = ".6fr 2.4fr 1fr 1fr 1.8fr";

export default function PartnerConsole() {
  const { viewer } = useViewer();
  if (viewer.kind !== "partner" && viewer.ring !== 0) {
    return <NotForThisRing sentence="The Partner Console is open to Brand Partners and the Advanced Team." />;
  }
  // Partners see only families that have opted into engagement with them.
  const optedIn = PARTNER.optedIn.filter((o) => o.optedIn);

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="stack gap-40">
          <PageHeader title={PARTNER.name} subline={PARTNER.subline} />

          <section id="priorities" className="table" aria-label="Priorities">
            <h2 className="band">Your three priorities, 2026–27</h2>
            {PARTNER.priorities.map((p) => (
              <div key={p.text} className="row row--top" style={{ gridTemplateColumns: "2.2fr 1.8fr 2fr", gap: 28 }}>
                <p className="t15 ink" style={{ margin: 0 }}>{p.text}</p>
                <p className="t14 sec lh16" style={{ margin: 0 }}>{p.kpis}</p>
                <p className="num ink" style={{ margin: 0, lineHeight: 1.7 }}>{p.figures}</p>
              </div>
            ))}
          </section>

          <section id="initiatives" className="table table-scroll" aria-label="Initiative calendar">
            <div className="row-head" style={{ gridTemplateColumns: INIT_COLS }}>
              <div>Date</div><div>Initiative</div><div>City</div><div>Families</div><div>Who from your firm</div>
            </div>
            {PARTNER.initiatives.map((i) => (
              <div key={i.name} className="row" style={{ gridTemplateColumns: INIT_COLS }}>
                <div className="num sec">{dayMonth(i.date)}</div>
                <div className="serif-17">{i.name}</div>
                <div className="t14 ink">{i.city}</div>
                <div className="t14 ink">{i.families}</div>
                <div className="t14 sec">{i.firm}</div>
              </div>
            ))}
          </section>

          <section id="opted-in" className="table" aria-label="Families who have opted in">
            <div className="band band--split">
              <h2 className="eyebrow">Families who have opted in · {optedIn.length}</h2>
              <span className="note">A family appears here only after opting into engagement with your firm.</span>
            </div>
            {optedIn.map((o) => (
              <div key={o.familyId} className="row" style={{ gridTemplateColumns: "1.6fr 1.6fr 2.6fr 1.2fr" }}>
                <div className="serif-17">{family(o.familyId)!.name}</div>
                <div className="t14 sec">{o.overlap}</div>
                <div className="t14 ink">{o.reason}</div>
                <div className="t14 sec">{o.owner}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </Shell>
  );
}
