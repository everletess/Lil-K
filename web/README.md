# Collaboration Circle OS — web

The Claude Design handoff (`../project/`) built as a React + TypeScript + Vite site. All data is sample data from the design, held in `src/data/data.ts`. The prototype's "today" is fixed at 14 Sep 2026 (`src/data/format.ts`).

```sh
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Routes

| Screen | Route |
|---|---|
| 01 Morning Brief (12 mobile brief below 640px) | `/` |
| 02 Deal Book | `/deals` |
| 03 Deal Room | `/deals/:id?tab=memo\|data-room\|diligence\|syndicate\|decision\|history` |
| 04 Families & Circle | `/circle` (`?view=groups` for working groups) |
| 05 Family profile | `/families/:id` |
| 06a Archive search | `/archive` |
| 06b Archive reading view | `/archive/:id` |
| 07 Introductions | `/introductions` |
| 08 Partner Console | `/partner` (viewer: Northgate Trust Company) |
| 09 Command | `/command` (viewer: Samira Salman) |
| 10 Events & Salons | `/events` |
| 10b After the event | `/events/:id/after` |
| 11 Onboarding | `/onboarding` |
| Foundations | `/foundations` |

## Viewers

The member name at the foot of the rail is a switch between four sample viewers: Eleanor Whitcombe (Ring 1), Priya Mehra (Ring 1), Samira Salman (Ring 0) and Northgate Trust Company (Ring 3). The rail, navigation and what is visible all follow the viewer.

## Access rules (`src/data/access.ts`)

- Access is concentric: a viewer sees their own ring and the rings outside it.
- Ring 1 never sees under-review or restricted archive items, or Ring 0 deals.
- A family's archive attribution controls appear only to that family (view the Mehra profile as Priya Mehra).
- Partners see only families that have opted in.
- Command is Ring 0 only.

## Structure

- `src/styles/tokens.css`: design tokens, taken from the handoff.
- `src/styles/app.css`: the shared vocabulary (the standard row, bands, buttons, text controls, tabs, filters, RUM mark, stage gate).
- `src/components/`: the shell and rail, the marks and the controls.
- `src/pages/`: one file per screen.

## Hosting with a password (Vercel)

The site is gated by `middleware.ts`, which runs on Vercel before any file is served. Visitors without a valid session see a sign-in page; the app's code is never sent to them.

1. In Vercel, choose **Add New → Project** and import `everletess/Lil-K` from GitHub.
2. Set **Root Directory** to `web`. Vercel reads the rest from `vercel.json`.
3. Under **Environment Variables**, add `SITE_PASSWORD` with the password you will give your team.
4. Deploy.

Notes:
- If `SITE_PASSWORD` is missing, the site shows only a "locked" message.
- Changing `SITE_PASSWORD` (then redeploying) signs everyone out.
- A session lasts 30 days. `/__auth/logout` signs a visitor out.
- Pages are marked `noindex` so search engines don't list them.
- `npm run dev` runs without the gate; it applies only on Vercel.
