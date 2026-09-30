import type {
  ArchiveItem, CircleEvent, Deal, Family, IntroRequest, Introduction, Outcome,
  RumStrength, Stage, Viewer,
} from "./types";

export const CURATED_LINE = "Curated for the circle. Not an endorsement. Decisions are your own.";

/* ------------------------------------------------------------------ viewers */

export const VIEWERS: Viewer[] = [
  {
    id: "eleanor", name: "Eleanor Whitcombe", firstName: "Eleanor", ring: 1,
    ringLabel: "RING 1 · CLOSE CIRCLE", familyId: "whitcombe", kind: "member", home: "/",
  },
  {
    id: "priya", name: "Priya Mehra", firstName: "Priya", ring: 1,
    ringLabel: "RING 1 · CLOSE CIRCLE", familyId: "mehra", kind: "member", home: "/families/mehra",
  },
  {
    id: "samira", name: "Samira Salman", firstName: "Samira", ring: 0,
    ringLabel: "RING 0 · ADVANCED TEAM", familyId: null, kind: "team", home: "/command",
  },
  {
    id: "northgate", name: "Northgate Trust Company", firstName: "Northgate", ring: 3,
    ringLabel: "RING 3 · FOUNDING PARTNER", familyId: null, kind: "partner", home: "/partner",
  },
];

/* ----------------------------------------------------------------- families */

export const FAMILIES: Family[] = [
  {
    id: "whitcombe", name: "the Whitcombe family", cities: ["New York"], generations: "G2/G3", ring: 1,
    memberSince: 2017, centersOfNeed: ["Assets", "Legacy"],
    interests: ["Land, water and power", "municipal infrastructure", "ranch land"],
    relationshipOwner: "Samira Salman",
  },
  {
    id: "mehra", name: "the Mehra family", cities: ["Mumbai", "London"], generations: "G2", ring: 1,
    memberSince: 2019, centersOfNeed: ["Lifestyle", "Business"],
    interests: ["Hospitality recapitalisations", "India–Europe corridor", "education", "family governance", "healthcare access"],
    relationshipOwner: "Samira Salman",
  },
  {
    id: "lindqvist", name: "the Lindqvist family", cities: ["Stockholm"], generations: "G4", ring: 2,
    memberSince: 2020, centersOfNeed: ["Legacy", "Assets"],
    interests: ["Nordic forestry", "timber and carbon", "family governance"],
    relationshipOwner: "Advisory",
  },
  {
    id: "al-rashid", name: "the Al-Rashid family", cities: ["Dubai"], generations: "G2", ring: 2,
    memberSince: 2021, centersOfNeed: ["People", "Lifestyle"],
    interests: ["Gulf women founders", "hospitality", "education"],
    relationshipOwner: "Brand Partnerships",
  },
  {
    id: "okafor", name: "the Okafor family", cities: ["Lagos", "London"], generations: "G1/G2", ring: 1,
    memberSince: 2018, centersOfNeed: ["People", "Assets"],
    interests: ["Lagos real estate", "education trusts", "healthcare access"],
    relationshipOwner: "Investments",
  },
  {
    id: "brenner", name: "the Brenner family", cities: ["Denver"], generations: "G3", ring: 1,
    memberSince: 2016, centersOfNeed: ["Assets"],
    interests: ["Water rights", "municipal infrastructure", "ranch land"],
    relationshipOwner: "Investments",
  },
  {
    id: "thorne", name: "the Thorne family", cities: ["Munich"], generations: "G2", ring: 2,
    centersOfNeed: ["Business", "Legacy"],
    interests: ["Mittelstand succession", "industrial carve-outs", "DACH industrial services", "Northern Europe", "family governance"],
    relationshipOwner: "Operating Lead",
  },
];

export function family(id: string | null | undefined): Family | undefined {
  return FAMILIES.find((f) => f.id === id);
}

/** RUM from a family to each other family. Only the Whitcombe and Mehra views are drawn. */
export const RUM_FROM: Record<string, Record<string, RumStrength>> = {
  whitcombe: { whitcombe: 4, mehra: 3, lindqvist: 2, "al-rashid": 2, okafor: 3, brenner: 4, thorne: 1 },
  mehra: { whitcombe: 3, mehra: 4, lindqvist: 3, "al-rashid": 2, okafor: 3, brenner: 2, thorne: 2 },
};

/** The directory's RUM column, exactly as drawn for the Whitcombe view. */
export const DIRECTORY_RUM: Record<string, RumStrength> = {
  whitcombe: 4, mehra: 4, lindqvist: 2, "al-rashid": 2, okafor: 3, brenner: 4, thorne: 1,
};

export const WORKING_GROUPS = [
  { name: "Land, Water & Power", center: "The Assets of Families", count: "11 families", next: "2026-09-24", conveners: "Convened by the Whitcombe and Brenner families" },
  { name: "Next-Generation Governance", center: "The Legacy of Families", count: "14 families", next: "2026-10-01", conveners: "Convened by the Lindqvist and Mehra families" },
  { name: "Health & Longevity", center: "The People of Families", count: "9 families", next: "2026-09-26", conveners: "Convened by the Al-Rashid and Lindqvist families" },
  { name: "Hospitality & Property Operations", center: "The Lifestyle of Families", count: "8 families", next: "2026-10-15", conveners: "Convened by the Mehra and Okafor families" },
  { name: "Succession & Carve-outs", center: "The Business of Families", count: "10 families", next: "2026-10-22", conveners: "Convened by the Thorne and Whitcombe families" },
];

export const NEAR_YOU = [
  { familyId: "brenner", note: "In New York 22–25 Sep for the Northfield site visit. Your co-lead on water rights." },
  { familyId: "okafor", note: "Idris is at Dinner & Diligence on 18 Sep. Your education trust overlaps theirs." },
  { familyId: "al-rashid", note: "Opening a New York office this quarter and asked who runs your art advisory." },
];

