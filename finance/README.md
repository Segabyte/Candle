# Paycheck Runway

A single-file personal finance app — cash flow planned one payday at a time.
Built from `MEXMGMT.xlsx`, which tracked salary dates, a per-payday expense
block, and a running balance.

Open `paycheck-runway.html` in any browser, or use the published Artifact
(which adds account sync and CSV download).

## What it does

- **Recap tiles** — balance in hand, safe to spend before the next payday,
  the next payday, and the lowest point the balance reaches.
- **Balance projection** — a stepped chart of the running balance across
  every payday, with the low point and endpoint labelled.
- **Payday ledger** — pay in, out, left over, and balance after, per payday.
  Each row expands to the individual expenses charged against it.
- **Where it goes** — expenses ranked by total over the period.
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
