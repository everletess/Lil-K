# Collaboration Circle OS — project context

Context for anyone, human or Claude, picking up this project. Current as of 5 October 2026.

## What it is

Collaboration Circle is a private circle of family offices founded by Samira Salman. **Collaboration Circle OS** is a members-only web app where a curated group of families sources, diligences, leads and closes deals together. They also make double-opt-in introductions and read fifteen years of private conversations that can only be read inside the system.

Users are principals and next-generation members of significant families, their chief investment officers, and a small operating team (the "Advanced Team"). They are busy, discreet and allergic to being sold to.

**What exists today** is a high-fidelity, clickable prototype with sample data. There is no backend, database or real login per user. Clicks such as "Soft-circle", "Agree" or "Take the lead" change what's on screen only, and reset on reload.

## Where things live

- **Code:** GitHub `everletess/Lil-K` (private). Everything is on `main`.
- **Live site:** Vercel project `lil-k`, deployed automatically from `main`. It is behind a shared password (see Hosting).
- **Not related:** the `Ashwick Home` repository and ashwickhome.com are a separate project. Nothing in this project should touch them.
- **Older preview:** a private claude.ai artifact copy was published early on. It is out of date (no Blob AI) and the Vercel site replaces it.

## How it should feel

A private bank's client room, not a SaaS dashboard. Quiet, readable from across a desk, one decision per screen. Confidence comes from restraint: whitespace, a disciplined type scale, real names and real numbers.

Avoid: gradients, shadows, rounded corners, glassmorphism, emoji, icons, charts, purple, hero banners, marketing copy, cards with coloured edges, and anything that looks generated.

## Design system

**Colour**
- Page and surfaces: white `#FFFFFF`.
- Structural grey `#F3F4F6`: table headers, section bands, row hover only.
- Hairline `#E2E5E9` between rows; divider `#C7CCD2` between major regions and on inputs.
- Ink `#101418`; secondary text `#4B5563`; tertiary `#6B7280` (never below 14px).
- **Oxblood `#6E1E2A`** (hover `#571722`): the ONE primary action per screen, the active nav marker, the current stage, decision dates within 14 days, and requests older than 7 days.
- **Brass `#7A6230`**: the RUM mark and ring labels only.
- Left navigation rail: solid `#101418`, 220px wide, nav text `#E5E7EB`, meta `#9CA3AF`.
- Every text colour meets 4.5:1 contrast on its background.

**Type** (Google Fonts)
- **Newsreader** serif, regular weight only: page headlines, and the names of deals, families and archive conversations. Nothing else.
- **IBM Plex Sans**: all interface text. Body 15px, secondary 14px, nothing below 13px.
- **IBM Plex Mono** 12px, letter-spaced .08em: ring labels, dates, figures, section eyebrows. 13px for figures in tables. Tabular numerals.

**The standard row** is the only table/list row in the product: 64px minimum height, 16px vertical padding, hairline between rows, grey on hover, opens its object when clicked. Name in serif 17px, sub-line in sans 13–14px, the "why" column in full ink.

**Recurring marks**
- **RUM™ mark** (Relationships Under Management): four 6×3px brass segments with 2px gaps; strength 1–4 ("one degree away" → "working together now"). Never a percentage.
- **Ring labels:** RING 0 Advanced Team · RING 1 Close Circle · RING 2 Larger Network · RING 3 Partners & Advisors.
- **Stage gate:** four hairline segments, Intake → Analyze → Strategize → Hustle & Close. Completed stages ink, current oxblood, future hairline.
- **Five Centers of Excellence**, always as text: The People / Legacy / Lifestyle / Business / Assets of Families.
- Every deal shows: "Curated for the circle. Not an endorsement. Decisions are your own."

**Copy rules:** short, declarative, human. Buttons name the outcome ("Take the lead", "Soft-circle $2.5M", "Make the introduction"). No exclamation marks. Never "unlock", "supercharge", "leverage" or "AI-powered". Empty states are one plain sentence.

## Screens and addresses

| Screen | Address |
|---|---|
| Morning Brief (phone layout below 640px wide) | `/` |
| Deal Book, grouped by stage | `/deals` |
| Deal Room: Memo, Data Room, Diligence, Syndicate, Decision, History tabs | `/deals/:id` |
| Families & Circle, plus Working groups | `/circle` |
| Family profile | `/families/:id` |
| Archive search (Ask and Search modes) | `/archive` |
| Archive reading view (watermarked, no copying) | `/archive/:id` |
| Introductions | `/introductions` |
| Partner Console (Northgate Trust Company only) | `/partner` |
| Command (Advanced Team only) | `/command` |
| Events & Salons | `/events` |
| After-the-event capture form | `/events/:id/after` |
| Onboarding for a new family (the Thorne family) | `/onboarding` |
| Foundations (the design system as a page) | `/foundations` |

Onboarding and Foundations are linked in small grey text at the foot of the left navigation.

## Sample data

