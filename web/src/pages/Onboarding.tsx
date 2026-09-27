import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TextChoice } from "../components/controls";
import { AGREEMENT_TERMS, SURVEY } from "../data/data";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "agreement", label: "Participation Agreement" },
  { id: "ring", label: "Your ring" },
  { id: "needs", label: "What your family needs" },
  { id: "interests", label: "Investment interests and visibility" },
];

const PRIORITIES = ["Now", "This year", "Eventually"] as const;
const VISIBILITY = ["Ring 1", "Ring 2", "Only CC"] as const;
type Visibility = (typeof VISIBILITY)[number];
type Priority = (typeof PRIORITIES)[number];

function Eyebrow({ n, children }: { n: number; children: string }) {
  return <h2 className="section-rule">{n} · {children}</h2>;
}

/** A single flowing page, read like a private banker's intake — not a wizard. */
export default function Onboarding() {
  const [reached, setReached] = useState(1);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [answers, setAnswers] = useState<string[][]>(() => SURVEY.map((c) => c.qs.map((q) => q.a)));
  const [priority, setPriority] = useState<(Priority | null)[][]>(() => SURVEY.map((c) => c.qs.map(() => null)));
  const [interests, setInterests] = useState({
    Structures: "Direct · SPV",
    Sectors: "Industrial services · Mittelstand succession",
    Geographies: "DACH · Northern Europe",
    "Check size": "$3M – $12M",
  });
  const [visibility, setVisibility] = useState<Record<string, Visibility>>({
    "Your city": "Ring 1", "Your theses": "Ring 2", "Your deals": "Only CC",
  });
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = refs.current.indexOf(e.target as HTMLElement);
          setReached((r) => Math.max(r, i));
        }
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const sectionRef = (i: number) => (el: HTMLElement | null) => { refs.current[i] = el; };

  return (
    <div className="shell">
      <nav className="steps-col" aria-label="Steps">
        <Link to="/" className="serif-20" style={{ lineHeight: 1.2 }}>Collaboration<br />Circle</Link>
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={i <= reached ? "reached" : undefined} aria-current={i === reached ? "step" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
        <Link to="/" className="back-link" style={{ marginTop: "auto" }}>Back to the Morning Brief</Link>
      </nav>

      <main style={{ flex: 1, minWidth: 0, padding: "56px 72px", maxWidth: 920 }}>
        <div className="stack gap-56">
          <section id="welcome" ref={sectionRef(0)} className="stack gap-20">
            <Eyebrow n={1}>Welcome</Eyebrow>
            <div className="serif" style={{ fontSize: 19, lineHeight: 1.8, maxWidth: "62ch" }}>
              <p style={{ margin: 0 }}>Dear Thorne family,</p>
              <p style={{ margin: "1.8em 0 0" }}>You are joining a circle of fifty-two families who work on each other's questions directly. There is no tier above the one you are entering, and nothing here is sold to you.</p>
              <p style={{ margin: "1.8em 0 0" }}>What we ask is plain: bring one real need and one real capability. Answer the survey honestly, including the parts you would not put in writing elsewhere; it stays inside the ring you choose.</p>
              <p style={{ margin: "1.8em 0 0" }}>I will call you in the first week.</p>
              <p style={{ margin: "1.8em 0 0" }}>Samira Salman</p>
            </div>
          </section>

          <section id="agreement" ref={sectionRef(1)} className="stack gap-20">
            <Eyebrow n={2}>Participation Agreement</Eyebrow>
            <div className="stack gap-16 t15 lh175 ink" style={{ maxWidth: "68ch" }}>
              {AGREEMENT_TERMS.map((t) => <p key={t} style={{ margin: 0 }}>{t}</p>)}
            </div>
            <label className="checkbox" style={{ paddingTop: 4 }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>We have read and agree</span>
            </label>
            <p className="t14 sec" style={{ margin: 0 }}>The full agreement sits in your data room, with counsel's mark-up from 2 September.</p>
          </section>

          <section id="ring" ref={sectionRef(2)} className="stack gap-20">
            <Eyebrow n={3}>Your ring</Eyebrow>
            <p className="serif-22" style={{ lineHeight: 1.3 }}>You are joining as Close Circle (Ring 1).</p>
            <p className="t15 lh175 ink" style={{ margin: 0, maxWidth: "68ch" }}>
              Ring 1 means you see deals as they are being formed, read the archive cleared for Close Circle, and may ask any family in the ring for an introduction. It does not mean access to Ring 0 material, founder escalations, or conversations a family has restricted; and it carries no obligation to invest in anything you are shown.
            </p>
          </section>

          <section id="needs" ref={sectionRef(3)} className="stack gap-28">
            <Eyebrow n={4}>What your family needs · the Needs Survey</Eyebrow>
            {SURVEY.map((c, ci) => (
              <fieldset key={c.center} className="stack gap-14" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="serif-20" style={{ marginBottom: 14, padding: 0 }}>{c.center}</legend>
                {c.qs.map((q, qi) => (
                  <div
                    key={q.q}
                    style={{ display: "grid", gridTemplateColumns: "1.6fr 2fr 1.1fr", gap: 20, padding: "14px 0", alignItems: "center", borderBottom: "1px solid var(--cc-hairline)" }}
                  >
                    <label htmlFor={`q-${ci}-${qi}`} className="t15 ink" style={{ lineHeight: 1.5 }}>{q.q}</label>
                    <textarea
                      id={`q-${ci}-${qi}`}
                      className="textarea"
                      rows={1}
                      style={{ minHeight: 40 }}
                      value={answers[ci][qi]}
                      onChange={(e) => setAnswers(answers.map((row, i) => (i === ci ? row.map((a, j) => (j === qi ? e.target.value : a)) : row)))}
                    />
                    <TextChoice
                      label={`Priority for: ${q.q}`}
                      options={PRIORITIES}
                      value={priority[ci][qi]}
                      onChange={(v) => setPriority(priority.map((row, i) => (i === ci ? row.map((p, j) => (j === qi ? v : p)) : row)))}
                      gap={14}
                    />
                  </div>
                ))}
              </fieldset>
            ))}
          </section>

          <section id="interests" ref={sectionRef(4)} className="stack gap-24">
            <Eyebrow n={5}>Investment interests and visibility</Eyebrow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {(Object.keys(interests) as (keyof typeof interests)[]).map((k) => (
                <label key={k} className="stack gap-8">
                  <span className="t14 sec">{k}</span>
                  <input
                    className={k === "Check size" ? "input input--mono" : "input"}
                    value={interests[k]}
                    onChange={(e) => setInterests({ ...interests, [k]: e.target.value })}
                  />
                </label>
              ))}
            </div>
            <div className="table">
              <div className="row-head" style={{ gridTemplateColumns: "2fr 3fr" }}>
                <div>Who can see</div><div>Visibility</div>
              </div>
              {Object.keys(visibility).map((k) => (
                <div key={k} className="row" style={{ gridTemplateColumns: "2fr 3fr" }}>
                  <div className="t15">{k}</div>
                  <TextChoice
                    label={`Who can see ${k.toLowerCase()}`}
                    options={VISIBILITY}
                    value={visibility[k]}
                    onChange={(v) => setVisibility({ ...visibility, [k]: v })}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="inline gap-24">
            {joined ? (
              <p className="notice" style={{ margin: 0 }}>Received. Samira will call you this week.</p>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "11px 20px" }}
                disabled={!agreed}
                onClick={() => setJoined(true)}
              >
                Join the circle
              </button>
            )}
            <span className="t14 sec">
              {agreed || joined
                ? "Samira reviews every intake personally before a family is announced."
                : "Agree to the Participation Agreement above to join."}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