/* ---------------------------------------------------------- family profiles */

export type ArchiveControl = "Attributed" | "Anonymise" | "Withhold";

export type FamilyProfileData = {
  principals: { name: string; role: string; note: string }[];
  theses: string;
  checkSize: string;
  structures: string;
  needs: { center: string; need: string; status: "Open" | "In progress" | "Met" }[];
  deals: { dealId: string; role: string; meta: string }[];
  intros: { pair: string; when: string; outcome: Outcome }[];
  events: { date: string; name: string; note: string }[];
  archive: { archiveId: string; control: ArchiveControl }[];
  archiveCount: number;
  route: { name: string; note: string; rum: RumStrength }[];
  routeNote: string;
  routeTarget: string;
};

export const PROFILES: Record<string, FamilyProfileData> = {
  mehra: {
    principals: [
      { name: "Priya Mehra", role: "Family office CEO", note: "Runs the hotels herself and sits on every investment committee." },
      { name: "Arjun Mehra", role: "Chair", note: "Built the original textiles business; now holds the family's governance seat." },
      { name: "Dev Mehra", role: "Next generation, London", note: "Leads the corridor work and the family's education commitments." },
    ],
    theses: "Hospitality recapitalisations in Southern Europe. The India–Europe corridor. Education.",
    checkSize: "$2M – $10M",
    structures: "SPV · Direct",
    needs: [
      { center: "The Legacy of Families", need: "Next-generation governance for a G3 transition", status: "In progress" },
      { center: "The Business of Families", need: "Outsourced general counsel for the London entity", status: "Open" },
      { center: "The Lifestyle of Families", need: "Operator for the Ravello property", status: "Met" },
    ],
    deals: [
      { dealId: "ravello", role: "Led", meta: "Lifestyle · SPV · decision 9 Oct" },
      { dealId: "northfield", role: "Joined, observer", meta: "Assets · Direct · decision 26 Sep" },
      { dealId: "meridian", role: "Passed", meta: "Business · SPV · passed 12 Aug" },
    ],
    intros: [
      { pair: "Priya Mehra → Henrik Lindqvist", when: "2026-03-04", outcome: "Invested" },
      { pair: "Dev Mehra → Idris Okafor", when: "2026-05-19", outcome: "In conversation" },
      { pair: "Priya Mehra → Samira Salman", when: "2026-02-02", outcome: "Met" },
      { pair: "Arjun Mehra → the Thorne family", when: "2026-06-28", outcome: "Met" },
    ],
    events: [
      { date: "2026-06-12", name: "CC Live! quarterly call", note: "Corridor structuring, spoke" },
      { date: "2026-05-03", name: "Dinner & Diligence, London", note: "Ravello recapitalisation" },
      { date: "2026-02-08", name: "Legacy Audit masterclass", note: "Two seats, Priya and Dev" },
    ],
    archive: [
      { archiveId: "corridor-session-2026", control: "Attributed" },
      { archiveId: "hospitality-1on1", control: "Anonymise" },
      { archiveId: "ai-roundtable", control: "Attributed" },
      { archiveId: "legacy-audit-2023", control: "Withhold" },
    ],
    archiveCount: 6,
    route: [
      { name: "Eleanor Whitcombe", note: "You", rum: 4 },
      { name: "Samira Salman", note: "Relationship owner for the Mehras", rum: 4 },
      { name: "Priya Mehra", note: "Family office CEO", rum: 3 },
    ],
    routeNote: "Samira has spoken with Priya twice this quarter and can carry the request.",
    routeTarget: "Priya Mehra",
  },
  whitcombe: {
    principals: [
      { name: "Eleanor Whitcombe", role: "Principal", note: "Leads the Land, Water & Power thesis and chairs the family's investment committee." },
      { name: "James Whitcombe", role: "Chief investment officer", note: "Runs diligence on Northfield and reads every municipal lease himself." },
      { name: "Clara Whitcombe", role: "Next generation, New York", note: "Sits on the education trust and the Next-Generation Governance group." },
    ],
    theses: "Senior water rights and municipal infrastructure. Ranch land held through successions. Education trusts.",
    checkSize: "$2.5M – $20M",
    structures: "Direct · SPV",
    needs: [
      { center: "The Legacy of Families", need: "A seat structure for G3 before the 2028 handover", status: "In progress" },
      { center: "The Assets of Families", need: "A water engineer on retainer across the Northfield basins", status: "Open" },
    ],
    deals: [
      { dealId: "northfield", role: "Led", meta: "Assets · Direct · decision 26 Sep" },
      { dealId: "ravello", role: "Joined", meta: "Lifestyle · SPV · soft-circled $3.0M" },
      { dealId: "gulf-women", role: "Joined", meta: "Assets · Fund · committed $1.5M" },
    ],
    intros: [
      { pair: "Eleanor Whitcombe → Hal Brenner", when: "2026-02-14", outcome: "Invested" },
      { pair: "Eleanor Whitcombe → Dr. Ana Lindqvist", when: "2026-04-09", outcome: "In conversation" },
      { pair: "Eleanor Whitcombe → Marguerite Dale", when: "2026-05-12", outcome: "Met" },
      { pair: "Eleanor Whitcombe → the Al-Rashid family", when: "2026-07-08", outcome: "No fit" },
    ],
    events: [
      { date: "2026-06-12", name: "CC Live! quarterly call", note: "Land, Water & Power thesis" },
      { date: "2026-02-20", name: "Dinner & Diligence, Denver", note: "Hosted with the Brenner family" },
    ],
    archive: [
      { archiveId: "lwp-thesis-call", control: "Attributed" },
      { archiveId: "dinner-denver-2025", control: "Attributed" },
      { archiveId: "drought-balance-sheet", control: "Anonymise" },
    ],
    archiveCount: 3,
    route: [],
    routeNote: "",
    routeTarget: "",
  },
};

