# JLU — "Jesus Loves You" · Roadmap

**Version:** 1.0 · **Date:** 2026-06-29
Companion to `FUNCTIONAL-SPEC.md` and `ARCHITECTURE.md`. Turns the backlog into prioritized,
buildable milestones. Effort is rough: **S** ≈ hours, **M** ≈ a day, **L** ≈ multiple days.

> Context: the site is **live** at jesus-lovesyou.life, friends are lighting candles and writing
> messages, and the owner uses it personally during prayer + study. Priorities below favor gentle,
> high-value additions that deepen that experience without adding friction.

---

## ✅ v1.0 — Shipped
Hero gratitude-book illustration + dove, draggable stickers, flip cards, note composer with
flip-to-verse, community wall + filters, prayer candles with type + reveal, KJV verse templates,
live hero chips, shared Supabase wall with localStorage fallback, light spam guard, responsive
layout. Hosted on GoDaddy cPanel; domain live with HTTPS.

---

## v1.1 — Gentle polish & trust (near-term)
Small wins that make the shared wall feel alive and safe. No new infrastructure.

| # | Milestone | Why | Effort | Depends on |
|---|---|---|---|---|
| 1.1a | **"Amen" / heart reactions** on notes and candles (public counts) | Lets people encourage each other; very on-theme | M | notes/candles tables + a `reactions` column or table |
| 1.1b | **Auto-refresh / "new notes" poll** every ~20s | Friends see each other's posts without manual refresh | S | — |
| 1.1c | **Server-side rate limit** (Supabase edge function or SQL trigger) | Hardens the spam guard beyond client-side | M | Supabase functions |
| 1.1d | **Gentle profanity list expansion + report button** | Keeps the space kind at larger scale | S–M | — |
| 1.1e | **Share a note** (copy link / share card image) | Spreads encouragement | M | per-note id + route or query param |

**Acceptance:** reactions persist and are shared; new posts appear without refresh; a burst of rapid
posts is throttled server-side.

---

## v1.2 — Study & prayer companion (personalized)
Features that serve the owner's own use — praying and studying with the site open.

| # | Milestone | Why | Effort | Depends on |
|---|---|---|---|---|
| 1.2a | **Focus timer tied to a candle** — light a candle, start a 25/50-min study/prayer session; the candle "burns" for the session | Turns lighting a candle into a study ritual | M | candle model + timer UI |
| 1.2b | **Verse of the day** on load | A daily anchor for study | S | VERSES array + date seed |
| 1.2c | **Prayer streak / gentle log** (local, private) | Encouragement to return daily | S | localStorage |
| 1.2d | **Quiet / focus mode** — dim animations, hide nav, just the book + a verse + timer | Fewer distractions while studying | S | CSS toggle |
| 1.2e | **Read-aloud a verse** (browser speech synthesis) | Accessibility + meditative | S | Web Speech API |

**Acceptance:** starting a session lights a candle and runs a visible timer; a daily verse shows;
focus mode removes motion/nav.

---

## v2.0 — Accounts & private walls (bigger step)
The main architectural step-up: authentication. Unlocks per-user data and moderation.

| # | Milestone | Why | Effort | Depends on |
|---|---|---|---|---|
| 2.0a | **Sign in (email / Google)** via Supabase Auth | Identity for private + owned content | L | Supabase Auth |
| 2.0b | **Private prayer journal** (per-user notes, not public) | Personal, confidential prayers | L | 2.0a + per-user RLS |
| 2.0c | **Edit / delete your own** notes & candles | Ownership | M | 2.0a |
| 2.0d | **Owner moderation dashboard** (hide/remove, review reports) | Safe community at scale | M–L | 2.0a + roles |
| 2.0e | **"Someone prayed for you" notifications** (opt-in email) | Connection | M | 2.0a + email provider |

**Acceptance:** a signed-in user has a private journal only they can see; the owner can hide/remove
any public post; users can edit/delete only their own.

---

## v2.1+ — Reach & richness (later)
| Milestone | Why | Effort |
|---|---|---|
| Search + pagination / infinite scroll on the wall | Scales past hundreds of notes | M |
| Categories / prayer topics ("healing", "family", "exams") | Study/prayer organization | M |
| Multi-language verse sets + UI | Wider audience | L |
| Photo attachments on notes | Richer sharing | M |
| Theme switcher (the original palettes: Cream & Rose, Sage & Linen, Dusk Rose) | Personalization | S |
| Privacy-respecting analytics | Understand engagement | S |
| PWA / installable + offline-first | App-like on phones | M |

---

## Suggested next sprint (my recommendation)
Given how it's being used right now, the highest-joy, lowest-risk set:
1. **1.1a Reactions** (friends encourage each other) — M
2. **1.1b Auto-refresh** (the wall feels live) — S
3. **1.2a Candle-linked study timer** + **1.2b Verse of the day** (your own study ritual) — M + S

All of these fit the current architecture (same tables, same adapter) with **no auth required**, so
they're quick to add and safe to ship. Accounts (v2) is the natural follow-on once you want private
journals or moderation.

---

## How to drive these with AI (specs-driven)
Each item maps back to `FUNCTIONAL-SPEC.md`. To implement one, prompt with:
> "Implement ROADMAP item 1.2a. Follow ARCHITECTURE.md's storage-adapter pattern and add any new
> fields per the data-model section of FUNCTIONAL-SPEC.md. Keep the design system + gentle tone.
> Provide acceptance tests."
Then add the new requirement back into `FUNCTIONAL-SPEC.md` (new FR-#) so the spec stays the source of truth.
