# Handoff: Collaboration Circle OS

## Overview
Collaboration Circle OS is a members-only web app for a private circle of family offices, founded by Samira Salman. Member families use it to source, diligence, lead and close deals together, make double-opt-in introductions, and read fifteen years of private conversations that can only be read inside the system. This package covers the design system and all twelve screens: eleven desktop screens at 1440 wide (the Archive and Events each have two artboards) plus a mobile Morning Brief at 390 wide.

Users: principals and next-generation members of significant families, their CIOs, and a small operating team ("the Advanced Team"). The product should feel like a private bank's client room, not a SaaS dashboard. It should be quiet, readable from across a desk, and have one decision per screen.

## About the design files
`Collaboration Circle OS.dc.html` is a **design reference built in HTML**. It is a prototype showing the intended look and content, **not production code**. Recreate these designs in the target codebase's environment (React, Vue, etc.) using its own patterns. If there is no codebase yet, pick a suitable stack. A component-based React + TypeScript app with CSS variables or Tailwind tokens fits well.

To view the reference, open the file in a browser with `support.js` next to it. All artboards are laid out on one pan/zoom canvas in a four-column grid. The in-file "Screen" prop (tweaks panel) can isolate one artboard. The template uses inline styles only. Read it to get exact values.

## Fidelity
**High-fidelity.** Colors, type, spacing, row spec and copy are final. Recreate them pixel-accurately. The sample content (families, deals, people) is realistic placeholder data. Replace it with real data but keep the tone and structure.

---

## Design tokens

### Color: light (default)
| Token | Hex | Use | Contrast on white |
|---|---|---|---|
| surface | #FFFFFF | Page, tables, cards, reading views | — |
| structural | #F3F4F6 | Table header rows, grouped-section bands, row hover. Never behind body text blocks; never page ground | — |
| hairline | #E2E5E9 | 1px row dividers, action-card border, unfilled RUM segment | — |
| divider | #C7CCD2 | 1px between major regions (header underline, right-column rule), input borders | — |
| ink | #101418 | Primary text; **navigation rail background** | 18.5:1 |
| secondary | #4B5563 | Secondary text, mono metadata, table headers | 7.5:1 |
| tertiary | #6B7280 | Tertiary only, never below 14px; stage "Intake" | 4.7:1 |
| oxblood | #6E1E2A (hover #571722) | The ONE primary action per screen, active nav bar, current gate stage, decision dates ≤14 days out, overdue ages (>7 days) | 11.1:1 |
| brass | #7A6230 | RUM mark and ring labels ONLY | 5.8:1 |
| stage-strategize | #1F4E79 | Stage colour, muted | 8.8:1 |

Stage colours: Intake #6B7280 · Analyze #4B5563 · Strategize #1F4E79 · Hustle & Close #6E1E2A.

### Color: navigation rail (dark)
Rail bg #101418 · nav text #E5E7EB · active item #FFFFFF with 2px #6E1E2A left bar · counts and member meta #9CA3AF · rail internal divider #2A3139 · wordmark #FFFFFF.

### Color: dark ground (exception: Archive reading view option / theme toggle)
Ground #101418 · surface #181D23 · ink #E5E7EB · secondary #9CA3AF · hairline #2A3139 · oxblood lifts to #C0616F · brass lifts to #C9A55E.

**Rule:** every text colour must reach 4.5:1 on its surface. Do not introduce other colours. Avoid gradients, shadows, tinted cards, purple and emoji.

### Typography
Fonts (Google Fonts): **Newsreader** (serif, 400 only, never bold), **IBM Plex Sans** (400/500), **IBM Plex Mono** (400/500).

- **Serif (Newsreader 400)** is used only for: page headlines, deal names, family names, archive titles, working-group names, the onboarding welcome letter.
  - 40/44: greeting ("Good morning, Eleanor.") and Deal Room title
  - 28/34: page headline (e.g. "The Circle", "Deal Book")
  - 22/28: Morning Brief lead-item titles; onboarding ring statement
  - 20/28: Center headings in the Needs Survey; mobile lead titles
  - 19/1.8: onboarding welcome letter
  - 17/1.35: row titles (deal / family / archive names in every table)
- **Sans (IBM Plex Sans)**: body 15/24; secondary 14/20; row sub-lines 13–14; buttons 15; tabs 15; row titles that are not names (e.g. introduction pairs) 15/500. **Nothing smaller than 13px sans**; 14 is the normal minimum.
- **Mono (IBM Plex Mono)**: 12px for ring labels, dates, section eyebrows, table column headers; 13px for figures and dates in table cells. Letter-spacing .08em. Uppercase only for ring labels and section eyebrows / table headers. Use `font-variant-numeric: tabular-nums` wherever figures align.