/* -------------------------------------------------------------------- deals */

export const STAGE_OWNERS: Record<Stage, string> = {
  intake: "Samira Salman",
  analyze: "Investments",
  strategize: "Samira Salman",
  close: "the Whitcombe family",
};

export const DEALS: Deal[] = [
  {
    id: "pond-lily", name: "Pond Lily Neuro Clinic Series B", center: "People", structure: "Direct",
    leadFamilyId: null, stage: "intake", decisionDate: "2026-10-17", ring: 2, rum: 2, owner: "Samira Salman",
    fit: "Aligned to your health mandate; the Lindqvist family has asked who will lead.",
  },
  {
    id: "cascais", name: "Cascais Coastal Land Assembly", center: "Assets", structure: "Direct",
    leadFamilyId: "okafor", stage: "intake", decisionDate: null, ring: 2, rum: 1, owner: "Samira Salman",
    fit: "Adjacent to your Iberian holdings; submitted 11 Sep, not yet curated.",
  },
  {
    id: "blob-ai", name: "Blob AI", center: "Business", structure: "Direct",
    leadFamilyId: null, stage: "intake", decisionDate: "2026-10-31", ring: 1, rum: 1, owner: "Samira Salman",
    fit: "AI for people who don't trust AI: no ads, no data deals. Raising $5M at a $50M valuation.",
  },
  {
    id: "meridian", name: "Meridian Aviation Services Carve-out", center: "Business", structure: "SPV",
    leadFamilyId: "lindqvist", stage: "analyze", decisionDate: "2026-11-14", ring: 1, rum: 3, owner: "Operating Lead",
    fit: "Two of your operating partners already service this fleet.",
  },
  {
    id: "gulf-women", name: "Gulf Women Founders Fund I", center: "Assets", structure: "Fund", corridor: "Gulf Circle",
    leadFamilyId: "al-rashid", stage: "analyze", decisionDate: "2026-10-31", ring: 2, rum: 2, owner: "Investments",
    fit: "Second close; you invested in Fund I's predecessor vehicle.",
  },
  {
    id: "ravello", name: "Ravello Family Hotel Recapitalisation", center: "Lifestyle", structure: "SPV", corridor: "India–Europe Corridor",
    leadFamilyId: "mehra", stage: "strategize", decisionDate: "2026-10-09", ring: 1, rum: 3, owner: "Samira Salman",
    fit: "You asked for hospitality with operating control; Priya Mehra runs the assets herself.",
  },
  {
    id: "helsingor", name: "Helsingør Timber & Carbon Rights", center: "Assets", structure: "Direct",
    leadFamilyId: "lindqvist", stage: "strategize", decisionDate: "2026-11-21", ring: 1, rum: 3, owner: "Advisory",
    fit: "Neighbours your Baltic forestry; same registry counsel.",
  },
  {
    id: "northfield", name: "Northfield Water Rights Portfolio", center: "Assets", structure: "Direct", corridor: "Land, Water & Power",
    leadFamilyId: "whitcombe", stage: "close", decisionDate: "2026-09-26", ring: 1, rum: 4, owner: "Samira Salman",
    fit: "Matches your Land, Water & Power thesis; introduced via Milken.",
  },
  // Advanced Team only — never shown to Ring 1.
  {
    id: "aldgate", name: "Aldgate Single-Family Office Acquisition", center: "Business", structure: "Direct",
    leadFamilyId: null, stage: "intake", decisionDate: null, ring: 0, rum: 1, owner: "Samira Salman",
    fit: "Held at Ring 0 while the seller's family is consulted.",
  },
  {
    id: "tessin", name: "Tessin Family Art Collection Financing", center: "Lifestyle", structure: "SPV",
    leadFamilyId: null, stage: "analyze", decisionDate: "2026-12-04", ring: 0, rum: 1, owner: "Advisory",
    fit: "Held at Ring 0 pending the family's consent to circulate.",
  },
];

export function deal(id: string | undefined): Deal | undefined {
  return DEALS.find((d) => d.id === id);
}

export type DealRoomData = {
  stageDates: Partial<Record<Stage, string>>;
  memoRevised: string;
  lead: string;
  memo: string[];
  /** The figures strip under the memo, in order. */
  figures: [label: string, amount: number][];
  /** The primary action once a family leads, e.g. "Soft-circle $2.5M". */
  primary?: string;
  threads: { name: string; role: string; date: string; body: string; open: boolean }[];
  syndicate: { familyId: string; soft: number; alloc: number | null; status: string }[];
  knowHere: { name: string; rum: RumStrength; note: string }[];
  warmestRoute: string;
  dataRoom: { name: string; kind: string; added: string; by: string; ring: number }[];
  decision: {
    meets: string;
    quorum: string;
    votes: { member: string; role: string; vote: "For" | "Against" | "Abstain" | "Pending"; note: string }[];
  };
  history: { date: string; event: string; by: string }[];
};

