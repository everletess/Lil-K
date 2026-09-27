import { useEffect } from "react";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { NotForThisRing } from "./components/Shell";
import { ViewerProvider } from "./viewer";
import MorningBrief from "./pages/MorningBrief";
import DealBook from "./pages/DealBook";
import DealRoom from "./pages/DealRoom";
import Circle from "./pages/Circle";
import FamilyProfile from "./pages/FamilyProfile";
import ArchiveSearch from "./pages/ArchiveSearch";
import ArchiveReader from "./pages/ArchiveReader";
import Introductions from "./pages/Introductions";
import PartnerConsole from "./pages/PartnerConsole";
import Command from "./pages/Command";
import Events from "./pages/Events";
import EventCapture from "./pages/EventCapture";
import Onboarding from "./pages/Onboarding";
import Foundations from "./pages/Foundations";

// The hosted preview (a claude.ai artifact) has no real URLs, so it routes in memory.
const Router = import.meta.env.VITE_ROUTER === "memory" ? MemoryRouter : BrowserRouter;

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ViewerProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MorningBrief />} />
          <Route path="/deals" element={<DealBook />} />
          <Route path="/deals/:id" element={<DealRoom />} />
          <Route path="/circle" element={<Circle />} />
          <Route path="/families/:id" element={<FamilyProfile />} />
          <Route path="/archive" element={<ArchiveSearch />} />
          <Route path="/archive/:id" element={<ArchiveReader />} />
          <Route path="/introductions" element={<Introductions />} />
          <Route path="/partner" element={<PartnerConsole />} />
          <Route path="/command" element={<Command />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id/after" element={<EventCapture />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="*" element={<NotForThisRing sentence="There is nothing at this address." />} />
        </Routes>
      </ViewerProvider>
    </Router>
  );
}
