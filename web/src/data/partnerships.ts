import type { Ring, RumStrength } from "./types";

/*
 * Partnerships & Resources: how a Brand Partner contributes to the circle and
 * what comes back. Sample data for Northgate Trust Company, consistent with
 * PARTNER and COMMAND in data.ts. "Today" is Monday 14 September 2026.
 */

export const PARTNER_ID = "northgate";

/** The six ways a partner takes part. Each is a section on the page. */
export const PARTICIPATION = [
  { n: "01", id: "contribute", label: "Contribute", line: "Research, thought leadership, events and opportunities, reviewed before families see them." },
  { n: "02", id: "needs", label: "Respond", line: "Answer specific needs and questions from families who have opted in to hear from you." },
  { n: "03", id: "convene", label: "Convene", line: "Take part in curated conversations, working groups and programming tied to your expertise." },
  { n: "04", id: "introductions", label: "Introductions", line: "Receive and manage warm introductions. Both sides agree before anyone is named." },
  { n: "05", id: "contributing", label: "Contributing to", line: "See the priorities, initiatives and relationships your work is moving." },
  { n: "06", id: "outcomes", label: "Outcomes", line: "Relationships activated, opportunities created, pipeline influenced, results achieved." },
] as const;

export type ResourceType = "Research" | "Thought leadership" | "Resource" | "Event" | "Opportunity";
export const RESOURCE_TYPES: readonly ResourceType[] = ["Research", "Thought leadership", "Resource", "Event", "Opportunity"];

export type PartnerResource = {
  id: string;
  partnerId: string;
  type: ResourceType;
  title: string;
  center: string;
  ring: Ring;
  status: "Published" | "In review";
  date: string;
  reach: string;
};

export const RESOURCES: PartnerResource[] = [
  { id: "corridor-2027", partnerId: PARTNER_ID, type: "Research", title: "India–Europe corridor: where family capital is landing in 2027", center: "The Business of Families", ring: 1, status: "Published", date: "2026-09-02", reach: "Read by 14 families · 3 questions back" },
  { id: "custody-checklist", partnerId: PARTNER_ID, type: "Resource", title: "Cross-border custody for education trusts: a working checklist", center: "The Assets of Families", ring: 1, status: "Published", date: "2026-08-28", reach: "Requested by the Okafor family" },
  { id: "succession-structures", partnerId: PARTNER_ID, type: "Thought leadership", title: "Succession without a sale: five structures families have used", center: "The Business of Families", ring: 2, status: "Published", date: "2026-08-12", reach: "Read by 21 families" },
  { id: "munich-salon", partnerId: PARTNER_ID, type: "Event", title: "Succession without a sale, Munich, 6 November", center: "The Business of Families", ring: 1, status: "Published", date: "2026-08-20", reach: "10 families attending" },
  { id: "dach-carveout", partnerId: PARTNER_ID, type: "Opportunity", title: "Co-investment alongside a DACH industrial carve-out", center: "The Business of Families", ring: 1, status: "In review", date: "2026-09-11", reach: "With the Advanced Team" },
  { id: "g5-governance", partnerId: PARTNER_ID, type: "Research", title: "Governance documents before a generational transition", center: "The Legacy of Families", ring: 2, status: "In review", date: "2026-09-09", reach: "With the Advanced Team" },
];

export type FamilyNeed = {
  familyId: string;
  center: string;
  need: string;
  asked: string;
  responded?: string;
};

/** Needs a family has chosen to share with this partner. Only opted-in families appear. */
export const NEEDS: FamilyNeed[] = [
  { familyId: "okafor", center: "The Assets of Families", need: "Custody for two education trusts held across Lagos and London. Who has done this cleanly?", asked: "2026-09-11" },
  { familyId: "al-rashid", center: "The Assets of Families", need: "Fund administration for Gulf Women Founders Fund I ahead of the second close.", asked: "2026-09-09" },
  { familyId: "mehra", center: "The Business of Families", need: "Opening banking for the London holding entity. What will the regulator ask us for?", asked: "2026-09-08", responded: "2026-09-10" },
  { familyId: "thorne", center: "The Business of Families", need: "A possible carve-out of the services arm in 2027. What should we do in the next twelve months?", asked: "2026-09-03" },
  { familyId: "lindqvist", center: "The Legacy of Families", need: "Governance documentation ahead of a G5 transition.", asked: "2026-09-01", responded: "2026-09-04" },
];