export const DEAL_ROOMS: Record<string, DealRoomData> = {
  northfield: {
    stageDates: { intake: "2026-07-02", analyze: "2026-07-28", strategize: "2026-09-04" },
    memoRevised: "Memo · revised 9 Sep by the Whitcombe family office",
    lead: "A portfolio of senior water rights across three Colorado basins, held under perpetual decree.",
    memo: [
      "Northfield holds 41,000 acre-feet of pre-1922 rights leased to two municipal districts and one agricultural cooperative. Contracted revenue is $4.1M against operating costs of $0.9M. The seller is a second-generation family exiting after a probate settlement and has agreed to a 90-day exclusivity with the circle.",
      "We are raising $30M of equity at a 6.8% unlevered yield. The Whitcombe family holds $18M and has asked the circle for the balance from families who can hold twenty years.",
    ],
    figures: [["Raise", 30_000_000], ["Soft-circled", 24_500_000], ["Minimum", 1_000_000]],
    primary: "Soft-circle $2.5M",
    threads: [
      { name: "Hal Brenner", role: "Water engineer · Ring 3 · invited by the Whitcombe family", date: "2026-09-11", body: "The 1922 decree priority is the whole asset. I have read the two municipal leases; both carry shortage-sharing language that has never been tested in court. I would price that.", open: true },
      { name: "Dr. Ana Lindqvist", role: "the Lindqvist family · Ring 2", date: "2026-09-09", body: "We hold similar rights in Chile. Our experience is that the agricultural cooperative renegotiates every drought cycle. Ask for ten years of delivery records, not five.", open: false },
      { name: "Samira Salman", role: "Founder · gate owner", date: "2026-09-08", body: "Two questions stand before the gate to Close: the shortage-sharing language and the cooperative's payment history. The Whitcombe office answers by 19 Sep.", open: false },
    ],
    syndicate: [
      { familyId: "whitcombe", soft: 18_000_000, alloc: 18_000_000, status: "Lead, committed" },
      { familyId: "mehra", soft: 4_000_000, alloc: 4_000_000, status: "Confirmed" },
      { familyId: "lindqvist", soft: 2_500_000, alloc: null, status: "Diligence" },
      { familyId: "al-rashid", soft: 1_000_000, alloc: null, status: "Reading memo" },
    ],
    knowHere: [
      { name: "Hal Brenner", rum: 4, note: "District board 2016–2023. Two calls with you this year." },
      { name: "Marguerite Dale", rum: 3, note: "Counsel on the 2021 basin transfer. Known to Samira." },
      { name: "the Whitcombe family", rum: 4, note: "Lead family. Co-invested with you twice." },
      { name: "Ellis Thorne", rum: 2, note: "Municipal district CFO. One degree via Hal Brenner." },
    ],
    warmestRoute: "Through Eleanor Whitcombe to Hal Brenner, who sat on the district board until 2023.",
    dataRoom: [
      { name: "Decree abstracts, three basins", kind: "Title", added: "2026-07-04", by: "the Whitcombe family office", ring: 1 },
      { name: "Municipal lease, Northfield District", kind: "Contract", added: "2026-07-18", by: "the Whitcombe family office", ring: 1 },
      { name: "Municipal lease, Carrow District", kind: "Contract", added: "2026-07-18", by: "the Whitcombe family office", ring: 1 },
      { name: "Cooperative delivery records, 2016–2025", kind: "Operating data", added: "2026-09-10", by: "Seller's counsel", ring: 1 },
      { name: "Hydrology review", kind: "Expert report", added: "2026-08-22", by: "Hal Brenner", ring: 1 },
      { name: "Syndicate terms, draft 3", kind: "Terms", added: "2026-09-09", by: "Samira Salman", ring: 1 },
    ],
    decision: {
      meets: "Investment committee meets 24 Sep. Decision 26 Sep.",
      quorum: "Four of five votes needed to close. Each family votes for its own allocation only.",
      votes: [
        { member: "the Whitcombe family", role: "Lead", vote: "For", note: "Committed $18M." },
        { member: "the Mehra family", role: "Syndicate", vote: "For", note: "Confirmed $4M." },
        { member: "the Lindqvist family", role: "Syndicate", vote: "Pending", note: "Awaiting delivery records." },
        { member: "the Al-Rashid family", role: "Syndicate", vote: "Pending", note: "Reading the memo." },
        { member: "Samira Salman", role: "Gate owner", vote: "Abstain", note: "Owns the gate; does not vote." },
      ],
    },
    history: [
      { date: "2026-09-11", event: "Hal Brenner flagged the shortage-sharing language as an open question.", by: "Hal Brenner" },
      { date: "2026-09-10", event: "Delivery records for 2016–2025 added to the data room.", by: "Seller's counsel" },
      { date: "2026-09-09", event: "Memo revised; minimum set at $1,000,000.", by: "the Whitcombe family office" },
      { date: "2026-09-04", event: "Gate to Hustle & Close cleared.", by: "Samira Salman" },
      { date: "2026-08-22", event: "Hydrology review added.", by: "Hal Brenner" },
      { date: "2026-07-28", event: "Gate to Strategize cleared.", by: "Samira Salman" },
      { date: "2026-07-02", event: "Submitted to the circle via Milken; curated in.", by: "the Whitcombe family" },
    ],
  },
  "blob-ai": {
    stageDates: {},
    memoRevised: "Intake summary · Samira Salman",
    lead: "AI for people who don't trust AI: a subscription companion from Everle, Inc. that answers to the person using it, not to an advertiser.",
    memo: [
      "Blob is built for the real parts of life (the 2 a.m. ideas and the big decisions) rather than for spreadsheets. The model is the product, not the user: zero ads, zero data deals and zero training on what people tell it. No one at Blob can read members' chats, and the company says their data will never pay the bills.",
      "The company is raising $5M at a $50M valuation. No family has taken the lead yet, and the gate to Analyze needs one. Before that gate the lead will ask for revenue and retention figures, the cap table and the terms of the round.",
    ],
    figures: [["Raise", 5_000_000], ["Valuation", 50_000_000], ["Soft-circled", 0]],
    threads: [],
    syndicate: [],
    knowHere: [],
    warmestRoute: "",
    dataRoom: [],
    decision: {
      meets: "Decision 31 Oct.",
      quorum: "The gate to Analyze opens once a family takes the lead.",
      votes: [],
    },
    history: [
      { date: "2026-09-14", event: "Submitted to the circle and curated in at Intake. Lead sought.", by: "Samira Salman" },
    ],
  },
};

