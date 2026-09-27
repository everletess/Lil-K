import { Link } from "react-router-dom";
import { CURATED_LINE } from "../data/data";
import { CENTER_LONG, CENTERS } from "../data/format";
import { RingLabel, Rum, StageGate } from "../components/marks";
import type { Ring, RumStrength } from "../data/types";

const SWATCHES = [
  ["#FFFFFF", "Surface — page, tables, cards", "—"],
  ["#F3F4F6", "Structural grey — table headers, grouped sections, fields", "—"],
  ["#E2E5E9", "Hairline 1px, and the border on action cards", "—"],
  ["#C7CCD2", "Divider between major regions", "—"],
  ["#101418", "Primary ink, and the navigation rail", "18.5:1 on white"],
  ["#4B5563", "Secondary text and mono metadata", "7.5:1 on white"],
  ["#6B7280", "Tertiary, never below 14px; stage Intake", "4.7:1 on white"],
  ["#6E1E2A", "Oxblood — one action, active nav bar, current gate, dates inside 14 days", "11.1:1 on white"],
  ["#7A6230", "Brass — the RUM mark and ring labels only", "5.8:1 on white"],
  ["#1F4E79", "Stage: Strategize", "8.8:1 on white"],
];

const RUM_LEVELS: [RumStrength, string][] = [
  [4, "Working together now"], [3, "Warm, recent contact"], [2, "Known, needs a route"], [1, "One degree away"],
];

function Band({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="inline start gap-56" style={{ gap: 64 }}>
      <h2 className="eyebrow" style={{ width: 220, flex: "none" }}>{label}</h2>
      <div className="grow stack gap-32">{children}</div>
    </section>
  );
}

/** The design system as a living page, built from the same components as the product. */
export default function Foundations() {
  return (
    <main style={{ padding: "64px 72px", maxWidth: 1440, margin: "0 auto" }}>
      <div className="stack gap-56">
        <Link to="/" className="back-link">Back to the Morning Brief</Link>
        <header className="stack gap-6">
          <div className="eyebrow">Collaboration Circle OS</div>
          <h1 className="serif-40">Foundations</h1>
          <p className="t15 sec" style={{ margin: 0, maxWidth: 640 }}>
            White surfaces, cool greys, one ink rail, one accent. Hairlines instead of borders. Tables before cards. Nothing moves unless it needs to.
          </p>
        </header>
        <div style={{ height: 1, background: "var(--cc-hairline)" }} />

        <Band label="Ground & ink">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {SWATCHES.map(([hex, use, ratio]) => (
              <div key={hex + use} className="stack gap-8">
                <div style={{ height: 64, background: hex, border: "1px solid var(--cc-hairline)" }} />
                <div className="mono ink">{hex}</div>
                <div className="t14 sec">{use}</div>
                <div className="mono">{ratio}</div>
              </div>
            ))}
          </div>
          <div data-theme="dark" style={{ background: "#101418", padding: 32 }} className="stack gap-20">
            <div className="eyebrow">Dark ground — the rail and the archive reading view</div>
            <div style={{ background: "var(--cc-surface)", padding: "28px 32px" }} className="stack gap-16">
              <div className="serif-28 ink">Northfield Water Rights Portfolio</div>
              <p className="t15 sec" style={{ margin: 0, maxWidth: 620 }}>
                Surface #181D23 on ground #101418. Ink #E5E7EB at 13.6:1, secondary #9CA3AF at 6.9:1, hairlines #2A3139. Oxblood lifts to #C0616F, brass to #C9A55E.
              </p>
            </div>
          </div>
        </Band>

        <div style={{ height: 1, background: "var(--cc-hairline)" }} />

        <Band label="Type scale">
          {[
            ["40 / 44", <div className="serif-40">Good morning, Eleanor</div>],
            ["28 / 34", <div className="serif-28">Ravello Family Hotel Recapitalisation</div>],
            ["20 / 28", <div className="serif-20">The Whitcombe family · New York · G2/G3</div>],
            ["17 / 23", <div className="serif-17">Northfield Water Rights Portfolio</div>],
            ["15 / 24", <div className="t15" style={{ maxWidth: 620 }}>Interface text sets in IBM Plex Sans at 15px; nothing sans below 14px except 13px row sub-lines.</div>],
            ["14 / 20", <div className="t14 sec">Secondary interface text and row metadata.</div>],
            ["12 · mono", <div className="eyebrow">Ring 1 · Decision 26 Sep · $2,500,000 · Tabular</div>],
          ].map(([k, v]) => (
            <div key={k as string} className="baseline gap-24">
              <div className="mono" style={{ width: 120, flex: "none" }}>{k}</div>
              {v}
            </div>
          ))}
        </Band>

        <div style={{ height: 1, background: "var(--cc-hairline)" }} />

        <Band label="Marks & labels">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div className="stack gap-16">
              <div className="t14 sec">Rings of trust — access is concentric</div>
              {([0, 1, 2, 3] as Ring[]).map((r) => (
                <div key={r} className="inline gap-12">
                  <RingLabel ring={r} boxed /><span className="t14">{["Advanced Team", "Close Circle", "Larger Network", "Partners & Advisors"][r]}</span>
                </div>
              ))}
            </div>
            <div className="stack gap-16">
              <div className="t14 sec">RUM™ mark — relationship strength, four steps</div>
              {RUM_LEVELS.map(([s, label]) => (
                <div key={s} className="inline gap-12"><Rum strength={s} /><span className="mono">{label}</span></div>
              ))}
            </div>
            <div className="stack gap-16">
              <div className="t14 sec">Five Centers of Excellence — text, never icons</div>
              <div className="stack gap-8 t15 w500">{CENTERS.map((c) => <div key={c}>{CENTER_LONG[c]}</div>)}</div>
            </div>
            <div className="stack gap-16">
              <div className="t14 sec">Stage gate — Intake → Analyze → Strategize → Hustle &amp; Close</div>
              <StageGate current="strategize" width={88} />
              <div className="t14 sec">Gate cleared 4 Sep by Samira Salman.</div>
            </div>
          </div>
        </Band>

        <div style={{ height: 1, background: "var(--cc-hairline)" }} />

        <Band label="Objects">
          <div className="deal-card" style={{ maxWidth: 560 }}>
            <div className="baseline between gap-16">
              <div className="serif-28" style={{ lineHeight: 1.2 }}>Ravello Family Hotel Recapitalisation</div>
              <RingLabel ring={1} />
            </div>
            <div className="eyebrow">Lifestyle · SPV · India–Europe Corridor</div>
            <div className="t14">Lead: the Mehra family. Soft-circled $14.2M of $22M. Decision 9 Oct.</div>
            <StageGate current="strategize" width={52} />
            <div className="inline gap-20" style={{ paddingTop: 4 }}>
              <button type="button" className="btn btn-primary btn--sm">Soft-circle $2.5M</button>
              <button type="button" className="text-ctl text-ctl--ink">Read the memo</button>
            </div>
            <div className="curated curated--ruled">{CURATED_LINE}</div>
          </div>
        </Band>
      </div>
    </main>
  );
}
