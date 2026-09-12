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

### The colour ramp

`--c1` `#f2f000` → `--c2` `#c4ee00` → `--c3` `#82e800` → `--c4` `#46df00`
→ `--c5` `#22ce00`, taken from the supplied swatch. Lightness falls
monotonically across the five steps (0.81 → 0.45), so it is a valid
**sequential** scale: deeper green means more. It encodes share of income
in the budget bars, share of a payday kept in the ledger, and completion
on goal bars; the ramp rule along the top edge of the card shows the
scale itself.

Each step measures only 1.2–2.1:1 against white, so the ramp fills shapes
and never draws text or hairlines. Two anchors cover those:
`--lime-deep` is `#2e7d00` in light (5.19:1 on white) and `#a8e000` in
dark (12:1), used for the chart line, markers and any coloured text. The
page ink `#1a1c12` clears 8:1 on every step, so it is what sits on top of
a ramp fill in buttons. Area-fill opacities are tokens (`--fill-a/b/c`)
so each theme sets its own weight.

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

`SEED` in the HTML holds the figures imported from the spreadsheet, with the
opening balance replaced by the real account balance (198.12; the sheet's
648.81 was stale). Eight paydays of 3,569 (3,069 + 500) from 2026-09-18 to
2026-12-23, a 2,000 per-payday expense block, and four one-off expenses. The
sheet carried no names on those four, so they are labelled for renaming.
Goals start empty — the section offers a computed first target rather than
shipping invented ones.