/** "Deals you are in" for the Whitcombe view. */
export const MY_DEALS = [
  { dealId: "ravello", note: "Soft-circled $3.0M · the Mehra family leads", stage: "Strategize" },
  { dealId: "meridian", note: "Reading the memo · owner Operating Lead", stage: "Analyze" },
  { dealId: "gulf-women", note: "Committed $1.5M · closed 4 Aug", stage: "Closed" },
];

/* ------------------------------------------------------------------ archive */

export const ARCHIVE: ArchiveItem[] = [
  { id: "lwp-thesis-call", title: "Land, Water & Power thesis call with operators", date: "2026-06", center: "Assets", kind: "Call", speakers: "Hal Brenner · A member", ring: 1, rights: "cleared", attributedFamilies: ["whitcombe", "brenner"] },
  { id: "ai-roundtable", title: "Family Office AI Roundtable", date: "2024-03-14", center: "Business", kind: "Roundtable", speakers: "Samira Salman · Henrik Lindqvist · 9 others", ring: 1, rights: "cleared", attributedFamilies: ["mehra", "lindqvist", "okafor"] },
  { id: "dinner-denver-2025", title: "Dinner & Diligence, Denver", date: "2025-02", center: "Assets", kind: "Event note", speakers: "the Brenner family · Samira Salman", ring: 1, rights: "cleared", attributedFamilies: ["brenner", "whitcombe"] },
  { id: "womens-health-boston", title: "Women's Health 1:1 series, Boston", date: "2023-11", center: "People", kind: "1:1", speakers: "A member", ring: 1, rights: "attribution_removed" },
  { id: "corridor-banking", title: "Corridor banking for Indian family capital", date: "2026-05", center: "Business", kind: "Working session", speakers: "Dev Mehra · Northgate Trust Company", ring: 1, rights: "cleared", attributedFamilies: ["mehra"] },
  { id: "drought-balance-sheet", title: "Drought and the family balance sheet", date: "2023-09", center: "Assets", kind: "Call", speakers: "A member · A member", ring: 1, rights: "attribution_removed", attributedFamilies: ["whitcombe"] },
  { id: "hospitality-ops", title: "Hospitality operations after a recapitalisation", date: "2026-03", center: "Lifestyle", kind: "1:1", speakers: "Priya Mehra", ring: 1, rights: "cleared", attributedFamilies: ["mehra"] },
  { id: "municipal-water", title: "Municipal water contracts, what breaks", date: "2022-04", center: "Assets", kind: "Roundtable", speakers: "A member · 6 others", ring: 1, rights: "attribution_removed" },
  { id: "tech-review-2025", title: "Technology and the family office, 2025 review", date: "2025-01", center: "Business", kind: "Roundtable", speakers: "Samira Salman · 7 others", ring: 1, rights: "cleared" },
  // Items Ring 1 must never see.
  { id: "corridor-session-2026", title: "India–Europe corridor working session", date: "2026-06", center: "Business", kind: "Working session", speakers: "Dev Mehra · Priya Mehra", ring: 1, rights: "cleared", attributedFamilies: ["mehra"] },
  { id: "hospitality-1on1", title: "Hospitality operations 1:1", date: "2026-03", center: "Lifestyle", kind: "1:1", speakers: "A member", ring: 1, rights: "attribution_removed", attributedFamilies: ["mehra"] },
  { id: "legacy-audit-2023", title: "Legacy Audit working session", date: "2023-11", center: "Legacy", kind: "Working session", speakers: "Arjun Mehra · Samira Salman", ring: 0, rights: "restricted", attributedFamilies: ["mehra"] },
  { id: "legacy-audit-2019", title: "Legacy Audit working session", date: "2019-05", center: "Legacy", kind: "Working session", speakers: "Samira Salman · A member", ring: 0, rights: "restricted" },
  { id: "gulf-dinner-notes", title: "Gulf Women's Circle founding dinner notes", date: "2026-04", center: "People", kind: "Event note", speakers: "the Al-Rashid family", ring: 1, rights: "under_review" },
];

export function archiveItem(id: string | undefined): ArchiveItem | undefined {
  return ARCHIVE.find((a) => a.id === id);
}

export const ASK_SAMPLE = {
  question: "What have families said about water rights as an asset class?",
  keywords: ["water", "drought", "rights"],
  answer:
    "Families in the circle treat senior water rights as an inflation-linked holding with a twenty-year horizon, not an infrastructure trade. The recurring caution is contractual rather than hydrological: municipal leases carry shortage-sharing language that has never been tested, and agricultural cooperatives renegotiate in every drought cycle. Two families ask for ten years of delivery records before pricing. The Brenners hold that local board relationships, not counsel, decide how a transfer is received. Nobody in the archive has sold a position; two have added in drought years.",
  citations: ["lwp-thesis-call", "dinner-denver-2025", "drought-balance-sheet"] as [string, ...string[]],
};

export const TRANSCRIPTS: Record<string, { participants: string; lines: { who: string; body: string }[] }> = {
  "ai-roundtable": {
    participants: "Samira Salman · Henrik Lindqvist · Priya Mehra · the Okafor family · A member · A member · A member",
    lines: [
      { who: "SAMIRA SALMAN", body: "We agreed to start with the question the family actually asked, not the technology. Three offices in the room had already bought tools nobody used." },
      { who: "HENRIK LINDQVIST", body: "Our rule is that a system has to survive a generational handover. If it needs a vendor to explain it, it will not." },
      { who: "A MEMBER", body: "We run a single register of decisions. Every recommendation a machine makes is written next to the decision a person took. After two years we can see where the two disagreed and why." },
      { who: "PRIYA MEHRA", body: "The hotels taught us that the work is the data entry, not the model. Nobody in this room has clean data on their own operating companies." },
      { who: "SAMIRA SALMAN", body: "So the first commitment is unglamorous: one shared definition of a relationship, one owner per relationship, reviewed twice a year." },
      { who: "A MEMBER", body: "Agreed. And nothing leaves the circle. If a family cannot say something here without it appearing in a newsletter, they will say nothing." },
    ],
  },
};