### Spacing & layout
- 8pt grid. Common values: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64.
- Left rail: **220px**, full height, solid #101418. Wordmark padding 0 20px; nav items padding 9px 20px; 32px gaps between wordmark / nav / member block.
- Content: padding 48px 56px; max content width 1200px (1000px for reading-heavy pages).
- Page header: headline, subline 15px secondary, then a 1px #C7CCD2 rule with 24px padding-bottom.
- Right column (where present): 280–300px, 1px #C7CCD2 left border, 28–32px left padding.
- Radius: **0 everywhere**. Shadows: **none**.
- Motion: only 150ms ease transitions on background/colour. Respect `prefers-reduced-motion`.

---

## Core components

### Standard row (the only row in the product)
Every table and list uses this row:
- CSS grid, column gap 20px, padding **16px 12px**, **min-height 64px**, `align-items:center`, 1px #E2E5E9 bottom border.
- Hover: background #F3F4F6 (150ms). Clickable rows open their object (e.g. a Deal Book row opens the Deal Room).
- Header row: #F3F4F6 bg, padding 10px 12px, mono 12px uppercase .08em #4B5563.
- Row title: Newsreader 17px ink (for names), with an optional sub-line in Plex Sans 13–14px #4B5563.
- Reason/"why" column: Plex Sans 14px/1.5 **full ink** #101418, clamped to 2 lines, and the widest column (~34%).
- Ring cell: mono 12px .08em (#4B5563 in Deal Book; brass #7A6230 elsewhere as a label).
- Date cell: mono 13px tabular; **oxblood only if ≤14 days away**, otherwise ink.
- Group header (e.g. stage in Deal Book): #F3F4F6 bar, padding 10px 12px, mono 12px uppercase stage name + count, a hairline filler, and "Gate owner …" at right in 14px secondary. 32px between groups.

### RUM™ mark (Relationships Under Management)
Four rectangles, each **6×3px**, **2px gap**, filled #7A6230 / unfilled #E2E5E9, vertically centred. Strength 1–4. The four levels are "one degree away", "known, needs a route", "warm, recent contact", "working together now". Never show a percentage or badge.

### Ring label
Mono 12px, .08em, uppercase: `RING 0` Advanced Team · `RING 1` Close Circle · `RING 2` Larger Network · `RING 3` Partners & Advisors. In the Foundations spec they appear as 1px outlined labels, padding 2px 6px (Ring 3 dashed). In tables they appear as plain text. Access is concentric: a Ring 1 viewer never sees Ring 0 or under-review items.

### Stage gate
Four hairline segments, one per stage (Intake → Analyze → Strategize → Hustle & Close). Completed stages are 2px ink, the current stage is 2px oxblood, and future stages are 1px #E2E5E9. Mono 12px uppercase labels sit under each segment (with dates in the Deal Room). Segment width is 88px in the spec and 150px in the Deal Room header. Each gate has one named owner.

### Buttons & controls
- Primary (one per screen): bg #6E1E2A, text #FFFFFF 15px, padding 9px 16px, radius 0; hover #571722.
- Secondary: 1px #101418 border, ink text, padding 8px 15px; hover bg #F3F4F6.
- Text control: 14px, 1px bottom border (#101418 for the affirmative option, #C7CCD2 otherwise), padding-bottom 2px. Examples: "Agree / Decline", "In / Park / Decline", "Not now", "Accept".
- Tag: 1px #101418 outline, 12px sans, padding 2px 6px (e.g. "Lead sought").
- Tabs: 15px text, 12px padding-bottom; active tab is ink with a 2px oxblood underline, others #4B5563.
- Filters: plain text. A mono 12px uppercase label, then the value with a 1px #C7CCD2 underline. Never chips.
- Inputs: 1px #C7CCD2 border, radius 0, padding 10–14px, 14–15px text. The search field is 48px tall.
- Multi-select chips (capture form only): 1px border, #101418 when selected and #C7CCD2 when not, padding 6px 12px.

### Deal card (only where a decision is taken)
White, 1px #E2E5E9 border, padding 24px, no shadow. Shows: title (serif), ring, Center · structure · corridor meta, a one-line status, the stage gate, the primary and secondary actions, and the footer line **"Curated for the circle. Not an endorsement. Decisions are your own."** (14px secondary, above a hairline). Every deal presentation carries this line.

### Archive reading view
`user-select:none`. There is no download control anywhere. A repeated diagonal watermark (−24°, mono 16px, #E2E5E9, low opacity, `pointer-events:none`) reads "Eleanor Whitcombe · Ring 1 · 14 Sep 2026", using the viewer's name, ring and date. It is clipped to the content area and must not cover the rail. A fixed footer line in 13px secondary reads: "This conversation is read in the system and cannot be exported, copied or downloaded. Your reading is logged." The transcript is 16px/1.8 sans, max-width 68ch, with mono 12px speaker labels.

---

## Screens

The viewer is **Eleanor Whitcombe (Ring 1, Close Circle)** unless noted. Nav items: Morning Brief · Deal Book (9) · Families & Circle (38) · Introductions (3) · The Archive · Events & Salons (4) · Your Family. The member block (name 15/500 #E5E7EB + "RING 1 · CLOSE CIRCLE" mono) sits at the bottom of the rail.

### 00 Foundations (artboard)
Token swatches with contrast ratios, the dark-ground specimen, the type scale, ring labels, RUM mark (4 levels), Five Centers (text only), stage gate, and object specimens (table row, deal card, person row, archive reading view).

### 01 Morning Brief
- Mono date eyebrow, then "Good morning, Eleanor." (serif 40), then the subline "Three things today. One needs a decision this month."
- **Three lead items** as rows on a 3-column grid (150px label / 1fr body / 200px actions), 28px padding, hairlines:
  1. *A deal for you*: Northfield Water Rights Portfolio. The why-line is 14px ink, the meta is mono, and it carries the curated-for-the-circle line. Actions: "Decision 26 Sep" in oxblood mono, **"Soft-circle $2.5M"** (primary), "Open the deal room".
  2. *An introduction to make*: Priya Mehra → Idris Okafor. RUM mark plus "Both Ring 1 · you are the warmest route" (13px). Actions: "Make the introduction" (secondary), "Not now".
  3. *From the archive*: Land, Water & Power thesis call with operators, "ASSETS · RING 1 · RIGHTS CLEARED". Action: "Read in system". Never show an under-review item to Ring 1.
- Below, in two columns: left is **Deals you are in** (standard row, name 17 serif, 14px sub-line, stage mono at right); right is **Introductions pending your reply** (age in mono 12, oxblood when older than 7 days) and then **Events this month**.
- No charts.

### 02 Deal Book
Headline "Deal Book", subline "Nine live deals. Five you can act on at Ring 1.", and a secondary button "Submit a deal". Filter bar (text controls): Center · Structure · Ring · Decision, with "Sorted by decision date" at right. The table is grouped by stage with gate owners.
Columns (fr): Deal 2.2 · Center/Structure 1 · Lead family 1.1 · **Why it is in front of you 3.4** · Ring .6 · Decision .8 · RUM .5.

### 03 Deal Room (Northfield Water Rights Portfolio)
- Header: breadcrumb eyebrow; title serif 40; meta line "Assets · Direct · Land, Water & Power · Lead: the Whitcombe family · Owner: Samira Salman · RING 1"; at right "Decision 26 Sep · 12 days" (oxblood mono) and **"Soft-circle $2.5M"**. The stage gate below it shows three stages complete and Hustle & Close current, with dates.
- Tabs: Memo · Data Room · Diligence · Syndicate · Decision · History.
  - Memo: 20px sans lead sentence, 15/1.75 body at max 660px, a 3-up figures strip (Raise $30,000,000 · Soft-circled $24,500,000 · Minimum $1,000,000), and the curated line.
  - Diligence: threads from named experts (name serif, role 14 secondary, date mono, body 15/1.7), with an open question flagged in oxblood text.
  - Syndicate: standard row with Family · Soft-circled · Allocation · Status.
  - The Data Room, Decision (IC vote) and History tabs have **not been drawn yet**. Design them in the same row and tab vocabulary.
- Right column "Who we know here": people with a RUM mark and a one-line note, then "Warmest route" with a paragraph and the secondary button "Request the introduction".

### 04 Families & Circle
Headline "The Circle", subline "Fifty-two families. Nineteen in your city or your Centers." Filters: Center · City · Generation · Interest · Ring. Text tabs: Families / Working groups.
- Families table: Family (serif 17, with "city · generations" 14px beneath) · Centers of need · Investment interests (up to three, "+2") · Ring · Relationship owner · RUM (from the viewer's family).
- Working groups: group name serif, conveners beneath · Center · member count · next session (mono).
- Right column "Near you this month": three families, each with a one-line reason.

### 05 Family profile (the Mehra family)
Header: serif 28 name; mono "MUMBAI · LONDON · G2 · RING 1 · CLOSE CIRCLE SINCE 2019"; relationship owner; at right "RUM FROM YOUR FAMILY" plus the mark and **"Ask for an introduction"**. Sections, each with a mono eyebrow and hairline: Principals · Investment theses (check size, structures) · Needs by Center (status open / in progress / met) · Deals (led / joined / passed) · Introductions made (outcome) · Events attended · **In the Archive**. The Archive section has per-row controls "Attributed · Anonymise · Withhold"; the current choice is in ink and the others in secondary. It carries the note "Visible to the Mehra family only." Right column "Warmest route" shows each hop with its own RUM mark.

### 06a The Archive: search
Headline "The Archive", subline "Fifteen years of conversations in the circle. Read here; never exported." A 48px search field with the placeholder "Ask the archive, or search a name, topic or year", then text tabs Ask / Search.
Ask result: the question (15/500), an answer of about 90 words (15/1.75), then a "Cited · three conversations" table (title, date, Center, speakers or "A member", rights, "Read"). **An answer never appears without citations.**
Results table (eight rows): Conversation · Date · Center · Kind (Roundtable / Call / 1:1 / Event note / Working session) · Speakers · Rights ("CLEARED · RING 1", "CLEARED · ATTRIBUTION REMOVED"). Under-review and Ring 0 items are filtered out for Ring 1.

### 06b The Archive: reading view
The spec is above under "Archive reading view". Header: "Family Office AI Roundtable" (serif 28), mono line "14 MARCH 2024 · BUSINESS OF FAMILIES · ROUNDTABLE · CLEARED FOR RING 1", then participants. Right column: "Related conversations" (three) and "Deals citing this" (two).

### 07 Introductions
Subline: "Every introduction is asked for, agreed by both sides, and followed to an outcome."
- **To make** (3): pair (15/500), ring labels, two RUM marks (viewer → each party), why-now (14 ink), asked date. "Make the introduction" is **primary on the first item only** and secondary on the rest. Each item also has "Not now".
- **Awaiting your reply** (3): who (serif), context, age (oxblood when older than 7 days), Agree / Decline.
- **Outcomes** (10 rows): Introduction · Date · Asked by · Outcome (met / in conversation / invested / partnered / no fit) · Deal it led to.
- Right column: Made 14 · Led to a meeting 11 · Led to a deal 3 (mono figures, no chart).

### 08 Partner Console (viewer: Northgate Trust Company, Ring 3)
Reduced nav: Console · Initiatives · Introductions · Events · Your firm. The rail footer reads "Northgate Trust Company" and "RING 3 · FOUNDING PARTNER". Subline: "Founding Partner since 2026 · Business of Families · Assets of Families".
Sections: **Your three priorities, 2026–27** (the partner's own wording · agreed KPIs · progress as mono figures, e.g. "RUM activated 9 · Opportunities created 3 · Qualified pipeline 2 · Outcomes 1"); **Initiative calendar** (Date · Initiative · City · Families · Who from your firm); **Families who have opted in** (5), with the note "A family appears here only after opting into engagement with your firm." No bars, charts or percentages.

### 09 Command (viewer: Samira Salman, Ring 0)
Nav adds "Command" at the top. The rail footer reads "Samira Salman" and "RING 0 · ADVANCED TEAM". Subline: "Tuesday. Four things need a decision; the rest is running."
Six queue sections, each with a #F3F4F6 eyebrow bar and a count:
- Intake awaiting curation (3): In / Park / Decline. "In" turns oxblood on hover only. A **required reason field** appears on decline.
- Deals without a lead (2): "Find a lead".
- Introductions unacknowledged 72 hours (4): days in oxblood, "Nudge".
- Relationships gone quiet 90 days (6): last contact and RUM mark.
- Rights reviews pending (5): reviewer "Sarah" and waiting time.
- Founder escalations (2): the primary action is "Take it".
Right column "Graph health": Families 52 · Relationships owned 1,240 · Introductions this quarter 31 · Archive cleared 412 / 1,870 · Deals in pipeline 9.

### 10 Events & Salons
Subline: "Small rooms, real agendas, intelligence captured after." Grouped by month (Sep, Oct, Nov 2026), eight events. Row: date (mono) · event name (serif) with city and format beneath · what it serves, with host · "N families attending · three named" · status. Status is "Attending" (15/500 ink), or "Invited" with an "Accept" text control. Formats: Dinner & Diligence · CC Live! · Masterclass · Salon · Working session.

### 10b After the event (capture form)
Event header, then: Who came (multi-select family chips) · What was discussed (textarea) · Needs raised table (Center · Family · Need, plus "Add a need") · Introductions to make (pair · why now, plus "Add an introduction") · Deals mentioned (chips). One primary button, **"Capture"**, with the note "Needs and introductions update the circle within the hour."

### 11 Onboarding (the Thorne family)
A single flowing page, not a wizard. The rail is replaced by a 220px **white** column with a #C7CCD2 right border, holding the wordmark and five step names (current and completed steps in ink, others secondary). Sections:
1. Welcome: letter from Samira, serif 19/1.8.
2. Participation Agreement: six short paragraphs, the checkbox "We have read and agree", and a note that the full agreement is in the data room.
3. Your ring: "You are joining as Close Circle (Ring 1)." plus what it does and does not mean.
4. Needs Survey: the five Centers, each with 3–4 questions, a free-text answer field, and a priority control (Now / This year / Eventually). Two answers are pre-filled.
5. Investment interests (Structures, Sectors, Geographies, Check size) and visibility controls (Your city / theses / deals → Ring 1 / Ring 2 / Only CC).
Primary: **"Join the circle"**.

### 12 Mobile Morning Brief (390 wide)
No rail, no tab bar, no icons. The top bar has the wordmark (serif 17) and the date (mono). "Good morning, Eleanor." serif 28. Three stacked items, each with a serif 20 title, two lines of sans 15, mono 12 metadata, and a **full-width** button 48px tall. The first button is oxblood; the others are 1px ink outline. Then "Deals you are in" (3) and "Introductions pending" (3) as compact standard rows (min-height 64, tappable). All touch targets are at least 44px.

---

## Interactions & behavior
- Nav: the active item is white with a 2px oxblood left bar.
- Row hover is #F3F4F6 and rows open their object: Deal Book → Deal Room, family → profile, archive → reading view.
- Transitions are 150ms ease on colour/background only; set them to none under reduced motion.
- **Access control is concentric.** Filter every list by the viewer's ring. Ring 1 never sees Ring 0, restricted, or under-review archive items. Partners (Ring 3) see only families that opted in.
- Introductions are double opt-in: both parties must agree before contact details are exchanged. Track each introduction to an outcome.
- Archive: disable text selection, copy, print and download. Render the watermark with the viewer's identity. Log reading events.
- Decision dates within 14 days are shown in oxblood. Ages over 7 days (introductions) and all 72-hour unacknowledged items are shown in oxblood.
- Command: declining an intake requires a reason, which is shown to the submitting family.
- The Ask mode must always return citations (conversation, date, Center, speaker or "A member").
- Empty states are one plain sentence with no illustration and no exclamation marks.

## State / data model (suggested)
Entities: Family (name, cities, generations, ring, centersOfNeed, interests, relationshipOwner), Person, Deal (name, center, structure, corridor, leadFamily | null, stage, gateOwner, decisionDate, raise, softCircled, ring), SyndicateEntry, DiligenceThread, Relationship (from, to, strength 1–4, lastContact) → RUM, Introduction (requester, partyA, partyB, whyNow, status, outcome, dealId?), ArchiveItem (title, date, center, kind, speakers[{personId | anonymous}], ring, rights: cleared | attribution_removed | under_review | restricted), Event (date, city, format, servesDealOrInitiative, host, attendees, viewerStatus), Need (family, center, text, status, priority), Partner (priorities[{text, kpis, figures}]).
View state: active tab (Deal Room), Families/Working-groups tab, Ask/Search mode, filters, capture-form rows.

## Copy rules
Short, declarative and human. Buttons name the outcome: "Take the lead", "Soft-circle $2.5M", "Make the introduction", "Clear for Ring 1". No exclamation marks. Never use "unlock", "supercharge", "leverage" or "AI-powered". Every deal carries: "Curated for the circle. Not an endorsement. Decisions are your own."

## Assets
There are no images or icons. The only glyphs are text characters (→, ·). Fonts come from Google Fonts: Newsreader, IBM Plex Sans, IBM Plex Mono. No imagery is used anywhere by design.

## Files
- `Collaboration Circle OS.dc.html`: all artboards (Overview, Foundations, 01–12, 06a/06b, 10/10b). The exact styles are inline. Sample data is in the logic class (`renderVals()`) at the bottom of the file.
- `support.js`: the runtime needed to open the reference file in a browser. It is not part of the product.
