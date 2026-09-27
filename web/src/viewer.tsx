import { createContext, useContext, useState, type ReactNode } from "react";
import { VIEWERS } from "./data/data";
import type { Viewer } from "./data/types";

type ViewerState = { viewer: Viewer; setViewerId: (id: string) => void };

const ViewerContext = createContext<ViewerState | null>(null);

const STORAGE_KEY = "cc-viewer";

function initialViewerId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "eleanor";
  } catch {
    return "eleanor";
  }
}

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(initialViewerId);
  const viewer = VIEWERS.find((v) => v.id === id) ?? VIEWERS[0];
  const setViewerId = (next: string) => {
    setId(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable; the choice lasts for this session only */
    }
  };
  return <ViewerContext.Provider value={{ viewer, setViewerId }}>{children}</ViewerContext.Provider>;
}

export function useViewer(): ViewerState {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error("useViewer must be used inside ViewerProvider");
  return ctx;
}