export const RELATED: Record<string, { conversations: { id: string; meta: string }[]; deals: { dealId: string; meta: string }[] }> = {
  "ai-roundtable": {
    conversations: [
      { id: "corridor-banking", meta: "May 2026 · Business · cites this conversation" },
      { id: "legacy-audit-2023", meta: "Nov 2023 · Legacy · cited here" },
      { id: "tech-review-2025", meta: "Jan 2025 · Business · cites this conversation" },
    ],
    deals: [
      { dealId: "meridian", meta: "Business · SPV · memo cites this call" },
      { dealId: "northfield", meta: "Assets · Direct · diligence thread cites this call" },
    ],
  },
};

/* ------------------------------------------------------------ introductions */

export const TO_MAKE: Introduction[] = [
  { id: "mehra-okafor", pair: "Priya Mehra → Idris Okafor", whyNow: "Priya is recapitalising four hotels and asked for an operator who has run assets in two currencies. You have worked with Idris on the Lagos school trust.", rings: [1, 1], rumA: 4, rumB: 3, asked: "2026-09-11" },
  { id: "lindqvist-brenner", pair: "Henrik Lindqvist → Hal Brenner", whyNow: "Henrik wants ten years of delivery records on a Chilean position and Hal has read every municipal lease in the Northfield book.", rings: [2, 3], rumA: 2, rumB: 4, asked: "2026-09-09" },
  { id: "dev-amara", pair: "Dev Mehra → Amara Okafor", whyNow: "Both are building education commitments in two countries and neither has met the other's counsel.", rings: [1, 1], rumA: 3, rumB: 3, asked: "2026-09-05" },
];

export const AWAITING: IntroRequest[] = [
  { id: "henrik-cio", who: "Henrik Lindqvist", context: "Asks to meet your CIO on legacy audit methodology, ahead of their G5 transition.", askedOn: "2026-09-12" },
  { id: "northgate", who: "Northgate Trust Company", context: "Corridor banking for the India–Europe deals; Samira has vouched for the firm.", askedOn: "2026-09-09" },
  { id: "thorne-ranch", who: "the Thorne family", context: "Joining as Close Circle in October and asked to speak with a family that has held ranch land through a succession.", askedOn: "2026-09-05" },
];

/** The Morning Brief's shorter wording of pending requests. */
export const BRIEF_PENDING = [
  { who: "Henrik Lindqvist asks to meet your CIO", why: "Legacy audit methodology, ahead of their G5 handover", askedOn: "2026-09-12" },
  { who: "Amara Okafor → your education trust", why: "Lagos school portfolio, co-investment", askedOn: "2026-09-09" },
  { who: "Brand partner: Northgate Trust Company", why: "Corridor banking for India–Europe deals", askedOn: "2026-09-06" },
];

export const OUTCOMES: { pair: string; date: string; asked: string; outcome: Outcome; deal: string }[] = [
  { pair: "Eleanor Whitcombe → Hal Brenner", date: "2026-02-14", asked: "the Whitcombe family", outcome: "Invested", deal: "Northfield Water Rights Portfolio" },
  { pair: "Priya Mehra → Henrik Lindqvist", date: "2026-03-04", asked: "the Mehra family", outcome: "Invested", deal: "Ravello Family Hotel Recapitalisation" },
  { pair: "Samira Salman → Idris Okafor", date: "2026-03-22", asked: "the Okafor family", outcome: "Partnered", deal: "Lagos education trust, outside the circle" },
  { pair: "Eleanor Whitcombe → Dr. Ana Lindqvist", date: "2026-04-09", asked: "the Lindqvist family", outcome: "In conversation", deal: "Pond Lily Neuro Clinic Series B" },
  { pair: "Arjun Mehra → the Thorne family", date: "2026-06-28", asked: "the Thorne family", outcome: "Met", deal: "—" },
  { pair: "Eleanor Whitcombe → Marguerite Dale", date: "2026-05-12", asked: "the Brenner family", outcome: "Met", deal: "—" },
  { pair: "Samira Salman → Ellis Thorne", date: "2026-06-03", asked: "the Whitcombe family", outcome: "In conversation", deal: "Northfield Water Rights Portfolio" },
  { pair: "Dev Mehra → Northgate Trust Company", date: "2026-05-19", asked: "Northgate Trust Company", outcome: "Partnered", deal: "India–Europe corridor mandate" },
  { pair: "Eleanor Whitcombe → the Al-Rashid family", date: "2026-07-08", asked: "the Al-Rashid family", outcome: "No fit", deal: "—" },
  { pair: "Idris Okafor → Priya Mehra", date: "2026-08-01", asked: "the Mehra family", outcome: "In conversation", deal: "Ravello Family Hotel Recapitalisation" },
];

/* ------------------------------------------------------------------- events */