**Viewers.** The name at the foot of the left navigation switches who you're viewing as:
- **Eleanor Whitcombe** (Ring 1, Close Circle): the default member view.
- **Priya Mehra** (Ring 1): sees her own family's archive attribution controls.
- **Samira Salman** (Ring 0, founder): sees Command.
- **Northgate Trust Company** (Ring 3, Founding Partner): sees the Partner Console.

**Families:** Whitcombe (New York, G2/G3), Mehra (Mumbai/London, G2), Lindqvist (Stockholm, G4), Al-Rashid (Dubai, G2), Okafor (Lagos/London, G1/G2), Brenner (Denver, G3), Thorne (Munich, G2, joining).

**Deals** (ten in total; eight visible at Ring 1):
- Northfield Water Rights Portfolio: Assets, Direct, led by the Whitcombe family, Hustle & Close, decision 26 Sep. The fully drawn deal room.
- Ravello Family Hotel Recapitalisation: Lifestyle, SPV, Mehra, Strategize, 9 Oct.
- Helsingør Timber & Carbon Rights: Assets, Direct, Lindqvist, Strategize, 21 Nov.
- Meridian Aviation Services Carve-out: Business, SPV, Lindqvist, Analyze, 14 Nov.
- Gulf Women Founders Fund I: Assets, Fund, Al-Rashid, Analyze, 31 Oct (Ring 2).
- Pond Lily Neuro Clinic Series B: People, Direct, lead sought, Intake, 17 Oct (Ring 2).
- Cascais Coastal Land Assembly: Assets, Direct, Okafor, Intake, no date (Ring 2).
- **Blob AI**: Business, Direct, lead sought, Intake, Ring 1, decision 31 Oct. Raising **$5M at a $50M valuation**. Made by Everle, Inc.; "AI for people who don't trust AI": a subscription companion with zero ads, zero data deals and zero training on users' conversations, and no one at Blob can read users' chats (heyblob.com). It appears in the Deal Book, its own deal room, Command's "Deals without a lead", and second under "A deal for you" on the Morning Brief, after Northfield.
- Two Ring 0 deals (Aldgate, Tessin) exist only to show that Ring 1 can't see them.

The prototype's "today" is fixed at **Monday 14 September 2026**, so dates and ages always read the same.

## Rules the prototype enforces

- **Access is concentric.** A viewer sees their own ring and the rings outside it, never closer in. Ring 1 never sees Ring 0 deals, or archive items that are under review or restricted.
- A family's archive attribution controls (Attributed / Anonymise / Withhold) show only to that family.
- Partners see only families that have opted in to engage with them.
- Command is for Ring 0 only.
- Archive answers ("Ask" mode) never appear without citations.
- Declining an intake in Command requires a reason.

## Design decisions made along the way

- The original design showed some things the access rules forbid (the Mehra archive controls to Eleanor; a restricted item in the reading view's Related list). The rules won.
- The design showed two oxblood buttons in Command; only the first is oxblood now.
- The Deal Room's Data Room, Decision and History tabs were never drawn in the design. They were designed in the same table style.
- Blob AI's button on the Morning Brief is outlined ("Take the lead"); Northfield keeps the one oxblood action because its decision is due this month.
- Nothing about a deal, family or conversation is invented beyond what the user has supplied. Blob AI copy comes from its own site and launch coverage.

## Code

- **Stack:** React 19, TypeScript, Vite, React Router. Plain CSS with tokens; no UI library.
- **Layout of `web/`:**
  - `src/data/data.ts`: all sample content (viewers, families, deals, deal rooms, archive, introductions, events, partner, command, onboarding).
  - `src/data/access.ts`: ring rules and archive rights labels.
  - `src/data/format.ts`: dates, "today", Center and stage names.
  - `src/styles/tokens.css`, `src/styles/app.css`: tokens and the shared component styles.
  - `src/components/`: the shell and left navigation, the RUM mark, ring label, stage gate, tabs, filters.
  - `src/pages/`: one file per screen.
  - `middleware.ts`: the password gate (runs on Vercel only).
- **Run locally:** `cd web && npm install && npm run dev`. There's no password locally.
- **To add a deal:** add it to `DEALS` in `data.ts`. Optionally give it a deal room in `DEAL_ROOMS`. Then add it wherever else it belongs: Morning Brief, Command's `noLead`, a family profile's deals. Update the Deal Book count in `Shell.tsx` and the Deal Book subline.

## Hosting

- Vercel, Root Directory `web`, settings in `web/vercel.json`.
- The password is the `SITE_PASSWORD` environment variable in Vercel. Changing it and redeploying signs everyone out. Without it, the site shows only "This site is locked".
- A session lasts 30 days. `/__auth/logout` signs a visitor out. Pages ask search engines not to list them.
- The password itself is not written anywhere in the code or in this document.

## Open items

- No real backend: actions don't persist and there are no individual accounts.
- Only Northfield has a full deal room. Other deals show their header and short notes; Blob AI has a memo but no data room, diligence or syndicate yet.
- Blob AI isn't linked to any family, event or archive conversation, because none has been named.
- Only the Mehra and Whitcombe families have full profiles.
