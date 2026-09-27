import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, Shell } from "../components/Shell";
import { Tabs } from "../components/controls";
import { ARCHIVE, ASK_SAMPLE, archiveItem } from "../data/data";
import { archiveVisible, rightsLabel } from "../data/access";
import { monthYear } from "../data/format";
import type { ArchiveItem } from "../data/types";
import { useViewer } from "../viewer";

const MODES = ["Ask", "Search"] as const;
type Mode = (typeof MODES)[number];

const CITE_COLS = "2.6fr .7fr .7fr 1.4fr 1.3fr .5fr";
const RESULT_COLS = "2.8fr .7fr .7fr 1fr 1.6fr 1.4fr";

/** An answer is only ever rendered with at least one citation. */
type Answer = { question: string; text: string; citations: [ArchiveItem, ...ArchiveItem[]] } | { question: string; text: null };

function answerFor(question: string, visible: (a: ArchiveItem) => boolean): Answer {
  const q = question.toLowerCase();
  if (ASK_SAMPLE.keywords.some((k) => q.includes(k))) {
    const cited = ASK_SAMPLE.citations.map((id) => archiveItem(id)!).filter(visible);
    if (cited.length) return { question, text: ASK_SAMPLE.answer, citations: cited as [ArchiveItem, ...ArchiveItem[]] };
  }
  return { question, text: null };
}

function matches(a: ArchiveItem, q: string) {
  const hay = `${a.title} ${a.speakers} ${a.center} ${a.kind} ${a.date.slice(0, 4)}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}

export default function ArchiveSearch() {
  const { viewer } = useViewer();
  const navigate = useNavigate();
  const visible = (a: ArchiveItem) => archiveVisible(a, viewer);
  const [mode, setMode] = useState<Mode>("Ask");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [answer, setAnswer] = useState<Answer>(() => answerFor(ASK_SAMPLE.question, visible));

  const results = useMemo(() => {
    const all = ARCHIVE.filter((a) => archiveVisible(a, viewer));
    return searched ? all.filter((a) => matches(a, searched)) : all.slice(0, 8);
  }, [viewer, searched]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (mode === "Ask") setAnswer(answerFor(query.trim(), visible));
    else setSearched(query.trim());
  };

  const open = (id: string) => navigate(`/archive/${id}`);

  return (
    <Shell>
      <main className="main" style={{ display: "block" }}>
        <div className="stack gap-32">
          <PageHeader title="The Archive" subline="Fifteen years of conversations in the circle. Read here; never exported." />

          <form className="stack gap-20" style={{ maxWidth: 940 }} onSubmit={submit} role="search">
            <label>
              <span className="sr-only">{mode === "Ask" ? "Ask the archive" : "Search the archive"}</span>
              <input
                className="input input--search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (mode === "Search" && !e.target.value) setSearched("");
                }}
                placeholder="Ask the archive, or search a name, topic or year"
              />
            </label>
            <Tabs tabs={MODES} value={mode} onChange={setMode} label="Archive mode" />
          </form>

          {mode === "Ask" && (
            <section className="stack gap-20" style={{ maxWidth: 760 }} aria-label="Answer">
              <div className="t15 w500">{answer.question}</div>
              {answer.text === null ? (
                <p className="t15 sec" style={{ margin: 0 }}>No conversation cleared for your ring answers this yet.</p>
              ) : (
                <>
                  <p className="t15 ink lh175" style={{ margin: 0 }}>{answer.text}</p>
                  <div className="table">
                    <h2 className="band">
                      Cited · {answer.citations.length === 3 ? "three conversations" : `${answer.citations.length} conversations`}
                    </h2>
                    {answer.citations.map((c) => (
                      <div
                        key={c.id}
                        className="row row--link"
                        style={{ gridTemplateColumns: CITE_COLS, gap: 16 }}
                        role="link"
                        tabIndex={0}
                        onClick={() => open(c.id)}
                        onKeyDown={(e) => e.key === "Enter" && open(c.id)}
                      >
                        <div className="serif-17">{c.title}</div>
                        <div className="num sec">{monthYear(c.date)}</div>
                        <div className="t14 sec">{c.center}</div>
                        <div className="t14 ink">{c.speakers}</div>
                        <div className="mono">{rightsLabel(c)}</div>
                        <div className="t14 ink">Read</div>
                      </div>
                    ))}
                  </div>
                  <p className="t14 sec" style={{ margin: 0 }}>An answer never appears without its citations.</p>
                </>
              )}
            </section>
          )}

          <section className="table table-scroll" aria-label="Results">
            <div className="row-head" style={{ gridTemplateColumns: RESULT_COLS, gap: 16 }}>
              <div>Conversation</div><div>Date</div><div>Center</div><div>Kind</div><div>Speakers</div><div>Rights</div>
            </div>
            {results.length === 0 && <p className="empty">Nothing cleared for your ring matches “{searched}”.</p>}
            {results.map((r) => (
              <Link key={r.id} to={`/archive/${r.id}`} className="row row--link" style={{ gridTemplateColumns: RESULT_COLS, gap: 16 }}>
                <div className="serif-17">{r.title}</div>
                <div className="num sec">{monthYear(r.date)}</div>
                <div className="t14 sec">{r.center}</div>
                <div className="t14 ink">{r.kind}</div>
                <div className="t14 ink">{r.speakers}</div>
                <div className="mono">{rightsLabel(r)}</div>
              </Link>
            ))}
            {viewer.ring > 0 && (
              <p className="t14 sec" style={{ margin: 0, padding: "16px 12px 0" }}>
                Conversations under review or restricted to Ring 0 do not appear in your results.
              </p>
            )}
          </section>
        </div>
      </main>
    </Shell>
  );
}