export type Programme = {
  date: string;
  name: string;
  kind: "Working group" | "Salon" | "Session" | "Call" | "Dinner";
  families: string;
  role: string;
};

export const PROGRAMMING: Programme[] = [
  { date: "2026-09-18", name: "Dinner & Diligence", kind: "Dinner", families: "9 families", role: "Two partners, corridor team" },
  { date: "2026-09-24", name: "CC Live! quarterly call", kind: "Call", families: "31 families", role: "Listening" },
  { date: "2026-10-08", name: "India–Europe Corridor working session", kind: "Session", families: "8 families", role: "Leading, with the head of private banking" },
  { date: "2026-10-22", name: "Succession & Carve-outs", kind: "Working group", families: "10 families", role: "Standing contributor" },
  { date: "2026-11-06", name: "Succession without a sale, Munich", kind: "Salon", families: "10 families", role: "You host; two speakers" },
];

export type PartnerIntro = {
  familyId: string;
  person: string;
  why: string;
  stage: "Asked for you" | "Awaiting the family" | "Both agreed" | "Met";
  date: string;
  next: string;
};

export const PARTNER_INTROS: PartnerIntro[] = [
  { familyId: "thorne", person: "Ellis Thorne", why: "Succession and a possible carve-out in 2027", stage: "Asked for you", date: "2026-09-12", next: "Accept the introduction" },
  { familyId: "mehra", person: "Dev Mehra", why: "Corridor banking for the London entity", stage: "Awaiting the family", date: "2026-09-11", next: "Waiting 3 days" },
  { familyId: "okafor", person: "Idris Okafor", why: "Cross-border custody for the education trusts", stage: "Met", date: "2026-09-09", next: "Follow-on booked 29 Sep" },
  { familyId: "lindqvist", person: "Dr. Ana Lindqvist", why: "Governance documentation ahead of a G5 transition", stage: "Both agreed", date: "2026-09-07", next: "Meeting 21 Sep, Stockholm" },
];

export type Contribution = {
  priority: string;
  through: string;
  families: { familyId: string; rum: RumStrength }[];
};

export const CONTRIBUTING: Contribution[] = [
  {
    priority: "Win corridor banking mandates from Indian family capital entering Europe",
    through: "Corridor research · India–Europe Corridor working session · the Mehra introduction",
    families: [{ familyId: "mehra", rum: 2 }, { familyId: "okafor", rum: 3 }],
  },
  {
    priority: "Be the firm families name when a succession turns into a carve-out",
    through: "Munich salon (host) · Succession & Carve-outs working group · the Thorne introduction",
    families: [{ familyId: "thorne", rum: 1 }, { familyId: "lindqvist", rum: 2 }],
  },
  {
    priority: "Gulf Women Founders Fund I, at the Al-Rashid family's request",
    through: "Fund administration ahead of the second close on 31 Oct",
    families: [{ familyId: "al-rashid", rum: 2 }],
  },
];

export const OUTCOMES = [
  { label: "Relationships activated", value: "15", source: "Introductions to the Okafor, Lindqvist and Thorne families; Dinner & Diligence, New York" },
  { label: "Opportunities created", value: "5", source: "Three corridor banking conversations; two succession reviews" },
  { label: "Pipeline influenced", value: "3", source: "The Mehra London entity; the Thorne 2027 carve-out; the Lindqvist governance work" },
  { label: "Results achieved", value: "1", source: "Custody mandate for the Okafor education trusts" },
];
