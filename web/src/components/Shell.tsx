import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VIEWERS } from "../data/data";
import type { Viewer } from "../data/types";
import { useViewer } from "../viewer";

type NavItem = { label: string; to: string; count?: string; match: (path: string) => boolean };

function memberNav(viewer: Viewer): NavItem[] {
  const own = viewer.familyId ? `/families/${viewer.familyId}` : "";
  return [
    { label: "Morning Brief", to: "/", match: (p) => p === "/" },
    { label: "Deal Book", to: "/deals", count: "9", match: (p) => p.startsWith("/deals") },
    {
      label: "Families & Circle", to: "/circle", count: "38",
      match: (p) => p.startsWith("/circle") || (p.startsWith("/families/") && p !== own),
    },
    { label: "Introductions", to: "/introductions", count: "3", match: (p) => p.startsWith("/introductions") },
    { label: "The Archive", to: "/archive", match: (p) => p.startsWith("/archive") },
    { label: "Events & Salons", to: "/events", count: "4", match: (p) => p.startsWith("/events") },
    { label: "Your Family", to: own || "/circle", match: (p) => !!own && p === own },
  ];
}

function teamNav(): NavItem[] {
  return [
    { label: "Command", to: "/command", count: "4", match: (p) => p.startsWith("/command") },
    { label: "Morning Brief", to: "/", match: (p) => p === "/" },
    { label: "Deal Book", to: "/deals", count: "9", match: (p) => p.startsWith("/deals") },
    { label: "Families & Circle", to: "/circle", count: "52", match: (p) => p.startsWith("/circle") || p.startsWith("/families/") },
    { label: "Introductions", to: "/introductions", count: "7", match: (p) => p.startsWith("/introductions") },
    { label: "The Archive", to: "/archive", match: (p) => p.startsWith("/archive") },
    { label: "Events & Salons", to: "/events", count: "8", match: (p) => p.startsWith("/events") },
  ];
}

function partnerNav(): NavItem[] {
  return [
    { label: "Console", to: "/partner", match: (p) => p === "/partner" },
    { label: "Initiatives", to: "/partner#initiatives", count: "4", match: () => false },
    { label: "Introductions", to: "/partner#opted-in", count: "2", match: () => false },
    { label: "Events", to: "/partner#initiatives", count: "4", match: () => false },
    { label: "Your firm", to: "/partner#priorities", match: () => false },
  ];
}

export function navFor(viewer: Viewer): NavItem[] {
  if (viewer.kind === "team") return teamNav();
  if (viewer.kind === "partner") return partnerNav();
  return memberNav(viewer);
}

export function Rail({ className }: { className?: string }) {
  const { viewer, setViewerId } = useViewer();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const items = navFor(viewer);

  return (
    <nav className={["rail", className].filter(Boolean).join(" ")} aria-label="Primary">
      <Link to={viewer.home} className="rail-wordmark">
        Collaboration<br />Circle
      </Link>
      <ul className="rail-nav">
        {items.map((item) => (
          <li key={item.label}>
            <Link to={item.to} aria-current={item.match(pathname) ? "page" : undefined}>
              <span>{item.label}</span>
              {item.count && <span className="rail-count">{item.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="rail-member">
        <label>
          <span className="sr-only">Viewing as</span>
          <select
            value={viewer.id}
            onChange={(e) => {
              const next = VIEWERS.find((v) => v.id === e.target.value)!;
              setViewerId(next.id);
              navigate(next.home);
            }}
          >
            {VIEWERS.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </label>
        <div className="rail-member-ring">{viewer.ringLabel}</div>
      </div>
    </nav>
  );
}

export function Shell({ children, railClassName }: { children: ReactNode; railClassName?: string }) {
  return (
    <div className="shell">
      <Rail className={railClassName} />
      {children}
    </div>
  );
}

export function PageHeader({ title, subline }: { title: string; subline?: ReactNode }) {
  return (
    <header className="page-header">
      <h1 className="serif-28">{title}</h1>
      {subline && <p className="t15 sec" style={{ margin: 0 }}>{subline}</p>}
    </header>
  );
}

/** One plain sentence when a viewer's ring cannot open a page. */
export function NotForThisRing({ sentence }: { sentence: string }) {
  return (
    <Shell>
      <main className="main">
        <div className="page gap-28">
          <p className="t15 sec" style={{ margin: 0 }}>{sentence}</p>
        </div>
      </main>
    </Shell>
  );
}
