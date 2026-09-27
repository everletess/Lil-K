export type Ring = 0 | 1 | 2 | 3;
export type RumStrength = 1 | 2 | 3 | 4;

export type Center = "People" | "Legacy" | "Lifestyle" | "Business" | "Assets";

export type Stage = "intake" | "analyze" | "strategize" | "close";

export type Viewer = {
  id: string;
  name: string;
  firstName: string;
  ring: Ring;
  ringLabel: string;
  familyId: string | null;
  kind: "member" | "team" | "partner";
  home: string;
};

export type Family = {
  id: string;
  name: string;
  cities: string[];
  generations: string;
  ring: Ring;
  memberSince?: number;
  centersOfNeed: Center[];
  interests: string[];
  relationshipOwner: string;
};

export type Deal = {
  id: string;
  name: string;
  center: Center;
  structure: string;
  corridor?: string;
  leadFamilyId: string | null;
  stage: Stage;
  decisionDate: string | null;
  ring: Ring;
  rum: RumStrength;
  fit: string;
  owner: string;
};

export type ArchiveRights = "cleared" | "attribution_removed" | "under_review" | "restricted";
export type ArchiveKind = "Roundtable" | "Call" | "1:1" | "Event note" | "Working session";

export type ArchiveItem = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm or yyyy-mm-dd
  center: Center;
  kind: ArchiveKind;
  speakers: string;
  ring: Ring;
  rights: ArchiveRights;
  attributedFamilies?: string[];
};

export type Introduction = {
  id: string;
  pair: string;
  whyNow: string;
  rings: [Ring, Ring];
  rumA: RumStrength;
  rumB: RumStrength;
  asked: string;
};

export type IntroRequest = {
  id: string;
  who: string;
  context: string;
  askedOn: string;
};

export type Outcome = "Met" | "In conversation" | "Invested" | "Partnered" | "No fit";

export type EventFormat = "Dinner & Diligence" | "CC Live!" | "Masterclass" | "Salon" | "Working session";

export type CircleEvent = {
  id: string;
  date: string;
  name: string;
  city: string;
  format: EventFormat;
  serves: string;
  host: string;
  familiesAttending: number;
  named: string;
  viewerStatus: "attending" | "invited";
};
