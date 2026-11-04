import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { NotForThisRing, Shell } from "../components/Shell";
import { RELATED, TRANSCRIPTS, archiveItem, deal } from "../data/data";
import { archiveVisible, logReading, rightsLabel } from "../data/access";
import { CENTER_SHORT, TODAY, monthYearLong, parseDate, shortDate } from "../data/format";
import type { ArchiveItem } from "../data/types";
import { SUMMARIES } from "../data/phase2";
import { centersOf, useCenters } from "../data/store";
import { useViewer } from "../viewer";

export default function ArchiveReader() {
  const { id } = useParams();
  const { viewer } = useViewer();
  const item = archiveItem(id);
  if (!item || !archiveVisible(item, viewer)) {
    return <NotForThisRing sentence="This conversation is not cleared for your ring." />;
  }
  return <Reader item={item} />;
}

function fullDate(item: ArchiveItem) {
  if (item.date.length > 7) {
    const d = parseDate(item.date);
    return `${d.getDate()} ${monthYearLong(item.date)}`;
  }
  return monthYearLong(item.date);
}

const block = (e: SyntheticEvent) => e.preventDefault();

function Reader({ item }: { item: ArchiveItem }) {
  const { viewer } = useViewer();
  const [dark, setDark] = useState(false);
  const transcript = TRANSCRIPTS[item.id];
  const related = RELATED[item.id];
  const summary = SUMMARIES[item.id];
  const centers = useCenters();
  const [playingFrom, setPlayingFrom] = useState<string | null>(null);

  useEffect(() => {
    logReading(item.id, viewer);
  }, [item.id, viewer]);

  useEffect(() => {
    // No saving or printing from the reading view.
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && ["s", "p", "c", "a"].includes(e.key.toLowerCase())) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const mark = `${viewer.name} · Ring ${viewer.ring} · ${shortDate(TODAY)}`;
  const line = [mark, mark, mark].join("    ");
  const rights = item.rights === "cleared" ? `CLEARED FOR RING ${item.ring}` : rightsLabel(item);
  const centerLine = centersOf(centers, item).map((c) => CENTER_SHORT[c]).join(" · ");
  const meta = [fullDate(item), centerLine, item.kind, rights].join(" · ").toUpperCase();

  const relatedConversations = (related?.conversations ?? [])
    .map((r) => ({ ...r, item: archiveItem(r.id)! }))
    .filter((r) => archiveVisible(r.item, viewer));

  return (
    <Shell>
      <main
        className="reader"
        data-theme={dark ? "dark" : undefined}
        onCopy={block}
        onCut={block}
        onContextMenu={block}
        onDragStart={block}
      >
        <div className="watermark" aria-hidden="true">
          <div className="watermark-inner">
            {Array.from({ length: 8 }, (_, i) => <div key={i}>{line}</div>)}
          </div>
        </div>

        <div className="with-aside" style={{ position: "relative", padding: "48px 56px" }}>
          <article className="grow stack gap-32">
            <header className="stack gap-12" style={{ paddingBottom: 24, borderBottom: "1px solid var(--cc-divider)" }}>
              <h1 className="serif-28">{item.title}</h1>
              <div className="mono">{meta}</div>
              <div className="t14 sec" style={{ maxWidth: 680 }}>
                Participants: {transcript ? transcript.participants : item.speakers}
              </div>
            </header>
            {summary && (
              <section className="stack gap-28" style={{ maxWidth: "68ch" }} aria-label="Summary">
                <div className="stack gap-10">
                  <h2 className="eyebrow">Summary · {summary.length} recording</h2>
                  <p className="t16 ink" style={{ margin: 0 }}>{summary.summary}</p>
                  <p className="t14 sec" style={{ margin: 0 }}>{summary.attended}. {summary.source}.</p>
                </div>

                <div className="stack">
                  <h2 className="eyebrow" style={{ paddingBottom: 10, borderBottom: "1px solid var(--cc-hairline)" }}>Chapters</h2>
                  {summary.chapters.map((c) => (
                    <div key={c.at} className="chapter">
                      <span className="num ink">{c.at}</span>
                      <div className="stack gap-4">
                        <span className="t15 ink w500">{c.title}</span>
                        <span className="t14 sec lh16">{c.points}</span>
                      </div>
                      <button type="button" className="text-ctl nowrap" onClick={() => setPlayingFrom(c.at)}>
                        {playingFrom === c.at ? "Playing here" : `Watch from ${c.at}`}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="stack gap-10">
                  <h2 className="eyebrow">What comes next</h2>
                  {summary.next.map((n) => (
                    <p key={n} className="t15 ink" style={{ margin: 0 }}>{n}</p>
                  ))}
                </div>
              </section>
            )}

            {summary ? null : transcript ? (
              <div className="stack gap-28" style={{ maxWidth: "68ch" }}>
                {transcript.lines.map((t, i) => (
                  <div key={i} className="stack gap-8">
                    <div className="mono">{t.who}</div>
                    <p className="t16 ink" style={{ margin: 0 }}>{t.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="t15 sec" style={{ margin: 0 }}>The transcript of this conversation is being prepared for reading.</p>
            )}
          </article>

          {related && (
            <aside className="aside" aria-label="Related">
              <h2 className="eyebrow">Related conversations</h2>
              {relatedConversations.map((r) => (
                <div key={r.id} className="aside-item">
                  <Link to={`/intelligence/${r.id}`} className="serif-17">{r.item.title}</Link>
                  <div className="t14 sec">{r.meta}</div>
                </div>
              ))}
              <h2 className="eyebrow" style={{ paddingTop: 8 }}>Deals citing this</h2>
              {related.deals.map((r) => (
                <div key={r.dealId} className="aside-item">
                  <Link to={`/deals/${r.dealId}`} className="serif-17">{deal(r.dealId)!.name}</Link>
                  <div className="t14 sec">{r.meta}</div>
                </div>
              ))}
            </aside>
          )}
        </div>

        <footer className="reader-footer">
          <span>This conversation is read in the system and cannot be exported, copied or downloaded. Your reading is logged.</span>
          <button type="button" className="text-ctl text-ctl--quiet nowrap" onClick={() => setDark(!dark)} style={{ fontSize: 13 }}>
            {dark ? "Light ground" : "Dark ground"}
          </button>
        </footer>
      </main>
    </Shell>
  );
}

