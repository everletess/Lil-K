import type { ArchiveItem, Deal, Ring, Viewer } from "./types";

/**
 * Access is concentric: a viewer sees their own ring and every ring outside it,
 * never a ring closer to the centre. Ring 0 sees everything.
 */
export function ringVisible(itemRing: Ring, viewer: Viewer): boolean {
  return itemRing >= viewer.ring;
}

export function visibleDeals(deals: Deal[], viewer: Viewer): Deal[] {
  return deals.filter((d) => ringVisible(d.ring, viewer));
}

/**
 * Archive items reach a member only when cleared (with or without attribution)
 * for a ring they can see. Under-review and restricted items are Advanced Team only.
 */
export function archiveVisible(item: ArchiveItem, viewer: Viewer): boolean {
  if (viewer.ring === 0) return true;
  if (item.rights === "under_review" || item.rights === "restricted") return false;
  return ringVisible(item.ring, viewer);
}

export function rightsLabel(item: ArchiveItem): string {
  switch (item.rights) {
    case "cleared":
      return `CLEARED · RING ${item.ring}`;
    case "attribution_removed":
      return "CLEARED · ATTRIBUTION REMOVED";
    case "under_review":
      return "UNDER REVIEW";
    case "restricted":
      return `RESTRICTED · RING ${item.ring}`;
  }
}

/** Reading events are logged. In the prototype they are kept in memory. */
export const readingLog: { itemId: string; viewerId: string; at: string }[] = [];

export function logReading(itemId: string, viewer: Viewer) {
  readingLog.push({ itemId, viewerId: viewer.id, at: new Date().toISOString() });
}
