import type { Center } from "./types";

/*
 * Sample content for the Phase 2 previews: recordings that arrive from Zoom
 * and are summarised, the post-event summary on the Morning Brief, and family
 * suggestions for events. "Today" is Monday 14 September 2026.
 */

export type Chapter = { at: string; title: string; points: string };

export type CallSummary = {
  source: string;
  length: string;
  attended: string;
  summary: string;
  chapters: Chapter[];
  next: string[];
};

/** Summaries drafted from the recording transcript and approved by the Advanced Team. */
export const SUMMARIES: Record<string, CallSummary> = {
  "health-longevity-sep": {
    source: "Zoom recording, catalogued automatically",
    length: "1 h 32 min",
    attended: "9 families attended · summary sent to the 5 who were not there",
    summary:
      "Nine families compared how they arrange care for a first-generation principal, and agreed that what they want is a family health office, not more concierge medicine. The group set a standard for diligence on longevity clinics: outcomes data first, protocols second. Two families are reading Pond Lily Neuro Clinic's Series B; neither will chair diligence yet.",
    chapters: [
      { at: "00:00", title: "Why the group meets", points: "The conveners set the question for the season: what does good care look like across three generations." },
      { at: "08:40", title: "Care for a first-generation principal", points: "Two families shared what they pay for and what goes unused. Coordination, not access, is the gap." },
      { at: "31:15", title: "Diligence on longevity clinics", points: "Ask for outcomes data and patient retention before protocols. One family walked through a clinic it declined." },
      { at: "52:30", title: "Pond Lily Neuro Clinic Series B", points: "Two families reading. The open question is who chairs diligence before 17 Oct." },
      { at: "74:05", title: "Who holds the health records", points: "The family, not the clinic. Three families now keep records in their own office." },
      { at: "86:50", title: "Next session and asks", points: "26 Sep. Families asked for a speaker on records portability." },
    ],
    next: [
      "Next session 26 Sep, remote.",
      "Pond Lily Neuro Clinic needs a family to chair diligence.",
      "Speaker wanted: health records portability.",
    ],
  },
};

/** Recordings waiting for the Advanced Team: arrived from Zoom, Centers suggested, not yet published. */
export const RECORDING_INBOX = [
  {
    itemId: "lwp-september-checkin",
    source: "Zoom · 1 h 04 min · matched to the calendar invitation",
    suggested: ["Assets", "Legacy"] as Center[],
  },
];

export type SuggestionKind = "Topic" | "Question" | "Guest speaker" | "Event";
export const SUGGESTION_KINDS: readonly SuggestionKind[] = ["Topic", "Question", "Guest speaker", "Event"];

export type Suggestion = {
  id: string;
  kind: SuggestionKind;
  text: string;
  center: Center;
  from: string;
  date: string;
  attending: number;
  status: "New" | "Scheduled" | "With the Advanced Team";
};

export const SUGGESTIONS: Suggestion[] = [
  { id: "s1", kind: "Guest speaker", text: "Someone who has moved a family's health records out of a clinic and into the family office.", center: "People", from: "the Al-Rashid family", date: "2026-09-10", attending: 6, status: "With the Advanced Team" },
  { id: "s2", kind: "Question", text: "How are families pricing water rights in a drought year without ten years of delivery records?", center: "Assets", from: "the Brenner family", date: "2026-09-08", attending: 9, status: "Scheduled" },
  { id: "s3", kind: "Topic", text: "Preparing the fourth generation to sit on an investment committee.", center: "Legacy", from: "the Lindqvist family", date: "2026-09-05", attending: 7, status: "New" },
  { id: "s4", kind: "Event", text: "A small dinner in Lagos on education trusts that cross two jurisdictions.", center: "People", from: "the Okafor family", date: "2026-09-02", attending: 4, status: "New" },
];
