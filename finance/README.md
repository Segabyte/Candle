# Paycheck Runway

A single-file personal finance app — cash flow planned one payday at a time.
Built from `MEXMGMT.xlsx`, which tracked salary dates, a per-payday expense
block, and a running balance.

Open `paycheck-runway.html` in any browser, or use the published Artifact
(which adds account sync and CSV download).

## Design

Laid out on the spine of `brightmoney-monthly-recap.html`: one card with
hairline-separated sections, a wash hero band, a three-up stat row on
dividers, `label / % / bar / amount` budget rows, a bills card, goal
progress bars, and an accent-bordered insight callout. Palette is lime
yellow and white rather than the reference's cream and gold.

## What it does

- **Hero + stat row** — a plain-language read on the stretch, then balance
  in hand, safe to spend now, and the lowest point ahead.
- **Balance projection** — a stepped chart of the running balance across
  every payday, with the low point and endpoint labelled, and a hover
  crosshair for the detail of any payday.
- **Where it goes** — every expense as a share of income, ranked, with
  what's left over as its own row.
- **Bills due soon** — everything leaving the account in the next 14 days.
- **Payday ledger** — pay in, out, left over, and balance after, per payday.
  Each row expands to the individual expenses charged against it.
- **Savings goals** — progress against a target, plus how many paydays away
  it is at the rate currently being kept.
- **Insight** — computed from the plan: names the pinch point and how much
  to move off it to stay above the cushion.
- **Editable plan** — paydays and expenses edit inline; expenses recur every
  payday, monthly on a day, or land once on a date.

## Storage

- In the browser: `localStorage` under `paycheck-runway-v1`.
- As an Artifact: the `db` capability, document `plan/current`, shaped
  `{ plan, updatedAt }`. Local storage still backs it up, so the page is
  never empty while the account copy loads.

## Seed data

`SEED` in the HTML holds the figures imported from the spreadsheet: opening
balance 648.81, eight paydays of 3,569 (3,069 + 500) from 2026-09-18 to
2026-12-23, a 2,000 per-payday expense block, and four one-off expenses. The
sheet carried no names on those four, so they are labelled for renaming.
Goals start empty — the section offers a computed first target rather than
shipping invented ones.