export const EVENTS: CircleEvent[] = [
  { id: "dd-new-york", date: "2026-09-18", name: "Dinner & Diligence", city: "New York", format: "Dinner & Diligence", serves: "Northfield Water Rights Portfolio", host: "Samira Salman", familiesAttending: 9, named: "the Whitcombe, Brenner and Okafor families", viewerStatus: "attending" },
  { id: "cc-live-q3", date: "2026-09-24", name: "CC Live! quarterly call", city: "Remote", format: "CC Live!", serves: "Land, Water & Power thesis review", host: "Thought Leadership", familiesAttending: 31, named: "the Mehra, Lindqvist and Al-Rashid families", viewerStatus: "attending" },
  { id: "boston-breakfast", date: "2026-09-29", name: "Women's health breakfast", city: "Boston", format: "Salon", serves: "The People of Families working group", host: "Advisory", familiesAttending: 7, named: "the Al-Rashid, Lindqvist and Okafor families", viewerStatus: "invited" },
  { id: "spv-masterclass", date: "2026-10-08", name: "Structuring an SPV across jurisdictions", city: "London", format: "Masterclass", serves: "Ravello Family Hotel Recapitalisation", host: "the Mehra family", familiesAttending: 12, named: "the Mehra, Thorne and Whitcombe families", viewerStatus: "invited" },
  { id: "corridor-session", date: "2026-10-15", name: "India–Europe Corridor working session", city: "London", format: "Working session", serves: "Northgate Trust Company initiative", host: "Dev Mehra", familiesAttending: 8, named: "the Mehra, Okafor and Thorne families", viewerStatus: "invited" },
  { id: "gulf-dinner", date: "2026-10-22", name: "Gulf Women's Circle founding dinner", city: "Dubai", format: "Salon", serves: "Gulf Women Founders Fund I", host: "the Al-Rashid family", familiesAttending: 11, named: "the Al-Rashid, Mehra and Okafor families", viewerStatus: "invited" },
  { id: "succession-munich", date: "2026-11-06", name: "Succession without a sale", city: "Munich", format: "Masterclass", serves: "The Business of Families working group", host: "Northgate Trust Company", familiesAttending: 10, named: "the Thorne, Lindqvist and Whitcombe families", viewerStatus: "invited" },
  { id: "dd-stockholm", date: "2026-11-19", name: "Dinner & Diligence", city: "Stockholm", format: "Dinner & Diligence", serves: "Helsingør Timber & Carbon Rights", host: "the Lindqvist family", familiesAttending: 6, named: "the Lindqvist, Thorne and Brenner families", viewerStatus: "invited" },
];

export const BRIEF_EVENTS = [
  { date: "2026-09-18", name: "Dinner & Diligence, New York", note: "Northfield water rights · 9 families attending", eventId: "dd-new-york" },
  { date: "2026-09-24", name: "CC Live! quarterly call", note: "Land, Water & Power thesis review", eventId: "cc-live-q3" },
  { date: "2026-10-08", name: "Masterclass: structuring an SPV across jurisdictions", note: "With the Mehra family office", eventId: "spv-masterclass" },
];

/** Prefilled capture for the New York dinner, as drawn. */
export const CAPTURE_PREFILL: Record<string, {
  came: string[];
  discussed: string;
  needs: { center: string; familyId: string; need: string }[];
  intros: { pair: string; why: string }[];
  deals: string[];
}> = {
  "dd-new-york": {
    came: ["whitcombe", "brenner", "okafor"],
    discussed: "Two hours on the Northfield leases. Hal Brenner walked the room through the shortage-sharing language and three families asked for the delivery records before the 26th.",
    needs: [
      { center: "The Assets of Families", familyId: "brenner", need: "Wants a water engineer on retainer, not per deal." },
      { center: "The People of Families", familyId: "okafor", need: "Asked who runs a G2 education committee well." },
    ],
    intros: [{ pair: "Hal Brenner → the Lindqvist family", why: "Henrik wants the Chilean delivery records read by someone who has done it." }],
    deals: ["northfield", "helsingor"],
  },
};

/* ------------------------------------------------------------------ partner */

export const PARTNER = {
  name: "Northgate Trust Company",
  subline: "Founding Partner since 2026 · Business of Families · Assets of Families",
  priorities: [
    { text: "Win corridor banking mandates from Indian family capital entering Europe", kpis: "RUM activated · Opportunities created · Qualified pipeline influenced · Target outcomes achieved", figures: "RUM activated 9 · Opportunities created 3 · Qualified pipeline 2 · Outcomes 1" },
    { text: "Be the firm families name when a succession turns into a carve-out", kpis: "RUM activated · Opportunities created · Qualified pipeline influenced · Target outcomes achieved", figures: "RUM activated 6 · Opportunities created 2 · Qualified pipeline 1 · Outcomes 0" },
    { text: "Hold one working session a quarter that families would attend without us", kpis: "Sessions held · Families attending · Needs raised · Follow-on conversations", figures: "Sessions held 2 · Families attending 19 · Needs raised 7 · Follow-on 11" },
  ],
  initiatives: [
    { date: "2026-09-18", name: "Dinner & Diligence", city: "New York", families: "9 families", firm: "Two partners, corridor team" },
    { date: "2026-09-24", name: "CC Live! quarterly call", city: "Remote", families: "31 families", firm: "One partner, listening" },
    { date: "2026-10-08", name: "India–Europe Corridor working session", city: "London", families: "8 families", firm: "Three, including the head of private banking" },
    { date: "2026-11-06", name: "Succession without a sale", city: "Munich", families: "10 families", firm: "You host; two speakers" },
  ],
  optedIn: [
    { familyId: "mehra", overlap: "The Business of Families", reason: "Corridor banking for the London entity", owner: "Samira Salman", optedIn: true },
    { familyId: "thorne", overlap: "The Business of Families", reason: "Succession and a possible carve-out in 2027", owner: "Operating Lead", optedIn: true },
    { familyId: "okafor", overlap: "The Assets of Families", reason: "Cross-border custody for the education trusts", owner: "Investments", optedIn: true },
    { familyId: "lindqvist", overlap: "The Legacy of Families", reason: "Governance documentation ahead of a G5 transition", owner: "Advisory", optedIn: true },
    { familyId: "al-rashid", overlap: "The Assets of Families", reason: "Fund administration for Gulf Women Founders Fund I", owner: "Brand Partnerships", optedIn: true },
    { familyId: "brenner", overlap: "The Assets of Families", reason: "", owner: "Investments", optedIn: false },
  ],
};

/* ------------------------------------------------------------------ command */

