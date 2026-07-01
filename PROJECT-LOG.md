# JLU — "Jesus Loves You" · Project Log

A record of what we built and how to run it. Last updated: 2026-06-29.

---

## What this is
A warm, handwritten-style faith web app: visitors write prayer/gratitude notes, light prayer
candles, start notes from KJV Bible verses, and everything pins to a shared community wall.
Built as a single static page (no build step) so it hosts anywhere.

- **Live domain:** jesus-lovesyou.life (registered at GoDaddy)
- **Hosting:** GoDaddy cPanel Web Hosting (switched from a mistakenly-bought Managed WordPress plan)
- **Shared wall database:** Supabase (free) — project `JLU`, URL `https://yfneguzcuisfwebzyrun.supabase.co`

---

## Files in this folder
| File | What it is |
|---|---|
| `index.html` | The entire website — one self-contained file. This is what you upload. |
| `hero-jesus.svg` | The original standalone Jesus illustration (also an inline book scene lives in index.html). |
| `SUPABASE-SETUP.md` | How to create the free shared-wall database + the SQL to run. |
| `PUBLISH-GoDaddy.md` | Publishing via GoDaddy cPanel hosting. |
| `PUBLISH-Free.md` | Alternative: free hosting on Netlify + point the domain (kept for reference). |
| `DEPLOY.md` | Original Wix Headless path (not used — kept for reference). |
| `setup-wix-collections.sh` | Wix helper (not used — kept for reference). |
| `PROJECT-LOG.md` | This file. |

---

## Features built
- **Hero illustration** — an open handwritten "gratitude book" (Daily Gratitude List + Prayer for
  Grace) with a **white dove carrying olive leaves** and warm light.
- **Flip cards** layered on the book — tap to flip a note over to the verse it's pinned to.
- **Draggable stickers** — amen, ✝, grace, ♥, ✧, blessed, pray.
- **Write a note** — pin a note (Gratitude / Prayer / Praise / Hope). On submit it **flips to a
  matching KJV verse** ("A word for you"), then lands on the wall.
- **Light a candle** — choose a type (Prayer / Gratitude / Praise / Hope); the type shows above
  each candle, and **tapping a candle reveals its prayer**. Live "candles burning" count.
- **Bible verse note cards** — KJV verses (John 3:16, Matthew 11:28, Psalm 23, Matthew 6:25 & 6:27,
  and ~20 more), filterable by theme; tap one to start a note from it.
- **Live hero chips** — the latest note and latest lit candle bob beside the hero buttons.
- **Blessing line** — "You are loved. You matter. Jesus loves you."
- **Shared wall** — notes + candles saved to Supabase so every visitor sees the same wall.
  Falls back to per-browser storage automatically if the database is unreachable.
- **Light spam guard** — a few-second cooldown, no duplicate posts, no links, 600-char cap, a
  gentle word filter, plus database-side length limits. All with kind messages.

---

## The one setting that turns on the shared wall
Near the top of the `<script>` in `index.html`:
```js
const SUPA = { url: "https://yfneguzcuisfwebzyrun.supabase.co", key: "sb_publishable_...YOUR KEY..." };
```
- `url` is already correct.
- `key` = the **anon / publishable** key from Supabase → Connect (or Settings → API Keys).
  NOT the service_role / secret key.
- Leave `key` blank and the site still works, but notes/candles save per-browser instead of shared.

The database (tables + rules + starter notes) is already created in the Supabase `JLU` project.
The SQL used lives in `SUPABASE-SETUP.md`.

---

## How it's hosted (GoDaddy cPanel)
1. Domain jesus-lovesyou.life registered at GoDaddy.
2. Switched from Managed WordPress → **cPanel Web Hosting** (WordPress plan being refunded).
3. Upload target: **cPanel → File Manager → `public_html`**.
4. The site file must be named exactly **`index.html`** (lowercase) so it loads at the domain root.
5. Turn on HTTPS: cPanel → **SSL/TLS Status → Run AutoSSL**.

> Note from setup: the first upload landed as `INDEX~1.HTM` (a mangled short name) plus a stray
> `APPCHE~1.JS` scratch file. Fix = delete the stray JS and rename the page to `index.html`.

---

## To update the site later
1. Edit `index.html` (on your computer, or directly in cPanel → select file → **Edit**).
2. Re-upload / save it in `public_html` (overwrites the old one). Changes are live immediately.

---

## Outstanding / next steps checklist
- [ ] Confirm `index.html` (renamed correctly) is in `public_html`
- [ ] Confirm the Supabase `key` is pasted into `index.html`
- [ ] Confirm jesus-lovesyou.life points to the cPanel hosting (support can set this)
- [ ] Run AutoSSL, then open https://jesus-lovesyou.life
- [ ] Test the shared wall: post on phone, refresh on computer — same note appears
- [ ] Confirm the Managed WordPress hosting refund went through
- [ ] Decide on the Microsoft 365 email free trial (cancel before it renews if not needed)

---

## Accounts & references
- GoDaddy: domain jesus-lovesyou.life + cPanel Web Hosting (login: nr.senthilganesh@gmail.com)
- Supabase: project `JLU`, URL https://yfneguzcuisfwebzyrun.supabase.co
- Verses used are KJV (public domain).

*You are loved. You matter. Jesus loves you.* 🕊️
