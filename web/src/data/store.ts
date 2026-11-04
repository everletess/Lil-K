import { useSyncExternalStore } from "react";
import { ARCHIVE } from "./data";
import type { ArchiveItem, Center } from "./types";

/*
 * On-screen state shared between pages. The prototype has no backend, so
 * everything here resets on reload.
 */

let centers: Record<string, Center[]> = Object.fromEntries(ARCHIVE.map((a) => [a.id, [a.center]]));
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setCenters(itemId: string, next: Center[]) {
  centers = { ...centers, [itemId]: next };
  listeners.forEach((fn) => fn());
}

/** The Centers of Excellence on every Intelligence item, as edited in Command. */
export function useCenters(): Record<string, Center[]> {
  return useSyncExternalStore(subscribe, () => centers);
}

export function centersOf(map: Record<string, Center[]>, item: ArchiveItem): Center[] {
  return map[item.id]?.length ? map[item.id] : [item.center];
}

/* Recordings the Advanced Team has approved in Command this session. */
const published = new Set<string>();
let publishedVersion = 0;

export function publishRecording(itemId: string) {
  published.add(itemId);
  publishedVersion += 1;
  listeners.forEach((fn) => fn());
}

export function isPublished(itemId: string): boolean {
  return published.has(itemId);
}

/** Re-renders when a recording is published. */
export function usePublishedVersion(): number {
  return useSyncExternalStore(subscribe, () => publishedVersion);
}