export const COMMAND = {
  intake: [
    { id: "cascais", deal: "Cascais Coastal Land Assembly", center: "Assets · Direct", source: "the Okafor family", introducer: "Idris Okafor", submitted: "2026-09-11" },
    { id: "helsingor", deal: "Helsingør Timber & Carbon Rights", center: "Assets · Direct", source: "the Lindqvist family", introducer: "Dr. Ana Lindqvist", submitted: "2026-09-08" },
    { id: "munich-rollup", deal: "Munich Industrial Services Roll-up", center: "Business · SPV", source: "the Thorne family", introducer: "Samira Salman", submitted: "2026-09-03" },
  ],
  noLead: [
    { dealId: "blob-ai", meta: "Business · Direct · Ring 1 · decision 31 Oct", note: "Raising $5M at a $50M valuation; needs a family to chair diligence." },
    { dealId: "pond-lily", meta: "People · Direct · Ring 2 · decision 17 Oct", note: "Two families reading; neither will chair." },
    { dealId: "gulf-women", meta: "Assets · Fund · Ring 2 · second close 31 Oct", note: "Al-Rashid family will co-lead if a second family steps up." },
  ],
  unack: [
    { pair: "Priya Mehra → Idris Okafor", late: "Eleanor Whitcombe", days: "4 days" },
    { pair: "Henrik Lindqvist → Hal Brenner", late: "Hal Brenner", days: "5 days" },
    { pair: "Northgate Trust Company → the Mehra family", late: "Dev Mehra", days: "3 days" },
    { pair: "the Thorne family → the Brenner family", late: "the Brenner family", days: "6 days" },
  ],
  quiet: [
    { parties: "the Al-Rashid family · Samira Salman", owner: "Brand Partnerships", last: "2026-06-08", rum: 2 as RumStrength },
    { parties: "the Lindqvist family · Investments", owner: "Investments", last: "2026-06-02", rum: 2 as RumStrength },
    { parties: "Ellis Thorne · Samira Salman", owner: "Operating Lead", last: "2026-05-21", rum: 1 as RumStrength },
    { parties: "Marguerite Dale · Advisory", owner: "Advisory", last: "2026-05-14", rum: 3 as RumStrength },
    { parties: "the Okafor family · Thought Leadership", owner: "Thought Leadership", last: "2026-05-09", rum: 3 as RumStrength },
    { parties: "Northgate Trust Company · Technology & Data", owner: "Technology & Data", last: "2026-04-30", rum: 1 as RumStrength },
  ],
  rightsReviews: [
    { title: "Land, Water & Power thesis call with operators", date: "Jun 2026", reviewer: "Sarah", waiting: "12 days" },
    { title: "Corridor banking working session", date: "May 2026", reviewer: "Sarah", waiting: "19 days" },
    { title: "Gulf Women's Circle founding dinner notes", date: "Apr 2026", reviewer: "Sarah", waiting: "26 days" },
    { title: "Legacy Audit working session", date: "Nov 2023", reviewer: "Sarah", waiting: "31 days" },
    { title: "Women's Health 1:1 series, Boston", date: "Nov 2023", reviewer: "Sarah", waiting: "44 days" },
  ],
  escalations: [
    { id: "northfield", note: "Northfield syndicate at 58% soft-circle, decision in 12 days." },
    { id: "thorne", note: "Thorne family onboarding stalled at the Participation Agreement for nine days." },
  ],
  graphHealth: [
    { label: "Families", value: "52" },
    { label: "Relationships owned", value: "1,240" },
    { label: "Introductions this quarter", value: "31" },
    { label: "Archive cleared", value: "412 / 1,870" },
    { label: "Deals in pipeline", value: "10" },
  ],
};

/* --------------------------------------------------------------- onboarding */

export const SURVEY: { center: string; qs: { q: string; a: string }[] }[] = [
  { center: "The People of Families", qs: [
    { q: "Who in the family needs support this year, and with what?", a: "" },
    { q: "What health or education questions are open?", a: "" },
    { q: "Which relationships does the next generation need?", a: "" },
  ]},
  { center: "The Legacy of Families", qs: [
    { q: "What is the governance question you have not answered?", a: "Three cousins enter the business in 2028 and we have no seat structure for them." },
    { q: "When does the next transition happen?", a: "" },
    { q: "What would you want written down before it does?", a: "" },
  ]},
  { center: "The Lifestyle of Families", qs: [
    { q: "Which properties or assets need operators?", a: "" },
    { q: "What does the family want its time to look like?", a: "" },
    { q: "Where do you need trusted service, not advice?", a: "" },
  ]},
  { center: "The Business of Families", qs: [
    { q: "What is the operating company's hardest decision this year?", a: "Whether to carve out the industrial services arm or hold it through the succession." },
    { q: "Where do you need capability you do not have in house?", a: "" },
    { q: "What would you like another family to tell you honestly?", a: "" },
  ]},
  { center: "The Assets of Families", qs: [
    { q: "What are you looking to own more of?", a: "" },
    { q: "What will you not own, and why?", a: "" },
    { q: "What check size and horizon are you working with?", a: "" },
    { q: "Which structures do you accept?", a: "" },
  ]},
];

export const AGREEMENT_TERMS = [
  "Nothing said inside the circle leaves it. Conversations enter the archive only with consent, and every family controls the attribution of its own words.",
  "Deals are curated, never endorsed. The circle does not act as adviser, broker or fiduciary, and no allocation is offered on the strength of membership.",
  "Introductions are double opt-in. A name is never forwarded without the agreement of both sides, and every introduction is followed to an outcome.",
  "Each family names one relationship owner inside the circle and keeps that name current.",
  "Partners engage only with families that have opted in, against priorities agreed in writing.",
  "Membership is annual, reviewed in conversation rather than by renewal notice, and either side may end it without penalty.",
];
